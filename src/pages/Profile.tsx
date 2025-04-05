
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, ShoppingBag, Heart, Settings, Home, Package } from 'lucide-react';

const Profile = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // If user is not authenticated, redirect to login
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };

  if (!user) {
    return null; // Will redirect via useEffect
  }

  // Format the date or use a default if created_at is not available
  const memberSince = user.created_at 
    ? new Date(user.created_at).toLocaleDateString()
    : new Date().toLocaleDateString(); // Fallback to current date

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-700">
                    <User size={40} />
                  </div>
                )}
              </div>
              <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
              <p className="text-gray-500 mb-4">{user.email}</p>
              <Button 
                variant="outline" 
                className="w-full mb-2"
                onClick={() => handleLogout()}
              >
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">DASHBOARD</h3>
              <ul className="space-y-2">
                <li>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => navigate('/orders')}
                  >
                    <Package className="mr-2 h-4 w-4" /> Orders
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => navigate('/wishlist')}
                  >
                    <Heart className="mr-2 h-4 w-4" /> Wishlist
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => navigate('/settings')}
                  >
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => navigate('/')}
                  >
                    <Home className="mr-2 h-4 w-4" /> Back to Home
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
            <div className="text-center py-8 text-gray-500">
              <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p>Check your order history and review products</p>
              <Button 
                className="mt-4"
                onClick={() => navigate('/orders')}
              >
                View Orders
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Account Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">{memberSince}</p>
              </div>
              <Button 
                variant="outline"
                onClick={() => navigate('/edit-profile')}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
