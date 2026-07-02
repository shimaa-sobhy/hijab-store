import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { toast } from '../../utils/toast.jsx';
import PasswordInput from '../../components/common/PasswordInput.jsx';

export default function AdminLogin() {
  const { signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await signIn(email, password);
      if (!result.profile || result.profile.role !== 'admin') {
        await signOut();
        toast.error('Access denied. Admin credentials required.', 'Access Denied');
        return;
      }
      toast.success('Welcome back!', 'Welcome');
      navigate('/admin');
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#FAFAFA', padding: '16px' }}>
      <div className="p-4 p-md-5 rounded-3" style={{ maxWidth: '420px', width: '100%', background: '#fff', border: '1px solid var(--border-subtle)' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.25rem, 5vw, 1.75rem)' }}>Admin Login</h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-small)' }}>Sign in to manage your store</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="ds-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@example.com" style={{ minHeight: '48px' }} />
          </div>
          <div className="mb-4">
            <label className="ds-label">Password</label>
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter password" style={{ minHeight: '48px' }} />
          </div>
          <button type="submit" className="btn-pink btn-pink--block" disabled={submitting} style={{ minHeight: '48px' }}>
            {submitting ? <><span className="spinner-border spinner-border-sm me-2"></span> Signing In...</> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
