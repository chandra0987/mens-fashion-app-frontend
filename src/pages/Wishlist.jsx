import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWishlist } from '../services/api';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWishlist()
      .then(({ data }) => setProducts(data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ paddingTop: 80 }}><div className="spinner"></div></div>;

  return (
    <div style={{ paddingTop: 80 }}>
      <div className="container" style={{ padding: '40px 24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 8 }}>My Wishlist</h1>
        <p style={{ color: 'var(--gray)', marginBottom: 40 }}>{products.length} saved items</p>

        {products.length === 0 ? (
          <div className="text-center" style={{ padding: '80px 0' }}>
            <div style={{ fontSize: 72, marginBottom: 24 }}>♡</div>
            <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>Your wishlist is empty</h2>
            <p style={{ color: 'var(--gray)', marginBottom: 32 }}>Save items you love for later</p>
            <Link to="/products" className="btn btn-gold btn-lg">Explore Collection</Link>
          </div>
        ) : (
          <div className="grid-4">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;