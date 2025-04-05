
const API_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = () => localStorage.getItem('token');

// Helper for fetch with auth and error handling
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = getToken();
  
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, options);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }
  
  return data;
};

// Products API
export const productApi = {
  getAll: () => fetchWithAuth('/products'),
  getById: (id) => fetchWithAuth(`/products/${id}`),
  search: (query) => fetchWithAuth(`/search?q=${encodeURIComponent(query)}`)
};

// Categories API
export const categoryApi = {
  getAll: () => fetchWithAuth('/categories'),
  getBySlug: (slug) => fetchWithAuth(`/categories/${slug}`)
};

// User API
export const userApi = {
  getProfile: () => fetchWithAuth('/profile'),
};

// Cart API
export const cartApi = {
  getItems: () => fetchWithAuth('/cart'),
  addToCart: (productId, quantity) => fetchWithAuth('/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId, quantity })
  }),
  removeFromCart: (itemId) => fetchWithAuth(`/cart/${itemId}`, {
    method: 'DELETE'
  })
};

// Wishlist API
export const wishlistApi = {
  getItems: () => fetchWithAuth('/wishlist'),
  addToWishlist: (productId) => fetchWithAuth('/wishlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId })
  }),
  removeFromWishlist: (itemId) => fetchWithAuth(`/wishlist/${itemId}`, {
    method: 'DELETE'
  })
};

// Orders API
export const orderApi = {
  getOrders: () => fetchWithAuth('/orders'),
  placeOrder: (cartItems, shippingDetails) => fetchWithAuth('/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: cartItems, shipping: shippingDetails })
  }),
  getOrderById: (orderId) => fetchWithAuth(`/orders/${orderId}`),
  cancelOrder: (orderId) => fetchWithAuth(`/orders/${orderId}/cancel`, {
    method: 'POST'
  })
};

// Reviews API
export const reviewApi = {
  getProductReviews: (productId) => fetchWithAuth(`/products/${productId}/reviews`),
  addReview: (productId, { rating, comment }) => fetchWithAuth(`/products/${productId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating, comment })
  }),
  updateReview: (reviewId, { rating, comment }) => fetchWithAuth(`/reviews/${reviewId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating, comment })
  }),
  deleteReview: (reviewId) => fetchWithAuth(`/reviews/${reviewId}`, {
    method: 'DELETE'
  })
};
