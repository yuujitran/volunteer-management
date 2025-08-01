//import React from 'react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
  const [form, setForm] = useState({
  email: '',
  password: '',
  confirmPassword: '',
  role: ''
});

const [error, setError] = useState('');
const navigate = useNavigate();

const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password || !form.confirmPassword || !form.role) {
      alert("Please fill in all fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/volunteers', {
        email: form.email,
        password: form.password,
        role: form.role
      });

      alert(res.data.message);
      navigate('/profile', { state: { email: form.email } }); // pass email to ProfilePage
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };


  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <div>
          <label>Password:</label><br />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <div>
          <label>Confirm Password:</label><br />
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <div>
          <label>Role:</label><br />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="volunteer">Volunteer</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
