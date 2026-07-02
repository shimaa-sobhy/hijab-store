import React from 'react';

export default function StatsCard({ icon, value, color = 'var(--pink-400)', title }) {
  return (
    <div className="stats-card-wrap">
      <div className="admin-card d-flex align-items-center gap-3 p-4" style={{ minHeight: '100%' }}>
        <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0" style={{ width: '52px', height: '52px', backgroundColor: color, color: '#fff', fontSize: '1.2rem' }}>
          <i className={`fas ${icon}`}></i>
        </div>
        <div className="min-w-0">
          <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-caption)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{title}</div>
          <div style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-h3)', fontWeight: 700, wordBreak: 'break-word' }}>{value}</div>
        </div>
      </div>
    </div>
  );
}
