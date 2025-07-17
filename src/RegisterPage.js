//import React from 'react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [form, setForm] = useState({
  email: '',
  password: '',
  confirmPassword: '',
  role: ''
});

//fake user for now, no DB
const [registeredUsers, setRegisteredUsers] = useState([
    { email: 'admin@example.com', password: 'admin123', role: 'admin' }
]);

const navigate = useNavigate();

const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password || !form.confirmPassword || !form.role) {
      alert("Please fill in all fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const existingUser = registeredUsers.find(user => user.email === form.email);
    if (existingUser) {
      alert("Email is already registered.");
      return;
    }

    //saves fake user
    const newUser = {
      email: form.email,
      password: form.password,
      role: form.role
    };

    setRegisteredUsers([...registeredUsers, newUser]);

    alert("Registration successful (simulated)");

    //redirects to profile page after registering
    navigate('/profile', { state: { email: form.email } });
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
