import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    const result = await register(form);
    if (result.success) {
      toast.success('Welcome to SINGAM! 🦁');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 50%, #1a1208 0%, #080808 70%)',
      padding: '24px'
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div className="text-center" style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, background: 'linear-gradient(135deg, #9a7c2e, #e8c97a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>
            🦁 SINGAM
          </div>
          <p style={{ color: 'var(--gray)', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase' }}>Premium Men's Fashion</p>
        </div>

        <div style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '40px 36px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 28, textAlign: 'center' }}>Create Account</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="your@email.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone (optional)</label>
              <input className="form-input" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="+91 9999999999" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} placeholder="Min 6 characters" required />
            </div>
            <button type="submit" className="btn btn-gold btn-full" style={{ marginTop: 8, padding: '14px', fontSize: 13 }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--gray)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--gold)', fontWeight: 700 }}>Sign In →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;