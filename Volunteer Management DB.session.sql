CREATE DATABASE VolunteerManagementDB;
USE VolunteerManagementDB;

DROP TABLE IF EXISTS UserProfile;
DROP TABLE IF EXISTS UserCredentials;



CREATE TABLE UserCredentials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL
);

CREATE TABLE UserProfile (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  address1 VARCHAR(255) NOT NULL,
  address2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state CHAR(2) NOT NULL,
  zip VARCHAR(10) NOT NULL,
  skills TEXT NOT NULL,
  preferences TEXT,
  availability TEXT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES UserCredentials(id)
);

SELECT * FROM UserCredentials;
SELECT * FROM UserProfile;
