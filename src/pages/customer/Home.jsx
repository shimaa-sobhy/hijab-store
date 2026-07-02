import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllProducts } from '../../services/productsService.js';
import ProductCard from '../../components/product/ProductCard.jsx';
import Loader from '../../components/common/Loader.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true); setError(null);
    fetchAllProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      {/* Full-cover hero */}
      <section className="position-relative overflow-hidden" style={{ height: 'calc(100vh + var(--header-height))', minHeight: 'calc(680px + var(--header-height))', marginTop: 'calc(var(--header-height) * -1)' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#f0e8e8',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)',
        }} />
        <div className="container h-100 d-flex align-items-center position-relative" style={{ zIndex: 2 }}>
          <div className="row w-100">
            <div className="col-lg-7">
              <p className="animate-in mb-3" style={{ letterSpacing: '4px', color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 300, textTransform: 'uppercase' }}>
                — New Collection 2026
              </p>
              <h1 className="animate-in animate-in--d1 mb-4" style={{ color: '#fff', fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem, 4.8vw, 3.5rem)', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.35, letterSpacing: '3px', textShadow: '0 2px 30px rgba(0,0,0,0.12)' }}>
                Elegance in<br /><span style={{ color: 'var(--pink)' }}>Every</span> Thread
              </h1>
              <p className="animate-in animate-in--d2 mb-5" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', maxWidth: '480px', lineHeight: 1.9, fontWeight: 300 }}>
                Discover our curated collection of premium hijabs, designed for the modern woman who values quality, grace, and timeless style.
              </p>
              <div className="animate-in animate-in--d3">
                <Link to="/shop" className="btn-hero btn-hero--lg">
                  Shop Now <i className="fas fa-arrow-right" style={{ fontSize: '0.85rem' }}></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <div className="ds-container section-premium products-section">
        <div className="text-center mb-5">
          <p className="ds-text-xs" style={{ color: 'var(--pink)', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            — Our Selection —
          </p>
          <h2 className="fw-bold" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-h2)' }}>Featured Products</h2>
          <div className="pink-divider pink-divider--center" style={{ marginTop: '1rem' }} />
        </div>

        {loading && <div className="py-5"><Loader /></div>}
        {error && <ErrorMessage message={error} onRetry={load} />}

        {!loading && !error && (
          <div className="row g-4 mx-0">
            {products.slice(0, 4).map((p, i) => (
              <div className="col-6 col-md-4 col-lg-3 animate-in" style={{ animationDelay: `${i * 0.05}s` }} key={p.id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="text-center mt-5">
            <Link to="/shop" className="btn-pink btn-pink--lg">
              View All <i className="fas fa-arrow-right" style={{ fontSize: '0.85rem' }}></i>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
