const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

router.get('/volunteers', async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        up.id,
        up.full_name,
        up.skills,
        up.availability
      FROM UserProfile up
      JOIN UserCredentials uc ON up.user_id = uc.id
      WHERE uc.role = 'volunteer'
    `);

    const volunteers = rows.map(v => ({
      id: v.id,
      name: v.full_name,
      skills: v.skills.split(',').map(s => s.trim()),
      availability: v.availability.split(',').map(d => d.trim())
    }));

    res.json(volunteers);
  } catch (err) {
    console.error('Error fetching volunteers:', err);
    res.status(500).json({ message: 'Error fetching volunteers' });
  }
});

// GET all events
router.get('/events', async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        id,
        name,
        required_skills,
        event_date
      FROM EventDetails
    `);

    const events = rows.map(e => ({
      id: e.id,
      name: e.name,
      requiredSkills: e.required_skills ? e.required_skills.split(',').map(s => s.trim()) : [],
      eventDate: e.event_date
    }));

    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

module.exports = router;
