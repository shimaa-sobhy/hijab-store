import React from 'react';

export default function ErrorMessage({ message = 'An unexpected error occurred', onRetry }) {
  return (
    <div className="text-center py-5">
      <i className="fas fa-triangle-exclamation fs-1 mb-3" style={{ color: 'var(--error-text)' }}></i>
      <p className="ds-text-muted">{message}</p>
      {onRetry && (
        <button className="btn-luxury btn-luxury--sm" onClick={onRetry}>Try Again</button>
      )}
    </div>
  );
}
