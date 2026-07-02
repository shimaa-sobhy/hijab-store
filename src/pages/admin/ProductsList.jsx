import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllAdminProducts, archiveProduct, restoreProduct } from '../../services/productsService.js';
import Loader from '../../components/common/Loader.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true); setError(null);
    fetchAllAdminProducts().then(setProducts).catch((err) => setError(err.message)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleArchive = async (id, name) => {
    if (!window.confirm(`Are you sure you want to archive "${name}"? It will be hidden from customers.`)) return;
    try { await archiveProduct(id); load(); } catch (err) { alert(err.message); }
  };

  const handleRestore = async (id, name) => {
    try { await restoreProduct(id); load(); } catch (err) { alert(err.message); }
  };

  const filtered = products.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 admin-stack-sm" style={{ gap: '12px' }}>
        <h1 className="fw-bold mb-0 admin-heading" style={{ color: 'var(--text-primary)' }}>Products</h1>
        <Link to="/admin/products/new" className="btn-pink"><i className="fas fa-plus me-1"></i> Add Product</Link>
      </div>

      <div className="mb-4">
        <input type="text" className="form-control ds-input admin-full-sm" style={{ maxWidth: '300px' }} placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="admin-card p-5 text-center" style={{ color: 'var(--text-tertiary)' }}>
          <i className="fas fa-box-open" style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block', color: 'var(--pink)' }}></i>
          <p>No products found</p>
        </div>
      ) : (
        <div className="admin-card p-0">
          <div className="admin-table-wrap">
            <table className="ds-table">
              <thead>
                <tr><th>Name</th><th>Price</th><th>Variants</th><th>Stock</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} style={{ opacity: p.is_active ? 1 : 0.6 }}>
                    <td><Link to={`/admin/products/${p.id}/edit`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500, display: 'block', padding: '2px 0' }}>{p.name}</Link></td>
                    <td>${Number(p.price).toFixed(2)}</td>
                    <td><span className="ds-badge ds-badge--primary">{(p.product_variants || []).length}</span></td>
                    <td style={{ color: p.stock <= 5 ? 'var(--error-text)' : 'inherit', fontWeight: p.stock <= 5 ? 600 : 400 }}>{p.stock ?? '—'}</td>
                    <td>
                      {p.is_active ? (
                        <span className="ds-badge ds-badge--success">Active</span>
                      ) : (
                        <span className="ds-badge ds-badge--secondary">Archived</span>
                      )}
                    </td>
                    <td>
                      <div className="admin-table-actions justify-content-end">
                        <Link to={`/admin/products/${p.id}/edit`} className="btn-pink btn-pink--sm"><i className="fas fa-edit"></i> Edit</Link>
                        {p.is_active ? (
                          <button className="btn-pink btn-pink--sm btn-pink--outline" onClick={() => handleArchive(p.id, p.name)} style={{ borderColor: 'var(--error-border)', color: 'var(--error-text)' }}><i className="fas fa-archive"></i> Archive</button>
                        ) : (
                          <button className="btn-pink btn-pink--sm" onClick={() => handleRestore(p.id, p.name)}><i className="fas fa-undo"></i> Restore</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
