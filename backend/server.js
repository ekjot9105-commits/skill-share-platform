const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./database');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    // Simple mock group room based on user_id so they get all messages
    socket.on('join', (userId) => {
        socket.join(userId.toString());
        console.log(`User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.use('/uploads', express.static('uploads'));
const upload = multer({ dest: 'uploads/' });

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// 1. Auth: Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });
        
        // If worker, fetch worker profile
        if (user.role === 'worker') {
            db.get('SELECT * FROM workers WHERE user_id = ?', [user.id], (err, worker) => {
                if (err) return res.status(500).json({ error: err.message });
                // Fetch skills
                db.all('SELECT skill FROM worker_skills WHERE worker_id = ?', [user.id], (err, skills) => {
                    return res.json({ ...user, workerProfile: { ...worker, skills: skills?.map(s => s.skill) || [] } });
                });
            });
        } else {
            return res.json(user);
        }
    });
});

// 2. Auth: Register
app.post('/api/register', (req, res) => {
    const { name, email, password, role, workerData } = req.body;
    db.run(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, password, role],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            
            const newUserId = this.lastID;
            
            if (role === 'worker' && workerData) {
                const deterministicAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
                
                // Insert worker details
                db.run(
                    'INSERT INTO workers (user_id, category, hourly_rate, experience_level, latitude, longitude, bio, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [newUserId, workerData.category, workerData.hourly_rate, workerData.experience_level, workerData.latitude, workerData.longitude, workerData.bio, deterministicAvatar],
                    (err) => {
                        if (err) console.error(err);
                        // Insert skills
                        if (workerData.skills && Array.isArray(workerData.skills)) {
                            workerData.skills.forEach(skill => {
                                db.run('INSERT INTO worker_skills (worker_id, skill) VALUES (?, ?)', [newUserId, skill]);
                            });
                        }
                    }
                );
            }
            res.status(201).json({ id: newUserId, name, email, role, wallet_balance: 0 });
        }
    );
});

// 3. Get Workers (Search & Filters)
app.get('/api/workers', (req, res) => {
    const query = `
        SELECT u.id, u.name, w.category, w.hourly_rate, w.experience_level, w.latitude, w.longitude, w.is_verified, w.avatar_url, w.video_url, w.bio,
        COALESCE(AVG(r.rating), 0) as rating, COUNT(r.id) as reviewsCount
        FROM users u
        JOIN workers w ON u.id = w.user_id
        LEFT JOIN reviews r ON w.user_id = r.worker_id
        WHERE u.role = 'worker'
        GROUP BY u.id
    `;
    db.all(query, (err, workers) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Fetch skills for each worker
        db.all('SELECT worker_id, skill FROM worker_skills', (err, allSkills) => {
            if (err) return res.status(500).json({ error: err.message });
            
            const workersWithSkills = workers.map(w => {
                const wSkills = allSkills.filter(s => s.worker_id === w.id).map(s => s.skill);
                // Also calculate dummy distance for prototype based on a fixed random point if lat/lng missing
                return { ...w, skills: wSkills, distance: (Math.random() * 10).toFixed(1) };
            });
            res.json(workersWithSkills);
        });
    });
});

// 4. Book a Worker
app.post('/api/bookings', (req, res) => {
    const { client_id, worker_id, job_date, total_price, payment_method } = req.body;
    
    if (payment_method === 'skill_exchange') {
         // Create barter booking, don't deduct wallet money
         db.run(
            'INSERT INTO bookings (client_id, worker_id, job_date, total_price, status, payment_method) VALUES (?, ?, ?, ?, ?, ?)',
            [client_id, worker_id, job_date, 0, 'pending', 'skill_exchange'],
            function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true, booking_id: this.lastID, new_balance: null });
            }
        );
    } else {
        // Deduct wallet
        db.get('SELECT wallet_balance FROM users WHERE id = ?', [client_id], (err, user) => {
            if (err) return res.status(500).json({ error: err.message });
            if (user.wallet_balance < total_price) return res.status(400).json({ error: 'Insufficient funds' });
            
            db.run('UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?', [total_price, client_id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                
                // Create booking
                db.run(
                    'INSERT INTO bookings (client_id, worker_id, job_date, total_price, status, payment_method) VALUES (?, ?, ?, ?, ?, ?)',
                    [client_id, worker_id, job_date, total_price, 'pending', 'wallet'],
                    function(err) {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({ success: true, booking_id: this.lastID, new_balance: user.wallet_balance - total_price });
                    }
                );
            });
        });
    }
});

// 4b. Update Booking Status
app.put('/api/bookings/:id/status', (req, res) => {
    const { status } = req.body; // e.g. 'accepted', 'rejected', 'completed'
    db.run('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, status });
    });
});

// 4c. Update Worker Profile
app.put('/api/workers/:id', (req, res) => {
    const { hourly_rate, bio, is_verified, video_url } = req.body;
    db.run(
        'UPDATE workers SET hourly_rate = COALESCE(?, hourly_rate), bio = COALESCE(?, bio), is_verified = COALESCE(?, is_verified), video_url = COALESCE(?, video_url) WHERE user_id = ?',
        [hourly_rate, bio, is_verified, video_url, req.params.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        }
    );
});

// 4d. Post a Review
app.post('/api/reviews', (req, res) => {
    const { worker_id, client_id, rating, comment } = req.body;
    db.run(
        'INSERT INTO reviews (worker_id, client_id, rating, comment) VALUES (?, ?, ?, ?)',
        [worker_id, client_id, rating, comment],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id: this.lastID });
        }
    );
});

// 5. Add Wallet Funds
app.post('/api/wallet/topup', (req, res) => {
    const { user_id, amount } = req.body;
    db.run('UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?', [amount, user_id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, added: amount });
    });
});

// 6. Get Client Bookings
app.get('/api/bookings/client/:client_id', (req, res) => {
    db.all(`
        SELECT b.*, u.name as worker_name, w.category 
        FROM bookings b
        JOIN users u ON b.worker_id = u.id
        JOIN workers w ON b.worker_id = w.user_id
        WHERE b.client_id = ?
        ORDER BY b.id DESC
    `, [req.params.client_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 6b. Get Worker Bookings
app.get('/api/bookings/worker/:worker_id', (req, res) => {
    db.all(`
        SELECT b.*, u.name as client_name, u.email as client_email 
        FROM bookings b
        JOIN users u ON b.client_id = u.id
        WHERE b.worker_id = ?
        ORDER BY b.id DESC
    `, [req.params.worker_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 7. Messages Placeholder
app.get('/api/messages/:user_id', (req, res) => {
    db.all(`
        SELECT m.*, u1.name as sender_name, u2.name as receiver_name 
        FROM messages m
        JOIN users u1 ON m.sender_id = u1.id
        JOIN users u2 ON m.receiver_id = u2.id
        WHERE m.sender_id = ? OR m.receiver_id = ? 
        ORDER BY m.timestamp ASC
    `, [req.params.user_id, req.params.user_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/messages', upload.single('video'), (req, res) => {
    const { sender_id, receiver_id, content } = req.body;
    const type = req.file ? 'video' : req.body.type || 'text';
    const filePath = req.file ? '/uploads/' + req.file.filename : null;

    db.run('INSERT INTO messages (sender_id, receiver_id, content, type) VALUES (?, ?, ?, ?)', 
        [sender_id, receiver_id, filePath || content, type], 
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            const newMsg = { id: this.lastID, sender_id, receiver_id, content: filePath || content, type, timestamp: new Date().toISOString() };
            // Broadcast via Socket.IO
            io.to(receiver_id.toString()).emit('receive_message', newMsg);
            io.to(sender_id.toString()).emit('receive_message', newMsg);
            
            res.json({ success: true, ...newMsg });
        }
    );
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log('SkillShare Backend running with WebSockets on http://localhost:' + PORT);
});
