
import React from 'react';
import { User, Star, ShoppingBag, Truck, RotateCcw, Shield } from 'lucide-react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About ShopWise</h1>
        
        <div className="mb-12">
          <img 
            src="https://images.unsplash.com/photo-1441057206919-63d19fac2369?auto=format&fit=crop&q=80&w=2070" 
            alt="ShopWise Team" 
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
          
          <p className="text-lg mb-4">
            Founded in 2015, ShopWise has grown from a small online store to become one of the leading e-commerce platforms, 
            offering a wide range of high-quality products at competitive prices.
          </p>
          
          <p className="text-lg mb-4">
            Our mission is to make online shopping accessible, enjoyable, and reliable for everyone. We carefully curate our 
            product selection to ensure that every item meets our quality standards, and we're constantly expanding our 
            catalog to meet our customers' evolving needs.
          </p>
        </div>
        
        <h2 className="text-2xl font-bold mb-6">Why Choose ShopWise?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-shop-primary/20 p-3 mr-4">
                <ShoppingBag className="h-6 w-6 text-shop-primary" />
              </div>
              <h3 className="text-xl font-semibold">Quality Products</h3>
            </div>
            <p>We carefully select each product to ensure it meets our high standards for quality and performance.</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-shop-primary/20 p-3 mr-4">
                <Truck className="h-6 w-6 text-shop-primary" />
              </div>
              <h3 className="text-xl font-semibold">Fast Shipping</h3>
            </div>
            <p>We offer quick and reliable shipping options to get your purchases to your doorstep as soon as possible.</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-shop-primary/20 p-3 mr-4">
                <RotateCcw className="h-6 w-6 text-shop-primary" />
              </div>
              <h3 className="text-xl font-semibold">Easy Returns</h3>
            </div>
            <p>Our hassle-free 30-day return policy gives you peace of mind with every purchase.</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-shop-primary/20 p-3 mr-4">
                <Shield className="h-6 w-6 text-shop-primary" />
              </div>
              <h3 className="text-xl font-semibold">Secure Shopping</h3>
            </div>
            <p>Shop with confidence knowing that your personal and payment information is protected.</p>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-6">Our Team</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
              <img 
                src="https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&q=80&w=2070" 
                alt="Alex Johnson" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-1">Alex Johnson</h3>
            <p className="text-gray-600 mb-2">Founder & CEO</p>
          </div>
          
          <div className="text-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
              <img 
                src="https://images.unsplash.com/photo-1498936178812-4b2e558d2937?auto=format&fit=crop&q=80&w=2070" 
                alt="Sarah Miller" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-1">Sarah Miller</h3>
            <p className="text-gray-600 mb-2">Head of Product</p>
          </div>
          
          <div className="text-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
              <img 
                src="https://images.unsplash.com/photo-1518877593221-1f28583780b4?auto=format&fit=crop&q=80&w=2070" 
                alt="Michael Chen" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-1">Michael Chen</h3>
            <p className="text-gray-600 mb-2">CTO</p>
          </div>
        </div>
        
        <div className="bg-shop-primary/10 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <p className="mb-4">
            We're always looking to improve and would love to hear from you. If you have any questions, 
            suggestions, or feedback, please don't hesitate to reach out.
          </p>
          <a href="/contact" className="text-shop-primary font-medium hover:underline">
            Contact Us →
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
