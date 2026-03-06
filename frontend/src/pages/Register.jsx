import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', countryCode: '+91' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 10) {
      setForm({ ...form, phone: val });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (form.phone.length !== 10) {
      alert('Phone number must be exactly 10 digits');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        phone: `${form.countryCode} ${form.phone}`
      };
      const { data } = await api.post('/auth/register', payload);
      login(data);
      navigate('/');
    } catch (err) {
      alert(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section" style={{ maxWidth: 500 }}>
      <h2>Register</h2>
      <form className="card shadow-lg form" onSubmit={submit} style={{ padding: '2rem' }}>
        <div className="form-group">
          <label className="label">Full Name</label>
          <input className="input" placeholder="Enter your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="form-group">
          <label className="label">Phone Number</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              className="input"
              value={form.countryCode}
              onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
              style={{ width: '85px', padding: '0 8px' }}
            >
              <option value="+91">+91</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
              <option value="+61">+61</option>
            </select>
            <input
              className="input"
              type="text"
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={handlePhoneChange}
              required
              style={{ flex: 1 }}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="label">Email Address</label>
          <input className="input" type="email" placeholder="email@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="form-group">
          <label className="label">Password</label>
          <input className="input" type="password" placeholder="Min. 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <button className="button shadow" type="submit" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>
        <div className="muted" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;

