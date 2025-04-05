
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronLeft, 
  Truck, 
  Clock, 
  CheckCircle, 
  XCircle,
  Calendar,
  MapPin,
  Package,
  Loader2,
} from 'lucide-react';
import { StarRating } from '@/components/ReviewForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReviewForm from '@/components/ReviewForm';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const OrderStatusTimeline = ({ status }) => {
  const statuses = ["Processing", "Shipped", "Delivered"];
  const currentIndex = statuses.findIndex(s => 
    s.toLowerCase() === status.toLowerCase()
  );
  
  return (
    <div className="relative">
      <div className="flex items-center justify-between w-full mb-2">
        {statuses.map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${index <= currentIndex ? 'bg-green-500' : 'bg-gray-200'}
              ${status.toLowerCase() === "cancelled" && index === currentIndex ? 'bg-red-500' : ''}
            `}>
              {index < currentIndex ? (
                <CheckCircle className="h-5 w-5 text-white" />
              ) : index === currentIndex ? (
                status.toLowerCase() === "cancelled" ? (
                  <XCircle className="h-5 w-5 text-white" />
                ) : status.toLowerCase() === "delivered" ? (
                  <CheckCircle className="h-5 w-5 text-white" />
                ) : status.toLowerCase() === "processing" ? (
                  <Clock className="h-5 w-5 text-white" />
                ) : (
                  <Truck className="h-5 w-5 text-white" />
                )
              ) : (
                <span className="text-xs font-bold text-white">{index + 1}</span>
              )}
            </div>
            <span className={`text-xs mt-1 ${index <= currentIndex ? 'font-medium' : 'text-gray-500'}`}>
              {step}
            </span>
          </div>
        ))}
      </div>
      
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10">
        <div 
          className={`h-full ${status.toLowerCase() === "cancelled" ? 'bg-red-500' : 'bg-green-500'}`}
          style={{ 
            width: `${currentIndex === -1 ? 0 : currentIndex >= statuses.length - 1 ? '100%' : `${(currentIndex / (statuses.length - 1)) * 100}%`}` 
          }}
        />
      </div>
    </div>
  );
};

const OrderDetail = () => {
  const { id } = useParams();
  const { getOrderById, cancelOrder, addReview } = useApi();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const { toast } = useToast();
  const [reviewDialog, setReviewDialog] = useState({ 
    open: false, 
    productId: null,
    productName: '',
    productImage: ''
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id, getOrderById]);

  const handleCancelOrder = async () => {
    if (!order || order.status !== 'processing') return;
    
    setIsCancelling(true);
    try {
      const success = await cancelOrder(order.id);
      if (success) {
        // Update local state
        setOrder({
          ...order,
          status: 'cancelled'
        });
        
        toast({
          title: "Order cancelled",
          description: "Your order has been cancelled successfully",
        });
      }
    } finally {
      setIsCancelling(false);
    }
  };

  const handleOpenReviewDialog = (productId, productName, productImage) => {
    setReviewDialog({
      open: true,
      productId,
      productName,
      productImage
    });
  };

  const handleSubmitReview = async (reviewData) => {
    if (!reviewDialog.productId) return;
    
    setIsSubmittingReview(true);
    try {
      await addReview(reviewDialog.productId, { ...reviewData, orderId: order.id });
      
      // Update local state
      setOrder({
        ...order,
        items: order.items.map(item => 
          item.product.id === reviewDialog.productId
            ? { 
                ...item, 
                reviewed: true, 
                review: { rating: reviewData.rating, comment: reviewData.comment } 
              }
            : item
        )
      });
      
      setReviewDialog({ open: false, productId: null, productName: '', productImage: '' });
      
      toast({
        title: "Review submitted",
        description: "Thank you for your review!",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading order details...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Order not found</h2>
          <p className="text-gray-500 mb-6">The order you're looking for doesn't exist or you don't have access to it.</p>
          <Button asChild>
            <Link to="/orders">Back to Orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/orders">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold">Order #{order.id}</h1>
          <div className="mt-2 md:mt-0">
            <span className="text-gray-500">
              Placed on {format(new Date(order.created_at), 'MMMM d, yyyy')}
            </span>
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
          <CardDescription>Track your order</CardDescription>
        </CardHeader>
        <CardContent>
          <OrderStatusTimeline status={order.status} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm">
                Order Date: {format(new Date(order.created_at), 'MMMM d, yyyy')}
              </span>
            </div>
            
            {order.shipped_at && (
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm">
                  Shipped on: {format(new Date(order.shipped_at), 'MMMM d, yyyy')}
                </span>
              </div>
            )}
            
            {order.delivered_at && (
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm">
                  Delivered on: {format(new Date(order.delivered_at), 'MMMM d, yyyy')}
                </span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          {order.status === 'processing' && (
            <Button 
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Cancel Order'
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {order.items.map((item) => (
                  <div key={item.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-start">
                      <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden mr-4">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Link 
                          to={`/products/${item.product.id}`}
                          className="text-lg font-medium hover:text-primary transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm text-gray-500">
                            {item.product.brand}
                          </p>
                          <div className="text-right">
                            <p className="font-medium">${item.price.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        
                        {item.reviewed ? (
                          <div className="mt-4 border rounded p-4 bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-sm">Your Review</h4>
                              <StarRating rating={item.review.rating} interactive={false} size="small" />
                            </div>
                            <p className="text-sm">{item.review.comment}</p>
                          </div>
                        ) : order.status === 'delivered' && (
                          <Button 
                            variant="outline" 
                            className="mt-3"
                            onClick={() => handleOpenReviewDialog(
                              item.product.id, 
                              item.product.name,
                              item.product.images[0]
                            )}
                          >
                            Write a Product Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Payment Method: {order.payment_method}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <p>{order.shipping.address}</p>
                  <p>{order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}</p>
                  <p>{order.shipping.country}</p>
                </div>
              </div>
              
              {order.tracking_number && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-medium mb-2">Tracking Information</h3>
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm">{order.tracking_number}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 w-full"
                    onClick={() => window.open('https://example.com/track')}
                  >
                    Track Package
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialog.open} onOpenChange={(open) => setReviewDialog({...reviewDialog, open})}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Review Product</DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
              <img 
                src={reviewDialog.productImage} 
                alt={reviewDialog.productName} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-lg">{reviewDialog.productName}</h3>
              <p className="text-sm text-gray-500">Order #{id}</p>
            </div>
          </div>
          
          <ReviewForm 
            onSubmit={handleSubmitReview}
            isSubmitting={isSubmittingReview}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderDetail;
