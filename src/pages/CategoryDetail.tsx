
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { categoryData } from '@/data/categories';
import { productData } from '@/data/products';
import ProductCard from '@/components/ProductCard';

const CategoryDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Find the category by slug
  const category = categoryData.find(cat => cat.slug === slug);
  
  // Filter products by category
  const categoryProducts = productData.filter(product => product.category === category?.id);
  
  if (!category) {
    return <div className="container mx-auto px-4 py-8">Category not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-shop-primary">Home</a>
        <ChevronRight className="h-4 w-4 mx-1" />
        <a href="/categories" className="hover:text-shop-primary">Categories</a>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-gray-700 font-medium">{category.name}</span>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-gray-600">{category.description}</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categoryProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CategoryDetail;
