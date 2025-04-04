
export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount: number;
}

export const categoryData: Category[] = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=2070",
    description: "Explore our range of cutting-edge electronics, from smart home devices to premium audio equipment and the latest gadgets.",
    productCount: 42
  },
  {
    id: 2,
    name: "Clothing",
    slug: "clothing",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=2070",
    description: "Discover stylish apparel for every occasion, featuring sustainable materials and designs that combine comfort with contemporary fashion.",
    productCount: 56
  },
  {
    id: 3,
    name: "Home & Kitchen",
    slug: "home-kitchen",
    image: "https://media.istockphoto.com/id/1211554164/photo/3d-render-of-home-appliances-collection-set.webp?a=1&b=1&s=612x612&w=0&k=20&c=eAClUK1d_8Qp8NkdaK4SYg8l0u1aByjOhl-nE-3cA_4=",
    description: "Transform your living space with our home and kitchen collection, from elegant dining sets to modern kitchen appliances and cozy decor.",
    productCount: 38
  },
  {
    id: 4,
    name: "Beauty & Personal Care",
    slug: "beauty-personal-care",
    image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=2188",
    description: "Enhance your natural beauty with our range of skincare, makeup, and personal care products made with premium ingredients and ethical formulations.",
    productCount: 27
  }
];
