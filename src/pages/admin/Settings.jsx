import React, { useEffect, useState } from 'react';
import { getSettings, updateSettings } from '../../services/settingsService.js';
import Loader from '../../components/common/Loader.jsx';
import { toast } from '../../utils/toast.jsx';

export default function Settings() {
  const [settings, setSettings] = useState({ brand_name: '', whatsapp: '', instagram: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings().then((s) => { if (s) setSettings(s); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setSettings((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await updateSettings(settings); toast.success('Settings saved', 'Saved'); } catch (err) { toast.error(err.message); }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="fw-bold mb-4 admin-heading" style={{ color: 'var(--text-primary)' }}>Settings</h1>
      <div className="admin-card p-4 p-md-5" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 mb-md-4">
            <label className="ds-label">Brand Name</label>
            <input type="text" name="brand_name" className="form-control" value={settings.brand_name ?? ''} onChange={handleChange} style={{ minHeight: '48px' }} />
          </div>

          <div className="mb-3 mb-md-4">
            <label className="ds-label">WhatsApp Number</label>
            <input type="text" name="whatsapp" className="form-control" value={settings.whatsapp ?? ''} onChange={handleChange} placeholder="1234567890" style={{ minHeight: '48px' }} />
          </div>
          <div className="mb-4">
            <label className="ds-label">Instagram Handle</label>
            <input type="text" name="instagram" className="form-control" value={settings.instagram ?? ''} onChange={handleChange} placeholder="yourhandle" style={{ minHeight: '48px' }} />
          </div>
          <button type="submit" className="btn-pink admin-full-sm" style={{ minHeight: '48px' }}>Save Settings</button>
        </form>
      </div>
    </div>
  );
}
