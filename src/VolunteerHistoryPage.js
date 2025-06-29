import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function VolunteerHistoryPage() {
  const { volunteerId } = useParams();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch(`/api/volunteers/${volunteerId}/history`)
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(console.error);
  }, [volunteerId]);

  return (
    <div>
      <h1>Volunteer Participation History</h1>
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Description</th>
            <th>Location</th>
            <th>Required Skills</th>
            <th>Urgency</th>
            <th>Event Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map((rec) => (
            <tr key={rec.eventId}>
              <td>{rec.eventName}</td>
              <td>{rec.eventDescription}</td>
              <td>{rec.location}</td>
              <td>{rec.requiredSkills.join(', ')}</td>
              <td>{rec.urgency}</td>
              <td>{new Date(rec.eventDate).toLocaleDateString()}</td>
              <td>{rec.participationStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VolunteerHistoryPage;
