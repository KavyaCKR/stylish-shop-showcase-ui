
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
import { Loader2, ChevronDown, ChevronRight, Package, Truck, Calendar, Filter } from 'lucide-react';
import { format } from 'date-fns';
import ReviewForm, { StarRating } from '@/components/ReviewForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
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

const OrderCard = ({ order, onOpenReview }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap justify-between items-start gap-2">
          <div>
            <CardTitle className="text-lg flex items-center">
              Order #{order.id}
              <span className="ml-2"><OrderStatusBadge status={order.status} /></span>
            </CardTitle>
            <CardDescription>
              Placed on {format(new Date(order.created_at), 'MMMM dd, yyyy')}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="font-medium">${order.total.toFixed(2)}</div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/orders/${order.id}`}>View Details</Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-gray-500 pb-2">
          <div className="flex items-center">
            <Package className="h-4 w-4 mr-1" />
            <span>{order.items.length} items</span>
          </div>
          {order.shipped_at && (
            <div className="flex items-center">
              <Truck className="h-4 w-4 mr-1" />
              <span>Shipped {format(new Date(order.shipped_at), 'MMM dd')}</span>
            </div>
          )}
          {order.delivered_at && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Delivered {format(new Date(order.delivered_at), 'MMM dd')}</span>
            </div>
          )}
        </div>
        
        {/* Always show the first 2 items */}
        <div className="space-y-4 mt-2">
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
                    onClick={() => onOpenReview(item.product, order.id)}
                  >
                    Write Review
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Show more items if expanded */}
        {expanded && order.items.length > 2 && (
          <div className="space-y-4 mt-4 pt-4 border-t">
            {order.items.slice(2).map((item) => (
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
                      onClick={() => onOpenReview(item.product, order.id)}
                    >
                      Write Review
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!expanded && order.items.length > 2 && (
          <div className="text-sm text-gray-500 mt-2">
            + {order.items.length - 2} more item(s)
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Orders = () => {
  const [searchParams] = useSearchParams();
  const reviewProductId = searchParams.get('review');
  
  const { isAuthenticated } = useAuth();
  const { getOrders, addReview } = useApi();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewDialog, setReviewDialog] = useState({ 
    open: false, 
    product: null,
    orderId: null
  });
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

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

  // Filter orders based on active tab
  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === activeTab);

  // Sort orders based on selected sorting option
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'date-desc') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortBy === 'date-asc') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else if (sortBy === 'total-desc') {
      return b.total - a.total;
    } else if (sortBy === 'total-asc') {
      return a.total - b.total;
    }
    return 0;
  });

  // Get products that need to be reviewed (from delivered orders)
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
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-5 w-full md:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Sort By
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy('date-desc')}>
              Date (Newest First)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('date-asc')}>
              Date (Oldest First)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('total-desc')}>
              Price (High to Low)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('total-asc')}>
              Price (Low to High)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
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
          {sortedOrders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order}
              onOpenReview={handleOpenReview}
            />
          ))}
        </div>
      )}

      {productsToReview.length > 0 && (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Products to Review</h2>
            <span className="text-sm text-gray-500">{productsToReview.length} items waiting for your review</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsToReview.map((item, index) => (
              <Card key={`${item.orderId}-${item.product.id}-${index}`} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex p-4">
                  <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden mr-4 flex-shrink-0">
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
              </Card>
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
