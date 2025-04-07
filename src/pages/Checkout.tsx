
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, CreditCard, Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { createCheckout } = useApi();
  
  const [isLoading, setIsLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    email: '',
    phone: ''
  });
  
  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
      return;
    }
    
    // Get order details from location state
    if (location.state && location.state.orderDetails) {
      setOrderDetails(location.state.orderDetails);
    } else if (location.state && location.state.orderId) {
      // If we have an orderId but no details, we could fetch the order details
      // For now, redirect back to orders page
      navigate('/orders');
      toast({
        title: 'Checkout Error',
        description: 'Order information is missing. Please try again.',
        variant: 'destructive'
      });
    } else {
      // No order information provided, redirect to orders
      navigate('/orders');
    }
  }, [isAuthenticated, location, navigate, toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderDetails) {
      toast({
        title: 'Checkout Error',
        description: 'Order information is missing. Please try again.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // For demo purposes, we'll simulate a successful checkout
      // In a real app, you would process payment info and shipping details
      const result = await createCheckout(
        orderDetails.items || orderDetails, 
        shippingInfo
      );
      
      if (result) {
        toast({
          title: 'Order Placed Successfully',
          description: 'Thank you for your purchase!',
        });
        
        // Redirect to success page or order details
        setTimeout(() => {
          navigate('/orders');
        }, 1500);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout Failed',
        description: 'There was a problem processing your order. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading checkout information...</span>
      </div>
    );
  }
  
  // Calculate totals
  const subtotal = orderDetails.items 
    ? orderDetails.items.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0)
    : orderDetails.subtotal || 0;
  
  const shipping = orderDetails.shipping || 12.99;
  const tax = orderDetails.tax || subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {/* Shipping Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name"
                      value={shippingInfo.name}
                      onChange={handleInputChange}
                      placeholder="John Smith"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <Label htmlFor="address">Street Address</Label>
                  <Input 
                    id="address" 
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select 
                      value={shippingInfo.state} 
                      onValueChange={(value) => setShippingInfo(prev => ({ ...prev, state: value }))}
                    >
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AL">Alabama</SelectItem>
                        <SelectItem value="AK">Alaska</SelectItem>
                        <SelectItem value="AZ">Arizona</SelectItem>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="CO">Colorado</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="WA">Washington</SelectItem>
                        {/* Add all states as needed */}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input 
                      id="zipCode" 
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select 
                      value={shippingInfo.country} 
                      onValueChange={(value) => setShippingInfo(prev => ({ ...prev, country: value }))}
                    >
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USA">United States</SelectItem>
                        <SelectItem value="CAN">Canada</SelectItem>
                        <SelectItem value="MEX">Mexico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Payment Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="credit_card"
                      value="credit_card"
                      name="payment_method"
                      checked={paymentMethod === 'credit_card'}
                      onChange={() => setPaymentMethod('credit_card')}
                      className="h-4 w-4 text-primary"
                    />
                    <Label htmlFor="credit_card" className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" /> Credit Card
                    </Label>
                  </div>
                  
                  {paymentMethod === 'credit_card' && (
                    <div className="border p-4 rounded-md mt-2">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="card_name">Name on Card</Label>
                          <Input 
                            id="card_name" 
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="John Smith"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="card_number">Card Number</Label>
                          <Input 
                            id="card_number" 
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry Date (MM/YY)</Label>
                            <Input 
                              id="expiry" 
                              value={expiryDate}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^\d]/g, '');
                                if (value.length <= 4) {
                                  const formatted = value.length > 2 ? value.slice(0, 2) + '/' + value.slice(2) : value;
                                  setExpiryDate(formatted);
                                }
                              }}
                              placeholder="MM/YY"
                              maxLength={5}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input 
                              id="cvv" 
                              value={cvv}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^\d]/g, '');
                                if (value.length <= 3) {
                                  setCvv(value);
                                }
                              }}
                              placeholder="123"
                              maxLength={3}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="paypal"
                      value="paypal"
                      name="payment_method"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      className="h-4 w-4 text-primary"
                    />
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="lg:hidden">
              {/* Order Summary for mobile view */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Order...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Complete Order (${total.toFixed(2)})
                </>
              )}
            </Button>
          </form>
        </div>
        
        {/* Order Summary - Desktop */}
        <div className="hidden lg:block">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Product List */}
                <div className="space-y-3">
                  {orderDetails.items ? (
                    orderDetails.items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-100 w-12 h-12 rounded overflow-hidden">
                            {item.product.images && (
                              <img 
                                src={item.product.images[0]} 
                                alt={item.product.name} 
                                className="w-full h-full object-cover" 
                              />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Order items not available</p>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
