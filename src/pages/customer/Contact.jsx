import React from 'react';
import { Link } from 'react-router-dom';
import { getSettings } from '../../services/settingsService.js';

export default function Contact() {
  const [settings, setSettings] = React.useState(null);
  React.useEffect(() => { getSettings().then(setSettings).catch(() => {}); }, []);

  return (
    <div className="ds-container section-premium text-center" style={{ maxWidth: '700px' }}>
      <div className="pink-divider pink-divider--center" style={{ marginBottom: '2rem' }} />
      <h1 className="fw-bold mb-1" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-h2)' }}>Contact Us</h1>
      <p className="mb-5" style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-body)', maxWidth: '480px', margin: '0 auto 3rem' }}>
        We're here to help. Get in touch via WhatsApp or Instagram.
      </p>
      <div className="d-flex justify-content-center gap-4 flex-wrap">
        <a
          href={settings?.whatsapp ? `https://wa.me/${settings.whatsapp}` : 'https://wa.me/'}
          target="_blank"
          className="btn-pink btn-pink--lg"
          rel="noreferrer"
        >
          <i className="fab fa-whatsapp me-2"></i> WhatsApp
        </a>
        <a
          href={settings?.instagram ? `https://instagram.com/${settings.instagram}` : 'https://instagram.com/'}
          target="_blank"
          className="btn-pink btn-pink--lg btn-pink--outline"
          rel="noreferrer"
        >
          <i className="fab fa-instagram me-2"></i> Instagram
        </a>
      </div>
    </div>
  );
}
