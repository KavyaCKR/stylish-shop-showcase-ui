
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
import { Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import ReviewForm, { StarRating } from '@/components/ReviewForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const ReviewDialog = ({ isOpen, setIsOpen, product, orderId, onSubmitReview }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (reviewData) => {
    setIsSubmitting(true);
    try {
      await onSubmitReview(product.id, reviewData, orderId);
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
        
        <div className="py-4">
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
          
          <ReviewForm 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Orders = () => {
  const [searchParams] = useSearchParams();
  const reviewProductId = searchParams.get('review');
  
  const { isAuthenticated } = useAuth();
  const { getOrders, addReview, getProductById } = useApi();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewDialog, setReviewDialog] = useState({ 
    open: false, 
    product: null,
    orderId: null
  });
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      try {
        const data = await getOrders();
        setOrders(data || []);
        
        // If there's a review parameter in the URL, open the review dialog
        if (reviewProductId) {
          const productId = parseInt(reviewProductId);
          const orderWithProduct = data.find(order => 
            order.items.some(item => item.product.id === productId)
          );
          
          if (orderWithProduct) {
            const item = orderWithProduct.items.find(item => 
              item.product.id === productId
            );
            
            if (item && orderWithProduct.status === 'delivered') {
              setReviewDialog({
                open: true,
                product: item.product,
                orderId: orderWithProduct.id
              });
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [isAuthenticated, getOrders, reviewProductId]);

  const handleOpenReview = (product, orderId) => {
    setReviewDialog({
      open: true,
      product,
      orderId
    });
  };

  const handleSubmitReview = async (productId, reviewData, orderId) => {
    await addReview(productId, { ...reviewData, orderId });
    
    // Refresh orders to update review status
    const updatedOrders = await getOrders();
    setOrders(updatedOrders || []);
  };

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === activeTab);

  const productsToReview = orders
    .filter(order => order.status === 'delivered')
    .flatMap(order => 
      order.items
        .filter(item => !item.reviewed)
        .map(item => ({
          orderId: order.id,
          ...item
        }))
    );

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
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-5 w-full md:w-auto">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white shadow-md rounded-lg">
          <p className="text-lg text-gray-500 mb-4">You haven't placed any orders yet</p>
          <Button asChild>
            <Link to="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white shadow-md rounded-lg">
          <p className="text-lg text-gray-500 mb-4">No {activeTab} orders found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-4 p-4 border-b">
                <div>
                  <p className="text-sm text-gray-500">Order Placed</p>
                  <p className="font-medium">{format(new Date(order.created_at), 'dd MMM yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-medium">${order.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="md:text-right">
                  <p className="text-sm text-gray-500">Order #{order.id}</p>
                  <Button
                    variant="link"
                    size="sm"
                    asChild
                    className="p-0 h-auto"
                  >
                    <Link to={`/orders/${order.id}`}>
                      View Order Details
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {order.items.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex items-start">
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden mr-4">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Link 
                          to={`/products/${item.product.id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                        
                        {item.reviewed ? (
                          <div className="mt-2 flex items-center">
                            <StarRating rating={item.review.rating} interactive={false} size="small" />
                            <span className="ml-2 text-xs text-gray-500">You reviewed this product</span>
                          </div>
                        ) : order.status === 'delivered' && (
                          <Button 
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={() => handleOpenReview(item.product, order.id)}
                          >
                            Write Review
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {order.items.length > 2 && (
                    <div className="text-sm text-gray-500">
                      + {order.items.length - 2} more item(s)
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {productsToReview.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">Products to Review</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsToReview.map((item, index) => (
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
                      onClick={() => handleOpenReview(item.product, item.orderId)}
                    >
                      Write Review
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ReviewDialog 
        isOpen={reviewDialog.open}
        setIsOpen={(open) => setReviewDialog({ ...reviewDialog, open })}
        product={reviewDialog.product}
        orderId={reviewDialog.orderId}
        onSubmitReview={handleSubmitReview}
      />
    </div>
  );
};

export default Orders;
