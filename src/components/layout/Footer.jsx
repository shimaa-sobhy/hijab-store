import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSettings } from '../../services/settingsService.js';
import './layout.css';

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSettings().then(setSettings).catch(() => {});
  }, []);

  return (
    <footer className="ds-footer">
      <div className="ds-footer__inner">
        <div className="ds-footer__grid">
          <div className="ds-footer__col ds-footer__col--brand">
            <h4 className="ds-footer__brand">{settings?.brand_name || 'VEIL LUXE'}</h4>
            <p className="ds-footer__about"><i className="fas fa-heart ds-footer__heart"></i> Curated elegance for the modern woman. Premium hijabs crafted with care, designed to inspire confidence and grace.</p>
            <div className="ds-footer__social">
              {settings?.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                  <i className="fab fa-whatsapp"></i>
                </a>
              )}
              {settings?.instagram && (
                <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noreferrer" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              )}
            </div>
          </div>
          <div className="ds-footer__col">
            <h6 className="ds-footer__heading">Shop</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li><Link to="/shop" className="ds-footer__link">All Products</Link></li>
              <li><Link to="/cart" className="ds-footer__link">Shopping Cart</Link></li>
            </ul>
          </div>
          <div className="ds-footer__col">
            <h6 className="ds-footer__heading">Account</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li><Link to="/login" className="ds-footer__link">Sign In</Link></li>
              <li><Link to="/account/orders" className="ds-footer__link">My Orders</Link></li>
            </ul>
          </div>
          <div className="ds-footer__col">
            <h6 className="ds-footer__heading">Connect</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li><Link to="/contact" className="ds-footer__link">Contact Us</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="ds-footer__bottom">
        <div className="ds-footer__bottom-inner">
          <p className="ds-footer__copyright">&copy; {new Date().getFullYear()} {settings?.brand_name || 'VEIL LUXE'} &mdash; All rights reserved</p>
          <p className="ds-footer__credit">Designed and developed by Shimaa Zahra <i className="fas fa-heart ds-footer__credit-heart"></i></p>
        </div>
      </div>
    </footer>
  );
}
