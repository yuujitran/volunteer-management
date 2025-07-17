// src/EventManagementPage.js
import React, { useState } from 'react';
import './EventManagementFormLayout.css';

const skillsOptions = [ 'Cooking','Tutoring','Driving','Event Setup' ];
const urgencyOptions = [ 'Low','Medium','High' ];

export default function EventManagementPage() {
  const [form, setForm] = useState({
    eventName: '',
    eventDescription: '',
    location: '',
    requiredSkills: [],
    urgency: '',
    eventDate: ''
  });

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleMulti = ({ target }) => {
    const values = Array.from(target.selectedOptions).map(o => o.value);
    setForm(f => ({ ...f, requiredSkills: values }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Map frontend form to backend fields
    const eventData = {
      name: form.eventName,
      details: form.eventDescription,
      location: form.location,
      requiredSkills: form.requiredSkills,
      urgency: form.urgency.toLowerCase(), // backend expects 'low', 'medium', 'high'
      // eventDate: form.eventDate, // not used in backend yet
    };

    try {
      const res = await fetch('http://localhost:5000/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (!res.ok) {
        const error = await res.json();
        alert('Error: ' + error.message);
        return;
      }

      const data = await res.json();
      alert('Event created: ' + data.name);
      // Optionally reset form or update event list here
    } catch (err) {
      alert('Network error: ' + err.message);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Event Management Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="eventName">Event Name</label>
          <input
            id="eventName"
            name="eventName"
            type="text"
            maxLength={100}
            required
            value={form.eventName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="eventDescription">Event Description</label>
          <textarea
            id="eventDescription"
            name="eventDescription"
            rows={4}
            required
            value={form.eventDescription}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <textarea
            id="location"
            name="location"
            rows={2}
            required
            value={form.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="requiredSkills">Required Skills</label>
          <select
            id="requiredSkills"
            name="requiredSkills"
            multiple
            required
            value={form.requiredSkills}
            onChange={handleMulti}
          >
            {skillsOptions.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="urgency">Urgency</label>
          <select
            id="urgency"
            name="urgency"
            required
            value={form.urgency}
            onChange={handleChange}
          >
            <option value="" disabled>Pick urgency</option>
            {urgencyOptions.map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="eventDate">Event Date</label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            required
            value={form.eventDate}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="button">Save Event</button>
      </form>
    </div>
  );
}
