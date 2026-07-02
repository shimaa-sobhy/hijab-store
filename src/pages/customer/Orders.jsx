import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { formatPrice } from '../../utils/formatPrice.js';
import { fetchMyOrders } from '../../services/ordersService.js';
import { ORDER_CONFIG } from '../../utils/constants.js';
import Loader from '../../components/common/Loader.jsx';
import useScrollReveal from '../../hooks/useScrollReveal.js';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [headerRef, headerVis] = useScrollReveal();
  const [tableRef, tableVis] = useScrollReveal({ threshold: 0.05 });

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchMyOrders(user.id)
      .then(setOrders)
      .catch((err) => console.error('Failed to load orders', err))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="ds-container section-premium"><Loader /></div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="ds-container section-premium" style={{ paddingTop: 'var(--space-6)' }}>
      <div ref={headerRef} className={`text-center mb-5 reveal ${headerVis ? 'is-visible' : ''}`}>
        <p className="ds-text-xs" style={{ color: 'var(--pink)', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          — My Orders —
        </p>
        <h1 className="fw-bold" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-h2)' }}>Order History</h1>
        <div className="pink-divider pink-divider--center" style={{ marginTop: '1rem' }} />
      </div>

      <div ref={tableRef} className={`admin-card p-4 p-md-5 reveal ${tableVis ? 'is-visible' : ''}`}>
        {orders.length === 0 ? (
          <div className="text-center py-5" style={{ color: 'var(--text-secondary)' }}>
            <i className="fas fa-box-open" style={{ fontSize: '3rem', color: 'var(--pink)', marginBottom: '1.5rem', display: 'block' }}></i>
            <p>No orders yet</p>
            <Link to="/shop" className="btn-pink mt-3" style={{ display: 'inline-block', padding: '12px 36px' }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="ds-table stagger" style={{ marginBottom: 0 }}>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="fw-semibold">#{o.order_number?.slice(0, 8)}</td>
                    <td>{formatPrice(o.total)}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                    <td><span className={`ds-badge ${ORDER_CONFIG.badgeMap[o.status] || 'ds-badge--secondary'}`}>{ORDER_CONFIG.displayLabels[o.status] || o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
