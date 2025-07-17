const express = require('express');
const { validateEvent } = require('../validators/eventValidator');
const router = express.Router();

// In-memory event data
let events = [
  {
    id: '1',
    name: 'Food Drive',
    location: 'Community Center',
    urgency: 'high',
    requiredSkills: ['organization', 'lifting'],
    details: 'Help organize and distribute food.'
  }
];

// GET all events
router.get('/', (req, res) => {
  res.json(events);
});

// GET event by ID
router.get('/:id', (req, res) => {
  const event = events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
});

// CREATE event
router.post('/', validateEvent, (req, res) => {
  const { name, location, urgency, requiredSkills, details } = req.body;
  const newEvent = {
    id: (events.length + 1).toString(),
    name,
    location,
    urgency,
    requiredSkills,
    details
  };
  events.push(newEvent);
  res.status(201).json(newEvent);
});

// UPDATE event
router.put('/:id', validateEvent, (req, res) => {
  const idx = events.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Event not found' });
  const { name, location, urgency, requiredSkills, details } = req.body;
  events[idx] = { id: req.params.id, name, location, urgency, requiredSkills, details };
  res.json(events[idx]);
});

// DELETE event
router.delete('/:id', (req, res) => {
  const idx = events.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Event not found' });
  events.splice(idx, 1);
  res.status(204).send();
});

module.exports = router; 