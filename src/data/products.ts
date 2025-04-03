export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  description: string;
  category: number;
  features: string[];
  specifications: { name: string; value: string }[];
  colors: { name: string; value: string; inStock: boolean }[];
  images: string[];
  reviews?: {
    id: number;
    user: string;
    date: string;
    rating: number;
    content: string;
  }[];
}

export const productData: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Noise-Cancelling Headphones",
    brand: "AudioTech",
    price: 249.99,
    discount: 279.99,
    rating: 4.8,
    reviewCount: 256,
    category: 1,
    description: "Experience crystal-clear sound and total immersion with our premium wireless noise-cancelling headphones. Featuring advanced acoustic technology, these headphones deliver exceptional audio quality while effectively blocking out ambient noise. With a comfortable over-ear design and up to 30 hours of battery life, they're perfect for long listening sessions at home or on the go.",
    features: [
      "Active noise cancellation",
      "30-hour battery life",
      "Bluetooth 5.2 connectivity",
      "Built-in microphone for calls",
      "Comfortable memory foam ear cushions",
      "Foldable design for easy storage",
      "Quick charge: 5 minutes for 3 hours of playback"
    ],
    specifications: [
      { name: "Connection", value: "Bluetooth 5.2, 3.5mm cable" },
      { name: "Battery Life", value: "Up to 30 hours" },
      { name: "Charging Time", value: "2 hours (full charge)" },
      { name: "Driver Size", value: "40mm" },
      { name: "Frequency Response", value: "20Hz - 20kHz" },
      { name: "Weight", value: "250g" }
    ],
    colors: [
      { name: "Matte Black", value: "#222222", inStock: true },
      { name: "Silver Gray", value: "#CCCCCC", inStock: true },
      { name: "Navy Blue", value: "#000080", inStock: false },
      { name: "Rose Gold", value: "#B76E79", inStock: true }
    ],
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=2070",
      "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&q=80&w=2070",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&q=80&w=2070",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=2070"
    ],
    reviews: [
      {
        id: 1,
        user: "Alex Johnson",
        date: "March 15, 2025",
        rating: 5,
        content: "These headphones are amazing! The sound quality is exceptional, and the noise cancellation works perfectly in noisy environments. Battery life is as advertised - I've been using them for a week on my commute without needing to recharge."
      },
      {
        id: 2,
        user: "Sarah Miller",
        date: "March 10, 2025",
        rating: 4,
        content: "Great headphones overall. The sound quality is excellent and they're very comfortable to wear for long periods. The only reason I'm not giving 5 stars is that the app can be a bit glitchy sometimes."
      },
      {
        id: 3,
        user: "Michael Chen",
        date: "February 28, 2025",
        rating: 5,
        content: "Worth every penny! The noise cancellation is best-in-class, and the sound quality is crisp and balanced. I'm particularly impressed with the battery life - I only need to charge them once a week with daily use."
      }
    ]
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    brand: "TechFit",
    price: 199.99,
    discount: 229.99,
    rating: 4.6,
    reviewCount: 189,
    category: 1,
    description: "Take control of your fitness journey with our Smart Fitness Watch. This advanced wearable tracks your steps, heart rate, sleep quality, and more, providing valuable insights into your overall health. With a vibrant touchscreen display and up to 7 days of battery life, it's the perfect companion for your active lifestyle.",
    features: [
      "24/7 heart rate monitoring",
      "GPS tracking",
      "Water-resistant up to 50m",
      "Sleep tracking",
      "15+ sport modes",
      "Notifications from your smartphone",
      "7-day battery life"
    ],
    specifications: [
      { name: "Display", value: "1.4-inch AMOLED" },
      { name: "Battery Life", value: "Up to 7 days" },
      { name: "Water Resistance", value: "50m" },
      { name: "Sensors", value: "Heart rate, accelerometer, gyroscope, GPS" },
      { name: "Compatibility", value: "iOS 12+, Android 7.0+" },
      { name: "Weight", value: "32g" }
    ],
    colors: [
      { name: "Black", value: "#000000", inStock: true },
      { name: "Blue", value: "#1E3A8A", inStock: true },
      { name: "Pink", value: "#FFC0CB", inStock: true }
    ],
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=2072",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=2027",
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=2070",
      "https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&q=80&w=2006"
    ]
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    brand: "EcoApparel",
    price: 29.99,
    rating: 4.5,
    reviewCount: 142,
    category: 2,
    description: "Our Organic Cotton T-Shirt combines comfort, style, and sustainability. Made from 100% organic cotton, this shirt is soft against your skin and gentle on the environment. The classic fit makes it a versatile addition to any wardrobe, perfect for casual everyday wear or layering for more sophisticated looks.",
    features: [
      "100% organic cotton",
      "Ethically produced",
      "Pre-shrunk fabric",
      "Reinforced stitching",
      "Tagless design for comfort",
      "Machine washable"
    ],
    specifications: [
      { name: "Material", value: "100% organic cotton" },
      { name: "Weight", value: "180 gsm" },
      { name: "Care", value: "Machine wash cold, tumble dry low" },
      { name: "Fit", value: "Classic fit" },
      { name: "Origin", value: "Fair trade certified factory" }
    ],
    colors: [
      { name: "White", value: "#FFFFFF", inStock: true },
      { name: "Black", value: "#000000", inStock: true },
      { name: "Navy", value: "#000080", inStock: true },
      { name: "Gray", value: "#808080", inStock: true },
      { name: "Forest Green", value: "#228B22", inStock: false }
    ],
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=2080",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&q=80&w=2070",
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&q=80&w=2071",
      "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&q=80&w=2070"
    ]
  },
  {
    id: 4,
    name: "Eco-Friendly Water Bottle",
    brand: "GreenLife",
    price: 24.99,
    discount: 29.99,
    rating: 4.7,
    reviewCount: 205,
    category: 3,
    description: "Stay hydrated in style with our Eco-Friendly Water Bottle. Made from high-quality stainless steel, this durable bottle keeps your drinks cold for up to 24 hours or hot for up to 12 hours. The leak-proof design and convenient carrying handle make it perfect for your daily commute, workouts, or outdoor adventures.",
    features: [
      "100% BPA-free",
      "Double-wall vacuum insulation",
      "Keeps drinks cold for 24 hours, hot for 12 hours",
      "Leak-proof lid",
      "Wide mouth for easy filling and cleaning",
      "Condensation-free exterior",
      "Fits standard cup holders"
    ],
    specifications: [
      { name: "Material", value: "18/8 stainless steel" },
      { name: "Capacity", value: "24 oz (750 ml)" },
      { name: "Dimensions", value: "10\" H x 2.8\" D" },
      { name: "Weight", value: "12 oz (empty)" },
      { name: "Care", value: "Hand wash recommended" }
    ],
    colors: [
      { name: "Stainless Steel", value: "#C0C0C0", inStock: true },
      { name: "Matte Black", value: "#222222", inStock: true },
      { name: "Ocean Blue", value: "#1E65A7", inStock: true },
      { name: "Forest Green", value: "#228B22", inStock: true }
    ],
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=1887",
      "https://images.unsplash.com/photo-1588675646184-f5b0b0b0b2be?auto=format&fit=crop&q=80&w=1887",
      "https://images.unsplash.com/photo-1577123964533-57c1f83d877e?auto=format&fit=crop&q=80&w=1887",
      "https://images.unsplash.com/photo-1555967522-37949fc21dcb?auto=format&fit=crop&q=80&w=1887"
    ]
  },
  {
    id: 5,
    name: "Professional DSLR Camera",
    brand: "Optix",
    price: 1299.99,
    discount: 1499.99,
    rating: 4.9,
    reviewCount: 86,
    category: 1,
    description: "Capture stunning photos and videos with our Professional DSLR Camera. Featuring a high-resolution full-frame sensor, advanced autofocus system, and 4K video recording capabilities, this camera delivers exceptional image quality in any shooting situation. Whether you're a professional photographer or an enthusiastic hobbyist, this versatile camera will help you bring your creative vision to life.",
    features: [
      "24.2 MP full-frame sensor",
      "ISO range of 100-51,200 (expandable to 204,800)",
      "61-point advanced autofocus system",
      "10 fps continuous shooting",
      "4K UHD video recording",
      "3.2-inch vari-angle touchscreen LCD",
      "Built-in Wi-Fi and Bluetooth",
      "Weather-sealed body"
    ],
    specifications: [
      { name: "Sensor", value: "24.2 MP full-frame CMOS" },
      { name: "Processor", value: "Digic X" },
      { name: "ISO Range", value: "100-51,200 (expandable)" },
      { name: "Autofocus", value: "61-point phase-detection" },
      { name: "Video", value: "4K UHD at 30fps, 1080p at 120fps" },
      { name: "Battery Life", value: "Approx. 900 shots per charge" },
      { name: "Weight", value: "1.4 lbs (body only)" }
    ],
    colors: [
      { name: "Black", value: "#000000", inStock: true }
    ],
    images: [
      "https://images.unsplash.com/photo-1516724562728-afc824a36e84?auto=format&fit=crop&q=80&w=2071",
      "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&q=80&w=2070",
      "https://images.unsplash.com/photo-1581591524425-c7e0978865fc?auto=format&fit=crop&q=80&w=2070",
      "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&q=80&w=2070"
    ]
  },
  {
    id: 6,
    name: "Handcrafted Ceramic Mug Set",
    brand: "ArtisanCraft",
    price: 39.99,
    rating: 4.8,
    reviewCount: 112,
    category: 3,
    description: "Add a touch of artisanal elegance to your morning routine with our Handcrafted Ceramic Mug Set. Each mug is uniquely shaped and glazed by skilled artisans, making every set one-of-a-kind. Perfect for serving coffee, tea, or hot chocolate, these mugs are both beautiful and functional, with a generous capacity and comfortable handle.",
    features: [
      "Set of 4 matching mugs",
      "Handcrafted by skilled artisans",
      "Lead-free ceramic",
      "Microwave and dishwasher safe",
      "Stackable design for easy storage",
      "Unique glazing patterns on each mug"
    ],
    specifications: [
      { name: "Material", value: "Lead-free ceramic" },
      { name: "Capacity", value: "12 oz each" },
      { name: "Dimensions", value: "4\" H x 3.5\" D" },
      { name: "Care", value: "Dishwasher and microwave safe" },
      { name: "Set Includes", value: "4 matching mugs" }
    ],
    colors: [
      { name: "Ocean Blue", value: "#1E65A7", inStock: true },
      { name: "Forest Green", value: "#228B22", inStock: true },
      { name: "Terracotta", value: "#E2725B", inStock: true },
      { name: "Cream", value: "#FFFDD0", inStock: false }
    ],
    images: [
      "https://images.unsplash.com/photo-1530968831187-a937ade474cc?auto=format&fit=crop&q=80&w=2070",
      "https://images.unsplash.com/photo-1543470373-e055b73a8f29?auto=format&fit=crop&q=80&w=2071",
      "https://images.unsplash.com/photo-1558365620-2227db21df49?auto=format&fit=crop&q=80&w=2070",
      "https://images.unsplash.com/photo-1577741314755-048d8525d31e?auto=format&fit=crop&q=80&w=1970"
    ]
  },
  {
    id: 7,
    name: "Hydrating Facial Serum",
    brand: "NaturalGlow",
    price: 42.99,
    discount: 54.99,
    rating: 4.7,
    reviewCount: 128,
    category: 4,
    description: "Revitalize your skin with our Hydrating Facial Serum, formulated with hyaluronic acid and vitamin C to deeply moisturize and brighten your complexion. This lightweight, non-greasy serum absorbs quickly, helping to reduce fine lines and improve skin texture while providing long-lasting hydration.",
    features: [
      "Contains 2% hyaluronic acid for intense hydration",
      "Vitamin C helps brighten skin and even tone",
      "Antioxidant-rich formula fights free radicals",
      "Oil-free and non-comedogenic",
      "Suitable for all skin types",
      "Fragrance-free and paraben-free",
      "Cruelty-free and vegan"
    ],
    specifications: [
      { name: "Size", value: "1 fl oz (30ml)" },
      { name: "Key Ingredients", value: "Hyaluronic Acid, Vitamin C, Niacinamide" },
      { name: "Skin Type", value: "All skin types" },
      { name: "Usage", value: "Morning and evening" },
      { name: "pH Level", value: "5.5" }
    ],
    colors: [
      { name: "Original Formula", value: "#F9F9F9", inStock: true }
    ],
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=2070",
      "https://images.unsplash.com/photo-1631730359585-5e4becd73f01?auto=format&fit=crop&q=80&w=1925",
      "https://images.unsplash.com/photo-1595081788554-0b2d25eb1588?auto=format&fit=crop&q=80&w=1965",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1780"
    ],
    reviews: [
      {
        id: 1,
        user: "Emma Wilson",
        date: "April 2, 2025",
        rating: 5,
        content: "My skin has never looked better! This serum absorbs quickly and doesn't feel sticky at all. I've been using it for three weeks and have noticed my skin looks more plump and hydrated. Even my fine lines seem less noticeable."
      },
      {
        id: 2,
        user: "James Rodriguez",
        date: "March 28, 2025",
        rating: 4,
        content: "Great serum that really hydrates my dry skin. I use it morning and night, and it's made a significant difference. The only reason I'm not giving 5 stars is because I wish the bottle was a bit larger for the price."
      }
    ]
  },
  {
    id: 8,
    name: "Organic Shampoo & Conditioner Set",
    brand: "PureEssence",
    price: 34.99,
    rating: 4.5,
    reviewCount: 94,
    category: 4,
    description: "Transform your hair care routine with our Organic Shampoo & Conditioner Set. Made with natural ingredients like argan oil, aloe vera, and botanical extracts, this duo gently cleanses and nourishes your hair without harsh chemicals. Perfect for all hair types, it leaves your hair soft, shiny, and manageable.",
    features: [
      "Made with 99% organic ingredients",
      "Free from sulfates, parabens, and silicones",
      "Argan oil and shea butter for deep conditioning",
      "Gentle enough for daily use",
      "Color-safe formula",
      "Recyclable packaging",
      "Cruelty-free and vegan"
    ],
    specifications: [
      { name: "Size", value: "8 fl oz (250ml) each" },
      { name: "Key Ingredients", value: "Argan Oil, Aloe Vera, Coconut Oil" },
      { name: "Hair Type", value: "All hair types" },
      { name: "Scent", value: "Lavender & Mint" },
      { name: "pH Balanced", value: "Yes" }
    ],
    colors: [
      { name: "Lavender & Mint", value: "#E6E6FA", inStock: true },
      { name: "Coconut & Vanilla", value: "#FFF8DC", inStock: true },
      { name: "Unscented", value: "#F5F5F5", inStock: true }
    ],
    images: [
      "https://images.unsplash.com/photo-1585232351009-aa87416fca20?auto=format&fit=crop&q=80&w=2187",
      "https://images.unsplash.com/photo-1556229010-aa3f7ff66b24?auto=format&fit=crop&q=80&w=1887",
      "https://images.unsplash.com/photo-1522664147796-9b267c33a4af?auto=format&fit=crop&q=80&w=1887",
      "https://images.unsplash.com/photo-1643185539104-3622eb1f0ff6?auto=format&fit=crop&q=80&w=1887"
    ]
  },
  {
    id: 9,
    name: "Premium Makeup Brush Set",
    brand: "ArtistryPro",
    price: 49.99,
    discount: 64.99,
    rating: 4.8,
    reviewCount: 76,
    category: 4,
    description: "Achieve flawless makeup application with our Premium Makeup Brush Set. This 15-piece collection includes precision brushes for foundation, concealer, powder, contouring, and eye makeup. Each brush features ultra-soft synthetic bristles and an ergonomic handle for precise control and seamless blending.",
    features: [
      "15-piece comprehensive brush set",
      "Premium synthetic cruelty-free bristles",
      "Designed for both beginners and professionals",
      "Rose gold metal handles with matte finish",
      "Dense bristles for minimal product waste",
      "Includes elegant storage case",
      "Easy to clean and maintain"
    ],
    specifications: [
      { name: "Set Includes", value: "15 premium brushes" },
      { name: "Bristle Material", value: "Synthetic Taklon" },
      { name: "Handle Material", value: "Aluminum with matte coating" },
      { name: "Case Dimensions", value: "8\" x 5\" x 2\"" },
      { name: "Care", value: "Clean with brush cleaner or mild soap" }
    ],
    colors: [
      { name: "Rose Gold", value: "#B76E79", inStock: true },
      { name: "Matte Black", value: "#222222", inStock: true }
    ],
    images: [
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=2188",
      "https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?auto=format&fit=crop&q=80&w=1938",
      "https://images.unsplash.com/photo-1617220377936-67930e098d8b?auto=format&fit=crop&q=80&w=1887",
      "https://images.unsplash.com/photo-1596224584716-5e16b15d5187?auto=format&fit=crop&q=80&w=1885"
    ]
  },
  {
    id: 10,
    name: "Natural Essential Oil Set",
    brand: "PureAroma",
    price: 29.99,
    discount: 39.99,
    rating: 4.6,
    reviewCount: 103,
    category: 4,
    description: "Experience the therapeutic benefits of aromatherapy with our Natural Essential Oil Set. This collection of six pure essential oils includes lavender, eucalyptus, peppermint, tea tree, lemon, and sweet orange. Perfect for diffusers, bath products, or DIY skincare recipes, these oils are 100% pure with no fillers or additives.",
    features: [
      "Set of 6 pure essential oils (10ml each)",
      "100% pure, therapeutic grade",
      "No fillers, additives, or carriers",
      "Amber glass bottles with droppers",
      "Sustainable sourcing practices",
      "Independently tested for purity",
      "Multiple aromatherapy applications"
    ],
    specifications: [
      { name: "Size", value: "10ml per bottle (6 bottles)" },
      { name: "Included Oils", value: "Lavender, Eucalyptus, Peppermint, Tea Tree, Lemon, Sweet Orange" },
      { name: "Extraction Method", value: "Steam distillation" },
      { name: "Shelf Life", value: "2-3 years" },
      { name: "Storage", value: "Store in cool, dark place" }
    ],
    colors: [
      { name: "Standard Set", value: "#FFDB58", inStock: true }
    ],
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=1887",
      "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?auto=format&fit=crop&q=80&w=2070",
      "https://images.unsplash.com/photo-1607968565043-36af90dde238?auto=format&fit=crop&q=80&w=1964",
      "https://images.unsplash.com/photo-1643706954197-ef9d7d90ca3d?auto=format&fit=crop&q=80&w=1974"
    ]
  }
];
