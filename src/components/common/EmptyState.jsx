import React from 'react';

export default function EmptyState({ icon = 'fa-box-open', title = 'No data', message, actionLabel, onAction }) {
  return (
    <div className="text-center py-5">
      <i className={`fas ${icon} fs-1 mb-3`} style={{ color: 'var(--pink-200)' }}></i>
      <h5 className="ds-text-primary">{title}</h5>
      {message && <p className="ds-text-muted">{message}</p>}
      {actionLabel && onAction && (
        <button className="btn-luxury btn-luxury--sm mt-2" onClick={onAction}>{actionLabel}</button>
      )}
    </div>
  );
}
