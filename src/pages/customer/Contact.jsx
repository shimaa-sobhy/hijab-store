import React from 'react';
import useScrollReveal from '../../hooks/useScrollReveal.js';

export default function Contact() {
  const [revealRef, vis] = useScrollReveal();

  return (
    <div className="ds-container section-premium text-center" style={{ maxWidth: '700px' }}>
      <div ref={revealRef} className={`reveal ${vis ? 'is-visible' : ''}`}>
        <div className="pink-divider pink-divider--center" style={{ marginBottom: '2rem' }} />
        <h1 className="fw-bold mb-1" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-h2)' }}>Contact Us</h1>
        <p className="mb-5" style={{
          color: 'var(--text-tertiary)', fontSize: 'var(--fs-body)',
          maxWidth: '480px', margin: '0 auto 3rem',
        }}>
          We're here to help. Get in touch via WhatsApp or Instagram.
        </p>
        <div className="d-flex justify-content-center gap-4">
          <a href="https://instagram.com/#" target="_blank" rel="noreferrer" className="ds-contact-social" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://facebook.com/#" target="_blank" rel="noreferrer" className="ds-contact-social" aria-label="Facebook">
            <i className="fab fa-facebook-f"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
