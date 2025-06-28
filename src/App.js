
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ProfilePage from './ProfilePage';
import EventManagementPage from './EventManagementPage';
import NotificationBanner from './NotificationBanner';


function App() {
  return (
    <Router>
      <div style={{ padding: '1rem', fontFamily: 'Arial' }}>
        <NotificationBanner />
  
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/events/manage" element={<EventManagementPage />} />
      </Routes>
    </Router>
  );
}

export default App;
