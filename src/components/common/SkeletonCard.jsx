import React from 'react';

export default function SkeletonCard({ count = 4 }) {
  return (
    <div className="row g-4 mx-0">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="col-6 col-md-4 col-lg-3">
          <div className="product-card overflow-hidden">
            <div className="skeleton skeleton--image" />
            <div className="product-card__body" style={{ padding: '14px 16px 16px' }}>
              <div className="skeleton skeleton--title" />
              <div className="d-flex justify-content-between align-items-center">
                <div className="skeleton" style={{ width: '50px', height: '18px' }} />
                <div className="skeleton" style={{ width: '44px', height: '44px', borderRadius: '9999px' }} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
