
import React from 'react';

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const statusStyles: Record<string, string> = {
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

export default OrderStatusBadge;
