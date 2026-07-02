import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { isValidEgyptianPhone, EGYPTIAN_GOVERNORATES } from '../../utils/validators.js';
import { updateProfile } from '../../services/profileService.js';
import { toast } from 'react-toastify';

export default function Account() {
  const { user, profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.phone && !isValidEgyptianPhone(form.phone)) {
      toast.error('Please enter a valid Egyptian phone number (11 digits starting with 01)');
      return;
    }
    setSubmitting(true);
    try {
      await updateProfile(user.id, form);
      await refreshProfile();
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ds-container section-premium" style={{ maxWidth: '640px' }}>
      <div className="pink-divider" style={{ marginBottom: '2rem' }} />
      <h1 className="fw-bold mb-1" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-h2)' }}>My Account</h1>
      <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-small)', marginBottom: '2rem' }}>Manage your account information</p>

      <div className="mb-4">
        <Link to="/account/orders" className="btn-pink btn-pink--outline btn-pink--sm" style={{ padding: '10px 24px' }}>
          <i className="fas fa-receipt" style={{ marginRight: '6px' }}></i> View My Orders
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="ds-label">Full Name</label>
            <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="ds-label">Phone</label>
            <input type="tel" name="phone" className="form-control" value={form.phone} onChange={handleChange} maxLength={11} />
          </div>
          <div className="col-12">
            <label className="ds-label">Address</label>
            <input type="text" name="address" className="form-control" value={form.address} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="ds-label">City</label>
            <select name="city" className="form-select" value={form.city} onChange={handleChange}>
              <option value="">Select governorate</option>
              {EGYPTIAN_GOVERNORATES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button type="submit" className="btn-pink btn-pink--lg" disabled={submitting}>
            {submitting ? <><span className="spinner-border spinner-border-sm me-2"></span> Saving...</> : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
