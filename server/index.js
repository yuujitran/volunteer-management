// index.js
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

//stores memory 
const volunteers = [];
const profiles = [];
let nextVolunteerId = 1;

const eventRoutes = require('./routes/eventRoutes');
app.use('/events', eventRoutes);

const historyRoutes = require('./routes/historyRoutes');
app.use('/history', historyRoutes);

//testing route
app.get('/', (req, res) => {
  res.send('API works');
});

//register volunteer
app.post('/volunteers', (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  //validate email 
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  const existing = volunteers.find(v => v.email === email);
  if (existing) {
    return res.status(409).json({ message: 'Volunteer already registered.' });
  }

  const newVolunteer = {
    id: nextVolunteerId++,
    email,
    password,
    role
  };

  volunteers.push(newVolunteer);
  res.status(201).json({ message: 'Volunteer registered successfully', volunteerId: newVolunteer.id });
});

//get volunteer ID by email
app.get('/volunteer-id', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const volunteer = volunteers.find(v => v.email === email);
  if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });

  res.json({ volunteerId: volunteer.id });
});

//save profile
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

  //validate zip code length
  if (!/^\d{5,9}$/.test(zip)) {
    return res.status(400).json({ message: 'Zip must be 5–9 digits.' });
  }

  const volunteer = volunteers.find(v => v.email === email);
  if (!volunteer) {
    return res.status(404).json({ message: 'Volunteer not found' });
  }

  const profile = {
    volunteerId: volunteer.id,
    fullName,
    address1,
    address2,
    city,
    state,
    zip,
    skills,
    preferences,
    availability
  };

  profiles.push(profile);
  res.status(201).json({ message: 'Profile saved successfully' });
});

//view all volunteers - fake data for now
app.get('/volunteers', (req, res) => {
  res.json(volunteers);
});

//starts server -- database not implemented yet 
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Mock backend server running at http://localhost:${PORT}`);
});
