import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice.js';
import { useCart } from '../../hooks/useCart.js';
import { toast } from '../../utils/toast.jsx';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  const images = [...(product.product_images || [])].sort((a, b) => a.sort_order - b.sort_order);
  const mainImage = images[0]?.image_url;
  const variants = product.product_variants || [];
  const totalStock = variants.reduce((s, v) => s + (v.stock || 0), 0);
  const inStock = totalStock > 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) {
      toast.error('This product is out of stock', 'Out of Stock');
      return;
    }
    const variant = variants[0];
    if (!variant) {
      toast.error('No variant available', 'Unavailable');
      return;
    }
    setAdding(true);
    addItem(product, variant, 1);
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <Link to={`/product/${product.id}`} className="text-decoration-none">
      <div className="product-card overflow-hidden">
        <div className="product-card__img-wrap">
          {mainImage ? (
            <img src={mainImage} alt={product.name} loading="lazy"
                 className="w-100 h-100 product-card__img"
                 style={{ objectFit: 'cover' }} />
          ) : (
            <div className="w-100 h-100 d-flex align-items-center justify-content-center ds-text-tertiary">
              <i className="fas fa-image fs-2"></i>
            </div>
          )}
          {product.is_new && (
            <span className="product-card__badge product-card__badge--new">New</span>
          )}
          {!inStock && (
            <div className="position-absolute top-0 start-0 end-0 bottom-0
                            d-flex align-items-center justify-content-center"
                 style={{ background: 'rgba(255,255,255,0.65)' }}>
              <span className="product-card__badge product-card__badge--out">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        <div className="product-card__body">
          <h6 className="product-card__name">{product.name}</h6>
          <div className="product-card__footer">
            <span className="product-card__price">{formatPrice(product.price)}</span>
            <button
              className={`btn-pink btn-pink--sm ${adding ? 'disabled' : ''}`}
              style={{ padding: '11px 16px', fontSize: '0.72rem', pointerEvents: 'auto', minWidth: '44px', minHeight: '44px' }}
              onClick={handleQuickAdd}
              disabled={!inStock}
            >
              {adding ? <i className="fas fa-check"></i> : <i className="fas fa-shopping-bag"></i>}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
