import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDashboardStats, fetchNewOrders } from '../../services/ordersService.js';
import { fetchLowStockVariants } from '../../services/productsService.js';
import StatsCard from '../../components/admin/StatsCard.jsx';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalOrders: 0, totalSales: 0, totalProducts: 0, lowStockCount: 0 });
  const [newOrders, setNewOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    fetchDashboardStats().then(setStats).catch(() => {});
    fetchNewOrders().then(setNewOrders).catch(() => {});
    fetchLowStockVariants(5).then(setLowStock).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="fw-bold mb-4" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-h2)' }}>Dashboard</h1>
      <div className="row g-4 mb-5">
        <div className="col-md-4"><StatsCard title="Products" value={stats.totalProducts} icon="fa-box" /></div>
        <div className="col-md-4"><StatsCard title="Orders" value={stats.totalOrders} icon="fa-shopping-cart" /></div>
        <div className="col-md-4"><StatsCard title="Revenue" value={`$${stats.totalSales.toFixed(2)}`} icon="fa-dollar-sign" /></div>
      </div>

      {newOrders.length > 0 && (
        <div className="admin-card p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>New Orders</h5>
            <span className="ds-badge ds-badge--secondary">Latest</span>
          </div>
          <div className="table-responsive">
            <table className="ds-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {newOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="fw-semibold">#{o.order_number?.slice(0, 8) || o.id?.slice(0, 8)}</td>
                    <td>{o.customer_name}</td>
                    <td>{o.phone}</td>
                    <td>${Number(o.total).toFixed(2)}</td>
                    <td style={{ fontSize: '0.85rem' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="text-end">
                      <Link to={`/admin/orders/${o.id}`} className="btn-pink btn-pink--sm">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-end mt-3">
            <Link to="/admin/orders" className="btn-pink btn-pink--outline btn-pink--sm">View All Orders</Link>
          </div>
        </div>
      )}

      <div className="admin-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>Low Stock Alerts</h5>
          {lowStock.length > 0 && <span className="ds-badge ds-badge--danger">{stats.lowStockCount}</span>}
        </div>
          {lowStock.length === 0 ? (
          <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-small)' }}>All products are well-stocked.</p>
        ) : (
          <div className="table-responsive">
            <table className="ds-table">
              <thead><tr><th>Product</th><th>Color</th><th>Stock</th></tr></thead>
              <tbody>{lowStock.map((v) => <tr key={v.id}><td>{v.products?.name || '—'}</td><td>{v.color || '—'}</td><td className="fw-semibold" style={{ color: 'var(--error-text)' }}>{v.stock}</td></tr>)}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
