
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-12 pb-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">ShopWise</h3>
            <p className="text-gray-600 mb-4">
              Your one-stop shop for quality products at amazing prices.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-600 hover:text-shop-primary">All Products</Link></li>
              <li><Link to="/categories" className="text-gray-600 hover:text-shop-primary">Categories</Link></li>
              <li><Link to="/deals" className="text-gray-600 hover:text-shop-primary">Deals</Link></li>
              <li><Link to="/new-arrivals" className="text-gray-600 hover:text-shop-primary">New Arrivals</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-600 hover:text-shop-primary">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-shop-primary">FAQs</Link></li>
              <li><Link to="/shipping" className="text-gray-600 hover:text-shop-primary">Shipping</Link></li>
              <li><Link to="/returns" className="text-gray-600 hover:text-shop-primary">Returns</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Stay Connected</h3>
            <p className="text-gray-600 mb-4">
              Subscribe to our newsletter for exclusive deals.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-shop-primary focus:border-transparent"
              />
              <button 
                className="bg-shop-primary text-white px-4 py-2 rounded-r-md hover:bg-shop-secondary transition-colors"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} ShopWise. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/terms" className="text-gray-600 text-sm hover:text-shop-primary">Terms</Link>
              <Link to="/privacy" className="text-gray-600 text-sm hover:text-shop-primary">Privacy</Link>
              <Link to="/cookies" className="text-gray-600 text-sm hover:text-shop-primary">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
