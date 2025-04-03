
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  
  // Mock featured products (would come from an API in a real app)
  const featuredProducts = [
    {
      id: 1,
      name: "Premium Wireless Noise-Cancelling Headphones",
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470&auto=format&fit=crop",
      price: 249.99,
      rating: 4.8
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      category: "Wearables",
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1528&auto=format&fit=crop",
      price: 199.99,
      rating: 4.6
    },
    {
      id: 3,
      name: "Organic Cotton T-Shirt",
      category: "Clothing",
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1528&auto=format&fit=crop",
      price: 29.99,
      rating: 4.5
    },
    {
      id: 4,
      name: "Eco-Friendly Water Bottle",
      category: "Home",
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1587&auto=format&fit=crop",
      price: 24.99,
      rating: 4.7
    }
  ];
  
  // Mock categories with respective slugs
  const categories = [
    { id: 1, name: "Electronics", slug: "electronics", color: "bg-pink-500" },
    { id: 2, name: "Clothing", slug: "clothing", color: "bg-purple-500" },
    { id: 3, name: "Home & Kitchen", slug: "home-kitchen", color: "bg-blue-500" },
    { id: 4, name: "Beauty", slug: "beauty", color: "bg-green-500" }
  ];

  const handleAddToWishlist = (productId: number, productName: string) => {
    toast({
      title: "Added to Wishlist",
      description: `${productName} has been added to your wishlist`,
    });
  };

  const handleAddToCart = (productId: number, productName: string) => {
    toast({
      title: "Added to Cart",
      description: `${productName} has been added to your cart`,
    });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-20">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Discover Amazing Products for Your Lifestyle
            </h1>
            <p className="text-lg opacity-90">
              Shop the latest trends with personalized recommendations and secure checkout.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-white text-shop-primary hover:bg-gray-100"
                asChild
              >
                <Link to="/products">Shop Now</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link to="/categories">Browse Categories</Link>
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470&auto=format&fit=crop" 
              alt="Featured product" 
              className="max-w-full md:max-w-md rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Shop by Category</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id}
                to={`/categories/${category.slug}`}
                className={`${category.color} rounded-xl p-8 text-white text-center transition-transform hover:scale-105`}
              >
                <div className="flex justify-center items-center h-24 mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Featured Products</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div 
                key={product.id} 
                className="group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link to={`/products/${product.id}`} className="block aspect-square relative overflow-hidden bg-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity" />
                  <div className="absolute top-2 left-2">
                    <span className="inline-block bg-white/90 text-xs font-medium py-1 px-2 rounded">
                      {product.category}
                    </span>
                  </div>
                  <button 
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white"
                    aria-label="Add to wishlist"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToWishlist(product.id, product.name);
                    }}
                  >
                    <Heart className="h-5 w-5" />
                  </button>
                </Link>
                
                <div className="p-4">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-medium mb-1 group-hover:text-shop-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center space-x-1 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, index) => (
                        <Star 
                          key={index}
                          className={`h-3.5 w-3.5 ${
                            index < Math.floor(product.rating) 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{product.rating}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-bold">${product.price.toFixed(2)}</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 px-3"
                      onClick={() => handleAddToCart(product.id, product.name)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-shop-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="max-w-md mx-auto mb-8">
            Subscribe to our newsletter for exclusive deals and updates on new products.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Your email address" 
              className="bg-white"
            />
            <Button className="bg-black hover:bg-gray-800">Subscribe</Button>
          </div>
        </div>
      </section>
      
      {/* Why Shop With Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Why Shop With Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Checkout</h3>
              <p className="text-gray-600">
                Your payment information is always protected with our secure payment system.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your products delivered quickly with our expedited shipping options.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our customer service team is available around the clock to assist you.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
