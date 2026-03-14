import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Products.css';
import { use } from 'react';

const categories = ['shirts', 'trousers', 'suits', 'jackets', 'shoes', 'accessories', 'ethnic', 'casuals'];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'newest',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    search: searchParams.get('search') || '',
    page: 1,
    featured: searchParams.get('featured') || '',
    newArrival: searchParams.get('newArrival') || '',
    bestSeller: searchParams.get('bestSeller') || '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
        const { data } = await getProducts(params);
        setProducts(data.products);
        setTotal(data.total);
        setPages(data.pages);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);
 useEffect(() => {
  const getdata=async()=>{
    try{
      const res=await getProducts();
      console.log('Fetched products:', res.data);
    }catch(err){
      console.error('Error fetching products:', err);
    }
  }
  getdata()
 },[])

  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ category: '', sort: 'newest', minPrice: '', maxPrice: '', search: '', page: 1, featured: '', newArrival: '', bestSeller: '' });
    setSearchParams({});
  };

  return (
    <div className="products-page" style={{ paddingTop: 80 }}>
      {/* Top bar */}
      <div className="products-topbar">
        <div className="container">
          <div className="topbar-inner">
            <div>
              <div style={{ fontSize: 11, color: 'var(--gray)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
                {filters.category || 'All Products'}
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700 }}>
                {total} Items Found
              </h1>
            </div>
            <div className="topbar-controls">
              <input
                className="search-input"
                placeholder="Search products..."
                value={filters.search}
                onChange={e => handleFilter('search', e.target.value)}
              />
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: 160 }}
                value={filters.sort}
                onChange={e => handleFilter('sort', e.target.value)}
              >
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <button
                className="btn btn-dark filter-toggle"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                Filters {filtersOpen ? '▲' : '▼'}
              </button>
            </div>
          </div>
          {/* Filter bar */}
          <div className={`filter-bar ${filtersOpen ? 'open' : ''}`}>
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <div className="filter-chips">
                <button
                  className={`chip ${!filters.category ? 'active' : ''}`}
                  onClick={() => handleFilter('category', '')}
                >All</button>
                {categories.map(c => (
                  <button
                    key={c}
                    className={`chip ${filters.category === c ? 'active' : ''}`}
                    onClick={() => handleFilter('category', c)}
                  >{c.charAt(0).toUpperCase() + c.slice(1)}</button>
                ))}
              </div>
            </div>
            <div className="filter-group" style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div>
                <label className="filter-label">Min Price</label>
                <input
                  type="number"
                  className="form-input"
                  style={{ width: 120 }}
                  placeholder="₹0"
                  value={filters.minPrice}
                  onChange={e => handleFilter('minPrice', e.target.value)}
                />
              </div>
              <div>
                <label className="filter-label">Max Price</label>
                <input
                  type="number"
                  className="form-input"
                  style={{ width: 120 }}
                  placeholder="₹99999"
                  value={filters.maxPrice}
                  onChange={e => handleFilter('maxPrice', e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  className={`chip ${filters.featured ? 'active' : ''}`}
                  onClick={() => handleFilter('featured', filters.featured ? '' : 'true')}
                >⭐ Featured</button>
                <button
                  className={`chip ${filters.newArrival ? 'active' : ''}`}
                  onClick={() => handleFilter('newArrival', filters.newArrival ? '' : 'true')}
                >🆕 New</button>
                <button
                  className={`chip ${filters.bestSeller ? 'active' : ''}`}
                  onClick={() => handleFilter('bestSeller', filters.bestSeller ? '' : 'true')}
                >🔥 Best Seller</button>
              </div>
              <button className="btn btn-outline btn-sm" onClick={clearFilters}>Clear All</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        {loading ? (
          <div className="spinner"></div>
        ) : products.length === 0 ? (
          <div className="no-products">
            <div style={{ fontSize: 60, marginBottom: 20 }}>😔</div>
            <h2 style={{ fontFamily: 'var(--font-display)' }}>No products found</h2>
            <p style={{ color: 'var(--gray)', marginBottom: 20 }}>Try adjusting your filters</p>
            <button className="btn btn-gold" onClick={clearFilters}>Clear Filters</button>
          </div>
        ) : (
          <div className="grid-4">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="pagination">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i + 1}
                className={`page-btn ${filters.page === i + 1 ? 'active' : ''}`}
                onClick={() => setFilters(prev => ({ ...prev, page: i + 1 }))}
              >{i + 1}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;