import React, { useState } from 'react';

const skillsOptions = [
  'Cooking',
  'Tutoring',
  'Driving',
  'Event Setup',
  // …add any other skills your app uses
];

const urgencyOptions = ['Low', 'Medium', 'High'];

function EventManagementPage() {
  const [form, setForm] = useState({
    eventName: '',
    eventDescription: '',
    location: '',
    requiredSkills: [],
    urgency: '',
    eventDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleMultiSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setForm((f) => ({ ...f, requiredSkills: selected }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New Event:', form);
    // TODO: send to backend
  };

  return (
    <div>
      <h1>Event Management Form</h1>
      <form onSubmit={handleSubmit}>
        {/* Event Name */}
        <label>
          Event Name (max 100 chars):
          <input
            type="text"
            name="eventName"
            maxLength="100"
            required
            value={form.eventName}
            onChange={handleChange}
          />
        </label>
        <br />

        {/* Event Description */}
        <label>
          Event Description:
          <textarea
            name="eventDescription"
            required
            rows={4}
            value={form.eventDescription}
            onChange={handleChange}
          />
        </label>
        <br />

        {/* Location */}
        <label>
          Location:
          <textarea
            name="location"
            required
            rows={2}
            value={form.location}
            onChange={handleChange}
          />
        </label>
        <br />

        {/* Required Skills */}
        <label>
          Required Skills:
          <select
            name="requiredSkills"
            multiple
            required
            value={form.requiredSkills}
            onChange={handleMultiSelect}
          >
            {skillsOptions.map((skill) => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </label>
        <br />

        {/* Urgency */}
        <label>
          Urgency:
          <select
            name="urgency"
            required
            value={form.urgency}
            onChange={handleChange}
          >
            <option value="" disabled>Select urgency</option>
            {urgencyOptions.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </label>
        <br />

        {/* Event Date */}
        <label>
          Event Date:
          <input
            type="date"
            name="eventDate"
            required
            value={form.eventDate}
            onChange={handleChange}
          />
        </label>
        <br />

        <button type="submit">Save Event</button>
      </form>
    </div>
  );
}

export default EventManagementPage;
