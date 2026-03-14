import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const categories = [
  { id: 'shirts', label: 'Shirts', emoji: '👔', desc: 'From Oxford to Linen' },
  { id: 'suits', label: 'Suits', emoji: '🤵', desc: 'Command Every Room' },
  { id: 'trousers', label: 'Trousers', emoji: '👖', desc: 'Tailored Perfection' },
  { id: 'jackets', label: 'Jackets', emoji: '🧥', desc: 'Layer in Style' },
  { id: 'shoes', label: 'Shoes', emoji: '👞', desc: 'Step with Authority' },
  { id: 'ethnic', label: 'Ethnic', emoji: '🎯', desc: 'Heritage & Royalty' },
  { id: 'accessories', label: 'Accessories', emoji: '⌚', desc: 'Complete the Look' },
  { id: 'casuals', label: 'Casuals', emoji: '👕', desc: 'Effortless Style' },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [f, n] = await Promise.all([
          getProducts({ featured: true, limit: 4 }),
          getProducts({ newArrival: true, limit: 4 })
        ]);
        setFeatured(f.data.products);
        setNewArrivals(n.data.products);
      } catch {} finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-overlay"></div>
          <img
            src="https://i.ytimg.com/vi/dy8Y-BTDGic/sddefault.jpg"
            alt="Hero" className="hero-img"
          />
        </div>
        <div className="container hero-content">
          <div className="hero-eyebrow">The New Season Collection</div>
          <h1 className="hero-title">
            Dress Like<br />
            <span className="hero-title-gold">A King</span>
          </h1>
          <p className="hero-desc">
            Premium men's fashion crafted for the modern maharaja.<br />
            Wear confidence. Wear SINGAM.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-gold btn-lg">Shop Now</Link>
            <Link to="/products?featured=true" className="btn btn-outline btn-lg">View Collection</Link>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <div className="scroll-line"></div>
          <span>Scroll</span>
        </div>
      </section>

      {/* Stats bar */}
      <div className="stats-bar">
        <div className="container">
          <div className="stats-inner">
            {[
              { num: '10K+', label: 'Happy Customers' },
              { num: '500+', label: 'Premium Products' },
              { num: '100%', label: 'Authentic Brands' },
              { num: '5★', label: 'Rated Service' },
            ].map((s, i) => (
              <div key={i} className="stat-item">
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="text-center">
            <div className="section-subtitle">Shop by Style</div>
            <h2 className="section-title">Our Collections</h2>
            <div className="gold-line"></div>
          </div>
          <div className="categories-grid">
            {categories.map(cat => (
              <div key={cat.id} className="cat-card" onClick={() => navigate(`/products?category=${cat.id}`)}>
                <div className="cat-emoji">{cat.emoji}</div>
                <div className="cat-label">{cat.label}</div>
                <div className="cat-desc">{cat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="section featured-section">
        <div className="container">
          <div className="text-center">
            <div className="section-subtitle">Handpicked for You</div>
            <h2 className="section-title">Featured Products</h2>
            <div className="gold-line"></div>
          </div>
          {loading ? (
  <div className="spinner"></div>
) : (
  <div className="grid-4">
    {featured?.map(p => (
      <ProductCard key={p._id} product={p} />
    ))}
  </div>
)}
          <div className="text-center" style={{ marginTop: 40 }}>
            <Link to="/products?featured=true" className="btn btn-outline">See All Featured</Link>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="banner-section">
        <div className="container">
          <div className="banner-inner">
            <img
              src="https://www.haggar.com/cdn/shop/files/preview_images/9ec5ffe73af144ba8f60c27fa981428e.thumbnail.0000000000.jpg?v=1771431899&width=1300"
              alt="Banner" className="banner-img"
            />
            <div className="banner-content">
              <div className="section-subtitle">Exclusive Offer</div>
              <h2 className="section-title" style={{ color: 'var(--gold)' }}>
                The Art of<br />Tailoring
              </h2>
              <div className="gold-line left"></div>
              <p style={{ color: 'var(--gray)', lineHeight: 1.8, marginBottom: 28 }}>
                Discover our premium suit collection — where every stitch tells a story of craftsmanship.
                Free shipping on orders above ₹999.
              </p>
              <Link to="/products?category=suits" className="btn btn-gold">Shop Suits</Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section">
        <div className="container">
          <div className="text-center">
            <div className="section-subtitle">Fresh & New</div>
            <h2 className="section-title">New Arrivals</h2>
            <div className="gold-line"></div>
          </div>
          {loading ? (
  <div className="spinner"></div>
) : (
  <div className="grid-4">
    {(newArrivals || []).map(p => (
      <ProductCard key={p._id} product={p} />
    ))}
  </div>
)}
          <div className="text-center" style={{ marginTop: 40 }}>
            <Link to="/products?newArrival=true" className="btn btn-outline">All New Arrivals</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="text-center">
            <div className="section-subtitle">What Our Kings Say</div>
            <h2 className="section-title">Customer Reviews</h2>
            <div className="gold-line"></div>
          </div>
          <div className="grid-3">
            {[
              { name: 'Arjun Sharma', city: 'Mumbai', rating: 5, text: 'The Oxford shirt I bought from SINGAM is absolutely premium. Fabric quality rivals international brands at half the price!' },
              { name: 'Vikram Patel', city: 'Bangalore', rating: 5, text: 'Ordered the Bandhgala suit for my wedding. Every guest complimented the fit and craftsmanship. SINGAM delivered royally!' },
              { name: 'Rahul Nair', city: 'Chennai', rating: 4, text: 'Fast delivery, genuine leather jacket, and superb packaging. SINGAM\'s attention to detail sets them apart from the rest.' },
            ].map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="stars" style={{ fontSize: 18, marginBottom: 12 }}>{'★'.repeat(t.rating)}</div>
                <p style={{ color: 'var(--white2)', lineHeight: 1.8, fontStyle: 'italic', marginBottom: 20 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--black)' }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                    <div style={{ color: 'var(--gray)', fontSize: 12 }}>{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;