import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../supabase/supabaseClient.js';
import { useAuth } from '../../hooks/useAuth.js';
import { fetchMyOrders } from '../../services/ordersService.js';
import { formatPrice } from '../../utils/formatPrice.js';
import { ORDER_CONFIG, PRODUCT_IMAGES_BUCKET } from '../../utils/constants.js';
import Loader from '../../components/common/Loader.jsx';
import useScrollReveal from '../../hooks/useScrollReveal.js';

export default function Account() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [imageMap, setImageMap] = useState({});
  const [headerRef, headerVis] = useScrollReveal();
  const [ordersRef, ordersVis] = useScrollReveal({ threshold: 0.05 });

  useEffect(() => {
    if (!user) { setOrdersLoading(false); return; }
    fetchMyOrders(user.id)
      .then((data) => {
        setOrders(data);
        return data;
      })
      .then((orders) => {
        const productIds = [...new Set(
          orders.flatMap((o) => (o.order_items || []).map((i) => i.product_id).filter(Boolean))
        )];
        if (productIds.length === 0) return;
        supabase
          .from('product_images')
          .select('product_id, image_url')
          .in('product_id', productIds)
          .order('sort_order', { ascending: true })
          .then(({ data: images }) => {
            const map = {};
            for (const img of images || []) {
              if (!map[img.product_id]) map[img.product_id] = img.image_url;
            }
            setImageMap(map);
          })
          .catch(() => {});
      })
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const toggleOrder = (orderId) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  if (ordersLoading) {
    return <Loader />;
  }

  return (
    <div className="ds-container section-premium" style={{ maxWidth: '960px' }}>
      {/* Header */}
      <div ref={headerRef} className={`text-center mb-5 reveal ${headerVis ? 'is-visible' : ''}`}>
        <p style={{
          color: 'var(--pink)', fontWeight: 600, letterSpacing: '3px',
          textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: '0.5rem',
        }}>
          — My Orders —
        </p>
        <h1 className="fw-bold mb-1" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-h2)' }}>My Orders</h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-small)', marginBottom: '0.75rem' }}>
          Track and review all your orders
        </p>
        <div className="pink-divider pink-divider--center" style={{ marginTop: '0.75rem' }} />
      </div>

      {orders.length === 0 ? (
        /* ---------- Empty state ---------- */
        <div className="admin-card p-5 text-center" style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div style={{
            width: '96px', height: '96px', borderRadius: '50%',
            background: 'var(--pink-50)', margin: '0 auto 1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="fas fa-shopping-bag" style={{ fontSize: '2.2rem', color: 'var(--pink-300)' }}></i>
          </div>
          <h5 className="fw-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No orders yet</h5>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-small)', marginBottom: '1.5rem', maxWidth: '280px', margin: '0 auto 1.5rem' }}>
            Start shopping to place your first order.
          </p>
          <Link to="/shop" className="btn-pink" style={{ padding: '12px 36px', textDecoration: 'none', display: 'inline-block' }}>
            <i className="fas fa-arrow-right me-2"></i> Shop Now
          </Link>
        </div>
      ) : (
        /* ---------- Orders list ---------- */
        <div ref={ordersRef} className={`d-flex flex-column gap-4 stagger ${ordersVis ? 'is-visible' : ''}`}>
          {orders.map((order) => {
            const isExpanded = expandedOrder === order.id;
            const items = order.order_items || [];

            return (
              <div key={order.id} className="admin-card" style={{
                overflow: 'hidden', borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}>
                {/* Order header */}
                <div style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  flexWrap: 'wrap', gap: '10px',
                }}>
                  <div>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', marginBottom: '2px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      Order placed
                    </p>
                    <p className="fw-medium" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-small)', margin: 0 }}>
                      {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-end">
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', marginBottom: '2px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      Order #
                    </p>
                    <p className="fw-medium" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-small)', margin: 0, fontFamily: 'monospace' }}>
                      {order.order_number?.length > 12 ? order.order_number.slice(0, 12) + '...' : order.order_number}
                    </p>
                  </div>
                  <div style={{ flex: '1 0 100%' }}>
                    <span className={`ds-badge ${ORDER_CONFIG.badgeMap[order.status] || 'ds-badge--secondary'}`}
                      style={{ fontSize: '0.75rem', padding: '4px 14px' }}>
                      {ORDER_CONFIG.displayLabels[order.status] || order.status}
                    </span>
                  </div>
                </div>

                {/* Order items */}
                <div style={{ padding: '16px 24px' }}>
                  {items.map((item, idx) => {
                    const imgUrl = imageMap[item.product_id];
                    return (
                    <div key={idx} style={{
                      display: 'flex', gap: '16px', alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: idx < items.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    }}>
                      {/* Product image */}
                      <div style={{
                        width: '80px', height: '80px', borderRadius: '12px',
                        background: imgUrl ? 'none' : 'linear-gradient(135deg, var(--pink-50) 0%, var(--pink-100) 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, overflow: 'hidden',
                      }}>
                        {imgUrl ? (
                          <img src={imgUrl} alt={item.product_name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                        ) : (
                          <i className="fas fa-tshirt" style={{ color: 'var(--pink-300)', fontSize: '1.5rem' }}></i>
                        )}
                      </div>
                      {/* Product details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="fw-semibold mb-1" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                          {item.product_name || 'Product'}
                        </p>
                        {item.color && (
                          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem', margin: 0 }}>
                            Color: <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{item.color}</span>
                          </p>
                        )}
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem', margin: 0 }}>
                          Qty: <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{item.quantity}</span>
                        </p>
                      </div>
                      {/* Price */}
                      <div className="text-end" style={{ flexShrink: 0 }}>
                        <p className="fw-semibold mb-0" style={{ color: 'var(--text-primary)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                          {formatPrice(Number(item.price_at_order) * item.quantity)}
                        </p>
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', margin: 0 }}>
                          {formatPrice(Number(item.price_at_order))} / ea
                        </p>
                      </div>
                    </div>
                  );})}
                </div>

                {/* Order footer */}
                <div style={{
                  padding: '16px 24px',
                  borderTop: '1px solid var(--border-subtle)',
                  background: '#fafafa',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  flexWrap: 'wrap', gap: '12px',
                }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Order Total: </span>
                    <span className="fw-bold" style={{ color: 'var(--pink-500)', fontSize: '1.05rem' }}>{formatPrice(order.total)}</span>
                  </div>
                  <button
                    className="btn-pink btn-pink--sm"
                    onClick={() => toggleOrder(order.id)}
                    style={{
                      padding: '10px 24px', minHeight: '40px', borderRadius: '10px',
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                    }}
                  >
                    {isExpanded ? 'Show Less' : 'View Details'}
                    <i className={`fas ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ fontSize: '0.7rem' }}></i>
                  </button>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div style={{
                    borderTop: '1px solid var(--border-subtle)',
                    background: '#fff',
                  }}>
                    <div style={{ padding: '24px' }}>
                      <h6 className="fw-semibold mb-3" style={{ color: 'var(--text-primary)', fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                        <i className="fas fa-receipt me-2" style={{ color: 'var(--pink)' }}></i>
                        Order Summary
                      </h6>

                      {/* Items with full details */}
                      {items.map((item, idx) => {
                        const imgUrl = imageMap[item.product_id];
                        return (
                        <div key={idx} style={{
                          display: 'flex', gap: '16px', padding: '12px 0',
                          borderBottom: idx < items.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                        }}>
                          <div style={{
                            width: '72px', height: '72px', borderRadius: '10px',
                            background: imgUrl ? 'none' : 'linear-gradient(135deg, var(--pink-50) 0%, var(--pink-100) 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, overflow: 'hidden',
                          }}>
                            {imgUrl ? (
                              <img src={imgUrl} alt={item.product_name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                            ) : (
                              <i className="fas fa-tshirt" style={{ color: 'var(--pink-300)', fontSize: '1.3rem' }}></i>
                            )}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p className="fw-semibold mb-1" style={{ color: 'var(--text-primary)', fontSize: '0.88rem' }}>
                              {item.product_name || 'Product'}
                            </p>
                            {item.color && (
                              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem', marginBottom: '2px' }}>
                                Color: <span style={{ color: 'var(--text-secondary)' }}>{item.color}</span>
                              </p>
                            )}
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem', margin: 0 }}>
                              Quantity: <span style={{ color: 'var(--text-secondary)' }}>{item.quantity}</span>
                            </p>
                          </div>
                          <div className="text-end" style={{ flexShrink: 0 }}>
                            <p className="fw-semibold mb-0" style={{ color: 'var(--text-primary)', fontSize: '0.88rem' }}>
                              {formatPrice(Number(item.price_at_order) * item.quantity)}
                            </p>
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', margin: 0 }}>
                              {formatPrice(Number(item.price_at_order))} / ea
                            </p>
                          </div>
                          </div>
                        );})}

                        {/* Summary table */}
                      <div style={{
                        marginTop: '20px', padding: '16px', borderRadius: '12px',
                        background: 'var(--pink-50)',
                      }}>
                        <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.82rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Items</span>
                          <span className="fw-medium" style={{ color: 'var(--text-primary)' }}>{items.length}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.82rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Order Date</span>
                          <span className="fw-medium" style={{ color: 'var(--text-primary)' }}>
                            {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.82rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Order Number</span>
                          <span className="fw-medium" style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{order.order_number}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.82rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Status</span>
                          <span>
                            <span className={`ds-badge ${ORDER_CONFIG.badgeMap[order.status] || 'ds-badge--secondary'}`}
                              style={{ fontSize: '0.7rem', padding: '3px 10px' }}>
                              {ORDER_CONFIG.displayLabels[order.status] || order.status}
                            </span>
                          </span>
                        </div>
                        <hr style={{ margin: '12px 0', borderColor: 'var(--border-subtle)', opacity: 0.6 }} />
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Total</span>
                          <span className="fw-bold" style={{ color: 'var(--pink-500)', fontSize: '1.05rem' }}>{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Sign Out */}
      <div className="text-center" style={{ marginTop: 'var(--space-7)', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-5)' }}>
        <button
          className="btn-pink btn-pink--outline"
          onClick={handleLogout}
          style={{
            padding: '14px 48px', minHeight: '48px',
            borderColor: 'var(--pink-300)', color: 'var(--pink-500)',
            borderRadius: '12px',
          }}
        >
          <i className="fas fa-sign-out-alt me-2"></i> Sign Out
        </button>
      </div>
    </div>
  );
}
