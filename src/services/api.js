import axios from 'axios';

const API = axios.create({ baseURL: 
  "http://localhost:3020/api"

});

API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('user');
  if (userInfo) {
    console.log('Attaching token to request:',userInfo);
    req.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`
    // `Bearer ${JSON.parse(userInfo).token}`;
  }
  return req;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const changePassword = (data) => API.put('/auth/change-password', data);

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const addReview = (id, data) => API.post(`/products/${id}/reviews`, data);
export const getCategories = () => API.get('/products/categories');

// Cart
export const getCart = () => API.get('/cart');
export const addToCart = (data) => API.post('/cart', data);
export const updateCartItem = (itemId, data) => API.put(`/cart/${itemId}`, data);
export const removeFromCart = (itemId) => API.delete(`/cart/${itemId}`);
export const clearCart = () => API.delete('/cart/clear');

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/my');
export const getOrder = (id) => API.get(`/orders/${id}`);
export const cancelOrder = (id) => API.put(`/orders/${id}/cancel`);
export const getAllOrders = (params) => API.get('/orders', { params });
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}/status`, data);

// Wishlist
export const getWishlist = () => API.get('/wishlist');
export const toggleWishlist = (productId) => API.post('/wishlist/toggle', { productId });

export default API;



