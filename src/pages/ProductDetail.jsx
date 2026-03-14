import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProduct, addReview } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, cartLoading, toggleWishlist, isInWishlist } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState('description');
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getProduct(id);
        console.log('Fetched product:', data);
        setProduct(data);
        if (data.colors?.length) setSelectedColor(data.colors[0]);
      } catch { navigate('/products'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!user) { toast.info('Please login to add items to cart'); navigate('/login'); return; }
    if (!selectedSize) { toast.warn('Please select a size'); return; }
    const result = await addToCart(product._id, quantity, selectedSize,quantity*product.price );
    console.log('Add to cart result:', result);
    if (result.success) toast.success('Added to cart! 🛒');
    else toast.error(result.message || 'Failed to add to cart');
  };

  const handleWishlist = async () => {
    const result = await toggleWishlist(product._id);
    if (result?.message) { toast.info('Login to save items'); return; }
    toast.success(isInWishlist(product._id) ? 'Added to wishlist' : 'Removed from wishlist');
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.info('Please login to review'); return; }
    setSubmittingReview(true);
    try {
      await addReview(id, review);
      toast.success('Review submitted!');
      const { data } = await getProduct(id);
      console.log('Updated product after review:', data);
      setProduct(data);
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmittingReview(false); }
  };

  if (loading) return <div style={{ paddingTop: 80 }}><div className="spinner"></div></div>;
  if (!product) return null;

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const inWishlist = isInWishlist(product._id);
  const stars = n => '★'.repeat(n) + '☆'.repeat(5 - n);

  return (
    <div className="product-detail" style={{ paddingTop: 80 }}>
      <div className="container" style={{ padding: '40px 24px' }}>
        <div className="detail-grid">
          {/* Images */}
          <div className="detail-images">
            <div className="main-image-wrap">
              <img
                src={product.images[selectedImage] || 'https://via.placeholder.com/600x800'}
                alt={product.name}
                className="main-image"
              />
              {discount > 0 && <div className="detail-discount-badge">{discount}% OFF</div>}
            </div>
            {product.images.length > 1 && (
              <div className="thumbnails">
                {product.images.map((img, i) => (
                  <img
                    key={i} src={img} alt={`View ${i + 1}`}
                    className={`thumb ${selectedImage === i ? 'active' : ''}`}
                    onClick={() => setSelectedImage(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="detail-info">
            <div className="detail-brand">{product.brand}</div>
            <h1 className="detail-name">{product.name}</h1>

            <div className="detail-rating">
              <span className="stars" style={{ fontSize: 18 }}>{stars(Math.round(product.rating))}</span>
              <span style={{ color: 'var(--gray)', fontSize: 13 }}>{product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
            </div>

            <div className="detail-pricing">
              <span className="price" style={{ fontSize: '2rem' }}>₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice && (
                <>
                  <span className="price-original" style={{ fontSize: '1.1rem' }}>₹{product.originalPrice.toLocaleString('en-IN')}</span>
                  <span className="price-discount">Save {discount}%</span>
                </>
              )}
            </div>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="selector-group">
                <div className="selector-label">Color: <strong>{selectedColor?.name}</strong></div>
                <div className="color-options">
                  {product.colors.map((c, i) => (
                    <button
                      key={i}
                      className={`color-swatch ${selectedColor?.name === c.name ? 'active' : ''}`}
                      style={{ background: c.hex }}
                      onClick={() => setSelectedColor(c)}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div className="selector-group">
              <div className="selector-label">Size: <strong>{selectedSize || 'Select Size'}</strong></div>
              <div className="size-options">
                {product.sizes.map((s, i) => (
                  <button
                    key={i}
                    className={`size-btn ${selectedSize === s.size ? 'active' : ''} ${s.stock === 0 ? 'out' : ''}`}
                    onClick={() => s.stock > 0 && setSelectedSize(s.size)}
                    disabled={s.stock === 0}
                    title={s.stock === 0 ? 'Out of stock' : `${s.stock} left`}
                  >
                    {s.size}
                    {s.stock === 0 && <span className="out-line"></span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="selector-group">
              <div className="selector-label">Quantity</div>
              <div className="qty-control">
                <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span className="qty-val">{quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="detail-actions">
              <button
                className="btn btn-gold btn-lg"
                style={{ flex: 1 }}
                onClick={handleAddToCart}
                disabled={cartLoading}
              >
                {cartLoading ? 'Adding...' : '🛒 Add to Cart'}
              </button>
              <button
                className={`btn btn-outline wishlist-toggle ${inWishlist ? 'wishlisted' : ''}`}
                onClick={handleWishlist}
              >
                {inWishlist ? '♥' : '♡'}
              </button>
            </div>

            <div className="detail-cta-secondary">
              <button className="btn btn-dark btn-lg btn-full" onClick={() => { handleAddToCart(); navigate('/cart'); }}>
                Buy Now →
              </button>
            </div>

            {/* Details */}
            <div className="detail-meta">
              {product.material && <div className="meta-item"><span>Material</span><strong>{product.material}</strong></div>}
              <div className="meta-item"><span>Category</span><strong style={{ textTransform: 'capitalize' }}>{product.category}</strong></div>
              <div className="meta-item"><span>SKU</span><strong>{product._id.slice(-8).toUpperCase()}</strong></div>
              {product.totalStock > 0
                ? <div className="meta-item in-stock">✓ In Stock ({product.totalStock} available)</div>
                : <div className="meta-item out-stock">✗ Out of Stock</div>
              }
            </div>

            <div className="perks">
              {['🚚 Free shipping above ₹999', '↩ Easy 30-day returns', '🔒 Secure payments', '✅ 100% Authentic'].map((p, i) => (
                <div key={i} className="perk">{p}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="detail-tabs">
          <div className="tab-nav">
            {['description', 'reviews', 'care'].map(t => (
              <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
                {t === 'reviews' && ` (${product.numReviews})`}
              </button>
            ))}
          </div>

          {tab === 'description' && (
            <div className="tab-content">
              <p style={{ color: 'var(--white2)', lineHeight: 1.9, fontSize: 15 }}>{product.description}</p>
              {product.tags?.length > 0 && (
                <div style={{ marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.tags.map(tag => (
                    <span key={tag} className="badge badge-dark">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'reviews' && (
            <div className="tab-content">
              {/* Review Form */}
              {user && (
                <form onSubmit={handleReview} className="review-form">
                  <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>Write a Review</h3>
                  <div className="form-group">
                    <label className="form-label">Your Rating</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[1,2,3,4,5].map(n => (
                        <button key={n} type="button" onClick={() => setReview(r => ({...r, rating: n}))}
                          style={{ background: 'none', border: 'none', fontSize: 28, cursor: 'pointer',
                            color: n <= review.rating ? 'var(--gold)' : 'var(--dark3)' }}>★</button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your Review</label>
                    <textarea
                      className="form-input"
                      rows={4}
                      value={review.comment}
                      onChange={e => setReview(r => ({...r, comment: e.target.value}))}
                      placeholder="Share your experience..."
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-gold" disabled={submittingReview}>
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              {product.reviews?.length === 0 ? (
                <p style={{ color: 'var(--gray)', textAlign: 'center', padding: '40px 0' }}>No reviews yet. Be the first!</p>
              ) : (
                <div className="reviews-list">
                  {product.reviews.map((r, i) => (
                    <div key={i} className="review-item">
                      <div className="review-header">
                        <div className="reviewer-avatar">{r.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</div>
                          <div className="stars" style={{ fontSize: 14 }}>{stars(r.rating)}</div>
                        </div>
                        <div style={{ marginLeft: 'auto', color: 'var(--gray)', fontSize: 12 }}>
                          {new Date(r.createdAt).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                      <p style={{ color: 'var(--white2)', lineHeight: 1.7, marginTop: 8 }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'care' && (
            <div className="tab-content">
              {product.care?.length > 0 ? (
                <ul style={{ color: 'var(--white2)', lineHeight: 2, paddingLeft: 20 }}>
                  {product.care.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              ) : (
                <div style={{ color: 'var(--white2)', lineHeight: 2 }}>
                  <p>• Machine wash cold with similar colors</p>
                  <p>• Do not bleach</p>
                  <p>• Tumble dry low</p>
                  <p>• Iron on medium heat if needed</p>
                  <p>• Dry clean recommended for delicate fabrics</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;