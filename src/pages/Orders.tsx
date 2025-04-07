import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Star, Loader2, ChevronDown, ChevronUp, Package, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReviewForm, { StarRating } from '@/components/ReviewForm';

const OrderStatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'processing': 'bg-blue-100 text-blue-800 border-blue-200',
    'shipped': 'bg-purple-100 text-purple-800 border-purple-200',
    'delivered': 'bg-green-100 text-green-800 border-green-200',
    'cancelled': 'bg-red-100 text-red-800 border-red-200',
  };
  
  const style = statusStyles[status.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${style} border`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const OrderItem = ({ item }: { item: any }) => {
  return (
    <div className="flex items-start space-x-4 py-3 border-b last:border-0">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={item.product.images?.[0] || '/placeholder.svg'}
          alt={item.product.name}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{item.product.name}</p>
        <p className="text-sm text-gray-500">
          Quantity: {item.quantity} x ${item.product.price.toFixed(2)}
        </p>
        {item.reviewed && (
          <div className="mt-1 flex items-center gap-1">
            <StarRating rating={item.rating || 5} interactive={false} size="small" />
            <span className="text-xs text-gray-500">You rated this product</span>
          </div>
        )}
      </div>
      <div className="text-right">
        <p className="font-medium">${(item.quantity * item.product.price).toFixed(2)}</p>
      </div>
    </div>
  );
};

const OrderCard = ({ order, onOpenReview, onProceedToCheckout }: { 
  order: any, 
  onOpenReview: (product: any, orderId: number) => void,
  onProceedToCheckout: (order: any) => Promise<void>
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleCheckout = async () => {
    setIsLoading(true);
    await onProceedToCheckout(order);
    setIsLoading(false);
  };

  const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <p className="text-sm text-gray-500">Order placed</p>
            <p className="font-medium">{orderDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Order number</p>
            <p className="font-medium">#{order.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="font-medium">${order.total.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-2">
            <Package size={16} />
            <span className="font-medium">
              {expanded ? "Hide" : "Show"} order details ({order.items.length} {order.items.length === 1 ? 'item' : 'items'})
            </span>
          </div>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        
        {expanded && (
          <div className="mt-2 space-y-4">
            {order.items.map((item: any, index: number) => (
              <OrderItem key={`${order.id}-item-${index}`} item={item} />
            ))}
            
            {order.shipping && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Shipping Address</h4>
                <p className="text-sm text-gray-600">
                  {[
                    order.shipping.name,
                    order.shipping.address,
                    order.shipping.city,
                    `${order.shipping.state} ${order.shipping.zip}`,
                    order.shipping.country
                  ].filter(Boolean).join(', ')}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t flex flex-wrap gap-2 pt-4 justify-between">
        <div>
          {order.status === 'pending' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Proceed to checkout'
              )}
            </Button>
          )}
          
          <Link to={`/orders/${order.id}`}>
            <Button variant="ghost" size="sm">View details</Button>
          </Link>
        </div>
        
        {order.status === 'delivered' && (
          <div className="flex flex-wrap gap-2">
            {order.items
              .filter((item: any) => !item.reviewed)
              .map((item: any, index: number) => (
                <Button 
                  key={`review-${index}`}
                  size="sm"
                  onClick={() => onOpenReview(item.product, order.id)}
                >
                  Review {item.product.name}
                </Button>
              ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

const ProductsToReviewCard = ({ item }: { item: any }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={item.product.images?.[0] || '/placeholder.svg'}
          alt={item.product.name}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-lg truncate">{item.product.name}</h3>
        <p className="text-sm text-gray-500">Purchased on {new Date(item.orderId).toLocaleDateString()}</p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={() => navigate(`/orders?review=${item.product.id}`)}
        >
          Write a review
        </Button>
      </CardFooter>
    </Card>
  );
};

const ReviewDialog = ({ 
  isOpen, 
  setIsOpen, 
  product, 
  orderId, 
  onSubmitReview 
}: { 
  isOpen: boolean, 
  setIsOpen: (isOpen: boolean) => void, 
  product: any, 
  orderId: number | null,
  onSubmitReview: (productId: number, reviewData: any, orderId: number) => Promise<void>
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (reviewData: any) => {
    if (!product || orderId === null) return;
    
    setIsSubmitting(true);
    try {
      await onSubmitReview(product.id, reviewData, orderId);
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen || !product) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Review Product</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 overflow-hidden rounded border">
              <img
                src={product.images?.[0] || '/placeholder.svg'}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
            </div>
          </div>
          
          <ReviewForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

const TabsComponent = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-5">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="processing">Processing</TabsTrigger>
        <TabsTrigger value="shipped">Shipped</TabsTrigger>
        <TabsTrigger value="delivered">Delivered</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

const DropdownMenuComponent = ({ sortBy, onSortChange }: { sortBy: string, onSortChange: (sort: string) => void }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Sort by:</span>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date-desc">Date (newest first)</SelectItem>
          <SelectItem value="date-asc">Date (oldest first)</SelectItem>
          <SelectItem value="total-desc">Price (high to low)</SelectItem>
          <SelectItem value="total-asc">Price (low to high)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

const Orders = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const reviewProductId = searchParams.get('review');

  const { isAuthenticated } = useAuth();
  const { getOrders, addReview, placeOrder, checkoutOrder } = useApi();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewDialog, setReviewDialog] = useState({ open: false, product: null, orderId: null });
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      setIsLoading(true);
      try {
        const data = await getOrders();
        setOrders(data || []);

        if (reviewProductId) {
          const productId = parseInt(reviewProductId);
          const orderWithProduct = data.find((order: any) =>
            order.items.some((item: any) => item.product.id === productId)
          );

          if (orderWithProduct) {
            const item = orderWithProduct.items.find((item: any) => item.product.id === productId);
            if (item && orderWithProduct.status === 'delivered') {
              setReviewDialog({ 
                open: true, 
                product: item.product, 
                orderId: orderWithProduct.id 
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error",
          description: "Failed to load your orders. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, getOrders, reviewProductId, navigate, toast]);

  const handleSubmitReview = async (productId: number, reviewData: any, orderId: number) => {
    try {
      await addReview(productId, { ...reviewData, orderId });

      const updatedOrders = await getOrders();
      setOrders(updatedOrders || []);

      toast({
        title: 'Review submitted',
        description: 'Thank you for sharing your feedback!',
      });
    } catch (error) {
      toast({
        title: 'Review submission failed',
        description: 'There was an error submitting your review. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleProceedToCheckout = async (order: any) => {
    setCheckoutLoading(true);
    try {
      navigate('/checkout', { state: { orderDetails: order } });
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout failed',
        description: 'There was a problem processing your checkout. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  const filteredOrders =
    activeTab === 'all' ? orders : orders.filter(order => order.status.toLowerCase() === activeTab);
  
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === 'date-asc') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sortBy === 'total-desc') return b.total - a.total;
    if (sortBy === 'total-asc') return a.total - b.total;
    return 0;
  });

  const productsToReview = orders
    .filter(order => order.status === 'delivered')
    .flatMap(order =>
      order.items.filter((item: any) => !item.reviewed).map((item: any) => ({ ...item, orderId: order.id }))
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
        <TabsComponent activeTab={activeTab} onTabChange={setActiveTab} />
        <DropdownMenuComponent sortBy={sortBy} onSortChange={setSortBy} />
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
          {sortedOrders.map((order: any) => (
            <OrderCard
              key={order.id}
              order={order}
              onOpenReview={(product, orderId) => setReviewDialog({ 
                open: true, 
                product, 
                orderId 
              })}
              onProceedToCheckout={handleProceedToCheckout}
            />
          ))}
        </div>
      )}

      {productsToReview.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Products to Review</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsToReview.map((item: any, index: number) => (
              <ProductsToReviewCard key={`${item.orderId}-${item.product.id}-${index}`} item={item} />
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
