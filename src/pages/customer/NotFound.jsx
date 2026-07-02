import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="ds-container section-premium text-center" style={{ maxWidth: '500px' }}>
      <h1 className="fw-bold mb-2" style={{ color: 'var(--pink)', fontSize: '5rem' }}>404</h1>
      <p className="mb-5" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-pink">Back to Home</Link>
    </div>
  );
}
