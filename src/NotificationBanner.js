import React from 'react';
const NotificationBanner = () => {
  const notifications = [
    "📢 You have been assigned to the 'Health Camp' event.",
    "⏰ Reminder: 'Food Drive' starts tomorrow.",
    "⚠️ Update: 'Education Fair' location has changed.",
    "✅ Your profile has been successfully updated.",
  ];

  return (
    <div style={{
      backgroundColor: '#fff3cd',
      color: '#856404',
      border: '1px solid #ffeeba',
      padding: '1rem',
      borderRadius: '0 0 0 8px'
    }}>
      <strong>🔔 Notifications:</strong>
      <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
        {notifications.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
      <div style={{ color:'red', fontWeight:'bold'}}>TEST BANNER: WILL ONLY APPEAR WITH ACTUAL NOTIFICATIONS</div>
    </div>
    
  );
};

export default NotificationBanner;
