
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  productApi, 
  categoryApi, 
  cartApi, 
  wishlistApi,
  orderApi,
  reviewApi
} from '@/services/api';

export const useApi = () => {
  const { toast } = useToast();

  const handleApiError = useCallback((error, customMessage = 'Something went wrong') => {
    console.error(error);
    toast({
      title: 'Error',
      description: error?.message || customMessage,
      variant: 'destructive'
    });
  }, [toast]);

  // Products
  const getProducts = useCallback(async () => {
    try {
      return await productApi.getAll();
    } catch (error) {
      handleApiError(error, 'Failed to fetch products');
      return [];
    }
  }, [handleApiError]);

  const getProductById = useCallback(async (id) => {
    try {
      return await productApi.getById(id);
    } catch (error) {
      handleApiError(error, 'Failed to fetch product details');
      return null;
    }
  }, [handleApiError]);

  const searchProducts = useCallback(async (query) => {
    try {
      return await productApi.search(query);
    } catch (error) {
      handleApiError(error, 'Failed to search products');
      return [];
    }
  }, [handleApiError]);

  // Categories
  const getCategories = useCallback(async () => {
    try {
      return await categoryApi.getAll();
    } catch (error) {
      handleApiError(error, 'Failed to fetch categories');
      return [];
    }
  }, [handleApiError]);

  const getCategoryBySlug = useCallback(async (slug) => {
    try {
      return await categoryApi.getBySlug(slug);
    } catch (error) {
      handleApiError(error, 'Failed to fetch category details');
      return null;
    }
  }, [handleApiError]);

  // Cart operations
  const getCartItems = useCallback(async () => {
    try {
      return await cartApi.getItems();
    } catch (error) {
      handleApiError(error, 'Failed to fetch your cart');
      return [];
    }
  }, [handleApiError]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      await cartApi.addToCart(productId, quantity);
      toast({
        title: 'Added to cart',
        description: 'Item added to your cart successfully',
      });
      return true;
    } catch (error) {
      handleApiError(error, 'Failed to add item to cart');
      return false;
    }
  }, [handleApiError, toast]);

  const removeFromCart = useCallback(async (itemId) => {
    try {
      await cartApi.removeFromCart(itemId);
      toast({
        title: 'Removed from cart',
        description: 'Item removed from your cart',
      });
      return true;
    } catch (error) {
      handleApiError(error, 'Failed to remove item from cart');
      return false;
    }
  }, [handleApiError, toast]);

  // Wishlist operations
  const getWishlistItems = useCallback(async () => {
    try {
      return await wishlistApi.getItems();
    } catch (error) {
      handleApiError(error, 'Failed to fetch your wishlist');
      return [];
    }
  }, [handleApiError]);

  const addToWishlist = useCallback(async (productId) => {
    try {
      await wishlistApi.addToWishlist(productId);
      toast({
        title: 'Added to wishlist',
        description: 'Item added to your wishlist',
      });
      return true;
    } catch (error) {
      handleApiError(error, 'Failed to add item to wishlist');
      return false;
    }
  }, [handleApiError, toast]);

  const removeFromWishlist = useCallback(async (itemId) => {
    try {
      await wishlistApi.removeFromWishlist(itemId);
      toast({
        title: 'Removed from wishlist',
        description: 'Item removed from your wishlist',
      });
      return true;
    } catch (error) {
      handleApiError(error, 'Failed to remove item from wishlist');
      return false;
    }
  }, [handleApiError, toast]);

  // Orders operations
  const getOrders = useCallback(async () => {
    try {
      return await orderApi.getOrders();
    } catch (error) {
      handleApiError(error, 'Failed to fetch your orders');
      return [];
    }
  }, [handleApiError]);

  const placeOrder = useCallback(async (cartItems, shippingDetails) => {
    try {
      const result = await orderApi.placeOrder(cartItems, shippingDetails);
      toast({
        title: 'Order placed',
        description: 'Your order has been placed successfully',
      });
      return result;
    } catch (error) {
      handleApiError(error, 'Failed to place your order');
      return null;
    }
  }, [handleApiError, toast]);

  const getOrderById = useCallback(async (orderId) => {
    try {
      return await orderApi.getOrderById(orderId);
    } catch (error) {
      handleApiError(error, 'Failed to fetch order details');
      return null;
    }
  }, [handleApiError]);

  const cancelOrder = useCallback(async (orderId) => {
    try {
      await orderApi.cancelOrder(orderId);
      toast({
        title: 'Order cancelled',
        description: 'Your order has been cancelled',
      });
      return true;
    } catch (error) {
      handleApiError(error, 'Failed to cancel your order');
      return false;
    }
  }, [handleApiError, toast]);

  // Reviews operations
  const getProductReviews = useCallback(async (productId) => {
    try {
      return await reviewApi.getProductReviews(productId);
    } catch (error) {
      handleApiError(error, 'Failed to fetch product reviews');
      return [];
    }
  }, [handleApiError]);

  const addReview = useCallback(async (productId, reviewData) => {
    try {
      await reviewApi.addReview(productId, reviewData);
      toast({
        title: 'Review submitted',
        description: 'Thank you for your review',
      });
      return true;
    } catch (error) {
      handleApiError(error, 'Failed to submit your review');
      return false;
    }
  }, [handleApiError, toast]);

  const updateReview = useCallback(async (reviewId, reviewData) => {
    try {
      await reviewApi.updateReview(reviewId, reviewData);
      toast({
        title: 'Review updated',
        description: 'Your review has been updated',
      });
      return true;
    } catch (error) {
      handleApiError(error, 'Failed to update your review');
      return false;
    }
  }, [handleApiError, toast]);

  const deleteReview = useCallback(async (reviewId) => {
    try {
      await reviewApi.deleteReview(reviewId);
      toast({
        title: 'Review deleted',
        description: 'Your review has been deleted',
      });
      return true;
    } catch (error) {
      handleApiError(error, 'Failed to delete your review');
      return false;
    }
  }, [handleApiError, toast]);

  return {
    // Products
    getProducts,
    getProductById,
    searchProducts,
    
    // Categories
    getCategories,
    getCategoryBySlug,
    
    // Cart
    getCartItems,
    addToCart,
    removeFromCart,
    
    // Wishlist
    getWishlistItems,
    addToWishlist,
    removeFromWishlist,

    // Orders
    getOrders,
    placeOrder,
    getOrderById,
    cancelOrder,

    // Reviews
    getProductReviews,
    addReview,
    updateReview,
    deleteReview
  };
};
