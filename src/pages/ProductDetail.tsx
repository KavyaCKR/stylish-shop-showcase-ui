
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  ChevronRight,
  Check,
  Truck,
  RotateCcw,
  Shield
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Mock product data (would come from an API in a real app)
const product = {
  id: 1,
  name: "Premium Wireless Noise-Cancelling Headphones",
  brand: "AudioTech",
  price: 249.99,
  discount: 279.99,
  rating: 4.8,
  reviewCount: 256,
  description: "Experience crystal-clear sound and total immersion with our premium wireless noise-cancelling headphones. Featuring advanced acoustic technology, these headphones deliver exceptional audio quality while effectively blocking out ambient noise. With a comfortable over-ear design and up to 30 hours of battery life, they're perfect for long listening sessions at home or on the go.",
  features: [
    "Active noise cancellation",
    "30-hour battery life",
    "Bluetooth 5.2 connectivity",
    "Built-in microphone for calls",
    "Comfortable memory foam ear cushions",
    "Foldable design for easy storage",
    "Quick charge: 5 minutes for 3 hours of playback"
  ],
  specifications: [
    { name: "Connection", value: "Bluetooth 5.2, 3.5mm cable" },
    { name: "Battery Life", value: "Up to 30 hours" },
    { name: "Charging Time", value: "2 hours (full charge)" },
    { name: "Driver Size", value: "40mm" },
    { name: "Frequency Response", value: "20Hz - 20kHz" },
    { name: "Weight", value: "250g" }
  ],
  colors: [
    { name: "Matte Black", value: "#222222", inStock: true },
    { name: "Silver Gray", value: "#CCCCCC", inStock: true },
    { name: "Navy Blue", value: "#000080", inStock: false },
    { name: "Rose Gold", value: "#B76E79", inStock: true }
  ],
  images: [
    "/lovable-uploads/afa82835-5390-483c-9ee6-aea32f9c6647.png",
    "/lovable-uploads/2abb4fb6-3562-4a40-a5fd-f05195f98165.png",
    "/lovable-uploads/d7a2f581-a44c-4f2e-a7e2-8c73b9977740.png",
    "/lovable-uploads/a01d3669-dbae-4e1b-b896-bfebfce0bd80.png"
  ],
  relatedProducts: [
    {
      id: 2,
      name: "Smart Fitness Watch",
      image: "/lovable-uploads/73473fc3-402c-40af-9b3e-4cbfe74ee042.png",
      price: 199.99,
      rating: 4.6
    },
    {
      id: 3,
      name: "Organic Cotton T-Shirt",
      image: "/lovable-uploads/73473fc3-402c-40af-9b3e-4cbfe74ee042.png",
      price: 29.99,
      rating: 4.5
    },
    {
      id: 4,
      name: "Eco-Friendly Water Bottle",
      image: "/lovable-uploads/73473fc3-402c-40af-9b3e-4cbfe74ee042.png",
      price: 24.99,
      rating: 4.7
    }
  ],
  reviews: [
    {
      id: 1,
      user: "Alex Johnson",
      date: "March 15, 2025",
      rating: 5,
      content: "These headphones are amazing! The sound quality is exceptional, and the noise cancellation works perfectly in noisy environments. Battery life is as advertised - I've been using them for a week on my commute without needing to recharge."
    },
    {
      id: 2,
      user: "Sarah Miller",
      date: "March 10, 2025",
      rating: 4,
      content: "Great headphones overall. The sound quality is excellent and they're very comfortable to wear for long periods. The only reason I'm not giving 5 stars is that the app can be a bit glitchy sometimes."
    },
    {
      id: 3,
      user: "Michael Chen",
      date: "February 28, 2025",
      rating: 5,
      content: "Worth every penny! The noise cancellation is best-in-class, and the sound quality is crisp and balanced. I'm particularly impressed with the battery life - I only need to charge them once a week with daily use."
    }
  ]
};

const ProductDetail = () => {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  
  const handleAddToCart = () => {
    toast.success(`Added ${quantity} ${product.name} to your cart`);
  };
  
  const handleAddToWishlist = () => {
    toast.success(`Added ${product.name} to your wishlist`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-shop-primary">Home</a>
        <ChevronRight className="h-4 w-4 mx-1" />
        <a href="/categories" className="hover:text-shop-primary">Electronics</a>
        <ChevronRight className="h-4 w-4 mx-1" />
        <a href="/categories/headphones" className="hover:text-shop-primary">Headphones</a>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-gray-700 font-medium">{product.name}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden border bg-gray-50">
            <img 
              src={product.images[activeImage]} 
              alt={product.name} 
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button 
                key={index}
                className={`aspect-square border rounded-md overflow-hidden ${
                  activeImage === index ? 'ring-2 ring-shop-primary' : ''
                }`}
                onClick={() => setActiveImage(index)}
              >
                <img 
                  src={image} 
                  alt={`Product view ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-500">{product.brand}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, index) => (
                <Star 
                  key={index}
                  className={`h-5 w-5 ${
                    index < Math.floor(product.rating) 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-yellow-600 font-medium">{product.rating}</span>
            <span className="text-gray-500">({product.reviewCount} reviews)</span>
          </div>
          
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            {product.discount && (
              <span className="text-lg text-gray-500 line-through">${product.discount.toFixed(2)}</span>
            )}
            {product.discount && (
              <span className="text-sm font-semibold bg-red-100 text-red-600 px-2 py-1 rounded">
                Save ${(product.discount - product.price).toFixed(2)}
              </span>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Color</h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    className={`relative w-12 h-12 rounded-full border-2 ${
                      selectedColor.name === color.name 
                        ? 'border-shop-primary' 
                        : 'border-transparent'
                    } ${!color.inStock ? 'opacity-40' : ''}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => color.inStock && setSelectedColor(color)}
                    disabled={!color.inStock}
                    aria-label={color.name}
                  >
                    {selectedColor.name === color.name && (
                      <Check className={`absolute inset-0 m-auto h-6 w-6 ${
                        selectedColor.value === '#222222' ? 'text-white' : 'text-black'
                      }`} />
                    )}
                    {!color.inStock && (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                        Out
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">Selected: {selectedColor.name}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Quantity</h3>
              <div className="flex items-center border rounded-md w-32">
                <button 
                  className="px-3 py-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  className="w-full text-center border-0 focus:ring-0"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                />
                <button 
                  className="px-3 py-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Button 
              className="flex-1 gap-2 bg-shop-primary hover:bg-shop-secondary"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
            
            <Button 
              variant="outline"
              className="gap-2"
              onClick={handleAddToWishlist}
            >
              <Heart className="h-5 w-5" />
              Wishlist
            </Button>
            
            <Button variant="outline" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-5 w-5 text-shop-primary" />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <RotateCcw className="h-5 w-5 text-shop-primary" />
              <span>30-day hassle-free returns</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-5 w-5 text-shop-primary" />
              <span>2-year warranty included</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="pt-6">
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">{product.description}</p>
              
              <h3 className="text-xl font-semibold mb-4">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-shop-primary mr-2 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="specifications" className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  {product.specifications.map((spec, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-3 px-4 font-medium">{spec.name}</td>
                      <td className="py-3 px-4">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="pt-6">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{product.reviewCount} Reviews</h3>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, index) => (
                        <Star 
                          key={index}
                          className={`h-5 w-5 ${
                            index < Math.floor(product.rating) 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-gray-500">Average rating: {product.rating}/5</span>
                  </div>
                </div>
                
                <Button>Write a Review</Button>
              </div>
              
              <Separator />
              
              {product.reviews.map((review) => (
                <div key={review.id} className="space-y-2">
                  <div className="flex justify-between">
                    <h4 className="font-semibold">{review.user}</h4>
                    <span className="text-gray-500 text-sm">{review.date}</span>
                  </div>
                  
                  <div className="flex">
                    {[...Array(5)].map((_, index) => (
                      <Star 
                        key={index}
                        className={`h-4 w-4 ${
                          index < review.rating 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <p className="text-gray-700">{review.content}</p>
                  
                  <Separator className="mt-4" />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You might also like</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {product.relatedProducts.map((item) => (
            <div key={item.id} className="group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button 
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white"
                  aria-label="Add to wishlist"
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="font-medium mb-1 group-hover:text-shop-primary transition-colors">
                  {item.name}
                </h3>
                
                <div className="flex items-center space-x-1 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, index) => (
                      <Star 
                        key={index}
                        className={`h-3.5 w-3.5 ${
                          index < Math.floor(item.rating) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{item.rating}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-bold">${item.price.toFixed(2)}</span>
                  <Button size="sm" variant="ghost" className="h-8 px-3">
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
