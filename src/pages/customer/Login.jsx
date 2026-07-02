import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { toast } from '../../utils/toast.jsx';
import PasswordInput from '../../components/common/PasswordInput.jsx';
import useScrollReveal from '../../hooks/useScrollReveal.js';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [revealRef, vis] = useScrollReveal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signIn(email, password);
      toast.success('Welcome back!', 'Welcome');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ds-container section-premium" style={{ maxWidth: '440px' }}>
      <div ref={revealRef} className={`admin-card p-4 p-md-5 reveal ${vis ? 'is-visible' : ''}`}>
        <div className="pink-divider pink-divider--center" style={{ marginBottom: '1.5rem' }} />
        <h1 className="fw-bold mb-1" style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.5rem, 5vw, var(--fs-h2))' }}>Sign In</h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-small)', marginBottom: '1.5rem' }}>Welcome back! Sign in to your account.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="ds-label">Email</label>
            <input type="email" className="form-control" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="ds-label">Password</label>
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
          </div>
          <button type="submit" className="btn-pink btn-pink--block mb-3" disabled={submitting}>
            {submitting ? <><span className="spinner-border spinner-border-sm me-2"></span> Signing In...</> : 'Sign In'}
          </button>
          <p className="text-center mb-0" style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-small)' }}>
            Don't have an account? <Link to="/register" className="fw-semibold" style={{ color: 'var(--pink)' }}>Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
