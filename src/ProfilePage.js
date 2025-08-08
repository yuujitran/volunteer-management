import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
const API_BASE = 'http://localhost:5000';


function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || localStorage.getItem('userEmail');

  useEffect(() => {
    if (email) {
      localStorage.setItem('userEmail', email); // persist across refreshes
    }
  }, [email]);

  const API_BASE = 'http://localhost:5000';

  const [form, setForm] = useState({
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    skills: [],
    preferences: '',
    availability: [],
    currentDate: ''
  });

  const skillsOptions = ['Cooking', 'Tutoring', 'Driving', 'Event Setup'];
  const [statesList, setStatesList] = useState([]);
  
  useEffect(() => {
    axios.get(`${API_BASE}/states`)
      .then(res => setStatesList(res.data))
      .catch(err => console.error('Failed to fetch states:', err));
  }, []);

  const fetchProfile = () => {
    if (!email) return;

    axios.get(`${API_BASE}/profile`, { params: { email } })
      .then(res => {
        const data = res.data;
        setForm({
          fullName: data.full_name || '',
          address1: data.address1 || '',
          address2: data.address2 || '',
          city: data.city || '',
          state: data.state || '',
          zip: data.zip || '',
          skills: Array.isArray(data.skills) ? data.skills : JSON.parse(data.skills || '[]'),
          preferences: data.preferences || '',
          availability: Array.isArray(data.availability) ? data.availability : JSON.parse(data.availability || '[]'),
          currentDate: ''
        });
      })
      .catch(err => {
        console.error('Failed to fetch profile:', err);
      });
  };
  

  useEffect(() => {
    fetchProfile();
  }, [email]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setForm(prev => ({ ...prev, skills: selected }));
  };

  const handleAddDate = () => {
    if (form.currentDate && !form.availability.includes(form.currentDate)) {
      setForm(prev => ({
        ...prev,
        availability: [...prev.availability, prev.currentDate],
        currentDate: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !form.fullName || !form.address1 || !form.city || !form.state || !form.zip || form.skills.length === 0 || form.availability.length === 0) {
      alert('Please complete all required fields.');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/profile`, {
        email,
        fullName: form.fullName,
        address1: form.address1,
        address2: form.address2,
        city: form.city,
        state: form.state,
        zip: form.zip,
        skills: form.skills,
        preferences: form.preferences,
        availability: form.availability
      });

      alert(res.data.message);
      fetchProfile();
    } catch (err) {
      console.error('Failed to save profile:', err);
      alert('Failed to save profile');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>User Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label><br />
          <input name="fullName" maxLength="50" required value={form.fullName} onChange={handleChange} />
        </div><br />

        <div>
          <label>Address 1:</label><br />
          <input name="address1" maxLength="100" required value={form.address1} onChange={handleChange} />
        </div><br />

        <div>
          <label>Address 2 (optional):</label><br />
          <input name="address2" maxLength="100" value={form.address2} onChange={handleChange} />
        </div><br />

        <div>
          <label>City:</label><br />
          <input name="city" maxLength="100" required value={form.city} onChange={handleChange} />
        </div><br />

        <div>
          <label>State:</label><br />
          <select name="state" required value={form.state} onChange={handleChange}>
            <option value="">Select a state</option>
            {statesList && statesList.length > 0 && statesList.map((s) => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>
        </div><br />

        <div>
          <label>Zip Code:</label><br />
          <input name="zip" pattern="\d{5,9}" required value={form.zip} onChange={handleChange} />
        </div><br />

        <div>
          <label>Skills:</label><br />
          <select multiple required value={form.skills} onChange={handleMultiSelect}>
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
            value={form.currentDate}
            onChange={(e) => setForm({ ...form, currentDate: e.target.value })}
          />
          <button type="button" onClick={handleAddDate}>Add Date</button>
        </div><br />

        <div>
          <label>Availability Dates:</label>
          <ul>
            {form.availability.map((date, idx) => (
              <li key={idx}>{date}</li>
            ))}
          </ul>
        </div>

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}

export default ProfilePage;
