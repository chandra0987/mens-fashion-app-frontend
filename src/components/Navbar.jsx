import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
// console.log('Navbar rendered. User:', user, 'Cart:', cart);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const categories = ['shirts', 'trousers', 'suits', 'jackets', 'shoes', 'accessories', 'ethnic', 'casuals'];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-lion">🦁</span>
          <span className="brand-text">SINGAM</span>
        </Link>

        <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <div className="nav-dropdown">
            <button className="nav-link" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
              Collections ▾
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                {categories.map(cat => (
                  <Link key={cat} to={`/products?category=${cat}`} className="dropdown-item">
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/products?newArrival=true" className="nav-link">New Arrivals</Link>
          <Link to="/products?bestSeller=true" className="nav-link">Best Sellers</Link>
          <Link to="/products?featured=true" className="nav-link">Featured</Link>
        </div>

        <div className="navbar-actions">
          <Link to="/products" className="action-btn" title="Search">🔍</Link>
          {user && (
            <>
              <Link to="/wishlist" className="action-btn" title="Wishlist">♡</Link>
              <Link to="/cart" className="action-btn cart-btn" title="Cart">
                🛒
                {cart.totalItems > 0 && <span className="cart-badge">{cart.totalItems}</span>}
              </Link>
            </>
          )}
          {user ? (
            <div className="user-menu">
              <button className="user-btn">
                {user.name.charAt(0).toUpperCase()}
              </button>
              <div className="user-dropdown">
                <div className="user-name">{user.name}</div>
                <Link to="/profile" className="user-item">Profile</Link>
                <Link to="/orders" className="user-item">My Orders</Link>
                {user.role === 'admin' && <Link to="/admin" className="user-item">Admin</Link>}
                <button onClick={handleLogout} className="user-item logout">Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-gold btn-sm">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;