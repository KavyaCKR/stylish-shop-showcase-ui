
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Share, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useShop } from '@/contexts/ShopContext';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, addToWishlist, isInWishlist } = useShop();

  const handleShare = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this product: ${product.name}`,
        url: `${window.location.origin}/products/${product.id}`
      })
      .then(() => toast({
        title: "Shared successfully",
        description: "Product has been shared",
      }))
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(`${window.location.origin}/products/${product.id}`)
        .then(() => toast({
          title: "Link copied",
          description: "Product link copied to clipboard",
        }))
        .catch(err => console.error('Could not copy text: ', err));
    }
  };

  return (
    <div className="group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 flex flex-col space-y-2">
            <button 
              className={`p-1.5 rounded-full ${isInWishlist(product.id) ? 'bg-red-50 text-red-500' : 'bg-white/80 hover:bg-white'}`}
              aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToWishlist(product);
              }}
            >
              <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-red-500' : ''}`} />
            </button>
            
            <button 
              className="p-1.5 rounded-full bg-white/80 hover:bg-white"
              aria-label="Share product"
              onClick={(e) => handleShare(e, product)}
            >
              <Share className="h-5 w-5" />
            </button>
          </div>
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
