import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { toast } from 'react-toastify';

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
        toast.error('Access denied. Admin credentials required.');
        return;
      }
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#FAFAFA' }}>
      <div className="p-5 rounded-3" style={{ maxWidth: '420px', width: '100%', background: '#fff', border: '1px solid var(--border-subtle)' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ color: 'var(--text-primary)' }}>Admin Login</h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--fs-small)' }}>Sign in to manage your store</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="ds-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@example.com" />
          </div>
          <div className="mb-4">
            <label className="ds-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter password" />
          </div>
          <button type="submit" className="btn-pink btn-pink--block" disabled={submitting}>
            {submitting ? <><span className="spinner-border spinner-border-sm me-2"></span> Signing In...</> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
