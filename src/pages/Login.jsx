import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form);
    console.log('Login result:', result);
    if (result.success) {
      toast.success('Welcome back! 🦁');
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/products');
      }
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
        {/* Logo */}
        <div className="text-center" style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, background: 'linear-gradient(135deg, #9a7c2e, #e8c97a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>
            🦁 SINGAM
          </div>
          <p style={{ color: 'var(--gray)', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase' }}>Premium Men's Fashion</p>
        </div>

        <div style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '40px 36px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 28, textAlign: 'center' }}>Welcome Back</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={form.email}
                onChange={e => setForm(f => ({...f, email: e.target.value}))}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={form.password}
                onChange={e => setForm(f => ({...f, password: e.target.value}))}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="btn btn-gold btn-full" style={{ marginTop: 8, padding: '14px', fontSize: 13 }} disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In →'}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{ marginTop: 20, padding: 16, background: 'rgba(201,168,76,0.05)', border: 'var(--border-gold)', borderRadius: 4 }}>
            <p style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>Demo Credentials</p>
            <p style={{ fontSize: 12, color: 'var(--gray)', lineHeight: 1.8 }}>
              Admin: admin@singam.com / admin123
            </p>
          </div>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--gray)' }}>
            New to SINGAM?{' '}
            <Link to="/register" style={{ color: 'var(--gold)', fontWeight: 700 }}>Create Account →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;



