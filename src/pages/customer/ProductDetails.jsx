import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../../services/productsService.js';
import { useCart } from '../../hooks/useCart.js';
import { useAuth } from '../../hooks/useAuth.js';
import Loader from '../../components/common/Loader.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import { formatPrice } from '../../utils/formatPrice.js';
import { toast } from 'react-toastify';

export default function ProductDetails() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const load = useCallback(() => {
    setLoading(true); setError(null);
    fetchProductById(id)
      .then((p) => {
        setProduct(p);
        if (p.product_variants && p.product_variants.length > 0) {
          setSelectedVariant(p.product_variants[0]);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (product) document.title = `${product.name} — VEIL LUXE`; }, [product]);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Please select a color option');
      return;
    }
    addItem(product, selectedVariant, quantity);
  };

  if (loading) return <div className="ds-container section-premium"><Loader /></div>;
  if (error) return <div className="ds-container section-premium"><ErrorMessage message={error} onRetry={load} /></div>;
  if (!product) return <div className="ds-container section-premium text-center py-5"><p>Product not found</p></div>;

  const mainImage = product.images?.[0] || null;
  const prodPrice = formatPrice(product.price);

  return (
    <div className="ds-container section-premium">
      <Link to="/shop" className="btn-pink btn-pink--outline" style={{ marginBottom: '2rem', display: 'inline-block' }}>&larr; Back to Shop</Link>
      <div className="row g-5">
        <div className="col-md-6">
          {mainImage ? (
            <img src={mainImage} alt={product.name} className="w-100 rounded-3" style={{ objectFit: 'cover', aspectRatio: '1/1', boxShadow: '0 2px 20px rgba(0,0,0,0.06)' }} />
          ) : (
            <div className="w-100 rounded-3 d-flex align-items-center justify-content-center" style={{ aspectRatio: '1/1', background: 'var(--bg-subtle)', color: 'var(--text-tertiary)' }}>
              <i className="fas fa-image" style={{ fontSize: '3rem' }}></i>
            </div>
          )}
        </div>
        <div className="col-md-6">
          <h1 className="fw-bold" style={{ color: 'var(--text-primary)' }}>{product.name}</h1>
          <p className="fw-bold mb-4" style={{ color: 'var(--pink)', fontSize: 'var(--fs-h3)' }}>{prodPrice}</p>
          <p className="mb-4" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{product.description}</p>

          {product.fabric && (
            <p className="mb-2" style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-small)' }}>
              <span className="fw-semibold" style={{ color: 'var(--text-primary)' }}>Fabric:</span> {product.fabric}
            </p>
          )}

          {/* Color variants */}
          {product.product_variants && product.product_variants.length > 0 && (
            <div className="mb-4">
              <p className="fw-semibold mb-2" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-small)' }}>Color: <span style={{ color: 'var(--text-secondary)' }}>{selectedVariant?.color || 'Select'}</span></p>
              <div className="d-flex gap-2 flex-wrap">
                {product.product_variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`btn-pink ${selectedVariant?.id === v.id ? '' : 'btn-pink--outline'} btn-pink--sm`}
                    style={{ minWidth: '60px' }}
                  >
                    {v.color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock status */}
          {selectedVariant && (
            <p className="mb-3" style={{ fontSize: 'var(--fs-small)' }}>
              {selectedVariant.stock > 0 ? (
                <span style={{ color: 'var(--success-text)' }}><i className="fas fa-check-circle me-1"></i> In Stock</span>
              ) : (
                <span style={{ color: 'var(--error-text)' }}><i className="fas fa-times-circle me-1"></i> Out of Stock</span>
              )}
            </p>
          )}

          {/* Quantity */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <span className="fw-semibold" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-small)' }}>Quantity:</span>
            <div className="d-flex align-items-center border rounded-pill" style={{ borderColor: 'var(--border-subtle)' }}>
              <button className="btn btn-sm border-0 px-3" onClick={() => setQuantity((q) => Math.max(1, q - 1))} style={{ color: 'var(--text-secondary)' }}>
                <i className="fas fa-minus"></i>
              </button>
              <span className="px-3 fw-medium" style={{ color: 'var(--text-primary)' }}>{quantity}</span>
              <button className="btn btn-sm border-0 px-3" onClick={() => setQuantity((q) => Math.min(selectedVariant?.stock || 99, q + 1))} style={{ color: 'var(--text-secondary)' }}>
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>

          <button
            className="btn-pink btn-pink--block"
            style={{ padding: '14px' }}
            onClick={handleAddToCart}
            disabled={selectedVariant && selectedVariant.stock <= 0}
          >
            {selectedVariant && selectedVariant.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

          {!user && (
            <p className="text-center mt-2" style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
              <Link to="/login" style={{ color: 'var(--pink)' }}>Sign in</Link> to save your cart across devices
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
