import React, { useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const Services = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    date: '',
    address: '',
    locationDescription: '',
    depthFeet: '',
    additionalNotes: ''
  });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (Number(form.depthFeet) <= 100) {
      alert('Depth must be greater than 100 feet.');
      setLoading(false);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(form.date);
    if (selectedDate <= today) {
      alert('Please select a strictly future date for the service.');
      setLoading(false);
      return;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(form.mobile)) {
      alert('Mobile number must be exactly 10 digits.');
      setLoading(false);
      return;
    }

    try {
      await api.post('/orders/service', {
        serviceDetails: {
          ...form,
          depthFeet: Number(form.depthFeet)
        },
        contact: { mobile: `${form.countryCode} ${form.mobile}`, email: user?.email }
      });
      alert('Request submitted! Track status in Orders.');
      setForm({ name: '', countryCode: '+91', mobile: '', date: '', address: '', locationDescription: '', depthFeet: '', additionalNotes: '' });
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  const handleMobileChange = (e) => {
    const val = e.target.value;
    if (val === '' || /^[0-9]+$/.test(val)) {
      if (val.length <= 10) setForm({ ...form, mobile: val });
    }
  };

  return (
    <div className="container section">
      <h2>Borewell Service Request</h2>
      {!user && <p className="muted">Login is required to submit the request.</p>}
      <form className="card form" onSubmit={submit}>
        <div className="flex">
          <div style={{ flex: 1 }}>
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div style={{ flex: 1 }}>
            <label className="label">Mobile</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select className="input" value={form.countryCode} onChange={(e) => setForm({ ...form, countryCode: e.target.value })} style={{ width: '80px', padding: '0 8px' }}>
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+61">+61</option>
              </select>
              <input className="input" type="text" pattern="[0-9]{10}" placeholder="10-digit number" value={form.mobile} onChange={handleMobileChange} required style={{ flex: 1 }} />
            </div>
          </div>
        </div>
        <div className="flex">
          <div style={{ flex: 1 }}>
            <label className="label">Preferred Date</label>
            <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          </div>
          <div style={{ flex: 1 }}>
            <label className="label">Depth Required (feet)</label>
            <input className="input" type="number" min="101" value={form.depthFeet} onChange={(e) => setForm({ ...form, depthFeet: e.target.value })} required />
          </div>
        </div>
        <div>
          <label className="label">Address</label>
          <textarea className="input" rows="2" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
        </div>
        <div>
          <label className="label">Location Description</label>
          <textarea className="input" rows="2" value={form.locationDescription} onChange={(e) => setForm({ ...form, locationDescription: e.target.value })} />
        </div>
        <div>
          <label className="label">Additional Requirements</label>
          <textarea className="input" rows="2" value={form.additionalNotes} onChange={(e) => setForm({ ...form, additionalNotes: e.target.value })} />
        </div>
        <div className="card-actions">
          <button className="button" type="submit" disabled={loading || !user}>{loading ? 'Sending...' : 'Send Request'}</button>
        </div>
      </form>
    </div>
  );
};

export default Services;

