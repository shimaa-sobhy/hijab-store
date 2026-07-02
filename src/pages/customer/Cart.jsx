import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart.js';
import { formatPrice } from '../../utils/formatPrice.js';
import Loader from '../../components/common/Loader.jsx';

export default function Cart() {
  const { items, loading, updateQuantity, removeItem, totalPrice } = useCart();

  if (loading) return <div className="ds-container section-premium"><Loader /></div>;

  return (
    <div className="ds-container section-premium" style={{ paddingTop: 'var(--space-6)' }}>
      <div className="text-center mb-5">
        <p className="ds-text-xs" style={{ color: 'var(--pink)', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          — Your Cart —
        </p>
        <h1 className="fw-bold" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-h2)' }}>Shopping Cart</h1>
        {items.length > 0 && (
          <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-small)', marginTop: '0.25rem' }}>{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        )}
        <div className="pink-divider pink-divider--center" style={{ marginTop: '1rem' }} />
      </div>

      {items.length === 0 ? (
        <div className="admin-card p-5 text-center" style={{ color: 'var(--text-secondary)' }}>
          <i className="fas fa-shopping-bag ds-empty-cart-icon" style={{ fontSize: '3rem', color: 'var(--pink)', marginBottom: '1.5rem', display: 'block' }}></i>
          <p>Your cart is empty</p>
          <Link to="/shop" className="btn-pink mt-3" style={{ display: 'inline-block', padding: '12px 36px' }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            {items.map((item, idx) => (
              <div key={item.variant_id || idx} className="d-flex gap-3 p-3 p-md-4 mb-3 rounded-3" style={{ border: '1px solid var(--border-subtle)', background: 'var(--surface)' }}>
                <div className="flex-shrink-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.product_name} style={{ width: '90px', height: '110px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  ) : (
                    <div style={{ width: '90px', height: '110px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                      <i className="fas fa-image"></i>
                    </div>
                  )}
                </div>
                <div className="flex-grow-1">
                  <h6 className="fw-semibold" style={{ color: 'var(--text-primary)' }}>{item.product_name}</h6>
                  {item.color && <p className="mb-1" style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-caption)' }}>Color: {item.color}</p>}
                  <p className="fw-bold mb-2" style={{ color: 'var(--pink)', fontSize: 'var(--fs-small)' }}>{formatPrice(item.price)}</p>
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center border rounded-pill" style={{ borderColor: 'var(--border-subtle)' }}>
                      <button className="btn border-0 d-flex align-items-center justify-content-center" onClick={() => updateQuantity(item.variant_id, Math.max(1, item.quantity - 1))} style={{ color: 'var(--text-secondary)', width: '44px', height: '44px' }}>
                        <i className="fas fa-minus" style={{ fontSize: '0.7rem' }}></i>
                      </button>
                      <span className="px-2 fw-medium" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-small)', minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                      <button className="btn border-0 d-flex align-items-center justify-content-center" onClick={() => updateQuantity(item.variant_id, Math.min(item.stock || 99, item.quantity + 1))} style={{ color: 'var(--text-secondary)', width: '44px', height: '44px' }}>
                        <i className="fas fa-plus" style={{ fontSize: '0.7rem' }}></i>
                      </button>
                    </div>
                    <button className="btn border-0 d-flex align-items-center justify-content-center" onClick={() => removeItem(item.variant_id)} style={{ color: 'var(--error-text)', width: '44px', height: '44px' }}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                <div className="text-end flex-shrink-0">
                  <p className="fw-bold" style={{ color: 'var(--text-primary)' }}>{formatPrice(Number(item.price) * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="col-lg-4">
            <div className="admin-card p-4">
              <h5 className="fw-bold mb-4" style={{ color: 'var(--text-primary)' }}>Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-small)' }}>Subtotal</span>
                <span className="fw-medium" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-small)' }}>{formatPrice(totalPrice)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-small)' }}>Shipping</span>
                <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-small)' }}>Calculated at checkout</span>
              </div>
              <hr style={{ borderColor: 'var(--border-subtle)' }} />
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold" style={{ color: 'var(--text-primary)' }}>Total</span>
                <span className="fw-bold" style={{ color: 'var(--pink)', fontSize: 'var(--fs-h4)' }}>{formatPrice(totalPrice)}</span>
              </div>
              <Link to="/checkout" className="btn-pink btn-pink--block btn-pink--lg">Checkout</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
