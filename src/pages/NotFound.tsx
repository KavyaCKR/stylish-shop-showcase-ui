
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mb-6">Oops! Page not found</p>
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>
          <Button asChild>
            <Link to="/" className="flex items-center gap-2">
              <Home size={16} />
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
