
import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useShop } from '@/contexts/ShopContext';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useShop();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 mb-4">Your wishlist is empty</p>
          <Button asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div 
              key={product.id} 
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link to={`/products/${product.id}`} className="block aspect-square relative overflow-hidden bg-gray-100">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <span className="inline-block bg-white/90 text-xs font-medium py-1 px-2 rounded">
                    {product.brand}
                  </span>
                </div>
              </Link>
              
              <div className="p-4">
                <Link to={`/products/${product.id}`}>
                  <h3 className="font-medium mb-1 hover:text-shop-primary transition-colors">
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
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-bold">${product.price.toFixed(2)}</span>
                    {product.discount && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ${product.discount.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className="flex-1" 
                    variant="default"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
