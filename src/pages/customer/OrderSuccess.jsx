import React from 'react';
import { Link, useParams } from 'react-router-dom';

export default function OrderSuccess() {
  const { orderNumber } = useParams();

  return (
    <div className="ds-container section-premium text-center" style={{ maxWidth: '600px' }}>
      <div style={{ fontSize: '3.5rem', color: 'var(--pink)', marginBottom: '1.5rem' }}>
        <i className="fas fa-check-circle"></i>
      </div>
      <h1 className="fw-bold mb-2" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-h2)' }}>Order Confirmed!</h1>
      {orderNumber && (
        <p className="mb-2" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-h5)' }}>
          Order Number: <span className="fw-bold">{orderNumber}</span>
        </p>
      )}
      <p className="mb-5" style={{ color: 'var(--text-secondary)' }}>Thank you for your order. We will contact you shortly to confirm the details.</p>
      <Link to="/shop" className="btn-pink btn-pink--lg">Continue Shopping</Link>
    </div>
  );
}
