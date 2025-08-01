const router = require('express').Router();
const db = require('../index').db;

// GET all events
router.get('/', (req, res) => {
  db.query('SELECT * FROM EventDetails', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST create event
router.post('/', (req, res) => {
  const { name, description, location, required_skills, urgency, event_date, stateCode } = req.body;
  if (!name || !location || !urgency || !event_date) {
    return res.status(400).json({ error: 'Name, location, urgency, and event date are required' });
  }
  if (urgency < 1 || urgency > 5) {
    return res.status(400).json({ error: 'Urgency must be between 1 and 5' });
  }
  db.query(
    'INSERT INTO EventDetails (name, description, location, required_skills, urgency, event_date, stateCode) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, description, location, required_skills, urgency, event_date, stateCode],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, name, description, location, required_skills, urgency, event_date, stateCode });
    }
  );
});

module.exports = router;
