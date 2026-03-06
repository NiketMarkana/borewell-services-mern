import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

const categories = ['HDPE', 'PVC', 'Water Pump'];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ quantity: 1, length: '', lengthUnit: 'Feet', additionalDetails: '', countryCode: '+91', mobile: '', email: '', price: 0 });
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'HDPE';
  const subCategory = searchParams.get('subCategory') || '';
  const { user } = useAuth();
  const formRef = useRef(null);

  const filtered = useMemo(
    () => products.filter(p => {
      if (p.category !== category) return false;
      if (category === 'Water Pump' && subCategory && p.subCategory !== subCategory) return false;
      return true;
    }),
    [products, category, subCategory]
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selected) {
      setForm((prev) => ({
        ...prev,
        price: selected.price
      }));
      // Auto-scroll to form
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [selected]);

  const submitOrder = async (e) => {
    e.preventDefault();
    if (!selected) return;

    if (Number(form.quantity) <= 0) {
      alert('Quantity must be greater than 0.');
      return;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(form.mobile)) {
      alert('Mobile number must be exactly 10 digits.');
      return;
    }

    setLoading(true);
    let extraDetails = form.additionalDetails;
    if (form.length) {
      extraDetails = `Length: ${form.length} ${form.lengthUnit}. ` + extraDetails;
    }

    try {
      const payload = {
        items: [{
          product: selected._id,
          productName: selected.name,
          price: Number(form.price),
          quantity: Number(form.quantity),
          additionalDetails: extraDetails.trim()
        }],
        contact: {
          mobile: `${form.countryCode} ${form.mobile}`,
          email: form.email
        }
      };
      await api.post('/orders/product', payload);
      alert('Order submitted! Track in Orders page.');
      setSelected(null);
      setForm({ quantity: 1, length: '', lengthUnit: 'Feet', additionalDetails: '', countryCode: '+91', mobile: '', email: '', price: 0 });
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to submit order');
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
      <h2>Products</h2>
      <div className="card-actions" style={{ marginBottom: 14 }}>
        {categories.map(cat => (
          <button
            key={cat}
            className={`button ${cat === category ? '' : 'outline'}`}
            onClick={() => setSearchParams({ category: cat, subCategory: cat === 'Water Pump' ? 'Borewell Pump' : '' })}
          >
            {cat}
          </button>
        ))}
      </div>

      {category === 'Water Pump' && (
        <div className="card-actions" style={{ marginBottom: 20, justifyContent: 'center' }}>
          {['Borewell Pump', 'Openwell Pump'].map(sub => (
            <button
              key={sub}
              className={`button ${sub === subCategory ? '' : 'outline'} secondary`}
              style={{ fontSize: '0.9rem', padding: '8px 16px' }}
              onClick={() => setSearchParams({ category, subCategory: sub })}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      <div className="grid cards-4">
        {filtered.map(p => (
          <ProductCard key={p._id} product={p} onSelect={setSelected} />
        ))}
      </div>

      {selected && (
        <div ref={formRef} className="card" style={{ marginTop: 20 }}>
          <h3>Order: {selected.name}</h3>
          {!user && <p className="muted">Login is required to submit the order.</p>}
          <form className="form" onSubmit={submitOrder}>
            <div>
              <label className="label">Price</label>
              <input className="input" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div className="flex">
              <div style={{ flex: 1 }}>
                <label className="label">Quantity</label>
                <input className="input" type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
              </div>
              <div style={{ flex: 1 }}>
                <label className="label">Length Unit</label>
                <select className="input" value={form.lengthUnit} onChange={(e) => setForm({ ...form, lengthUnit: e.target.value })}>
                  <option value="Feet">Feet</option>
                  <option value="Meters">Meters</option>
                </select>
              </div>
            </div>
            <div className="flex">
              <div style={{ flex: 1 }}>
                <label className="label">Length (Optional)</label>
                <input className="input" type="number" min="0" value={form.length} onChange={(e) => setForm({ ...form, length: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">Additional Details</label>
              <textarea className="input" rows="3" value={form.additionalDetails} onChange={(e) => setForm({ ...form, additionalDetails: e.target.value })} />
            </div>
            <div className="flex">
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
              <div style={{ flex: 1 }}>
                <label className="label">Email</label>
                <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div className="card-actions">
              <button className="button" type="submit" disabled={loading || !user}>{loading ? 'Submitting...' : 'Submit Order'}</button>
              <button type="button" className="button secondary" onClick={() => setSelected(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Products;

