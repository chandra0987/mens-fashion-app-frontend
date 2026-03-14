import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0, totalItems: 0 });
  const [wishlist, setWishlist] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.getCart();
      setCart(data);
    } catch {}
  }, [user]);

  const fetchWishlist = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.getWishlist();
      setWishlist(data.products?.map(p => p._id || p) || []);
    } catch {}
  }, [user]);

  useEffect(() => {
    if (user) { fetchCart(); fetchWishlist(); }
    else { setCart({ items: [], totalAmount: 0, totalItems: 0 }); setWishlist([]); }
  }, [user, fetchCart, fetchWishlist]);

  const addToCart = async (productId, quantity, size, price) => {
    setCartLoading(true);
    try {
      const { data } = await api.addToCart({ productId, quantity, size, price });
      setCart(data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    } finally {
      setCartLoading(false);
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      const { data } = await api.updateCartItem(itemId, { quantity });
      setCart(data);
    } catch {}
  };

  const removeItem = async (itemId) => {
    try {
      await api.removeFromCart(itemId);
      setCart(prev => ({
        ...prev,
        items: prev.items.filter(i => i._id !== itemId)
      }));
      fetchCart();
    } catch {}
  };

  const toggleWishlist = async (productId) => {
    if (!user) return { success: false, message: 'Login required' };
    try {
      await api.toggleWishlist(productId);
      setWishlist(prev =>
        prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
      );
      return { success: true };
    } catch {}
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  return (
    <CartContext.Provider value={{
      cart, wishlist, cartLoading, addToCart, updateItem, removeItem,
      toggleWishlist, isInWishlist, fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);