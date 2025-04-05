
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
};

async function setupDatabase() {
  let connection;
  try {
    // Create connection without database
    connection = await mysql.createConnection(dbConfig);
    
    // Create database if not exists
    console.log('Creating database if not exists...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'ecommerce'}`);
    
    // Use the database
    await connection.query(`USE ${process.env.DB_NAME || 'ecommerce'}`);
    
    // Create tables
    console.log('Creating tables...');
    
    // Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        avatar VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Categories table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) NOT NULL UNIQUE,
        image VARCHAR(255),
        description TEXT,
        product_count INT DEFAULT 0
      )
    `);
    
    // Products table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        discount DECIMAL(10, 2),
        images JSON,
        rating FLOAT DEFAULT 0,
        stock INT DEFAULT 0,
        brand VARCHAR(100),
        category_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )
    `);
    
    // Cart table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cart (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY (user_id, product_id)
      )
    `);
    
    // Wishlist table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY (user_id, product_id)
      )
    `);
    
    // Sample data - Categories
    console.log('Adding sample categories...');
    await connection.query(`
      INSERT INTO categories (name, slug, image, description, product_count) VALUES
      ('Electronics', 'electronics', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=2070', 'Explore our range of cutting-edge electronics, from smart home devices to premium audio equipment and the latest gadgets.', 42),
      ('Clothing', 'clothing', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=2070', 'Discover stylish apparel for every occasion, featuring sustainable materials and designs that combine comfort with contemporary fashion.', 56),
      ('Home & Kitchen', 'home-kitchen', 'https://images.unsplash.com/photo-1556911220-bda9f7f3fe9b?auto=format&fit=crop&q=80&w=2070', 'Transform your living space with our home and kitchen collection, from elegant dining sets to modern kitchen appliances and cozy decor.', 38),
      ('Beauty & Personal Care', 'beauty-personal-care', 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=2188', 'Enhance your natural beauty with our range of skincare, makeup, and personal care products made with premium ingredients and ethical formulations.', 27)
    `);
    
    // Sample data - Products
    console.log('Adding sample products...');
    await connection.query(`
      INSERT INTO products (name, slug, description, price, discount, images, rating, stock, brand, category_id) VALUES
      ('Wireless Headphones', 'wireless-headphones', 'Premium wireless headphones with noise cancellation and 20-hour battery life.', 149.99, 199.99, '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470&auto=format&fit=crop"]', 4.5, 50, 'SoundPro', 1),
      ('Smart Watch', 'smart-watch', 'Track your fitness goals with this waterproof smart watch featuring heart rate monitoring.', 199.99, 249.99, '["https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1528&auto=format&fit=crop"]', 4.2, 30, 'TechWear', 1),
      ('Cotton T-Shirt', 'cotton-tshirt', 'Comfortable cotton t-shirt available in multiple colors.', 19.99, 24.99, '["https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1528&auto=format&fit=crop"]', 4.8, 100, 'EcoWear', 2),
      ('Leather Jacket', 'leather-jacket', 'Classic leather jacket with quilted lining and multiple pockets.', 199.99, 249.99, '["https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1470&auto=format&fit=crop"]', 4.6, 20, 'UrbanChic', 2)
    `);
    
    // Create a test user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    await connection.query(`
      INSERT INTO users (name, email, password, avatar) VALUES
      ('Test User', 'test@example.com', '${hashedPassword}', 'https://api.dicebear.com/7.x/initials/svg?seed=TestUser')
    `);
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Database setup failed:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
