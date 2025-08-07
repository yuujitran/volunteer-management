import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

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

  const states = [
    'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
    'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
    'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
  ];
  const skillsOptions = ['Cooking', 'Tutoring', 'Driving', 'Event Setup'];

  useEffect(() => {
    axios.get('http://localhost:5000/states')
      .then(res => setStatesList(res.data))
      .catch(err => console.error('Failed to fetch states:', err));
  }, []);
  
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

    if (!email || !form.fullName || !form.address1 || !form.city || !form.state || !form.zip || form.skills.length === 0) {
      alert('Please complete all required fields.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/profile', {
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
      navigate('/');
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
          <input name="zip" pattern="\d{5,9}" required onChange={handleChange} />
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
