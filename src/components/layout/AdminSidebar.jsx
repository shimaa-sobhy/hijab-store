import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import './layout.css';

const links = [
  { to: '/admin', label: 'Dashboard', icon: 'fa-gauge', end: true },
  { to: '/admin/products', label: 'Products', icon: 'fa-box' },
  { to: '/admin/orders', label: 'Orders', icon: 'fa-receipt' },
  { to: '/admin/settings', label: 'Settings', icon: 'fa-gear' },
];

export default function AdminSidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <aside className="admin-sidebar">
      <Link to="/admin" className="admin-sidebar__brand">VEIL <span style={{ color: 'var(--pink)' }}>LUXE</span></Link>
      <nav className="admin-sidebar__nav">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `admin-sidebar__link ${isActive ? 'is-active' : ''}`}>
            <i className={`fas ${l.icon}`}></i>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
      <div style={{ padding: 'var(--space-4)', marginTop: 'auto', borderTop: '1px solid var(--border-subtle)' }}>
        <button onClick={handleLogout} className="admin-sidebar__link" style={{ width: '100%', border: 'none', cursor: 'pointer' }}>
          <i className="fas fa-right-from-bracket"></i>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
