import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSettings } from '../../services/settingsService.js';
import './layout.css';

const socialLinks = [
  { key: 'facebook', icon: 'fab fa-facebook-f', label: 'Facebook', href: 'https://www.facebook.com' },
  { key: 'instagram', icon: 'fab fa-instagram', label: 'Instagram', href: 'https://www.instagram.com' },
  { key: 'pinterest', icon: 'fab fa-pinterest-p', label: 'Pinterest', href: 'https://www.pinterest.com' },
];

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSettings().then(setSettings).catch(() => {});
  }, []);

  const resolvedLinks = socialLinks.map((link) => {
    if (link.key === 'instagram' && settings?.instagram) {
      return { ...link, href: `https://www.instagram.com/${settings.instagram}` };
    }
    return link;
  });

  return (
    <footer className="ds-footer">
      <div className="ds-footer__inner">
        <div className="ds-footer__grid">
          <div className="ds-footer__col ds-footer__col--brand">
            <h4 className="ds-footer__brand"><i className="fas fa-gem ds-footer__brand-icon"></i> {settings?.brand_name || 'VEIL LUXE'}</h4>
            <p className="ds-footer__about"><i className="fas fa-heart ds-footer__heart"></i> Curated elegance for the modern woman. Premium hijabs crafted with care, designed to inspire confidence and grace.</p>
            <div className="ds-footer__social">
              {settings?.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <i className="fab fa-whatsapp"></i>
                </a>
              )}
              {resolvedLinks.map((link) => (
                <a key={link.key} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                  <i className={link.icon}></i>
                </a>
              ))}
            </div>
          </div>
          <div className="ds-footer__col">
            <h6 className="ds-footer__heading"><i className="fas fa-store ds-footer__heading-icon"></i> Shop</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li><Link to="/shop" className="ds-footer__link"><i className="fas fa-tag ds-footer__link-icon"></i> All Products</Link></li>
              <li><Link to="/cart" className="ds-footer__link"><i className="fas fa-shopping-bag ds-footer__link-icon"></i> Shopping Cart</Link></li>
            </ul>
          </div>
          <div className="ds-footer__col">
            <h6 className="ds-footer__heading"><i className="fas fa-user ds-footer__heading-icon"></i> Account</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li><Link to="/login" className="ds-footer__link"><i className="fas fa-sign-in-alt ds-footer__link-icon"></i> Sign In</Link></li>
              <li><Link to="/account" className="ds-footer__link"><i className="fas fa-id-card ds-footer__link-icon"></i> My Account</Link></li>
            </ul>
          </div>
          <div className="ds-footer__col">
            <h6 className="ds-footer__heading"><i className="fas fa-envelope ds-footer__heading-icon"></i> Connect</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li><Link to="/contact" className="ds-footer__link"><i className="fas fa-paper-plane ds-footer__link-icon"></i> Contact Us</Link></li>
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
