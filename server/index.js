// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.error('Failed to connect to MySQL:', err.message);
  } else {
    console.log('Connected to MySQL');
  }
});

// Export db so routes can import it
module.exports.db = db;

/* ------------------ ROUTES ------------------ */

// Events
const eventRoutes = require('./routes/eventRoutes');
app.use('/events', eventRoutes);

// Volunteer History
const historyRoutes = require('./routes/historyRoutes');
app.use('/history', historyRoutes);

// Notifications
const notificationRoutes = require('./routes/notificationRoutes');
app.use('/notifications', notificationRoutes);

// Matching
const matchingRoutes = require('./routes/matchingRoutes');
app.use('/match', matchingRoutes);

// States
const statesRoutes = require('./routes/statesRoutes');
app.use('/states', statesRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('API works');
});

/* ------------------ VOLUNTEER AUTH & PROFILE ------------------ */

// Register volunteer
app.post('/volunteers', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  const checkQuery = 'SELECT * FROM UserCredentials WHERE email = ?';
  db.query(checkQuery, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (results.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = 'INSERT INTO UserCredentials (email, password_hash, role) VALUES (?, ?, ?)';
    db.query(insertQuery, [email, hashedPassword, role], (err, result) => {
      if (err) return res.status(500).json({ message: 'Failed to register volunteer' });
      res.status(201).json({ message: 'Volunteer registered successfully', userId: result.insertId });
    });
  });
});

// Get volunteer ID by email
app.get('/volunteer-id', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const query = 'SELECT id FROM UserCredentials WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Volunteer not found' });

    res.json({ volunteerId: results[0].id });
  });
});

// Save profile
app.post('/profile', (req, res) => {
  const {
    email,
    fullName,
    address1,
    address2,
    city,
    state,
    zip,
    skills,
    preferences,
    availability
  } = req.body;

  if (!email || !fullName || !address1 || !city || !state || !zip || !skills || !availability) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!/^\d{5,9}$/.test(zip)) {
    return res.status(400).json({ message: 'Zip must be 5–9 digits.' });
  }

  const getUserIdQuery = 'SELECT id FROM UserCredentials WHERE email = ?';
  db.query(getUserIdQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Volunteer not found' });

    const userId = results[0].id;
    const insertProfileQuery = `
      INSERT INTO UserProfile 
      (user_id, full_name, address1, address2, city, state, zip, skills, preferences, availability)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      userId,
      fullName,
      address1,
      address2,
      city,
      state,
      zip,
      Array.isArray(skills) ? skills.join(',') : skills,
      preferences,
      Array.isArray(availability) ? availability.join(',') : availability
    ];

    db.query(insertProfileQuery, values, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to save profile' });
      }
      res.status(201).json({ message: 'Profile saved successfully' });
    });
  });
});

/* ------------------ START SERVER ------------------ */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
