
//import React from 'react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage({ setIsLoggedIn }) {
  const navigate = useNavigate();

  //stores inputs locally 
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/login', {
        email: form.email,
        password: form.password
      });

      alert(res.data.message); // Login successful
      setIsLoggedIn(true);
      navigate('/profile', { state: { email: res.data.email } });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial' }}>
      <h1>Login</h1>
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
      <hr style={{ margin: '2rem 0' }} />
      <p style={{ fontWeight: 'bold' }}>Don’t have an account?</p>
      <button onClick={() => navigate('/register')}>Register</button>
    </div>
  );
}

export default LoginPage;
