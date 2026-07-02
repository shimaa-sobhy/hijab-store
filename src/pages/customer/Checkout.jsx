import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart.js';
import { useAuth } from '../../hooks/useAuth.js';
import { formatPrice } from '../../utils/formatPrice.js';
import { isValidEgyptianPhone, EGYPTIAN_GOVERNORATES } from '../../utils/validators.js';
import { placeOrder } from '../../services/ordersService.js';
import { toast } from 'react-toastify';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ customer_name: '', phone: '', address: '', city: '', notes: '' });

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const placeOrderAction = async () => {
    if (items.length === 0) { toast.error('Your cart is empty'); return; }
    if (!isValidEgyptianPhone(form.phone)) {
      toast.error('Please enter a valid Egyptian phone number (11 digits starting with 01)');
      return;
    }
    setSubmitting(true);
    try {
      const orderItems = items.map((i) => ({
        product_id: i.product_id,
        variant_id: i.variant_id,
        quantity: i.quantity,
      }));
      const orderNumber = await placeOrder({
        userId: user?.id || null,
        customerName: form.customer_name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        notes: form.notes || null,
        items: orderItems,
      });
      await clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-success/${orderNumber}`);
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    placeOrderAction();
  };

  const handleSummaryPlaceOrder = () => {
    if (formRef.current && !formRef.current.reportValidity()) return;
    placeOrderAction();
  };

  if (items.length === 0) {
    return (
      <div className="ds-container section-premium text-center" style={{ paddingTop: '80px' }}>
        <div style={{ maxWidth: '440px', margin: '0 auto' }}>
          <i className="fas fa-shopping-bag" style={{ fontSize: '3rem', color: 'var(--pink-300)', marginBottom: '1.5rem', display: 'block' }}></i>
          <h3 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>Your cart is empty</h3>
          <p className="mb-4" style={{ color: 'var(--text-tertiary)' }}>Add some items to your cart before checkout.</p>
          <Link to="/shop" className="btn-pink" style={{ padding: '14px 40px' }}>Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const imgUrl = (item) => item.image_url || null;

  return (
    <div style={{
      background: 'var(--pink-50)',
      minHeight: '100vh',
      padding: 'calc(var(--header-height) + var(--space-5)) var(--space-4) var(--space-6)',
    }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        <div className="text-center mb-5">
          <h1 className="fw-bold mb-2" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-h2)' }}>Checkout</h1>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-small)' }}>Complete your order with confidence</p>
          <div className="pink-divider--center pink-divider" style={{ margin: 'var(--space-3) auto 0' }}></div>
        </div>

        <div className="row g-5">
          <div className="col-lg-7">
            <div style={{
              background: '#fff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: 'var(--space-4) var(--space-5)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'var(--pink)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
                }}>1</div>
                <div>
                  <h5 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>Contact & Shipping</h5>
                  <p style={{ fontSize: 'var(--fs-caption)', color: 'var(--text-tertiary)', margin: 0 }}>Provide your shipping details to receive your order</p>
                </div>
              </div>

              <div style={{ padding: 'var(--space-5)' }}>
                <form ref={formRef} onSubmit={handleSubmit}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="ds-label">
                        <i className="fas fa-user" style={{ marginRight: '6px', color: 'var(--pink-400)', fontSize: '0.75rem' }}></i>
                        Full Name
                      </label>
                      <input
                        type="text" name="customer_name" className="form-control"
                        value={form.customer_name} onChange={handleChange}
                        required placeholder="John Doe"
                        style={{ padding: '13px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: 'var(--fs-small)' }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="ds-label">
                        <i className="fas fa-phone" style={{ marginRight: '6px', color: 'var(--pink-400)', fontSize: '0.75rem' }}></i>
                        Phone Number
                      </label>
                      <input
                        type="tel" name="phone" className="form-control"
                        value={form.phone} onChange={handleChange}
                        required placeholder="0100 000 0000" maxLength={11}
                        style={{ padding: '13px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: 'var(--fs-small)' }}
                      />
                    </div>
                    <div className="col-12">
                      <label className="ds-label">
                        <i className="fas fa-map-marker-alt" style={{ marginRight: '6px', color: 'var(--pink-400)', fontSize: '0.75rem' }}></i>
                        Address
                      </label>
                      <input
                        type="text" name="address" className="form-control"
                        value={form.address} onChange={handleChange}
                        required placeholder="Street, building, apartment number"
                        style={{ padding: '13px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: 'var(--fs-small)' }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="ds-label">
                        <i className="fas fa-city" style={{ marginRight: '6px', color: 'var(--pink-400)', fontSize: '0.75rem' }}></i>
                        City / Governorate
                      </label>
                      <select
                        name="city" className="form-select"
                        value={form.city} onChange={handleChange} required
                        style={{ padding: '13px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: 'var(--fs-small)', backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill=%27none%27 stroke=%27%236B6B6B%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27m2 5 6 6 6-6%27/%3e%3c/svg%3e")' }}
                      >
                        <option value="">Select governorate</option>
                        {EGYPTIAN_GOVERNORATES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="ds-label">
                        <i className="fas fa-sticky-note" style={{ marginRight: '6px', color: 'var(--pink-400)', fontSize: '0.75rem' }}></i>
                        Notes <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>(optional)</span>
                      </label>
                      <textarea
                        name="notes" className="form-control" rows="3"
                        value={form.notes} onChange={handleChange}
                        placeholder="Delivery instructions, landmarks, etc."
                        style={{ padding: '13px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: 'var(--fs-small)', resize: 'vertical' }}
                      ></textarea>
                    </div>
                  </div>

                  <div style={{
                    marginTop: 'var(--space-5)', paddingTop: 'var(--space-4)',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    flexWrap: 'wrap', gap: 'var(--space-3)',
                  }}>
                    <Link to="/cart" className="btn-pink btn-pink--outline" style={{ padding: '12px 28px', fontSize: 'var(--fs-small)' }}>
                      <i className="fas fa-arrow-left" style={{ fontSize: '0.75rem' }}></i> Back to Cart
                    </Link>
                    <button type="submit" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}>Submit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div style={{
              background: '#fff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
              position: 'sticky', top: 'calc(var(--header-height) + var(--space-4))',
            }}>
              <div style={{
                padding: 'var(--space-4) var(--space-5)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>Order Summary</h5>
                <span style={{
                  background: 'var(--pink-100)', color: 'var(--pink-500)',
                  padding: '3px 12px', borderRadius: 'var(--radius-pill)',
                  fontSize: 'var(--fs-caption)', fontWeight: 600,
                }}>
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div style={{ padding: 'var(--space-3) var(--space-5)' }}>
                {items.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 'var(--space-3)',
                    padding: 'var(--space-3) 0',
                    borderBottom: i < items.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  }}>
                    <div style={{
                      width: '60px', height: '72px', borderRadius: 'var(--radius-sm)',
                      background: 'var(--pink-50)', overflow: 'hidden', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {imgUrl(item) ? (
                        <img src={imgUrl(item)} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <i className="fas fa-tshirt" style={{ color: 'var(--pink-300)', fontSize: '1.2rem' }}></i>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="fw-medium mb-1" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-small)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product_name}</p>
                      {item.color && <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-caption)', margin: 0 }}>Color: {item.color}</p>}
                      <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-caption)', margin: 0 }}>Qty: {item.quantity}</p>
                    </div>
                    <div className="fw-semibold" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-small)', whiteSpace: 'nowrap' }}>
                      {formatPrice(Number(item.price) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                padding: 'var(--space-4) var(--space-5)',
                borderTop: '1px solid var(--border-subtle)',
                background: 'var(--pink-50)',
              }}>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-small)' }}>Subtotal</span>
                  <span style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-small)', fontWeight: 500 }}>{formatPrice(totalPrice)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-small)' }}>Shipping</span>
                  <span style={{ color: 'var(--success-text)', fontSize: 'var(--fs-small)', fontWeight: 500 }}>Free</span>
                </div>
                <div style={{
                  borderTop: '1px dashed var(--gold-light)',
                  paddingTop: 'var(--space-3)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span className="fw-bold" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-body)' }}>Total</span>
                  <span className="fw-bold" style={{ color: 'var(--pink)', fontSize: 'var(--fs-h4)' }}>{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div style={{ padding: 'var(--space-4) var(--space-5)' }}>
                <button
                  className="btn-pink"
                  style={{ width: '100%', padding: '16px', fontSize: 'var(--fs-body)' }}
                  disabled={submitting}
                  onClick={handleSummaryPlaceOrder}
                >
                  {submitting ? (
                    <><span className="spinner-border spinner-border-sm me-2" role="status"></span> Placing Order...</>
                  ) : (
                    <><i className="fas fa-lock me-2" style={{ fontSize: '0.8rem' }}></i> Place Order</>
                  )}
                </button>
                <div className="text-center mt-3" style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-caption)' }}>
                  <i className="fas fa-shield-alt me-1" style={{ color: 'var(--pink-400)' }}></i>
                  Secure checkout — your information is protected
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
