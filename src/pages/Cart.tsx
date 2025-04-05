
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useShop } from '@/contexts/ShopContext';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/useApi';

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, clearCart } = useShop();
  const { isAuthenticated } = useAuth();
  const { placeOrder } = useApi();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Calculate additional values
  const shipping = 12.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=cart');
      return;
    }
    
    setIsProcessing(true);
    
    // Simple shipping details for demo purposes
    const shippingDetails = {
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "USA"
    };
    
    try {
      const orderResult = await placeOrder(cart, shippingDetails);
      if (orderResult) {
        clearCart();
        navigate(`/orders`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 mb-4">Your cart is empty</p>
          <Button asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Cart Items ({cart.reduce((acc, item) => acc + item.quantity, 0)})</h2>
              </div>
              <ul className="divide-y">
                {cart.map((item) => (
                  <li key={item.product.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-full sm:w-24 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <Link to={`/products/${item.product.id}`} className="text-lg font-medium hover:text-shop-primary transition-colors">
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500 mb-2">{item.product.brand}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded overflow-hidden">
                          <button 
                            className="px-2 py-1 hover:bg-gray-100"
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-1 border-x">{item.quantity}</span>
                          <button 
                            className="px-2 py-1 hover:bg-gray-100"
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      </div>
                    </div>
                    <div className="text-right font-bold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Button 
                className="w-full" 
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Proceed to Checkout'
                )}
              </Button>
              <Button variant="outline" className="w-full mt-2" asChild>
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
