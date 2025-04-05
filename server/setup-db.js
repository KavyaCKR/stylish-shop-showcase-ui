
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
    
    // Orders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        shipping DECIMAL(10, 2) NOT NULL,
        tax DECIMAL(10, 2) NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        status ENUM('processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'processing',
        payment_method VARCHAR(50) NOT NULL,
        shipping_address VARCHAR(255) NOT NULL,
        shipping_city VARCHAR(100) NOT NULL,
        shipping_state VARCHAR(100) NOT NULL,
        shipping_zip VARCHAR(20) NOT NULL,
        shipping_country VARCHAR(100) NOT NULL,
        tracking_number VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        shipped_at TIMESTAMP NULL,
        delivered_at TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Order items table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        name VARCHAR(255) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);
    
    // Reviews table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        order_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        UNIQUE KEY (user_id, product_id, order_id)
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
    
    // Create a sample order with items for test user
    console.log('Creating sample orders and reviews...');
    
    // Get the user id
    const [users] = await connection.query(`SELECT id FROM users WHERE email = 'test@example.com'`);
    const userId = users[0].id;
    
    // Create an order
    const [orderResult] = await connection.query(`
      INSERT INTO orders (
        user_id, subtotal, shipping, tax, total, status, payment_method,
        shipping_address, shipping_city, shipping_state, shipping_zip, shipping_country,
        created_at, shipped_at, delivered_at
      ) VALUES (
        ?, 349.98, 12.99, 28.00, 390.97, 'delivered', 'Credit Card',
        '123 Main St', 'Anytown', 'CA', '12345', 'USA',
        DATE_SUB(NOW(), INTERVAL 15 DAY),
        DATE_SUB(NOW(), INTERVAL 12 DAY),
        DATE_SUB(NOW(), INTERVAL 10 DAY)
      )
    `, [userId]);
    
    const orderId = orderResult.insertId;
    
    // Add order items
    await connection.query(`
      INSERT INTO order_items (order_id, product_id, quantity, price, name) VALUES
      (?, 1, 1, 149.99, 'Wireless Headphones'),
      (?, 2, 1, 199.99, 'Smart Watch')
    `, [orderId, orderId]);
    
    // Add a review for one product
    await connection.query(`
      INSERT INTO reviews (user_id, product_id, order_id, rating, comment) VALUES
      (?, 1, ?, 5, 'These headphones are amazing! Great sound quality and the noise cancellation works perfectly. Battery life is also impressive.')
    `, [userId, orderId]);
    
    // Update product rating
    await connection.query(`
      UPDATE products SET rating = 5 WHERE id = 1
    `);
    
    // Create a processing order
    const [orderResult2] = await connection.query(`
      INSERT INTO orders (
        user_id, subtotal, shipping, tax, total, status, payment_method,
        shipping_address, shipping_city, shipping_state, shipping_zip, shipping_country,
        created_at
      ) VALUES (
        ?, 19.99, 12.99, 1.60, 34.58, 'processing', 'Credit Card',
        '123 Main St', 'Anytown', 'CA', '12345', 'USA',
        DATE_SUB(NOW(), INTERVAL 2 DAY)
      )
    `, [userId]);
    
    const orderId2 = orderResult2.insertId;
    
    // Add order items
    await connection.query(`
      INSERT INTO order_items (order_id, product_id, quantity, price, name) VALUES
      (?, 3, 1, 19.99, 'Cotton T-Shirt')
    `, [orderId2]);
    
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
