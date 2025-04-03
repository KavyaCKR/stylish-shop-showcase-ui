
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { productData } from '@/data/products';

const Products = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productData.map((product) => (
          <div key={product.id} className="group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <Link to={`/products/${product.id}`} className="block">
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button 
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white"
                  aria-label="Add to wishlist"
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>
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
                <Button size="sm" variant="ghost" className="h-8 px-3">
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
