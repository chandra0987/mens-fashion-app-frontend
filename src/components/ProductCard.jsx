import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
// import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useCart();
  const inWishlist = isInWishlist(product._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    const result = await toggleWishlist(product._id);
    if (result?.message) {
      toast.info('Login to save items');
    } else {
      toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    }
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-image-wrap">
        <img
          src={product.images[0] || 'https://via.placeholder.com/400x500?text=No+Image'}
          alt={product.name}
          className="product-image"
        />
        {product.images[1] && (
          <img src={product.images[1]} alt={product.name} className="product-image-hover" />
        )}
        <div className="product-badges">
          {product.isNewArrival && <span className="badge badge-gold">New</span>}
          {product.isBestSeller && <span className="badge badge-dark">Best Seller</span>}
          {discount > 0 && <span className="badge badge-red">{discount}% OFF</span>}
        </div>
        <button
          className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
          onClick={handleWishlist}
        >
          {inWishlist ? '♥' : '♡'}
        </button>
      </Link>
      <div className="product-info">
        <div className="product-brand">{product.brand}</div>
        <Link to={`/products/${product._id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <div className="product-rating">
          <span className="stars">{stars}</span>
          <span className="review-count">({product.numReviews})</span>
        </div>
        <div className="product-pricing">
          <span className="price">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice && (
            <span className="price-original">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          )}
        </div>
        <Link to={`/products/${product._id}`} className="btn btn-gold btn-sm product-cta">
          View Product
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;