import React from 'react';

export default function Loader({ fullPage = false, small = false }) {
  if (small) {
    return (
      <div className="ds-loader ds-loader--small">
        <div className="ds-loader__spinner" />
      </div>
    );
  }
  return (
    <div className={`ds-loader ${fullPage ? 'ds-loader--full' : 'ds-loader--inline'}`}>
      <div className="ds-loader__logo">
        VEIL <span>LUXE</span>
      </div>
      <div className="ds-loader__bar" />
    </div>
  );
}
