import React, { useState } from 'react';
import axios from 'axios';

function ProfilePage() {
  const [form, setForm] = useState({
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    skills: [],
    preferences: '',
    availability: []
  });

  const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

  const skillsOptions = ['Cooking', 'Tutoring', 'Driving', 'Event Setup'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleMultiSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((option) => option.value);
    setForm({ ...form, skills: selected });
  };

  const handleAvailability = (e) => {
    const selected = e.target.value.split(',').map((d) => d.trim());
    setForm({ ...form, availability: selected });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log('Profile data submitted:', form);

  if (!form.fullName || !form.address1 || !form.city || !form.state || !form.zip || form.skills.length === 0) {
    alert('Please complete all required fields.');
    return;
  }

  alert('Profile saved successfully (simulated)');
};

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>User Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label><br />
          <input name="fullName" maxLength="50" required onChange={handleChange} />
        </div><br />

        <div>
          <label>Address 1:</label><br />
          <input name="address1" maxLength="100" required onChange={handleChange} />
        </div><br />

        <div>
          <label>Address 2 (optional):</label><br />
          <input name="address2" maxLength="100" onChange={handleChange} />
        </div><br />

        <div>
          <label>City:</label><br />
          <input name="city" maxLength="100" required onChange={handleChange} />
        </div><br />

        <div>
          <label>State:</label><br />
          <select name="state" required onChange={handleChange}>
            <option value="">Select a state</option>
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div><br />

        <div>
          <label>Zip Code:</label><br />
          <input name="zip" maxLength="9" pattern="\d{5,9}" required onChange={handleChange} />
        </div><br />

        <div>
          <label>Skills:</label><br />
          <select multiple required onChange={handleMultiSelect}>
            {skillsOptions.map((skill) => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div><br />

        <div>
          <label>Preferences (optional):</label><br />
          <textarea name="preferences" rows="4" cols="40" onChange={handleChange}></textarea>
        </div><br />

        <div>
            <label>Pick a date you're available:</label><br />
            <input
                type="date"
                value={form.currentDate || ''}
                onChange={(e) => setForm({ ...form, currentDate: e.target.value })}
            />
            <br /><br />
            <button
                type="button"
                onClick={() => {
                if (form.currentDate && !form.availability.includes(form.currentDate)) {
                    setForm({
                    ...form,
                    availability: [...form.availability, form.currentDate],
                    currentDate: ''
                    });
                }
                }}
            >
                Add Date
            </button>
        </div>

        <br />

        <div>
            <label>Dates you've selected:</label>
            <ul>
                {form.availability.map((date, index) => (
                <li key={index}>{date}</li>
                ))}
            </ul>
        </div>


        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}

export default ProfilePage;
