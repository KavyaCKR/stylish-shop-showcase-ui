
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductsToReviewCardProps {
  item: any;
}

const ProductsToReviewCard = ({ item }: ProductsToReviewCardProps) => {
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

export default ProductsToReviewCard;
