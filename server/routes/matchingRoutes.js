const express = require('express');
const router = express.Router();

// In memory
const volunteers = [
  { id: '1', name: 'Aryan', skills: ['Cooking'], availability: ['2025-07-01'] },
  { id: '2', name: 'Chris', skills: ['Tutoring'], availability: ['2025-07-10'] }
];

const events = [
  { id: '101', name: 'Food Drive', requiredSkills: ['Cooking'], date: '2025-07-01' },
  { id: '102', name: 'Education Fair', requiredSkills: ['Tutoring'], date: '2025-07-10' },
  { id: '103', name: 'Health Camp', requiredSkills: ['First Aid'], date: '2025-07-15' }
];
// matching
router.get('/:volunteerId', (req, res) => {
  const { volunteerId } = req.params;
  const volunteer = volunteers.find(v => v.id === volunteerId);

  if (!volunteer) {
    return res.status(404).json({ message: 'Volunteer not found' });
  }

  const matched = events.filter(event =>
    event.requiredSkills.some(skill => volunteer.skills.includes(skill)) &&
    volunteer.availability.includes(event.date)
  );

  res.json(matched);
});

module.exports = router;
