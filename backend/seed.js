const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./skillshare.sqlite');

const dummyClients = [
    { name: 'Demo Client', email: 'client@demo.com', password: 'password', role: 'client', wallet_balance: 5000 }
];

const dummyWorkers = [
    {
        name: 'Carlos Mendez',
        email: 'carlos@demo.com',
        password: 'password',
        role: 'worker',
        category: 'Plumber',
        hourly_rate: 45,
        experience_level: 'Expert',
        latitude: 34.0522,
        longitude: -118.2437,
        bio: 'Over 15 years of experience in residential plumbing. I can fix leaks instantly. Always neat and always on time.',
        avatar_url: 'https://images.unsplash.com/photo-1544168190-79c17527004f?auto=format&fit=crop&w=150&q=80',
        skills: ['Pipe Repair', 'Water Heaters', 'Drain Cleaning'],
        rating: 4.9,
        reviewsCount: 120
    },
    {
        name: 'Priya Sharma',
        email: 'priya@demo.com',
        password: 'password',
        role: 'worker',
        category: 'UI/UX Designer',
        hourly_rate: 65,
        experience_level: 'Senior',
        latitude: 34.0525,
        longitude: -118.2432,
        bio: 'Award-winning UI/UX designer. I specialize in making high-converting, accessible apps. Figma and React expert.',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        skills: ['Figma', 'Prototyping', 'User Research'],
        rating: 5.0,
        reviewsCount: 88
    },
    {
        name: 'Aiko Tanaka',
        email: 'aiko@demo.com',
        password: 'password',
        role: 'worker',
        category: 'Music Teacher',
        hourly_rate: 35,
        experience_level: 'Intermediate',
        latitude: 34.0625,
        longitude: -118.2542,
        bio: 'Passionate music teacher. I teach Piano and Composition. I love utilizing the Barter system to learn new languages in exchange for piano lessons!',
        avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
        skills: ['Piano', 'Composition', 'Music Theory'],
        rating: 4.8,
        reviewsCount: 45
    },
    {
        name: 'James Wilson',
        email: 'james@demo.com',
        password: 'password',
        role: 'worker',
        category: 'Electrician',
        hourly_rate: 55,
        experience_level: 'Expert',
        latitude: 34.0450,
        longitude: -118.2500,
        bio: 'Licensed and insured electrician. Commercial and residential wiring. Safety is my number one priority.',
        avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
        skills: ['Wiring', 'Lighting', 'Circuit Breakers'],
        rating: 4.7,
        reviewsCount: 200
    },
    {
        name: 'Elena Rodriguez',
        email: 'elena@demo.com',
        password: 'password',
        role: 'worker',
        category: 'Cleaner',
        hourly_rate: 25,
        experience_level: 'Beginner',
        latitude: 34.0530,
        longitude: -118.2400,
        bio: 'Meticulous deep cleaning services. I bring my own eco-friendly products and will leave your home spotless!',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        skills: ['Deep Cleaning', 'Organization', 'Eco-friendly'],
        rating: 4.6,
        reviewsCount: 30
    }
];

db.serialize(() => {
    console.log('Resetting Database...');
    db.run('DELETE FROM worker_skills');
    db.run('DELETE FROM reviews');
    db.run('DELETE FROM bookings');
    db.run('DELETE FROM messages');
    db.run('DELETE FROM workers');
    db.run('DELETE FROM users');

    console.log('Inserting Clients...');
    const insertClient = db.prepare('INSERT INTO users (name, email, password, role, wallet_balance) VALUES (?, ?, ?, ?, ?)');
    dummyClients.forEach(c => insertClient.run([c.name, c.email, c.password, c.role, c.wallet_balance]));
    insertClient.finalize();

    console.log('Inserting Workers...');
    const insertUser = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
    
    let pendingUsers = dummyWorkers.length;

    dummyWorkers.forEach(w => {
        insertUser.run([w.name, w.email, w.password, w.role], function(err) {
            if (err) return console.error(err);
            const userId = this.lastID;

            db.run(
                'INSERT INTO workers (user_id, category, hourly_rate, experience_level, latitude, longitude, bio, avatar_url, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [userId, w.category, w.hourly_rate, w.experience_level, w.latitude, w.longitude, w.bio, w.avatar_url, 1]
            );

            w.skills.forEach(skill => {
                db.run('INSERT INTO worker_skills (worker_id, skill) VALUES (?, ?)', [userId, skill]);
            });
            
            // Add a mock review
            db.run('INSERT INTO reviews (worker_id, client_id, rating, comment) VALUES (?, ?, ?, ?)', [userId, 1, w.rating, 'Great service!']);

            pendingUsers--;
            if (pendingUsers === 0) {
                console.log('Seeding Complete!');
            }
        });
    });
    insertUser.finalize();
});
