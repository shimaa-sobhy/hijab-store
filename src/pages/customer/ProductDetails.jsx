import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../../services/productsService.js';
import { useCart } from '../../hooks/useCart.js';
import { useAuth } from '../../hooks/useAuth.js';
import Loader from '../../components/common/Loader.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import { formatPrice } from '../../utils/formatPrice.js';
import { toast } from '../../utils/toast.jsx';

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

  const hasVariant = selectedVariant !== null;
  const inStock = hasVariant && selectedVariant.stock > 0;

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Please select a color option', 'Selection Required');
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
    <div className="ds-container pd-wrap">
      <Link to="/shop" className="pd-back">
        <i className="fas fa-arrow-left" style={{ fontSize: '0.7rem' }}></i> Back to Shop
      </Link>

      <div className="pd-grid">
        <div className="pd-image-col">
          {mainImage ? (
            <img src={mainImage} alt={product.name} className="pd-img" />
          ) : (
            <div className="pd-img pd-img--placeholder">
              <i className="fas fa-image"></i>
            </div>
          )}
        </div>

        <div className="pd-info-col">
          <h1 className="pd-title">{product.name}</h1>
          <p className="pd-price">{prodPrice}</p>
          <p className="pd-desc">{product.description}</p>

          {product.fabric && (
            <p className="pd-fabric">
              <span className="pd-label">Fabric:</span> {product.fabric}
            </p>
          )}

          {product.product_variants && product.product_variants.length > 0 && (
            <div className="pd-variants">
              <p className="pd-label">
                Color: <span className="pd-label-desc">{selectedVariant?.color || 'Select'}</span>
              </p>
              <div className="pd-variant-list">
                {product.product_variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => { setSelectedVariant(v); setQuantity(1); }}
                    className={`pd-v-btn ${selectedVariant?.id === v.id ? 'pd-v-btn--active' : ''}`}
                  >
                    {v.color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasVariant && (
            <p className="pd-stock">
              {inStock ? (
                <span className="pd-stock--in"><i className="fas fa-check-circle"></i> In Stock</span>
              ) : (
                <span className="pd-stock--out"><i className="fas fa-times-circle"></i> Out of Stock</span>
              )}
            </p>
          )}

          {hasVariant && inStock && (
            <div className="pd-qty-wrap">
              <span className="pd-qty-label">Qty:</span>
              <div className="pd-qty-control">
                <button className="pd-qty-btn" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  <i className="fas fa-minus" style={{ fontSize: '0.7rem' }}></i>
                </button>
                <span className="pd-qty-value">{quantity}</span>
                <button className="pd-qty-btn" onClick={() => setQuantity((q) => Math.min(selectedVariant.stock, q + 1))} aria-label="Increase quantity">
                  <i className="fas fa-plus" style={{ fontSize: '0.7rem' }}></i>
                </button>
              </div>
            </div>
          )}

          {!hasVariant && product.product_variants && product.product_variants.length > 0 && (
            <div className="pd-qty-wrap">
              <span className="pd-qty-label">Qty:</span>
              <div className="pd-qty-control">
                <button className="pd-qty-btn" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  <i className="fas fa-minus" style={{ fontSize: '0.7rem' }}></i>
                </button>
                <span className="pd-qty-value">{quantity}</span>
                <button className="pd-qty-btn" onClick={() => setQuantity((q) => Math.min(99, q + 1))} aria-label="Increase quantity">
                  <i className="fas fa-plus" style={{ fontSize: '0.7rem' }}></i>
                </button>
              </div>
            </div>
          )}

          <button
            className="pd-cart-btn"
            onClick={handleAddToCart}
            disabled={hasVariant && !inStock}
          >
            {hasVariant && !inStock ? 'Out of Stock' : 'Add to Cart'}
          </button>

          {!user && (
            <p className="pd-signin">
              <Link to="/login" style={{ color: 'var(--pink)' }}>Sign in</Link> to save your cart across devices
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
