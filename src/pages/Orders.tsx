import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import TabsComponent from './TabsComponent';
import DropdownMenuComponent from './DropdownMenuComponent';
import OrderCard from './OrderCard/OrderCard';
import ProductsToReviewCard from './ProductsToReviewCard';
import ReviewDialog from './ReviewDialog/ReviewDialog';

const Orders = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const reviewProductId = searchParams.get('review');

  const { isAuthenticated } = useAuth();
  const { getOrders, addReview, placeOrder } = useApi();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewDialog, setReviewDialog] = useState({ open: false, product: null, orderId: null });
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Fetch orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;

      setIsLoading(true);
      try {
        const data = await getOrders();
        setOrders(data || []);

        if (reviewProductId) {
          // Open review dialog if "review" query param exists
          const productId = parseInt(reviewProductId);
          const orderWithProduct = data.find(order =>
            order.items.some(item => item.product.id === productId)
          );

          if (orderWithProduct) {
            const item = orderWithProduct.items.find(item => item.product.id === productId);
            if (item && orderWithProduct.status === 'delivered') {
              setReviewDialog({ open: true, product: item.product, orderId: orderWithProduct.id });
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, getOrders, reviewProductId]);

  // Handle review submission
  const handleSubmitReview = async (productId, reviewData, orderId) => {
    await addReview(productId, { ...reviewData, orderId });

    // Refresh orders to update review status
    const updatedOrders = await getOrders();
    setOrders(updatedOrders || []);

    toast({
      title: 'Review submitted',
      description: 'Thank you for sharing your feedback!',
    });
  };

  // Handle checkout process
  const handleProceedToCheckout = async (order) => {
    setCheckoutLoading(true);
    try {
      const result = await placeOrder(order.items, order.shipping || {});
      if (result) {
        toast({
          title: 'Order placed successfully',
          description: 'Your order has been placed and is being processed.',
        });
        navigate(`/orders/${result.id}`);
      }
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

  // Filter and sort orders based on active tab and sorting option
  const filteredOrders =
    activeTab === 'all' ? orders : orders.filter(order => order.status.toLowerCase() === activeTab);
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === 'date-asc') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sortBy === 'total-desc') return b.total - a.total;
    if (sortBy === 'total-asc') return a.total - b.total;
    return 0;
  });

  // Get products waiting for review
  const productsToReview = orders
    .filter(order => order.status === 'delivered')
    .flatMap(order =>
      order.items.filter(item => !item.reviewed).map(item => ({ ...item, orderId: order.id }))
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

      {/* Tabs and Sorting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <TabsComponent activeTab={activeTab} onTabChange={setActiveTab} />
        <DropdownMenuComponent sortBy={sortBy} onSortChange={setSortBy} />
      </div>

      {/* Orders List */}
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
          {sortedOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onOpenReview={(product, orderId) => setReviewDialog({ open: true, product, orderId })}
              onProceedToCheckout={handleProceedToCheckout}
            />
          ))}
        </div>
      )}

      {/* Products to Review */}
      {productsToReview.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Products to Review</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsToReview.map((item, index) => (
              <ProductsToReviewCard key={`${item.orderId}-${item.product.id}-${index}`} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Review Dialog */}
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
