import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'Modanker_04',
    port: parseInt(process.env.DB_PORT || '3306')
  });

  try {
    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'house_rental_db'}`);
    await connection.query(`USE ${process.env.DB_NAME || 'house_rental_db'}`);

    // Create Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role ENUM('owner', 'tenant', 'admin') NOT NULL DEFAULT 'tenant',
        avatar VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create Properties table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id INT PRIMARY KEY AUTO_INCREMENT,
        owner_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        rent DECIMAL(10, 2) NOT NULL,
        location VARCHAR(500) NOT NULL,
        amenities JSON,
        photos JSON,
        bedrooms INT DEFAULT 1,
        bathrooms INT DEFAULT 1,
        area_sqft INT,
        property_type ENUM('apartment', 'house', 'studio', 'villa', 'condo') DEFAULT 'apartment',
        is_available BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create Bookings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        property_id INT NOT NULL,
        tenant_id INT NOT NULL,
        status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
        message TEXT,
        move_in_date DATE,
        duration_months INT DEFAULT 12,
        request_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        response_time TIMESTAMP NULL,
        owner_notes TEXT,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
        FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create property_ratings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS property_ratings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        property_id INT NOT NULL,
        tenant_id INT NOT NULL,
        rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_property_rating (property_id, tenant_id),
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
        FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create user_ratings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_ratings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        reviewer_id INT NOT NULL,
        target_user_id INT NOT NULL,
        rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_rating (reviewer_id, target_user_id),
        FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT anti_self_rating CHECK (reviewer_id <> target_user_id)
      )
    `);

    // Create sample admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await connection.query(`
      INSERT IGNORE INTO users (email, password, name, role) 
      VALUES ('admin@houserental.com', ?, 'System Admin', 'admin')
    `, [hashedPassword]);

    console.log('✅ Database initialized successfully!');
    console.log('📋 Tables created: users, properties, bookings, property_ratings, user_ratings');
    console.log('👤 Default admin user: admin@houserental.com / admin123');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

initializeDatabase();

