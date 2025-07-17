const express = require('express');
const { validateHistory } = require('../validators/historyValidator');
const router = express.Router();

// In-memory volunteer history data
let histories = [
  {
    id: '1',
    volunteerId: '123',
    eventId: '456',
    date: '2024-04-01',
    hours: 4,
    role: 'Helper',
    notes: 'Did a great job'
  }
];

// GET all history for a volunteer
router.get('/:volunteerId', (req, res) => {
  const result = histories.filter(h => h.volunteerId === req.params.volunteerId);
  res.json(result);
});

// CREATE new history record
router.post('/', validateHistory, (req, res) => {
  const { volunteerId, eventId, date, hours, role, notes } = req.body;
  const newHistory = {
    id: (histories.length + 1).toString(),
    volunteerId,
    eventId,
    date,
    hours,
    role,
    notes
  };
  histories.push(newHistory);
  res.status(201).json(newHistory);
});

// UPDATE history record
router.put('/:id', validateHistory, (req, res) => {
  const idx = histories.findIndex(h => h.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'History not found' });
  const { volunteerId, eventId, date, hours, role, notes } = req.body;
  histories[idx] = { id: req.params.id, volunteerId, eventId, date, hours, role, notes };
  res.json(histories[idx]);
});

// DELETE history record
router.delete('/:id', (req, res) => {
  const idx = histories.findIndex(h => h.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'History not found' });
  histories.splice(idx, 1);
  res.status(204).send();
});

module.exports = router; 