-- CREATE DATABASE VolunteerManagementDB;
USE volunteer_management;

DROP TABLE IF EXISTS UserProfile;
DROP TABLE IF EXISTS UserCredentials;



CREATE TABLE IF NOT EXISTS UserCredentials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS UserProfile (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  address1 VARCHAR(255) NOT NULL,
  address2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state CHAR(2) NOT NULL,
  zip VARCHAR(10) NOT NULL,
  skills TEXT,
  preferences TEXT,
  availability TEXT,
  user_id INT NOT NULL UNIQUE,  -- 🔥 Make user_id UNIQUE to enable ON DUPLICATE KEY UPDATE
  FOREIGN KEY (user_id) REFERENCES UserCredentials(id)
);

-- EventDetails table
CREATE TABLE IF NOT EXISTS EventDetails (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  location VARCHAR(100) NOT NULL,
  required_skills VARCHAR(255),
  urgency TINYINT NOT NULL CHECK (urgency BETWEEN 1 AND 5),
  event_date DATE NOT NULL,
  stateCode CHAR(2),
  FOREIGN KEY (stateCode) REFERENCES States(code)
);

-- VolunteerHistory table
CREATE TABLE IF NOT EXISTS VolunteerHistory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  volunteer_id INT NOT NULL,
  event_id INT NOT NULL,
  participation_date DATE NOT NULL,
  role VARCHAR(50),
  hours DECIMAL(5,2) NOT NULL CHECK (hours >= 0),
  FOREIGN KEY (event_id) REFERENCES EventDetails(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS States (
  code CHAR(2) PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

INSERT INTO States (code, name) VALUES
('AL', 'Alabama'),
('AK', 'Alaska'),
('AZ', 'Arizona'),
('AR', 'Arkansas'),
('CA', 'California'),
('CO', 'Colorado'),
('CT', 'Connecticut'),
('DE', 'Delaware'),
('FL', 'Florida'),
('GA', 'Georgia'),
('HI', 'Hawaii'),
('ID', 'Idaho'),
('IL', 'Illinois'),
('IN', 'Indiana'),
('IA', 'Iowa'),
('KS', 'Kansas'),
('KY', 'Kentucky'),
('LA', 'Louisiana'),
('ME', 'Maine'),
('MD', 'Maryland'),
('MA', 'Massachusetts'),
('MI', 'Michigan'),
('MN', 'Minnesota'),
('MS', 'Mississippi'),
('MO', 'Missouri'),
('MT', 'Montana'),
('NE', 'Nebraska'),
('NV', 'Nevada'),
('NH', 'New Hampshire'),
('NJ', 'New Jersey'),
('NM', 'New Mexico'),
('NY', 'New York'),
('NC', 'North Carolina'),
('ND', 'North Dakota'),
('OH', 'Ohio'),
('OK', 'Oklahoma'),
('OR', 'Oregon'),
('PA', 'Pennsylvania'),
('RI', 'Rhode Island'),
('SC', 'South Carolina'),
('SD', 'South Dakota'),
('TN', 'Tennessee'),
('TX', 'Texas'),
('UT', 'Utah'),
('VT', 'Vermont'),
('VA', 'Virginia'),
('WA', 'Washington'),
('WV', 'West Virginia'),
('WI', 'Wisconsin'),
('WY', 'Wyoming');

SELECT * FROM UserCredentials;
SELECT * FROM UserProfile;
