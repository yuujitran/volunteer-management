import React from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Login</h1>
      <form>
        <div>
          <label>Email:</label><br />
          <input type="email" required />
        </div>
        <br />
        <div>
          <label>Password:</label><br />
          <input type="password" required />
        </div>
        <br />
        <button type="submit">Login</button>
      </form>
      <hr style={{ margin: '2rem 0' }} />
      <p>Don’t have an account?</p>
      <button onClick={() => navigate('/register')}>Register</button>
    </div>
  );
}

export default LoginPage;
