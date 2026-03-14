import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { updateProfile, changePassword } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name: profileForm.name, phone: profileForm.phone, address: { street: profileForm.street, city: profileForm.city, state: profileForm.state, pincode: profileForm.pincode } });
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update'); } finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await changePassword(pwForm);
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password'); } finally { setSaving(false); }
  };

  return (
    <div style={{ paddingTop: 80 }}>
      <div className="container" style={{ padding: '40px 24px', maxWidth: 760 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: 'var(--black)' }}>
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 4 }}>{user?.name}</h1>
            <p style={{ color: 'var(--gray)', fontSize: 13 }}>{user?.email}</p>
            {user?.role === 'admin' && <span className="badge badge-gold" style={{ marginTop: 4 }}>Admin</span>}
          </div>
        </div>

        <div className="tab-nav" style={{ marginBottom: 32 }}>
          {['profile', 'password'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
          ))}
        </div>

        {tab === 'profile' && (
          <form onSubmit={handleProfileSave}>
            <div className="card" style={{ padding: 32 }}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={profileForm.name} onChange={e => setProfileForm(f => ({...f, name: e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={profileForm.phone} onChange={e => setProfileForm(f => ({...f, phone: e.target.value}))} />
                </div>
              </div>
              <h3 style={{ color: 'var(--gold)', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16, marginTop: 8 }}>Delivery Address</h3>
              <div className="form-group">
                <label className="form-label">Street</label>
                <input className="form-input" value={profileForm.street} onChange={e => setProfileForm(f => ({...f, street: e.target.value}))} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-input" value={profileForm.city} onChange={e => setProfileForm(f => ({...f, city: e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input className="form-input" value={profileForm.state} onChange={e => setProfileForm(f => ({...f, state: e.target.value}))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Pincode</label>
                <input className="form-input" value={profileForm.pincode} onChange={e => setProfileForm(f => ({...f, pincode: e.target.value}))} style={{ maxWidth: 200 }} />
              </div>
              <button type="submit" className="btn btn-gold" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        )}

        {tab === 'password' && (
          <form onSubmit={handlePasswordChange}>
            <div className="card" style={{ padding: 32, maxWidth: 400 }}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-input" value={pwForm.currentPassword} onChange={e => setPwForm(f => ({...f, currentPassword: e.target.value}))} required />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" className="form-input" value={pwForm.newPassword} onChange={e => setPwForm(f => ({...f, newPassword: e.target.value}))} required />
              </div>
              <button type="submit" className="btn btn-gold" disabled={saving}>{saving ? 'Changing...' : 'Change Password'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;



