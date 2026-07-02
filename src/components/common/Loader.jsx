import React from 'react';

export default function Loader({ fullPage = false, small = false }) {
  if (small) {
    return (
      <div className="d-flex justify-content-center py-2">
        <div className="spinner-border spinner-border-sm ds-text-pink" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <div className={`d-flex flex-column align-items-center justify-content-center ${fullPage ? 'vh-100' : 'py-5'}`}>
      <div className="spinner-border ds-text-pink" style={{ width: '2.5rem', height: '2.5rem' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2 ds-text-tertiary">Loading...</p>
    </div>
  );
}
