
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Toaster } from "./components/ui/toaster"

// Pages
import Index from './pages/Index'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Categories from './pages/Categories'
import CategoryDetail from './pages/CategoryDetail'
import Deals from './pages/Deals'
import About from './pages/About'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import SearchResults from './pages/SearchResults'
import NotFound from './pages/NotFound'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Checkout from './pages/Checkout'

// Providers
import { ThemeProvider } from "./components/theme-provider"
import { ShopProvider } from './contexts/ShopContext'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="shop-ui-theme">
      <BrowserRouter>
        <AuthProvider>
          <ShopProvider>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/categories/:slug" element={<CategoryDetail />} />
                  <Route path="/deals" element={<Deals />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/orders/:id" element={<OrderDetail />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <Toaster />
          </ShopProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
