
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from 'lucide-react';

interface ReviewFormProps {
  onSubmit: (reviewData: { rating: number; comment: string }) => Promise<void>;
  defaultRating?: number;
  defaultComment?: string;
  isSubmitting?: boolean;
}

export const StarRating = ({ 
  rating, 
  setRating, 
  interactive = true,
  size = 'default'
}: { 
  rating: number; 
  setRating?: (rating: number) => void;
  interactive?: boolean;
  size?: 'small' | 'default' | 'large';
}) => {
  const sizeClass = {
    small: 'h-3.5 w-3.5',
    default: 'h-6 w-6',
    large: 'h-8 w-8'
  };
  
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && setRating && setRating(star)}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <Star
            className={`${sizeClass[size]} ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  defaultRating = 5,
  defaultComment = '',
  isSubmitting = false
}) => {
  const [rating, setRating] = useState(defaultRating);
  const [comment, setComment] = useState(defaultComment);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return;
    
    await onSubmit({ rating, comment });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Your Rating
        </label>
        <StarRating rating={rating} setRating={setRating} />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2" htmlFor="review-comment">
          Your Review
        </label>
        <Textarea
          id="review-comment"
          placeholder="Write your review here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          required
        />
      </div>
      
      <Button 
        type="submit"
        disabled={!rating || !comment.trim() || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Review'
        )}
      </Button>
    </form>
  );
};

export default ReviewForm;
