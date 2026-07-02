import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOrderById, updateOrderStatus } from '../../services/ordersService.js';
import Loader from '../../components/common/Loader.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import { formatPrice } from '../../utils/formatPrice.js';
import { ORDER_CONFIG } from '../../utils/constants.js';
import { toast } from 'react-toastify';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const load = () => {
    setLoading(true); setError(null);
    fetchOrderById(id).then(setOrder).catch((err) => setError(err.message)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await updateOrderStatus(order.id, newStatus);
      setOrder((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Order moved to ${ORDER_CONFIG.displayLabels[newStatus]}`);
    } catch (err) { toast.error(err.message); }
    finally { setUpdating(false); }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;
  if (!order) return <div className="admin-card p-5 text-center"><p>Order not found</p></div>;

  const stepIdx = ORDER_CONFIG.stepIndex[order.status];
  const isTerminal = order.status === 'delivered' || order.status === 'cancelled';
  const allowedTransitions = ORDER_CONFIG.transitions[order.status] || {};

  const renderProgress = () => {
    const steps = ORDER_CONFIG.workflowSteps;
    const isCancelled = order.status === 'cancelled';

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', padding: '1.5rem 0', position: 'relative' }}>
        {steps.map((step, i) => {
          const isCompleted = !isCancelled && stepIdx !== undefined && i < stepIdx;
          const isCurrent = !isCancelled && stepIdx !== undefined && i === stepIdx;
          const isFuture = !isCancelled && stepIdx !== undefined && i > stepIdx;
          const isPastOnCancel = isCancelled && stepIdx !== undefined && i <= stepIdx;

          let circleBg, circleColor;
          if (isCompleted || isPastOnCancel) {
            circleBg = isCancelled ? 'var(--text-tertiary)' : 'var(--success-text)';
            circleColor = '#fff';
          } else if (isCurrent) {
            circleBg = 'var(--pink)';
            circleColor = '#fff';
          } else {
            circleBg = '#E8E8E8';
            circleColor = 'var(--text-tertiary)';
          }

          return (
            <React.Fragment key={step.key}>
              {i > 0 && (
                <div style={{
                  flex: 1, height: '3px',
                  background: isCompleted || (isCancelled && stepIdx !== undefined && i - 1 < stepIdx) ? (isCancelled ? 'var(--text-tertiary)' : 'var(--success-text)') : '#E8E8E8',
                  margin: '0 4px',
                  borderRadius: '2px',
                }} />
              )}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: circleBg, color: circleColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700,
                  transition: 'all 0.3s',
                  boxShadow: isCurrent ? '0 0 0 4px rgba(240,168,168,0.25)' : 'none',
                }}>
                  {isCompleted ? <i className="fas fa-check" style={{ fontSize: '0.7rem' }}></i> : (isCurrent ? <i className="fas fa-circle" style={{ fontSize: '0.5rem' }}></i> : i + 1)}
                </div>
                <span style={{
                  fontSize: '0.75rem', fontWeight: isCurrent ? 600 : 400,
                  color: isCurrent ? 'var(--pink)' : (isCompleted ? 'var(--success-text)' : 'var(--text-tertiary)'),
                  whiteSpace: 'nowrap',
                }}>{step.label}</span>
              </div>
            </React.Fragment>
          );
        })}

        {isCancelled && (
          <>
            <div style={{ flex: 1, height: '3px', background: 'var(--error-text)', margin: '0 4px', borderRadius: '2px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%',
                background: 'var(--error-text)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700,
              }}>
                <i className="fas fa-times" style={{ fontSize: '0.7rem' }}></i>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--error-text)', whiteSpace: 'nowrap' }}>Cancelled</span>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div>
      <Link to="/admin/orders" className="btn-pink btn-pink--outline mb-4" style={{ display: 'inline-block' }}>&larr; Back to Orders</Link>

      <div className="d-flex justify-content-between align-items-start mb-4">
        <h1 className="fw-bold mb-0" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-h2)' }}>
          Order #{order.order_number?.slice(0, 8) || order.id?.slice(0, 8)}
        </h1>
        <span className={`ds-badge ${ORDER_CONFIG.badgeMap[order.status] || ''}`} style={{ fontSize: '0.85rem', padding: '6px 16px' }}>
          {ORDER_CONFIG.displayLabels[order.status] || order.status}
        </span>
      </div>

      <div className="admin-card p-4 mb-4">
        <h6 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>Order Progress</h6>
        {renderProgress()}
        {!isTerminal && (
          <div className="d-flex gap-2 justify-content-center mt-3 flex-wrap">
            {Object.entries(allowedTransitions).map(([nextStatus, actionLabel]) => (
              <button
                key={nextStatus}
                className={`btn-pink btn-pink--sm ${nextStatus === 'cancelled' ? 'btn-pink--outline' : ''}`}
                disabled={updating}
                onClick={() => handleStatusChange(nextStatus)}
              >
                {updating ? 'Updating...' : actionLabel}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="admin-card p-4">
            <h6 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>Customer Details</h6>
            <table className="ds-table">
              <tbody>
                <tr><td className="fw-semibold" style={{ width: '120px' }}>Name</td><td>{order.customer_name}</td></tr>
                <tr><td className="fw-semibold">Phone</td><td>{order.phone}</td></tr>
                <tr><td className="fw-semibold">Address</td><td>{order.address}</td></tr>
                <tr><td className="fw-semibold">City</td><td>{order.city || '—'}</td></tr>
                {order.notes && <tr><td className="fw-semibold">Notes</td><td>{order.notes}</td></tr>}
                <tr><td className="fw-semibold">Date</td><td>{new Date(order.created_at).toLocaleDateString()}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-md-6">
          <div className="admin-card p-4">
            <h6 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>Order Summary</h6>
            <table className="ds-table">
              <tbody>
                <tr><td className="fw-semibold" style={{ width: '120px' }}>Items</td><td>{(order.order_items || []).length}</td></tr>
                <tr><td className="fw-semibold">Total</td><td style={{ color: 'var(--pink)', fontWeight: 700, fontSize: 'var(--fs-h5)' }}>{formatPrice(order.total)}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="admin-card p-4">
        <h6 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>Order Items</h6>
        <div className="table-responsive">
          <table className="ds-table">
            <thead><tr><th>Product</th><th>Color</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
            <tbody>
              {(order.order_items || []).map((item, i) => (
                <tr key={i}>
                  <td>{item.product_name || item.name}</td>
                  <td>{item.color || '—'}</td>
                  <td>{item.quantity}</td>
                  <td>{formatPrice(Number(item.price_at_order || item.price))}</td>
                  <td className="fw-semibold">{formatPrice(Number(item.price_at_order || item.price) * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
