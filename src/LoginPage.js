//import React from 'react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ setIsLoggedIn }) {
  const navigate = useNavigate();

  //stores inputs locally 
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  //fake registered users for now
  const registeredUsers = [
    { email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { email: 'volunteer@example.com', password: 'vol123', role: 'volunteer' }
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //check if uer exists in the fake list
    const user = registeredUsers.find(
      (u) => u.email === form.email && u.password === form.password
    );

    if (user) {
      //routes to event page after login
      setIsLoggedIn(true);
      navigate('/events', { state: { email: user.email } });
    } else {
      setError('Invalid email or password');
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
