import React from 'react';
import { Link } from 'react-router-dom';
import { ORDER_CONFIG } from '../../utils/constants.js';

export default function OrdersTable({ orders }) {
  if (!orders || orders.length === 0) {
    return <div className="admin-card p-5 text-center" style={{ color: 'var(--text-tertiary)' }}>No orders found</div>;
  }

  return (
    <div className="admin-card p-0">
      <div className="admin-table-wrap">
        <table className="ds-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>City</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="fw-semibold">#{o.order_number?.slice(0, 8) || o.id?.slice(0, 8)}</td>
                <td>{o.customer_name}</td>
                <td>{o.city || '—'}</td>
                <td>${Number(o.total).toFixed(2)}</td>
                <td><span className={`ds-badge ${ORDER_CONFIG.badgeMap[o.status] || ''}`}>{ORDER_CONFIG.displayLabels[o.status] || o.status}</span></td>
                <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="admin-table-actions justify-content-end">
                    <Link to={`/admin/orders/${o.id}`} className="btn-pink btn-pink--sm">View</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
