
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Package, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';
import OrderItem from './OrderItem';

interface OrderCardProps {
  order: any;
  onOpenReview: (product: any, orderId: number) => void;
  onProceedToCheckout: (order: any) => Promise<void>;
}

const OrderCard = ({ order, onOpenReview, onProceedToCheckout }: OrderCardProps) => {
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

export default OrderCard;
