
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Refactored Components
import OrderCard from '@/components/orders/OrderCard';
import ProductsToReviewCard from '@/components/orders/ProductsToReviewCard';
import ReviewDialog from '@/components/orders/ReviewDialog';
import OrderFilters from '@/components/orders/OrderFilters';
import EmptyOrdersState from '@/components/orders/EmptyOrdersState';

const Orders = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const reviewProductId = searchParams.get('review');

  const { isAuthenticated } = useAuth();
  const { getOrders, addReview, checkoutOrder } = useApi();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewDialog, setReviewDialog] = useState({ open: false, product: null, orderId: null });
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

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
    try {
      navigate('/checkout', { state: { orderDetails: order } });
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout failed',
        description: 'There was a problem processing your checkout. Please try again.',
        variant: 'destructive',
      });
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

      <OrderFilters 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {orders.length === 0 ? (
        <EmptyOrdersState isFilterActive={false} />
      ) : filteredOrders.length === 0 ? (
        <EmptyOrdersState isFilterActive={true} activeTab={activeTab} />
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
