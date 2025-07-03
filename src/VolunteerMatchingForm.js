import React, { useState, useEffect } from 'react';

const Volunteers = [
  {
    id: 1,
    name: 'Aryan Prajapati',
    skills: ['Cooking', 'Driving'],
    availability: ['2025-07-01', '2025-07-15']
  },
  {
    id: 2,
    name: 'Chris',
    skills: ['Tutoring', 'Event Setup'],
    availability: ['2025-07-10']
  }
];

const mockEvents = [
  {
    id: 101,
    name: 'Food Drive',
    requiredSkills: ['Cooking'],
    eventDate: '2025-07-01'
  },
  {
    id: 102,
    name: 'Education Fair',
    requiredSkills: ['Tutoring'],
    eventDate: '2025-07-10'
  },
  {
    id: 103,
    name: 'Health Camp',
    requiredSkills: ['First Aid'],
    eventDate: '2025-07-20'
  }
];

function VolunteerMatchingForm() {
  const [selectedVolunteerId, setSelectedVolunteerId] = useState('');
  const [matchedEvents, setMatchedEvents] = useState([]);

  useEffect(() => {
    if (!selectedVolunteerId) return;

    const volunteer = Volunteers.find(v => v.id === parseInt(selectedVolunteerId));

    if (volunteer) {
      const matches = mockEvents.filter(event =>
        event.requiredSkills.some(skill => volunteer.skills.includes(skill)) &&
        volunteer.availability.includes(event.eventDate)
      );
      setMatchedEvents(matches);
    } else {
      setMatchedEvents([]);
    }
  }, [selectedVolunteerId]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Volunteer Matching</h1>

      <label>Select a Volunteer:</label><br />
      <select value={selectedVolunteerId} onChange={(e) => setSelectedVolunteerId(e.target.value)}>
        <option value="">-- Select --</option>
        {Volunteers.map((v) => (
          <option key={v.id} value={v.id}>{v.name}</option>
        ))}
      </select>

      <br /><br />

      <h3>Matched Events</h3>
      {matchedEvents.length > 0 ? (
        <ul>
          {matchedEvents.map((event) => (
            <li key={event.id}>
              {event.name} — {new Date(event.eventDate).toLocaleDateString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No matched events for this volunteer.</p>
      )}
    </div>
  );
}

export default VolunteerMatchingForm;
