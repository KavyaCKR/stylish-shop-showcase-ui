
# E-Commerce Backend with MySQL

This is the backend server for the e-commerce application using Express.js and MySQL.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

### Installation

1. Clone the repository
2. Navigate to the server directory:
   ```
   cd server
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on `.env.example` and update with your MySQL credentials:
   ```
   cp .env.example .env
   ```
5. Edit the `.env` file with your MySQL database credentials

### Database Setup

Run the setup script to create and populate the database:
```
npm run setup-db
```

This will create:
- The database (if it doesn't exist)
- All required tables
- Sample data for categories and products
- A test user (email: test@example.com, password: password123)

### Running the Server

Start the development server:
```
npm run dev
```

The server will run on port 5000 by default (or the port specified in your `.env` file).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get a specific category with its products

### User Profile
- `GET /api/profile` - Get the authenticated user's profile

### Cart
- `GET /api/cart` - Get items in the user's cart
- `POST /api/cart` - Add an item to the cart
- `DELETE /api/cart/:id` - Remove an item from the cart

### Wishlist
- `GET /api/wishlist` - Get items in the user's wishlist
- `POST /api/wishlist` - Add an item to the wishlist
- `DELETE /api/wishlist/:id` - Remove an item from the wishlist

### Search
- `GET /api/search?q=term` - Search for products

## Authentication

Most endpoints require authentication using a JWT token. Add the token to the Authorization header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```
