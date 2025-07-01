// src/VolunteerHistoryPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './VolunteerHistoryFormLayout.css';   // or './FormLayout.css' if you added it there

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
    <div className="page-container">
      <h1>Volunteer Participation History</h1>
      <table className="history-table">
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
          {history.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                No history to display.
              </td>
            </tr>
          ) : (
            history.map((rec) => (
              <tr key={rec.eventId}>
                <td>{rec.eventName}</td>
                <td>{rec.eventDescription}</td>
                <td>{rec.location}</td>
                <td>{rec.requiredSkills.join(', ')}</td>
                <td>{rec.urgency}</td>
                <td>{new Date(rec.eventDate).toLocaleDateString()}</td>
                <td>{rec.participationStatus}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default VolunteerHistoryPage;
