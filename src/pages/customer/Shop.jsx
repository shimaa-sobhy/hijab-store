import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/product/ProductCard.jsx';
import SkeletonCard from '../../components/common/SkeletonCard.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import { fetchAllProducts } from '../../services/productsService.js';
import useScrollReveal from '../../hooks/useScrollReveal.js';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const [headerRef, headerVis] = useScrollReveal();
  const [gridRef, gridVis] = useScrollReveal({ threshold: 0.05 });

  const load = () => {
    setLoading(true); setError(null);
    fetchAllProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = products.filter((p) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    if (p.name?.toLowerCase().includes(q)) return true;
    return (p.product_variants || []).some((v) => v.color?.toLowerCase().includes(q));
  });

  return (
    <div className="ds-container section-premium products-section">
      <div ref={headerRef} className={`text-center mb-5 reveal ${headerVis ? 'is-visible' : ''}`}>
        <p className="ds-text-xs" style={{ color: 'var(--pink)', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          — Our Collection —
        </p>
        <h1 className="fw-bold" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-h2)' }}>All Products</h1>
        <div className="pink-divider pink-divider--center" style={{ marginTop: '1rem' }} />
      </div>

      <div className="d-flex justify-content-center mb-5">
        <input
          type="text"
          className="form-control ds-input ds-input--pill"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '400px' }}
        />
      </div>

      {loading && <SkeletonCard count={8} />}
      {error && <ErrorMessage message={error} onRetry={load} />}

      {!loading && !error && (
        <div ref={gridRef} className={`row g-4 mx-0 stagger ${gridVis ? 'is-visible' : ''}`}>
          {filtered.map((p) => (
            <div className="col-6 col-md-4 col-lg-3" key={p.id}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-5" style={{ color: 'var(--text-secondary)' }}>
          <i className="fas fa-search" style={{ fontSize: '2rem', color: 'var(--pink)', marginBottom: '1rem', display: 'block' }}></i>
          <p>No products match your search</p>
        </div>
      )}
    </div>
  );
}
