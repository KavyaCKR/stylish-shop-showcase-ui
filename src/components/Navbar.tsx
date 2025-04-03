
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Search, User, Home, Menu, X, LogOut, UserCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useShop } from '@/contexts/ShopContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount, wishlist } = useShop();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

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
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-shop-primary flex items-center gap-1">
            <Home className="h-4 w-4" />
            Home
          </Link>
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
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-background pt-16 px-4">
            <nav className="flex flex-col gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                Home
              </Link>
              <Link 
                to="/products" 
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                to="/categories" 
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                to="/deals" 
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Deals
              </Link>
              <Link 
                to="/about" 
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              
              <div className="mt-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input 
                    type="search" 
                    placeholder="Search products..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </nav>
          </div>
        )}
        
        {/* Search bar (desktop) */}
        <form onSubmit={handleSearch} className="hidden md:flex relative max-w-sm items-center space-x-2">
          <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search products..." 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" size="sm" className="hidden sm:flex">Search</Button>
        </form>
        
        {/* User Actions */}
        <div className="flex items-center gap-4">
          <Link to="/wishlist" className="relative">
            <Heart className="h-6 w-6" />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-shop-primary text-xs text-white">
                {wishlist.length}
              </span>
            )}
          </Link>
          
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-shop-primary text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <User className="h-6 w-6" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user?.name && <p className="font-medium">{user.name}</p>}
                    {user?.email && (
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders" className="w-full cursor-pointer">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/wishlist" className="w-full cursor-pointer">Wishlist</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="cursor-pointer text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/login')}
              className="hidden md:flex"
            >
              <User className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
