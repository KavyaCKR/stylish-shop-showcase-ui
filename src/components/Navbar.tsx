
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Search, User } from 'lucide-react';
import { Input } from "@/components/ui/input";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-full bg-shop-primary w-10 h-10 flex items-center justify-center text-white font-bold">
              SW
            </div>
            <span className="text-xl font-bold text-shop-primary">ShopWise</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/products" className="text-sm font-medium transition-colors hover:text-shop-primary">
            Products
          </Link>
          <Link to="/categories" className="text-sm font-medium transition-colors hover:text-shop-primary">
            Categories
          </Link>
          <Link to="/deals" className="text-sm font-medium transition-colors hover:text-shop-primary">
            Deals
          </Link>
          <Link to="/about" className="text-sm font-medium transition-colors hover:text-shop-primary">
            About
          </Link>
        </nav>
        
        <div className="hidden md:flex relative max-w-sm items-center space-x-2">
          <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search products..." 
            className="pl-8" 
          />
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/wishlist" className="relative">
            <Heart className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-shop-primary text-xs text-white">
              2
            </span>
          </Link>
          
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-shop-primary text-xs text-white">
              3
            </span>
          </Link>
          
          <Link to="/account" className="hidden md:block">
            <User className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
