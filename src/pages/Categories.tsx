
import React from 'react';
import { Link } from 'react-router-dom';
import { categoryData } from '@/data/categories';

const Categories = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Product Categories</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categoryData.map((category) => (
          <Link 
            key={category.id} 
            to={`/categories/${category.slug}`}
            className="group relative overflow-hidden rounded-lg"
          >
            <div className="aspect-square">
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white text-xl font-bold">{category.name}</h3>
                <p className="text-white/80 text-sm mt-1">{category.productCount} Products</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
