
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ status: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }
    
    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    
    // Generate avatar URL
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
    
    // Update user with avatar
    await pool.query('UPDATE users SET avatar = ? WHERE id = ?', [avatar, result.insertId]);
    
    // Create token
    const token = jwt.sign(
      { id: result.insertId, name, email, avatar },
      process.env.JWT_SECRET || 'mysecretkey',
      { expiresIn: '1d' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: result.insertId, name, email, avatar }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }
    
    // Find user
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Create token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
      process.env.JWT_SECRET || 'mysecretkey',
      { expiresIn: '1d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Products routes
app.get('/api/products', async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT p.*, 
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(r.id) as review_count
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      GROUP BY p.id
    `);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT p.*, 
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(r.id) as review_count
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE p.id = ?
      GROUP BY p.id
    `, [req.params.id]);
    
    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Get reviews for the product
    const [reviews] = await pool.query(`
      SELECT r.id, r.rating, r.comment, r.created_at,
        u.name as user_name, u.avatar as user_avatar
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
    `, [req.params.id]);
    
    // Return product with reviews
    res.json({
      ...products[0],
      reviews
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Categories routes
app.get('/api/categories', async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/categories/:slug', async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories WHERE slug = ?', [req.params.slug]);
    
    if (categories.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const [products] = await pool.query(`
      SELECT p.*, 
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(r.id) as review_count
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE p.category_id = ?
      GROUP BY p.id
    `, [categories[0].id]);
    
    res.json({
      category: categories[0],
      products
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// Search route
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const searchTerm = `%${q}%`;
    const [products] = await pool.query(`
      SELECT p.*, 
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(r.id) as review_count
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE p.name LIKE ? OR p.description LIKE ?
      GROUP BY p.id
    `, [searchTerm, searchTerm]);
    
    res.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Failed to search products' });
  }
});

// Authentication middleware
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Protected routes
app.get('/api/profile', authenticate, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, avatar, created_at FROM users WHERE id = ?', [req.user.id]);
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(users[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Cart and wishlist routes
app.post('/api/cart', authenticate, async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;
    
    if (!product_id || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }
    
    // Check if product exists in cart
    const [cartItems] = await pool.query(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
      [user_id, product_id]
    );
    
    if (cartItems.length > 0) {
      // Update quantity
      await pool.query(
        'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
        [quantity, user_id, product_id]
      );
    } else {
      // Add new item
      await pool.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [user_id, product_id, quantity]
      );
    }
    
    res.status(201).json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

app.get('/api/cart', authenticate, async (req, res) => {
  try {
    const [cartItems] = await pool.query(
      `SELECT c.id, c.quantity, p.* 
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = ?`,
      [req.user.id]
    );
    
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

app.delete('/api/cart/:id', authenticate, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM cart WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

app.post('/api/wishlist', authenticate, async (req, res) => {
  try {
    const { product_id } = req.body;
    const user_id = req.user.id;
    
    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    
    // Check if product exists in wishlist
    const [wishlistItems] = await pool.query(
      'SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?',
      [user_id, product_id]
    );
    
    if (wishlistItems.length === 0) {
      // Add to wishlist
      await pool.query(
        'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
        [user_id, product_id]
      );
    }
    
    res.status(201).json({ message: 'Added to wishlist successfully' });
  } catch (error) {
    console.error('Error updating wishlist:', error);
    res.status(500).json({ error: 'Failed to update wishlist' });
  }
});

app.get('/api/wishlist', authenticate, async (req, res) => {
  try {
    const [wishlistItems] = await pool.query(
      `SELECT w.id, p.* 
       FROM wishlist w 
       JOIN products p ON w.product_id = p.id 
       WHERE w.user_id = ?`,
      [req.user.id]
    );
    
    res.json(wishlistItems);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

app.delete('/api/wishlist/:id', authenticate, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM wishlist WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    
    res.json({ message: 'Item removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ error: 'Failed to remove item from wishlist' });
  }
});

// Orders routes
app.post('/api/orders', authenticate, async (req, res) => {
  try {
    const { items, shipping } = req.body;
    const user_id = req.user.id;
    
    if (!items || items.length === 0 || !shipping) {
      return res.status(400).json({ error: 'Items and shipping details are required' });
    }
    
    // Calculate order totals
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shipping_cost = 12.99; // Fixed shipping cost for now
    const tax = subtotal * 0.08; // 8% tax rate
    const total = subtotal + shipping_cost + tax;
    
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Create the order
      const [orderResult] = await connection.query(
        `INSERT INTO orders (
          user_id, subtotal, shipping, tax, total, status, payment_method,
          shipping_address, shipping_city, shipping_state, shipping_zip, shipping_country
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id, subtotal, shipping_cost, tax, total, 'processing', 'Credit Card',
          shipping.address, shipping.city, shipping.state, shipping.zipCode, shipping.country
        ]
      );
      
      const order_id = orderResult.insertId;
      
      // Add order items
      for (const item of items) {
        await connection.query(
          `INSERT INTO order_items (
            order_id, product_id, quantity, price, name
          ) VALUES (?, ?, ?, ?, ?)`,
          [order_id, item.product.id, item.quantity, item.product.price, item.product.name]
        );
      }
      
      // Clear user's cart
      await connection.query('DELETE FROM cart WHERE user_id = ?', [user_id]);
      
      // Commit the transaction
      await connection.commit();
      
      res.status(201).json({
        message: 'Order placed successfully',
        order_id
      });
    } catch (error) {
      // Roll back on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

app.get('/api/orders', authenticate, async (req, res) => {
  try {
    // Get all orders for the user
    const [orders] = await pool.query(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );
    
    // For each order, get the order items
    const ordersWithItems = [];
    for (const order of orders) {
      const [items] = await pool.query(
        `SELECT oi.*, p.images, p.description, p.brand, p.category_id
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      
      // Check if user has reviewed each item
      for (let i = 0; i < items.length; i++) {
        const [reviews] = await pool.query(
          `SELECT * FROM reviews 
           WHERE user_id = ? AND product_id = ? AND order_id = ?`,
          [req.user.id, items[i].product_id, order.id]
        );
        
        items[i].reviewed = reviews.length > 0;
        if (items[i].reviewed) {
          items[i].review = reviews[0];
        }
        
        // Add product information
        items[i].product = {
          id: items[i].product_id,
          name: items[i].name,
          price: items[i].price,
          images: JSON.parse(items[i].images),
          description: items[i].description,
          brand: items[i].brand
        };
      }
      
      ordersWithItems.push({
        ...order,
        items
      });
    }
    
    res.json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/api/orders/:id', authenticate, async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT * FROM orders WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = orders[0];
    
    // Get order items
    const [items] = await pool.query(
      `SELECT oi.*, p.images, p.description, p.brand, p.category_id
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [order.id]
    );
    
    // Check if user has reviewed each item
    for (let i = 0; i < items.length; i++) {
      const [reviews] = await pool.query(
        `SELECT * FROM reviews 
         WHERE user_id = ? AND product_id = ? AND order_id = ?`,
        [req.user.id, items[i].product_id, order.id]
      );
      
      items[i].reviewed = reviews.length > 0;
      if (items[i].reviewed) {
        items[i].review = reviews[0];
      }
      
      // Add product information
      items[i].product = {
        id: items[i].product_id,
        name: items[i].name,
        price: items[i].price,
        images: JSON.parse(items[i].images),
        description: items[i].description,
        brand: items[i].brand
      };
    }
    
    res.json({
      ...order,
      items,
      shipping: {
        address: order.shipping_address,
        city: order.shipping_city,
        state: order.shipping_state,
        zipCode: order.shipping_zip,
        country: order.shipping_country
      }
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

app.post('/api/orders/:id/cancel', authenticate, async (req, res) => {
  try {
    // Check if order exists and belongs to user
    const [orders] = await pool.query(
      `SELECT * FROM orders WHERE id = ? AND user_id = ? AND status = 'processing'`,
      [req.params.id, req.user.id]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found or cannot be cancelled' });
    }
    
    // Update order status
    await pool.query(
      `UPDATE orders SET status = 'cancelled' WHERE id = ?`,
      [req.params.id]
    );
    
    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

// Reviews routes
app.post('/api/products/:id/reviews', authenticate, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product_id = req.params.id;
    const user_id = req.user.id;
    
    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment are required' });
    }
    
    // Check if product exists
    const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [product_id]);
    
    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Check if user has ordered this product (can only review purchased products)
    const [orderItems] = await pool.query(`
      SELECT oi.* FROM order_items oi 
      JOIN orders o ON oi.order_id = o.id 
      WHERE o.user_id = ? AND oi.product_id = ? AND o.status = 'delivered'
    `, [user_id, product_id]);
    
    if (orderItems.length === 0) {
      return res.status(400).json({ error: 'You can only review products you have purchased' });
    }
    
    // Check if user has already reviewed this product from this order
    const order_id = orderItems[0].order_id;
    const [existingReviews] = await pool.query(`
      SELECT * FROM reviews 
      WHERE user_id = ? AND product_id = ? AND order_id = ?
    `, [user_id, product_id, order_id]);
    
    if (existingReviews.length > 0) {
      return res.status(400).json({ error: 'You have already reviewed this product from this order' });
    }
    
    // Create review
    await pool.query(`
      INSERT INTO reviews (user_id, product_id, order_id, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `, [user_id, product_id, order_id, rating, comment]);
    
    // Update product rating
    const [reviews] = await pool.query(`
      SELECT AVG(rating) as avg_rating 
      FROM reviews 
      WHERE product_id = ?
    `, [product_id]);
    
    const avg_rating = reviews[0].avg_rating;
    
    await pool.query(`
      UPDATE products SET rating = ? WHERE id = ?
    `, [avg_rating, product_id]);
    
    res.status(201).json({ 
      message: 'Review submitted successfully',
      rating: avg_rating
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

app.get('/api/products/:id/reviews', async (req, res) => {
  try {
    const [reviews] = await pool.query(`
      SELECT r.*, u.name as user_name, u.avatar as user_avatar
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
    `, [req.params.id]);
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

app.put('/api/reviews/:id', authenticate, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment are required' });
    }
    
    // Check if review exists and belongs to user
    const [reviews] = await pool.query(
      `SELECT * FROM reviews WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id]
    );
    
    if (reviews.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    const product_id = reviews[0].product_id;
    
    // Update review
    await pool.query(
      `UPDATE reviews SET rating = ?, comment = ? WHERE id = ?`,
      [rating, comment, req.params.id]
    );
    
    // Update product rating
    const [avgReview] = await pool.query(`
      SELECT AVG(rating) as avg_rating 
      FROM reviews 
      WHERE product_id = ?
    `, [product_id]);
    
    const avg_rating = avgReview[0].avg_rating;
    
    await pool.query(`
      UPDATE products SET rating = ? WHERE id = ?
    `, [avg_rating, product_id]);
    
    res.json({ 
      message: 'Review updated successfully',
      rating: avg_rating
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

app.delete('/api/reviews/:id', authenticate, async (req, res) => {
  try {
    // Check if review exists and belongs to user
    const [reviews] = await pool.query(
      `SELECT * FROM reviews WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id]
    );
    
    if (reviews.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    const product_id = reviews[0].product_id;
    
    // Delete review
    await pool.query(`DELETE FROM reviews WHERE id = ?`, [req.params.id]);
    
    // Update product rating
    const [avgReview] = await pool.query(`
      SELECT AVG(rating) as avg_rating 
      FROM reviews 
      WHERE product_id = ?
    `, [product_id]);
    
    const avg_rating = avgReview[0].avg_rating || 0;
    
    await pool.query(`
      UPDATE products SET rating = ? WHERE id = ?
    `, [avg_rating, product_id]);
    
    res.json({ 
      message: 'Review deleted successfully',
      rating: avg_rating
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
