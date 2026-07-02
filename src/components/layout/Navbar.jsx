import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useCart } from '../../hooks/useCart.js';
import './layout.css';

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [scrollY, setScrollY] = useState(() => window.scrollY);
  const scrolled = !isHome || scrollY > 60;
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 992) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest('.ds-nav__user')) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userMenuOpen]);

  const handleLogout = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className={`ds-nav ${scrolled ? 'ds-nav--scrolled' : ''}`}>
      <div className="ds-container ds-nav__inner">
        <Link to="/" className="ds-nav__brand">
          VEIL <span style={{ color: 'var(--pink)' }}>LUXE</span>
        </Link>

        <nav className="ds-nav__links">
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `ds-nav__link ${isActive ? 'is-active' : ''}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="ds-nav__actions">
          <Link to="/cart" className="ds-nav__icon-btn" aria-label="Shopping bag">
            <i className="fas fa-shopping-bag"></i>
            {totalItems > 0 && <span className="ds-nav__badge">{totalItems}</span>}
          </Link>

          {user ? (
            <div className="ds-nav__user">
              <button className="ds-nav__icon-btn" onClick={() => setUserMenuOpen((v) => !v)} aria-label="Account">
                <i className="fas fa-user"></i>
              </button>
              {userMenuOpen && (
                <div className="ds-nav__dropdown">
                  <Link to="/account" onClick={() => setUserMenuOpen(false)}>My Account</Link>
                  <Link to="/account/orders" onClick={() => setUserMenuOpen(false)}>My Orders</Link>
                  <hr />
                  <button onClick={handleLogout}>Sign Out</button>
                </div>
              )}
            </div>
          ) : scrolled ? (
            <Link to="/login" className="btn-pink btn-pink--sm">Sign In</Link>
          ) : (
            <Link to="/login" className="btn-hero btn-hero--sm">Sign In</Link>
          )}

          <button className="ds-nav__burger" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className={`ds-nav__mobile ${menuOpen ? 'is-open' : ''}`}>
        {navLinks.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setMenuOpen(false)} className={({ isActive }) => `ds-nav__mobile-link ${isActive ? 'is-active' : ''}`}>
            {l.label}
          </NavLink>
        ))}
        {user ? (
          <>
            <Link to="/account" onClick={() => setMenuOpen(false)} className="ds-nav__mobile-link">My Account</Link>
            <Link to="/account/orders" onClick={() => setMenuOpen(false)} className="ds-nav__mobile-link">My Orders</Link>
            <button className="ds-nav__mobile-link" onClick={handleLogout}>Sign Out</button>
          </>
        ) : (
          <Link to="/login" onClick={() => setMenuOpen(false)} className="ds-nav__mobile-link">Sign In</Link>
        )}
      </div>
    </header>
  );
}
