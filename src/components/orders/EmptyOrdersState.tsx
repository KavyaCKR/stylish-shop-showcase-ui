
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

interface EmptyOrdersStateProps {
  isFilterActive: boolean;
  activeTab?: string;
}

const EmptyOrdersState = ({ isFilterActive, activeTab }: EmptyOrdersStateProps) => {
  if (isFilterActive) {
    return (
      <div className="text-center py-12 bg-white shadow-md rounded-lg">
        <p className="text-lg text-gray-500 mb-4">No {activeTab} orders found</p>
      </div>
    );
  }
  
  return (
    <div className="text-center py-12 bg-white shadow-md rounded-lg">
      <p className="text-lg text-gray-500 mb-4">You haven't placed any orders yet</p>
      <Button asChild>
        <Link to="/products">Start Shopping</Link>
      </Button>
    </div>
  );
};

export default EmptyOrdersState;
