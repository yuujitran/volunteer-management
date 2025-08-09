// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');        // use bcryptjs (cross-platform)
const mysql = require('mysql2');
const crypto = require('crypto');
const sendVerificationEmail = require('./utils/email');

const app = express();

// CORS — allow the React dev server
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// MySQL connection (callback style)
const db = mysql.createConnection({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port:     process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.error('Failed to connect to MySQL:', err.message);
  } else {
    console.log('Connected to MySQL');
  }
});

// Export db so route modules can import it via ../index
module.exports.db = db;

/* ------------------ ROUTES ------------------ */

// Profile
const profileRoutes = require('./routes/profileRoutes');
app.use('/profile', profileRoutes);

// Events
const eventRoutes = require('./routes/eventRoutes');
app.use('/events', eventRoutes);

// Volunteer History
const historyRoutes = require('./routes/historyRoutes');
app.use('/history', historyRoutes);

// Notifications
const notificationRoutes = require('./routes/notificationRoutes');
app.use('/notifications', notificationRoutes);

// Matching (singular path)  --> client calls /match?eventId=...
const matchingRoutes = require('./routes/matchingRoutes');
app.use('/match', matchingRoutes);

// Reports
const reportRoutes = require('./routes/reportRoutes');
app.use('/reports', reportRoutes);

// States
const statesRoutes = require('./routes/statesRoutes');
app.use('/states', statesRoutes);

// Health pings for sanity checks
app.get('/_ping', (_req, res) => res.json({ ok: true }));
app.get('/match/_ping', (_req, res) => res.json({ ok: true }));

/* ------------------ VOLUNTEER AUTH & PROFILE ------------------ */

/**
 * Register volunteer with email verification
 * POST /volunteers
 * body: { email, password, role }
 */
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

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const verifyToken = crypto.randomBytes(32).toString('hex');

      const insertQuery =
        'INSERT INTO UserCredentials (email, password_hash, role, is_verified, verify_token) VALUES (?, ?, ?, ?, ?)';
      db.query(insertQuery, [email, hashedPassword, role, 0, verifyToken], async (err2, result) => {
        if (err2) return res.status(500).json({ message: 'Failed to register volunteer' });
        try {
          await sendVerificationEmail(email, verifyToken);
          res.status(201).json({
            message: 'Registration successful. Check your email to verify your account.',
            userId: result.insertId
          });
        } catch (emailErr) {
          console.error('Failed to send verification email:', emailErr);
          res.status(500).json({ message: 'User created, but email verification failed.' });
        }
      });
    } catch (hashErr) {
      console.error('Hash error:', hashErr);
      res.status(500).json({ message: 'Server error' });
    }
  });
});

/**
 * GET /volunteer-id?email=...
 */
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

/**
 * POST /login
 * body: { email, password }
 */
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM UserCredentials WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Email address not registered' });
    }

    const user = results[0];
    try {
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) return res.status(401).json({ message: 'Incorrect password' });

      if (!user.is_verified) {
        return res.status(403).json({ message: 'Please verify your email before logging in.' });
      }

      res.json({ message: 'Login successful', email: user.email, role: user.role });
    } catch (error) {
      console.error('Bcrypt compare failed:', error);
      res.status(500).json({ message: 'Incorrect password' });
    }
  });
});

/**
 * GET /verify-email?token=...
 */
app.get('/verify-email', (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send('Invalid verification link');

  const query = 'SELECT * FROM UserCredentials WHERE verify_token = ?';
  db.query(query, [token], (err, results) => {
    if (err) return res.status(500).send('Database error');
    if (results.length === 0) return res.status(400).send('Invalid or expired token');

    const update = 'UPDATE UserCredentials SET is_verified = 1, verify_token = NULL WHERE id = ?';
    db.query(update, [results[0].id], (err2) => {
      if (err2) return res.status(500).send('Failed to verify email');
      res.send(`
        <h2>Email Verified!</h2>
        <p>You can now log in to your account.</p>
        <a href="http://localhost:3000">Go to Login</a>
      `);
    });
  });
});

/**
 * Mount the rest of your volunteer routes AFTER the explicit auth endpoints
 * to avoid any accidental path collisions.
 * This router should handle things like GET /volunteers (list), etc.
 */
const volunteerRoutes = require('./routes/volunteerRoutes');
// If that router declares paths like router.get('/volunteers', ...) this is correct:
app.use('/', volunteerRoutes);

/* ------------------ ERROR HANDLERS ------------------ */

// 404 for unknown API paths (kept after all routers)
app.use((req, res, next) => {
  if (
    req.path.startsWith('/api') ||
    req.path.startsWith('/events') ||
    req.path.startsWith('/volunteers') ||
    req.path.startsWith('/match')
  ) {
    return res.status(404).json({ error: 'Not found', path: req.path });
  }
  next();
});

// Centralized error handler so you actually see stack traces
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

/* ------------------ START SERVER ------------------ */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
