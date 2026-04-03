const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'skillshare.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        db.serialize(() => {
            // Users table: Stores both clients and workers
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'client',
                wallet_balance REAL DEFAULT 0,
                language TEXT DEFAULT 'en'
            )`);

            // Workers table: Extended details for users with role='worker'
            db.run(`CREATE TABLE IF NOT EXISTS workers (
                user_id INTEGER PRIMARY KEY,
                category TEXT,
                hourly_rate REAL DEFAULT 0,
                experience_level TEXT,
                latitude REAL,
                longitude REAL,
                is_verified INTEGER DEFAULT 0,
                avatar_url TEXT,
                video_url TEXT,
                bio TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS worker_skills (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                worker_id INTEGER,
                skill TEXT NOT NULL,
                FOREIGN KEY (worker_id) REFERENCES workers(user_id)
            )`);

            // Bookings table
            db.run(`CREATE TABLE IF NOT EXISTS bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id INTEGER,
                worker_id INTEGER,
                job_date TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                total_price REAL,
                payment_method TEXT DEFAULT 'wallet',
                FOREIGN KEY (client_id) REFERENCES users(id),
                FOREIGN KEY (worker_id) REFERENCES workers(user_id)
            )`);

            // Messages table
            db.run(`CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender_id INTEGER,
                receiver_id INTEGER,
                content TEXT,
                type TEXT DEFAULT 'text',
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (sender_id) REFERENCES users(id),
                FOREIGN KEY (receiver_id) REFERENCES users(id)
            )`);
            
            // Reviews table
            db.run(`CREATE TABLE IF NOT EXISTS reviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                worker_id INTEGER,
                client_id INTEGER,
                rating INTEGER,
                comment TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (worker_id) REFERENCES workers(user_id),
                FOREIGN KEY (client_id) REFERENCES users(id)
            )`);
            
            console.log('Tables initialized (or already exist).');
            
            // Seed a test user or worker if the DB is completely empty.
            db.get('SELECT COUNT(*) AS count FROM users', (err, row) => {
                if (err) console.error(err);
                if (row && row.count === 0) {
                    db.run(`INSERT INTO users (name, email, password, role, wallet_balance) VALUES ('Admin User', 'admin@example.com', 'password123', 'client', 5000)`);
                }
            });
        });
    }
});

module.exports = db;
