
import React, { useState } from 'react';
import ReviewForm from '@/components/ReviewForm';

interface ReviewDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  product: any;
  orderId: number | null;
  onSubmitReview: (productId: number, reviewData: any, orderId: number) => Promise<void>;
}

const ReviewDialog = ({ 
  isOpen, 
  setIsOpen, 
  product, 
  orderId, 
  onSubmitReview 
}: ReviewDialogProps) => {
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

export default ReviewDialog;
