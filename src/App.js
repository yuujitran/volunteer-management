
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ProfilePage from './ProfilePage';
import EventManagementPage from './EventManagementPage';
import NotificationBanner from './NotificationBanner';
import VolunteerHistoryPage from './VolunteerHistoryPage';
import VolunteerMatchingForm from './VolunteerMatchingForm';
import NavBar from './NavBar';
import Footer from './Footer';
import AboutUs from './FooterLinks/AboutUs';
import Location from './FooterLinks/Location';
import FAQ from './FooterLinks/FAQ';
import ContactUs from './FooterLinks/ContactUs';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
      <div style={{ padding: '1rem', fontFamily: 'Arial'}}>
        <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
        <div style={{
          backgroundImage: `url('/mission-banner.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'top',
          color: '#FFFFFF',
          padding: '1rem',
          textAlign: 'center',
          fontSize: '1.5rem',
          borderBottom: '1px solid #ccc',
          textDecoration: 'underline',
          textUnderlineOffset: '3px',
          textShadow: `
            -1px -1px 0 #C8102E,
            1px -1px 0 #C8102E,
            -1px 1px 0 #C8102E,
            1px 1px 0 #C8102E
          `
        }}>
          <h1>Welcome to Cougar Helpers!</h1>
          <p>University of Houston's most trusted site to match students to volunteer opportunities!</p>
        </div>
        <NotificationBanner />

      <Routes>
        <Route path="/" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/events" element={<EventManagementPage />} />
        <Route path="/volunteerhistory" element={<VolunteerHistoryPage />}/>
        <Route path="/volunteer-match" element={<VolunteerMatchingForm />} />
        <Route path="/FooterLinks/AboutUs" element={<AboutUs />} />
        <Route path="/FooterLinks/Location" element={<Location />} />
        <Route path="/FooterLinks/FAQ" element={<FAQ />} />
        <Route path="/FooterLinks/ContactUs" element={<ContactUs />} />
      </Routes>
      <Footer />
      </div>
    </Router>
    
  );
}

export default App;
