// src/VolunteerHistoryPage.js
import React, { useEffect, useState } from 'react';

export default function VolunteerHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    eventId: '',
    date: '',
    hours: '',
    role: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const volunteerId = "123"; // Replace with dynamic value as needed

  useEffect(() => {
    fetch(`http://localhost:5000/history/${volunteerId}`)
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [volunteerId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    const newRecord = {
      volunteerId,
      eventId: form.eventId,
      date: form.date,
      hours: Number(form.hours),
      role: form.role,
      notes: form.notes
    };
    try {
      const res = await fetch('http://localhost:5000/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord)
      });
      if (!res.ok) {
        const error = await res.json();
        alert('Error: ' + error.message);
        setSubmitting(false);
        return;
      }
      const created = await res.json();
      setHistory(h => [...h, created]);
      setForm({ eventId: '', date: '', hours: '', role: '', notes: '' });
    } catch (err) {
      alert('Network error: ' + err.message);
    }
    setSubmitting(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Volunteer History</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <h3>Add New Record</h3>
        <div>
          <label>Event ID: <input name="eventId" value={form.eventId} onChange={handleChange} required /></label>
        </div>
        <div>
          <label>Date: <input name="date" type="date" value={form.date} onChange={handleChange} required /></label>
        </div>
        <div>
          <label>Hours: <input name="hours" type="number" min="0.5" max="24" step="0.5" value={form.hours} onChange={handleChange} required /></label>
        </div>
        <div>
          <label>Role: <input name="role" value={form.role} maxLength={50} onChange={handleChange} required /></label>
        </div>
        <div>
          <label>Notes: <input name="notes" value={form.notes} maxLength={200} onChange={handleChange} /></label>
        </div>
        <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Add Record'}</button>
      </form>
      {history.length === 0 ? (
        <p>No history records found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Event ID</th>
              <th>Hours</th>
              <th>Role</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {history.map(record => (
              <tr key={record.id}>
                <td>{record.date}</td>
                <td>{record.eventId}</td>
                <td>{record.hours}</td>
                <td>{record.role}</td>
                <td>{record.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
