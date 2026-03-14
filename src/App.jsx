import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/OrderDetail';
import OrderDetail from './pages/OrderDetail';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>

        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

          <Navbar />

          <main style={{ flex: 1 }}>
            <Routes>

              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/cart" element={<ProtectedRoute><Cart/></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout/></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders/></ProtectedRoute>} />
              <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail/></ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute><Wishlist/></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />

              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard/></ProtectedRoute>} />

            </Routes>
          </main>

          <Footer />

        </div>

        <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />

      </CartProvider>
    </AuthProvider>
  );
}

export default App;





