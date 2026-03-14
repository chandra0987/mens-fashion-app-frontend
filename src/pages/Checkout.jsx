import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createOrder } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    country: 'India',
    paymentMethod: 'cod',
    notes: ''
  });

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart.items?.length) { toast.error('Cart is empty'); return; }
    setLoading(true);
    try {
      const { data } = await createOrder({
        shippingAddress: { name: form.name, phone: form.phone, street: form.street, city: form.city, state: form.state, pincode: form.pincode, country: form.country },
        paymentMethod: form.paymentMethod,
        notes: form.notes
      });
      await fetchCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  const shippingCharge = cart.totalAmount > 999 ? 0 : 99;
  const total = cart.totalAmount + shippingCharge;

  return (
    <div style={{ paddingTop: 80 }}>
      <div className="container" style={{ padding: '40px 24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 8 }}>Checkout</h1>
        <p style={{ color: 'var(--gray)', marginBottom: 40 }}>Complete your order</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>
          <form onSubmit={handleSubmit}>
            {/* Delivery Address */}
            <div className="card" style={{ padding: 32, marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 24, fontSize: '1.2rem' }}>
                📍 Delivery Address
              </h2>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input name="name" className="form-input" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input name="phone" className="form-input" value={form.phone} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input name="street" className="form-input" value={form.street} onChange={handleChange} placeholder="House/Flat No, Street, Area" required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input name="city" className="form-input" value={form.city} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input name="state" className="form-input" value={form.state} onChange={handleChange} required />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input name="pincode" className="form-input" value={form.pincode} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input name="country" className="form-input" value={form.country} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Order Notes (optional)</label>
                <textarea name="notes" className="form-input" value={form.notes} onChange={handleChange} rows={3} placeholder="Any special instructions..." />
              </div>
            </div>

            {/* Payment */}
            <div className="card" style={{ padding: 32 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 24, fontSize: '1.2rem' }}>💳 Payment Method</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { value: 'cod', label: '💵 Cash on Delivery', desc: 'Pay when order arrives' },
                  { value: 'upi', label: '📱 UPI Payment', desc: 'Google Pay, PhonePe, Paytm' },
                  { value: 'card', label: '💳 Credit/Debit Card', desc: 'Visa, Mastercard, Rupay' },
                  { value: 'netbanking', label: '🏦 Net Banking', desc: 'All major banks supported' },
                ].map(p => (
                  <label key={p.value} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 18px',
                    background: form.paymentMethod === p.value ? 'rgba(201,168,76,0.1)' : 'var(--dark3)',
                    border: form.paymentMethod === p.value ? 'var(--border-gold)' : 'var(--border)',
                    borderRadius: 'var(--radius)', cursor: 'pointer', transition: 'all 0.2s'
                  }}>
                    <input type="radio" name="paymentMethod" value={p.value} checked={form.paymentMethod === p.value} onChange={handleChange} style={{ accentColor: 'var(--gold)' }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{p.label}</div>
                      <div style={{ color: 'var(--gray)', fontSize: 11 }}>{p.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-gold btn-lg btn-full" style={{ marginTop: 24 }} disabled={loading}>
              {loading ? 'Placing Order...' : '🦁 Place Order — ₹' + total.toLocaleString('en-IN')}
            </button>
          </form>

          {/* Order Summary */}
          <div className="card" style={{ padding: 28, position: 'sticky', top: 100 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 20 }}>Order Summary</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {cart.items?.map(item => (
                <div key={item._id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <img src={item.product?.images?.[0]} alt="" style={{ width: 52, height: 66, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.4 }}>{item.product?.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray)' }}>Size: {item.size} × {item.quantity}</div>
                  </div>
                  <div className="price" style={{ fontSize: '1rem', flexShrink: 0 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: 'var(--border)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--gray)' }}>
                <span>Subtotal</span><span>₹{cart.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--gray)' }}>
                <span>Shipping</span>
                <span style={{ color: shippingCharge === 0 ? 'var(--green)' : 'inherit' }}>
                  {shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, paddingTop: 10, borderTop: 'var(--border)' }}>
                <span>Total</span>
                <span className="price">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;