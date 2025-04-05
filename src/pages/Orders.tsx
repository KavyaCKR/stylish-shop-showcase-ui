
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const OrderStatusBadge = ({ status }) => {
  const statusStyles = {
    'processing': 'bg-yellow-100 text-yellow-800',
    'shipped': 'bg-blue-100 text-blue-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

const StarRating = ({ rating, setRating, interactive = true }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && setRating(star)}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <Star
            className={`h-6 w-6 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const ReviewDialog = ({ isOpen, setIsOpen, product, onSubmitReview }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      setRating(5);
      setComment('');
    }
  }, [isOpen, product]);

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmitReview(product.id, { rating, comment });
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Review Product</DialogTitle>
          <DialogDescription>
            Share your experience with {product?.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden mr-4">
              {product?.images && (
                <img 
                  src={product.images[0]} 
                  alt={product?.name} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div>
              <h3 className="font-medium">{product?.name}</h3>
              <p className="text-sm text-gray-500">{product?.brand}</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Your Rating
            </label>
            <StarRating rating={rating} setRating={setRating} />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Your Review
            </label>
            <Textarea
              placeholder="Write your review here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            disabled={!rating || !comment.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const { getOrders, addReview } = useApi();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewDialog, setReviewDialog] = useState({ open: false, product: null });

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      try {
        const data = await getOrders();
        setOrders(data || []);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [isAuthenticated, getOrders]);

  const handleOpenReview = (product) => {
    setReviewDialog({
      open: true,
      product
    });
  };

  const handleSubmitReview = async (productId, reviewData) => {
    await addReview(productId, reviewData);
    
    // Refresh orders to update review status
    const updatedOrders = await getOrders();
    setOrders(updatedOrders || []);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading your orders...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white shadow-md rounded-lg">
          <p className="text-lg text-gray-500 mb-4">You haven't placed any orders yet</p>
          <Button asChild>
            <Link to="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableCaption>A list of your recent orders.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{format(new Date(order.created_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link to={`/orders/${order.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">Review Products</h2>
        
        {orders.some(order => order.status === 'delivered') ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders
              .filter(order => order.status === 'delivered')
              .flatMap(order => 
                order.items
                  .filter(item => !item.reviewed)
                  .map(item => ({
                    orderId: order.id,
                    ...item
                  }))
              )
              .map((item, index) => (
                <div key={`${item.orderId}-${item.product.id}-${index}`} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex items-start">
                    <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden mr-4">
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">Order #{item.orderId}</p>
                      <Button 
                        size="sm"
                        onClick={() => handleOpenReview(item.product)}
                      >
                        Write Review
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white shadow-md rounded-lg">
            <p className="text-gray-500">No products to review yet.</p>
            <p className="text-sm text-gray-400 mt-2">
              Products are available for review after delivery.
            </p>
          </div>
        )}
      </div>

      <ReviewDialog 
        isOpen={reviewDialog.open}
        setIsOpen={(open) => setReviewDialog({ ...reviewDialog, open })}
        product={reviewDialog.product}
        onSubmitReview={handleSubmitReview}
      />
    </div>
  );
};

export default Orders;
