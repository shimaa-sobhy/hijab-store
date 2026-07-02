import React, { useEffect, useState } from 'react';
import { fetchAllOrders } from '../../services/ordersService.js';
import OrdersTable from '../../components/admin/OrdersTable.jsx';
import Loader from '../../components/common/Loader.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';

const tabs = [
  { key: '', label: 'All Orders' },
  { key: 'new', label: 'New' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

const statusFilterMap = {
  new: ['new'],
  processing: ['pending', 'confirmed'],
  shipped: ['shipped'],
  delivered: ['delivered'],
  cancelled: ['cancelled'],
};

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('');

  const load = () => {
    setLoading(true); setError(null);
    fetchAllOrders().then((res) => setOrders(res.orders || [])).catch((err) => setError(err.message)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filterStatuses = statusFilterMap[activeTab] || null;
  const filtered = orders.filter((o) => {
    const matchSearch = !search || o.customer_name?.toLowerCase().includes(search.toLowerCase()) || o.order_number?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatuses || filterStatuses.includes(o.status);
    return matchSearch && matchStatus;
  });

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold mb-0" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-h2)' }}>Orders</h1>
      </div>

      <div className="d-flex gap-3 mb-4 flex-wrap align-items-center">
        <input type="text" className="form-control ds-input" style={{ maxWidth: '250px' }} placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="d-flex gap-1 mb-4 flex-wrap" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: 'var(--fs-small)',
              fontWeight: activeTab === tab.key ? 600 : 400,
              color: activeTab === tab.key ? 'var(--pink)' : 'var(--text-secondary)',
              borderBottom: activeTab === tab.key ? '2px solid var(--pink)' : '2px solid transparent',
              marginBottom: '-1px',
              transition: 'color 0.2s, border-color 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="admin-card p-5 text-center" style={{ color: 'var(--text-tertiary)' }}>
          <i className="fas fa-inbox" style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block', color: 'var(--pink)' }}></i>
          <p>No orders found</p>
        </div>
      ) : (
        <OrdersTable orders={filtered} />
      )}
    </div>
  );
}
