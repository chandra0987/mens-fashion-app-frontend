import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{
    background: '#050505',
    borderTop: '1px solid rgba(201,168,76,0.15)',
    padding: '60px 0 30px'
  }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900, background: 'linear-gradient(135deg, #9a7c2e, #e8c97a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 12 }}>
            🦁 SINGAM
          </div>
          <p style={{ color: 'var(--gray)', fontSize: 13, lineHeight: 1.8 }}>
            Premium men's fashion from the heart of India. Crafted for the modern maharaja.
          </p>
        </div>
        <div>
          <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', marginBottom: 16, fontSize: '0.9rem', letterSpacing: 2 }}>COLLECTIONS</h4>
          {['shirts', 'suits', 'trousers', 'jackets', 'shoes', 'ethnic'].map(c => (
            <Link key={c} to={`/products?category=${c}`} style={{ display: 'block', color: 'var(--gray)', fontSize: 13, marginBottom: 8, textDecoration: 'none', textTransform: 'capitalize', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--gold)'}
              onMouseLeave={e => e.target.style.color = 'var(--gray)'}>
              {c}
            </Link>
          ))}
        </div>
        <div>
          <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', marginBottom: 16, fontSize: '0.9rem', letterSpacing: 2 }}>SUPPORT</h4>
          {['Size Guide', 'Care Instructions', 'Returns & Exchanges', 'Track Your Order', 'Contact Us'].map(item => (
            <div key={item} style={{ color: 'var(--gray)', fontSize: 13, marginBottom: 8, cursor: 'pointer' }}>{item}</div>
          ))}
        </div>
        <div>
          <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', marginBottom: 16, fontSize: '0.9rem', letterSpacing: 2 }}>FOLLOW US</h4>
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            {['Instagram', 'Twitter', 'Facebook', 'Pinterest'].map(s => (
              <div key={s} style={{ background: 'var(--dark3)', border: 'var(--border-gold)', padding: '8px 12px', borderRadius: 2, fontSize: 11, color: 'var(--gold)', cursor: 'pointer', letterSpacing: 1 }}>
                {s.charAt(0)}
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--dark2)', border: 'var(--border)', borderRadius: 2, overflow: 'hidden', display: 'flex' }}>
            <input placeholder="Your email" style={{ flex: 1, background: 'none', border: 'none', padding: '10px 14px', color: 'var(--white)', fontSize: 12, outline: 'none' }} />
            <button style={{ background: 'var(--gold)', border: 'none', padding: '10px 16px', color: 'var(--black)', fontWeight: 700, fontSize: 11, cursor: 'pointer', letterSpacing: 1 }}>
              JOIN
            </button>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ color: 'var(--gray)', fontSize: 12 }}>© 2026 SINGAM. All rights reserved. Made with ♥ in India.</p>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy Policy', 'Terms', 'Sitemap'].map(t => (
            <span key={t} style={{ color: 'var(--gray)', fontSize: 11, cursor: 'pointer', letterSpacing: 1 }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;