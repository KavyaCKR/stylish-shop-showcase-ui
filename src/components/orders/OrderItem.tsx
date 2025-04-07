
import React from 'react';
import { StarRating } from '@/components/ReviewForm';

interface OrderItemProps {
  item: any;
}

const OrderItem = ({ item }: OrderItemProps) => {
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

export default OrderItem;
