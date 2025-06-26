import React from 'react';

function RegisterPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Register</h1>
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
        <div>
          <label>Confirm Password:</label><br />
          <input type="password" required />
        </div>
        <br />
        <div>
          <label>Role:</label><br />
          <select required>
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
