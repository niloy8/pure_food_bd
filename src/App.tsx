import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from '@/hooks/useCart';
import { Toaster } from '@/components/ui/sonner';
import ProtectedRoute from '@/components/ProtectedRoute';

// Customer Pages
import Home from '@/pages/customer/Home';
import Cart from '@/pages/customer/Cart';
import Checkout from '@/pages/customer/Checkout';
import OrderConfirmation from '@/pages/customer/OrderConfirmation';
import TrackOrder from '@/pages/customer/TrackOrder';
import ProductDetails from '@/pages/customer/ProductDetails';

// Admin Pages
import AdminLogin from '@/pages/admin/Login';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminProducts from '@/pages/admin/Products';
import AdminOrders from '@/pages/admin/Orders';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/product/:productId" element={<ProductDetails />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster position="bottom-right" />
    </CartProvider>
  );
}

export default App;
