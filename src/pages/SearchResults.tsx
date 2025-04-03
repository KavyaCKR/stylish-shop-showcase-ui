
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { productData, Product } from '@/data/products';
import { useShop } from '@/contexts/ShopContext';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Product[]>([]);
  const { addToCart, addToWishlist, isInWishlist } = useShop();

  useEffect(() => {
    if (query) {
      const searchResults = productData.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase())
      );
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-gray-600 mb-6">
        {results.length} results for "{query}"
      </p>
      
      {results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 mb-4">No products found matching your search</p>
          <Button asChild>
            <Link to="/products">Browse All Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((product) => (
            <div key={product.id} className="group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <Link to={`/products/${product.id}`} className="block">
                <div className="aspect-square relative overflow-hidden bg-gray-100">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button 
                    className={`absolute top-2 right-2 p-1.5 rounded-full ${isInWishlist(product.id) ? 'bg-red-50 text-red-500' : 'bg-white/80 hover:bg-white'}`}
                    aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                    onClick={(e) => {
                      e.preventDefault();
                      addToWishlist(product);
                    }}
                  >
                    <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-red-500' : ''}`} />
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
                  <div>
                    <span className="font-bold">${product.price.toFixed(2)}</span>
                    {product.discount && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ${product.discount.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 px-3"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4" />
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

export default SearchResults;
