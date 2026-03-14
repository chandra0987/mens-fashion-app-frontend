import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllOrders, updateOrderStatus, getProducts, createProduct, deleteProduct } from '../services/api';

const AdminDashboard = () => {
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', originalPrice: '', category: 'shirts',
    brand: '', images: [''], material: '', tags: ''
  });

  useEffect(() => {
    if (tab === 'orders') {
      getAllOrders().then(({ data }) => setOrders(data.orders)).finally(() => setLoading(false));
    } else {
      getProducts({ limit: 50 }).then(({ data }) => setProducts(data.products)).finally(() => setLoading(false));
    }
    setLoading(true);
  }, [tab]);

  const handleStatusUpdate = async (orderId, orderStatus) => {
    try {
      await updateOrderStatus(orderId, { orderStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus } : o));
      toast.success('Status updated!');
    } catch { toast.error('Failed to update status'); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success('Product deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProduct,
        price: Number(newProduct.price),
        originalPrice: Number(newProduct.originalPrice) || undefined,
        images: newProduct.images.filter(Boolean),
        tags: newProduct.tags.split(',').map(t => t.trim()).filter(Boolean),
        sizes: [{ size: 'S', stock: 10 }, { size: 'M', stock: 15 }, { size: 'L', stock: 12 }, { size: 'XL', stock: 8 }]
      };
      const { data } = await createProduct(payload);
      setProducts(prev => [data, ...prev]);
      setShowAddProduct(false);
      toast.success('Product created!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const statusOptions = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  const statusColors = { placed: '#f39c12', confirmed: '#3498db', processing: '#9b59b6', shipped: '#2980b9', delivered: '#27ae60', cancelled: '#e74c3c' };

  return (
    <div style={{ paddingTop: 80 }}>
      <div className="container" style={{ padding: '40px 24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 8 }}>🛠️ Admin Dashboard</h1>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
          {[
            { label: 'Total Orders', val: orders.length, icon: '📦' },
            { label: 'Products', val: products.length, icon: '👔' },
            { label: 'Revenue', val: '₹' + orders.reduce((a, o) => a + (o.totalAmount || 0), 0).toLocaleString('en-IN'), icon: '💰' },
            { label: 'Delivered', val: orders.filter(o => o.orderStatus === 'delivered').length, icon: '✅' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--gold)', fontWeight: 700 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'var(--gray)', letterSpacing: 1, textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="tab-nav" style={{ marginBottom: 32 }}>
          {['orders', 'products'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
          ))}
        </div>

        {tab === 'orders' && (
          <div>
            {loading ? <div className="spinner"></div> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {orders.map(order => (
                  <div key={order._id} className="card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>#{order._id.slice(-8).toUpperCase()}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray)' }}>
                          {order.user?.name} • {new Date(order.createdAt).toLocaleDateString('en-IN')} • ₹{order.totalAmount?.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ padding: '3px 10px', background: `${statusColors[order.orderStatus]}22`, color: statusColors[order.orderStatus], fontSize: 11, fontWeight: 700, borderRadius: 2 }}>
                          {order.orderStatus}
                        </span>
                        <select
                          className="form-select"
                          style={{ width: 'auto', fontSize: 12, padding: '6px 12px' }}
                          value={order.orderStatus}
                          onChange={e => handleStatusUpdate(order._id, e.target.value)}
                        >
                          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
              <button className="btn btn-gold" onClick={() => setShowAddProduct(!showAddProduct)}>
                {showAddProduct ? '✕ Cancel' : '+ Add Product'}
              </button>
            </div>

            {showAddProduct && (
              <form onSubmit={handleAddProduct} className="card" style={{ padding: 32, marginBottom: 24 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 20 }}>Add New Product</h3>
                <div className="grid-2">
                  {[
                    { label: 'Name', key: 'name', required: true },
                    { label: 'Brand', key: 'brand', required: true },
                    { label: 'Price (₹)', key: 'price', type: 'number', required: true },
                    { label: 'Original Price (₹)', key: 'originalPrice', type: 'number' },
                    { label: 'Material', key: 'material' },
                    { label: 'Tags (comma separated)', key: 'tags' },
                  ].map(f => (
                    <div key={f.key} className="form-group">
                      <label className="form-label">{f.label}</label>
                      <input type={f.type || 'text'} className="form-input" value={newProduct[f.key]} onChange={e => setNewProduct(p => ({...p, [f.key]: e.target.value}))} required={f.required} />
                    </div>
                  ))}
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={newProduct.category} onChange={e => setNewProduct(p => ({...p, category: e.target.value}))}>
                    {['shirts', 'trousers', 'suits', 'jackets', 'shoes', 'accessories', 'ethnic', 'casuals'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows={3} value={newProduct.description} onChange={e => setNewProduct(p => ({...p, description: e.target.value}))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input className="form-input" value={newProduct.images[0]} onChange={e => setNewProduct(p => ({...p, images: [e.target.value]}))} placeholder="https://..." />
                </div>
                <button type="submit" className="btn btn-gold">Create Product</button>
              </form>
            )}

            {loading ? <div className="spinner"></div> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {products.map(p => (
                  <div key={p._id} className="card" style={{ padding: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
                    <img src={p.images[0]} alt={p.name} style={{ width: 52, height: 66, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--gray)', textTransform: 'capitalize' }}>{p.brand} • {p.category} • ₹{p.price.toLocaleString('en-IN')}</div>
                    </div>
                    <button className="btn btn-sm" style={{ background: 'rgba(192,57,43,0.2)', color: 'var(--red)', border: '1px solid rgba(192,57,43,0.3)' }} onClick={() => handleDeleteProduct(p._id)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;