import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { toast } from '../../utils/toast.jsx';
import PasswordInput from '../../components/common/PasswordInput.jsx';
import useScrollReveal from '../../hooks/useScrollReveal.js';

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', full_name: '' });
  const [submitting, setSubmitting] = useState(false);
  const [revealRef, vis] = useScrollReveal();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signUp({ email: form.email, password: form.password, full_name: form.full_name });
      toast.success('Account created! Check your email to confirm.', 'Account Created');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ds-container section-premium" style={{ maxWidth: '440px' }}>
      <div ref={revealRef} className={`admin-card p-4 p-md-5 reveal ${vis ? 'is-visible' : ''}`}>
        <div className="pink-divider pink-divider--center" style={{ marginBottom: '1.5rem' }} />
        <h1 className="fw-bold mb-1" style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.5rem, 5vw, var(--fs-h2))' }}>Create Account</h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-small)', marginBottom: '1.5rem' }}>Join us for a premium shopping experience.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="ds-label">Full Name</label>
            <input type="text" name="full_name" className="form-control" placeholder="Your full name" value={form.full_name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="ds-label">Email</label>
            <input type="email" name="email" className="form-control" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label className="ds-label">Password</label>
            <PasswordInput name="password" value={form.password} onChange={handleChange} placeholder="Create a password" required minLength={6} />
          </div>
          <button type="submit" className="btn-pink btn-pink--block mb-3" disabled={submitting}>
            {submitting ? <><span className="spinner-border spinner-border-sm me-2"></span> Creating Account...</> : 'Create Account'}
          </button>
          <p className="text-center mb-0" style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-small)' }}>
            Already have an account? <Link to="/login" className="fw-semibold" style={{ color: 'var(--pink)' }}>Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
