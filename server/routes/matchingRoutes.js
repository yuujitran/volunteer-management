const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

router.get('/:volunteerId', (req, res) => {
  const volunteerId = req.params.volunteerId;

  const profileQuery = `SELECT skills, availability FROM UserProfile WHERE user_id = ?`;

  db.query(profileQuery, [volunteerId], (err, profileResult) => {
    if (err || profileResult.length === 0) {
      return res.status(404).json({ message: 'Volunteer not found or error' });
    }

    const volunteer = profileResult[0];
    const skills = volunteer.skills ? volunteer.skills.split(',') : [];
    const availability = volunteer.availability ? volunteer.availability.split(',') : [];
    const eventQuery = `SELECT * FROM EventDetails`;

    db.query(eventQuery, (err, events) => {
      if (err) return res.status(500).json({ message: 'Failed to fetch events' });

      const matched = events.filter(event => {
        const eventSkills = event.required_skills ? event.required_skills.split(',') : [];
        return eventSkills.some(skill => skills.includes(skill)) &&
               availability.includes(event.event_date.toISOString().split('T')[0]);
      });

      res.json(matched);
    });
  });
});

module.exports = router;
