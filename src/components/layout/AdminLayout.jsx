import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';

const pageTitles = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/orders': 'Orders',
  '/admin/settings': 'Settings',
};

function DesktopRequired() {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#FAFAFA', padding: '24px' }}>
      <div className="text-center p-4 p-md-5 rounded-3" style={{ maxWidth: '480px', width: '100%', background: '#fff', border: '1px solid var(--border-subtle)' }}>
        <div className="d-flex align-items-center justify-content-center mx-auto mb-4 rounded-3" style={{ width: '80px', height: '80px', background: 'var(--pink-100)', color: 'var(--pink)' }}>
          <i className="fas fa-desktop" style={{ fontSize: '2rem' }}></i>
        </div>
        <h2 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>Desktop Required</h2>
        <p className="mb-4" style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-small)', lineHeight: 'var(--lh-relaxed)', maxWidth: '360px', margin: '0 auto' }}>
          This Admin Dashboard is available only on desktop devices for the best management experience.
        </p>
        <p className="mb-4" style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-small)' }}>
          Please open this page from a laptop or desktop computer.
        </p>
        <Link to="/" className="btn-pink" style={{ textDecoration: 'none' }}>
          <i className="fas fa-arrow-left me-1"></i> Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const location = useLocation();
  const title = Object.entries(pageTitles).find(([path]) => location.pathname.startsWith(path))?.[1] || 'Admin';

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 992);
    const checkWidth = () => setIsDesktop(window.innerWidth >= 992);
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (!isDesktop) return <DesktopRequired />;

  return (
    <div className="admin-layout">
      <div className="admin-topbar">
        <button className="admin-topbar__burger" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
          <i className="fas fa-bars"></i>
        </button>
        <h5 className="admin-topbar__title">{title}</h5>
      </div>

      <div className={`admin-overlay${sidebarOpen ? ' is-visible' : ''}`} onClick={() => setSidebarOpen(false)} />

      <AdminSidebar open={sidebarOpen} onNavClick={() => setSidebarOpen(false)} onClose={() => setSidebarOpen(false)} />

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
