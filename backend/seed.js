const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'skillshare.sqlite');
const db = new sqlite3.Database(dbPath);

const demoWorkers = [
  {
    name: "Rajesh Kumar",
    email: "rajesh@demo.com",
    category: "Plumbing",
    hourly_rate: 45,
    experience_level: "Expert",
    lat: 28.6139,
    lng: 77.209,
    bio: "Certified plumber with 10+ years of experience in residential and commercial repairs.",
    skills: ["Pipe Fitting", "Leak Repair", "Drain Cleaning", "Water Heater Installation"],
    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Sunita Sharma",
    email: "sunita@demo.com",
    category: "Tutoring",
    hourly_rate: 30,
    experience_level: "Professional",
    lat: 19.076,
    lng: 72.8777,
    bio: "Mathematics and Science tutor for high school students. 5 years of teaching experience.",
    skills: ["Algebra", "Calculus", "Physics", "Exam Prep"],
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Michael Chen",
    email: "michael@demo.com",
    category: "Graphic Design",
    hourly_rate: 60,
    experience_level: "Senior",
    lat: 34.0522,
    lng: -118.2437,
    bio: "Creative designer specializing in logo design and brand identity for startups.",
    skills: ["Logo Design", "Branding", "UI/UX", "Adobe Illustrator"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Amit Patel",
    email: "amit@demo.com",
    category: "Electrician",
    hourly_rate: 40,
    experience_level: "Expert",
    lat: 23.0225,
    lng: 72.5714,
    bio: "Licensed electrician available for home wiring, fuse box repairs, and smart home setup.",
    skills: ["Wiring", "Smart Home", "Fuse Boxes", "Lighting"],
    avatar: "https://images.unsplash.com/photo-1544168190-79c17527004f?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Elena Rodriguez",
    email: "elena@demo.com",
    category: "Cleaning",
    hourly_rate: 25,
    experience_level: "Intermediate",
    lat: 40.7128,
    lng: -74.006,
    bio: "Punctual and thorough deep cleaning services for homes and offices.",
    skills: ["Deep Cleaning", "Sanitization", "Window Cleaning", "Organizing"],
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Vikram Singh",
    email: "vikram@demo.com",
    category: "Carpentry",
    hourly_rate: 50,
    experience_level: "Master",
    lat: 30.7333,
    lng: 76.7794,
    bio: "Custom furniture maker and repair specialist. Master craftsman with 15 years experience.",
    skills: ["Furniture Repair", "Custom Cabinets", "Wood Staining", "Decking"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
  }
];

db.serialize(() => {
  console.log("Starting demo data seeding...");
  
  demoWorkers.forEach((worker) => {
    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [worker.email], (err, row) => {
      if (err) return console.error(err);
      
      if (!row) {
        // Insert User
        db.run(
          `INSERT INTO users (name, email, password, role, wallet_balance) VALUES (?, ?, ?, 'worker', 100)`,
          [worker.name, worker.email, 'password123'],
          function(err) {
            if (err) return console.error(err);
            const userId = this.lastID;
            
            // Insert Worker Profile
            db.run(
              `INSERT INTO workers (user_id, category, hourly_rate, experience_level, latitude, longitude, is_verified, avatar_url, bio) 
               VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)`,
              [userId, worker.category, worker.hourly_rate, worker.experience_level, worker.lat, worker.lng, worker.avatar, worker.bio],
              (err) => {
                if (err) return console.error(err);
                
                // Insert Skills
                worker.skills.forEach(skill => {
                  db.run(`INSERT INTO worker_skills (worker_id, skill) VALUES (?, ?)`, [userId, skill]);
                });
                console.log(`Seeded worker: ${worker.name}`);
              }
            );
          }
        );
      } else {
        console.log(`Worker ${worker.name} already exists, skipping.`);
      }
    });
  });
});
