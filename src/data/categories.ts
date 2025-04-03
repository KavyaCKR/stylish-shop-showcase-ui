
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export const categoryData: Category[] = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    description: "Discover the latest gadgets and electronic devices, from smartphones and laptops to headphones and smart home systems.",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=2070",
    productCount: 42
  },
  {
    id: 2,
    name: "Clothing",
    slug: "clothing",
    description: "Shop stylish and comfortable clothing for all seasons, including tops, bottoms, dresses, and outerwear for men, women, and children.",
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=2070",
    productCount: 56
  },
  {
    id: 3,
    name: "Home & Kitchen",
    slug: "home-kitchen",
    description: "Enhance your living space with our collection of home decor, kitchen appliances, furniture, and other household essentials.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=2070",
    productCount: 38
  },
  {
    id: 4,
    name: "Beauty & Personal Care",
    slug: "beauty",
    description: "Find everything you need for your beauty and personal care routine, including skincare, makeup, hair care, and fragrances.",
    image: "https://images.unsplash.com/photo-1573461160327-b370752e5191?auto=format&fit=crop&q=80&w=2070",
    productCount: 29
  },
  {
    id: 5,
    name: "Sports & Outdoors",
    slug: "sports",
    description: "Get active with our sports and outdoor equipment, including fitness gear, camping supplies, team sports, and recreational items.",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=2070",
    productCount: 33
  },
  {
    id: 6,
    name: "Books & Media",
    slug: "books-media",
    description: "Explore our collection of books, music, movies, and video games across various genres and formats.",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=2070",
    productCount: 45
  },
  {
    id: 7,
    name: "Toys & Games",
    slug: "toys-games",
    description: "Discover fun and educational toys, games, and activities for children of all ages.",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80&w=2070",
    productCount: 27
  },
  {
    id: 8,
    name: "Health & Wellness",
    slug: "health-wellness",
    description: "Support your health and wellness journey with our products, including vitamins, supplements, fitness trackers, and wellness tools.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=2070",
    productCount: 31
  }
];
