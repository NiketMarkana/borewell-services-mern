import React, { useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import ReviewSection from '../components/ReviewSection';

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
    additionalNotes: '',
    images: []
  });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (Number(form.depthFeet) < 100) {
      alert('Depth must be at least 100 feet.');
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
      setForm({ name: '', countryCode: '+91', mobile: '', date: '', address: '', locationDescription: '', depthFeet: '', additionalNotes: '', images: [] });
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

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);

    const processImage = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Compress to JPEG with 0.7 quality to reduce payload size
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            resolve(dataUrl);
          };
          img.onerror = (err) => reject(err);
        };
        reader.onerror = error => reject(error);
      });
    };

    try {
      const compressedImages = await Promise.all(files.map(processImage));
      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...compressedImages]
      }));
    } catch (err) {
      console.error('Error compressing images:', err);
      alert('Failed to process one or more images');
    }
  };

  const removeImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
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
            <input className="input" type="number" min="100" placeholder="Min 100ft" value={form.depthFeet} onChange={(e) => setForm({ ...form, depthFeet: e.target.value })} required />
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

        {/* Site Images Upload */}
        <div style={{ padding: '16px', background: 'var(--primary-light)', borderRadius: '12px', border: '1px dashed var(--primary)', marginBottom: '16px' }}>
          <label className="label" style={{ marginBottom: 4 }}>Site Images (Optional)</label>
          <p className="muted" style={{ fontSize: '0.85rem', marginBottom: '12px', marginTop: 0 }}>
            Upload photos of your land, soil type, or existing borewell to help engineers estimate the work.
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            style={{ fontSize: '0.9rem', marginBottom: '12px' }}
          />

          {/* Image Previews */}
          {form.images.length > 0 && (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '10px' }}>
              {form.images.map((imgSrc, index) => (
                <div key={index} style={{ position: 'relative', width: '80px', height: '80px' }}>
                  <img
                    src={imgSrc}
                    alt={`Preview ${index}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    style={{
                      position: 'absolute', top: '-6px', right: '-6px', background: 'var(--danger)', color: 'white',
                      border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-actions">
          <button className="button" type="submit" disabled={loading || !user}>{loading ? 'Sending...' : 'Send Request'}</button>
        </div>
      </form>

      {/* Reviews for Borewell Service */}
      <div className="card" style={{ marginTop: 28 }}>
        <ReviewSection targetType="service" targetId="borewell-service" />
      </div>
    </div>
  );
};

export default Services;

