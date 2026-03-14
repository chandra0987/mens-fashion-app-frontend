import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/api';

const statusColors = {
  placed: '#f39c12', confirmed: '#3498db', processing: '#9b59b6',
  shipped: '#2980b9', delivered: '#27ae60', cancelled: '#e74c3c', returned: '#7f8c8d'
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ paddingTop: 80 }}><div className="spinner"></div></div>;

  if (!orders.length) return (
    <div style={{ paddingTop: 80 }}>
      <div className="container text-center" style={{ padding: '120px 24px' }}>
        <div style={{ fontSize: 72, marginBottom: 24 }}>📦</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 12 }}>No Orders Yet</h2>
        <p style={{ color: 'var(--gray)', marginBottom: 32 }}>Start shopping and your orders will appear here</p>
        <Link to="/products" className="btn btn-gold btn-lg">Shop Now</Link>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 80 }}>
      <div className="container" style={{ padding: '40px 24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 8 }}>My Orders</h1>
        <p style={{ color: 'var(--gray)', marginBottom: 40 }}>{orders.length} total orders</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map(order => (
            <div key={order._id} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>
                    Order #{order._id.slice(-8).toUpperCase()}
                  </div>
                  <div style={{ color: 'var(--gray)', fontSize: 12 }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: 2,
                    background: `${statusColors[order.orderStatus]}22`,
                    color: statusColors[order.orderStatus],
                    fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase'
                  }}>
                    {order.orderStatus}
                  </span>
                  <div className="price" style={{ fontSize: '1.1rem' }}>₹{order.totalAmount.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {order.items.slice(0, 3).map((item, i) => (
                  <img key={i} src={item.image} alt={item.name} style={{ width: 60, height: 76, objectFit: 'cover', borderRadius: 2, border: 'var(--border)' }} />
                ))}
                {order.items.length > 3 && (
                  <div style={{ width: 60, height: 76, background: 'var(--dark3)', border: 'var(--border)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: 'var(--gray)' }}>
                    +{order.items.length - 3}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--gray)' }}>
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''} •
                  Tracking: {order.trackingNumber}
                </div>
                <Link to={`/orders/${order._id}`} className="btn btn-gold btn-sm">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;