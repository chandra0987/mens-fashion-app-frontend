import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  if (!cart.items?.length) return (
    <div className="empty-page" style={{ paddingTop: 80 }}>
      <div className="container text-center" style={{ padding: '120px 24px' }}>
        <div style={{ fontSize: 72, marginBottom: 24 }}>🛒</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 12 }}>Your cart is empty</h2>
        <p style={{ color: 'var(--gray)', marginBottom: 32 }}>Add some royal pieces to your cart</p>
        <Link to="/products" className="btn btn-gold btn-lg">Explore Collection</Link>
      </div>
    </div>
  );

  const shippingCharge = cart.totalAmount > 999 ? 0 : 99;
  const total = cart.totalAmount + shippingCharge;
console.log('Cart data:', cart);
  return (
    <div style={{ paddingTop: 80 }}>
      <div className="container" style={{ padding: '40px 24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 8 }}>Shopping Cart</h1>
        <p style={{ color: 'var(--gray)', marginBottom: 40 }}>{cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''} in your cart</p>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {cart.items.map(item => (
              <div key={item._id} className="cart-item">
                <Link to={`/products/${item.product}`}>
                  <img
                    src={item.product?.images?.[0] || 'https://via.placeholder.com/120x160'}
                    alt={item.product?.name}
                    className="cart-item-img"
                  />
                </Link>
                <div className="cart-item-details">
                  <div className="cart-item-brand">{item.product?.brand}</div>
                  <Link to={`/products/${item.product?._id}`}>
                    <h3 className="cart-item-name">{item.product?.name}</h3>
                  </Link>
                  <div style={{ display: 'flex', gap: 16, margin: '8px 0', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, color: 'var(--gray)' }}>Size: <strong style={{ color: 'var(--white)' }}>{item.size}</strong></span>
                    {item.color && <span style={{ fontSize: 12, color: 'var(--gray)' }}>Color: <strong style={{ color: 'var(--white)' }}>{item.color.name}</strong></span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div className="price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                    <div className="cart-qty-control">
                      <button onClick={() => updateItem(item._id, item.quantity - 1)} className="qty-btn">−</button>
                      <span className="qty-val">{item.quantity}</span>
                      <button onClick={() => updateItem(item._id, item.quantity + 1)} className="qty-btn">+</button>
                    </div>
                  </div>
                </div>
                <button className="remove-btn" onClick={() => removeItem(item._id)} title="Remove">✕</button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: 24 }}>Order Summary</h2>
            <div className="summary-row"><span>Subtotal</span><span>₹{cart.totalAmount?.toLocaleString('en-IN')}</span></div>
            <div className="summary-row">
              <span>Shipping</span>
              <span style={{ color: shippingCharge === 0 ? 'var(--green)' : 'inherit' }}>
                {shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}
              </span>
            </div>
            {shippingCharge > 0 && (
              <div style={{ background: 'rgba(201,168,76,0.1)', border: 'var(--border-gold)', padding: 12, borderRadius: 4, marginBottom: 16, fontSize: 12, color: 'var(--gold)' }}>
                Add ₹{(999 - cart.totalAmount).toLocaleString('en-IN')} more for free shipping!
              </div>
            )}
            <div className="summary-total">
              <span>Total</span>
              <span className="price">₹{total.toLocaleString('en-IN')}</span>
            </div>
            <button className="btn btn-gold btn-lg btn-full" onClick={() => navigate('/checkout')}>
              Proceed to Checkout →
            </button>
            <Link to="/products" className="btn btn-dark btn-full" style={{ marginTop: 12 }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;