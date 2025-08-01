const router = require('express').Router();
const db = require('../index').db;

// GET all volunteer history
router.get('/', (req, res) => {
  db.query('SELECT * FROM VolunteerHistory', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST add volunteer history record
router.post('/', (req, res) => {
  const { volunteer_id, event_id, participation_date, role, hours } = req.body;
  if (!volunteer_id || !event_id || !participation_date || hours == null) {
    return res.status(400).json({ error: 'Volunteer ID, Event ID, participation date, and hours are required' });
  }
  if (hours < 0) {
    return res.status(400).json({ error: 'Hours must be >= 0' });
  }
  db.query(
    'INSERT INTO VolunteerHistory (volunteer_id, event_id, participation_date, role, hours) VALUES (?, ?, ?, ?, ?)',
    [volunteer_id, event_id, participation_date, role, hours],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, volunteer_id, event_id, participation_date, role, hours });
    }
  );
});

module.exports = router;
