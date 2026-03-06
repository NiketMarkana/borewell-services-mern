import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import ReviewSection from '../components/ReviewSection';
import { useAuth } from '../context/AuthContext';
import { HDPE_PRICES, PVC_PRICES, PUMP_PRICES, getSuggestedPrice } from '../utils/priceData';

const categories = ['HDPE', 'PVC', 'Water Pump'];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    name: '', quantity: 1, length: '', additionalDetails: '',
    countryCode: '+91', mobile: '', email: '', price: 0, address: '', date: '',
    // HDPE specific
    hdpeDiameter: '', hdpeSdr: '', hdpeMaterial: '', hdpePipeType: '', hdpeApplication: '',
    // PVC specific
    pvcDiameter: '', pvcPressure: '', pvcPipeType: '', pvcApplication: '', pvcWall: '',
    // Water Pump specific
    pumpPower: '', pumpSize: '', pumpPhase: '', pumpHead: '', pumpBody: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPriceList, setShowPriceList] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [reviewProductId, setReviewProductId] = useState(null);
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

  // Auto-fill price based on parameter changes
  useEffect(() => {
    if (!selected) return;
    const suggested = getSuggestedPrice(selected.category, form.hdpeDiameter || form.pvcDiameter, form.pumpPower);
    if (suggested > 0) setForm(prev => ({ ...prev, price: suggested }));
  }, [form.hdpeDiameter, form.pvcDiameter, form.pumpPower]);

  const submitOrder = async (e) => {
    e.preventDefault();
    if (!selected) return;

    if (Number(form.quantity) <= 0) {
      alert('Quantity must be greater than 0.');
      return;
    }

    if (selected.category !== 'Water Pump' && Number(form.length) < 100) {
      alert('Minimum pipe length must be 100 meters.');
      return;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(form.mobile)) {
      alert('Mobile number must be exactly 10 digits.');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(form.date);
    if (!form.date || selectedDate <= today) {
      alert('Please select a future date for delivery.');
      return;
    }

    setLoading(true);
    let extraDetails = form.additionalDetails;
    let finalPrice = Number(form.price);

    // Encode category-specific params
    if (selected.category === 'HDPE') {
      extraDetails = `Diameter: ${form.hdpeDiameter}, SDR: ${form.hdpeSdr}, Grade: ${form.hdpeMaterial}, Type: ${form.hdpePipeType}, Application: ${form.hdpeApplication}. Length: ${form.length}m. Address: ${form.address}. ` + extraDetails;
      finalPrice = finalPrice * Number(form.length);
    } else if (selected.category === 'PVC') {
      extraDetails = `Diameter: ${form.pvcDiameter}, Pressure: ${form.pvcPressure}, Type: ${form.pvcPipeType}, Application: ${form.pvcApplication}, Wall: ${form.pvcWall}. Length: ${form.length}m. Address: ${form.address}. ` + extraDetails;
      finalPrice = finalPrice * Number(form.length);
    } else {
      extraDetails = `Power: ${form.pumpPower}, Size: ${form.pumpSize}, Phase: ${form.pumpPhase}, Head: ${form.pumpHead}, Body: ${form.pumpBody}. Address: ${form.address}. ` + extraDetails;
    }

    try {
      const payload = {
        items: [{
          product: selected._id,
          productName: selected.name,
          price: finalPrice,
          quantity: Number(form.quantity),
          additionalDetails: extraDetails.trim()
        }],
        contact: {
          name: form.name,
          mobile: `${form.countryCode} ${form.mobile}`,
          email: form.email,
          address: form.address,
          deliveryDate: form.date
        }
      };
      await api.post('/orders/product', payload);
      alert('Order submitted! Track in Orders page.');
      setSelected(null);
      setForm({
        name: '', quantity: 1, length: '', additionalDetails: '',
        countryCode: '+91', mobile: '', email: '', price: 0, address: '', date: '',
        hdpeDiameter: '', hdpeSdr: '', hdpeMaterial: '', hdpePipeType: '', hdpeApplication: '',
        pvcDiameter: '', pvcPressure: '', pvcPipeType: '', pvcApplication: '', pvcWall: '',
        pumpPower: '', pumpSize: '', pumpPhase: '', pumpHead: '', pumpBody: ''
      });
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

      {/* Price List Toggle */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className={`button ${showPriceList ? 'secondary' : 'outline'}`}
          style={{ fontSize: '0.88rem', padding: '7px 14px' }}
          onClick={() => setShowPriceList(p => !p)}
        >
          {showPriceList ? '✕ Hide Price List' : '📋 View Price List'}
        </button>
      </div>

      {showPriceList && (
        <div className="card" style={{ marginBottom: 24, overflowX: 'auto' }}>
          <h4 style={{ marginBottom: 12 }}>
            {category === 'HDPE' ? '🔵 HDPE Pipe Prices (per meter)' : category === 'PVC' ? '🟡 PVC Pipe Prices (per meter)' : '⚡ Water Pump Prices'}
          </h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '8px 12px' }}>{category === 'Water Pump' ? 'Motor Power' : 'Diameter'}</th>
                <th style={{ textAlign: 'right', padding: '8px 12px' }}>Min Price</th>
                <th style={{ textAlign: 'right', padding: '8px 12px' }}>Max Price</th>
                <th style={{ textAlign: 'right', padding: '8px 12px' }}>Suggested</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(category === 'HDPE' ? HDPE_PRICES : category === 'PVC' ? PVC_PRICES : PUMP_PRICES).map(([key, val]) => (
                <tr key={key} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 600 }}>{key}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-light)' }}>₹{val.min.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-light)' }}>₹{val.max.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: 'var(--primary)' }}>₹{val.suggested.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: 10 }}>* All prices are approximate market rates and may vary based on brand and region.</p>
        </div>
      )}

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
          <div key={p._id}>
            <ProductCard product={p} onSelect={setSelected} />
            <div style={{ marginTop: 4 }}>
              <button
                className={`button ${reviewProductId === p._id ? 'secondary' : 'outline'}`}
                style={{ width: '100%', fontSize: '0.85rem', padding: '8px 12px', borderRadius: '0 0 12px 12px', borderTop: 'none' }}
                onClick={() => setReviewProductId(reviewProductId === p._id ? null : p._id)}
              >
                {reviewProductId === p._id ? '▲ Hide Reviews' : '⭐ Reviews & Ratings'}
              </button>
              {reviewProductId === p._id && (
                <div className="card" style={{ borderRadius: '0 0 16px 16px', marginTop: 0, borderTop: 'none', paddingTop: 16 }}>
                  <ReviewSection targetType="product" targetId={p._id} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div ref={formRef} className="card" style={{ marginTop: 20 }}>
          <h3>Order: {selected.name}</h3>
          {!user && <p className="muted">Login is required to submit the order.</p>}
          <form className="form" onSubmit={submitOrder}>
            <div className="flex">
              <div style={{ flex: 1 }}>
                <label className="label">Your Name</label>
                <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div style={{ flex: 1 }}>
                <label className="label">Email</label>
                <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
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
                <label className="label">Preferred Delivery Date</label>
                <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="label">Delivery Address</label>
              <input className="input" placeholder="Full delivery address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            </div>

            {/* HDPE-specific parameters */}
            {selected?.category === 'HDPE' && (<>
              <div className="flex">
                <div style={{ flex: 1 }}>
                  <label className="label">Outer Diameter</label>
                  <select className="input" value={form.hdpeDiameter} onChange={(e) => setForm({ ...form, hdpeDiameter: e.target.value })} required>
                    <option value="">Select Diameter</option>
                    {['20 mm', '25 mm', '32 mm', '40 mm', '50 mm', '63 mm', '75 mm', '90 mm', '110 mm', '160 mm'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">SDR Rating</label>
                  <select className="input" value={form.hdpeSdr} onChange={(e) => setForm({ ...form, hdpeSdr: e.target.value })} required>
                    <option value="">Select SDR</option>
                    {['SDR 9', 'SDR 11', 'SDR 13.6', 'SDR 17', 'SDR 21', 'SDR 26'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex">
                <div style={{ flex: 1 }}>
                  <label className="label">Material Grade</label>
                  <select className="input" value={form.hdpeMaterial} onChange={(e) => setForm({ ...form, hdpeMaterial: e.target.value })} required>
                    <option value="">Select Grade</option>
                    {['PE63', 'PE80', 'PE100'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">Pipe Type</label>
                  <select className="input" value={form.hdpePipeType} onChange={(e) => setForm({ ...form, hdpePipeType: e.target.value })} required>
                    <option value="">Select Type</option>
                    {['Coil Pipe', 'Straight Pipe'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Application</label>
                <select className="input" value={form.hdpeApplication} onChange={(e) => setForm({ ...form, hdpeApplication: e.target.value })} required>
                  <option value="">Select Application</option>
                  {['Irrigation', 'Water Supply', 'Sprinkler System', 'Drip Irrigation'].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
            </>)}

            {/* PVC-specific parameters */}
            {selected?.category === 'PVC' && (<>
              <div className="flex">
                <div style={{ flex: 1 }}>
                  <label className="label">Diameter</label>
                  <select className="input" value={form.pvcDiameter} onChange={(e) => setForm({ ...form, pvcDiameter: e.target.value })} required>
                    <option value="">Select Diameter</option>
                    {['20 mm', '25 mm', '32 mm', '40 mm', '50 mm', '63 mm', '75 mm', '90 mm', '110 mm'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">Pressure Class</label>
                  <select className="input" value={form.pvcPressure} onChange={(e) => setForm({ ...form, pvcPressure: e.target.value })} required>
                    <option value="">Select Pressure</option>
                    {['2.5 kg/cm²', '4 kg/cm²', '6 kg/cm²', '8 kg/cm²', '10 kg/cm²'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex">
                <div style={{ flex: 1 }}>
                  <label className="label">Pipe Type</label>
                  <select className="input" value={form.pvcPipeType} onChange={(e) => setForm({ ...form, pvcPipeType: e.target.value })} required>
                    <option value="">Select Type</option>
                    {['PVC', 'UPVC'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">Wall Thickness</label>
                  <select className="input" value={form.pvcWall} onChange={(e) => setForm({ ...form, pvcWall: e.target.value })} required>
                    <option value="">Select Wall</option>
                    {['Standard', 'Heavy'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Application</label>
                <select className="input" value={form.pvcApplication} onChange={(e) => setForm({ ...form, pvcApplication: e.target.value })} required>
                  <option value="">Select Application</option>
                  {['Agricultural Irrigation', 'Borewell Pipe', 'Water Supply'].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
            </>)}

            {/* Water Pump-specific parameters */}
            {selected?.category === 'Water Pump' && (<>
              <div className="flex">
                <div style={{ flex: 1 }}>
                  <label className="label">Motor Power (HP)</label>
                  <select className="input" value={form.pumpPower} onChange={(e) => setForm({ ...form, pumpPower: e.target.value })} required>
                    <option value="">Select Power</option>
                    {['0.5 HP', '1 HP', '2 HP', '3 HP', '5 HP', '7.5 HP', '10 HP', '15 HP'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">Pump Size</label>
                  <select className="input" value={form.pumpSize} onChange={(e) => setForm({ ...form, pumpSize: e.target.value })} required>
                    <option value="">Select Size</option>
                    {['3"', '4"', '5"', '6"', '8"'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex">
                <div style={{ flex: 1 }}>
                  <label className="label">Phase</label>
                  <select className="input" value={form.pumpPhase} onChange={(e) => setForm({ ...form, pumpPhase: e.target.value })} required>
                    <option value="">Select Phase</option>
                    {['Single Phase', 'Three Phase'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">Head Range</label>
                  <select className="input" value={form.pumpHead} onChange={(e) => setForm({ ...form, pumpHead: e.target.value })} required>
                    <option value="">Select Head</option>
                    {['20 m', '40 m', '60 m', '80 m', '100 m', '150 m'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Body Material</label>
                <select className="input" value={form.pumpBody} onChange={(e) => setForm({ ...form, pumpBody: e.target.value })} required>
                  <option value="">Select Material</option>
                  {['Stainless Steel', 'Cast Iron', 'Bronze'].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
            </>)}
            <div>
              <label className="label">Price (per unit)</label>
              <input className="input" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              {/* Dynamic Price Hint */}
              {(() => {
                const specKey = form.hdpeDiameter || form.pvcDiameter || form.pumpPower;
                const specTable = selected?.category === 'HDPE' ? HDPE_PRICES : selected?.category === 'PVC' ? PVC_PRICES : PUMP_PRICES;
                const range = specTable[specKey];
                if (range) {
                  return <p style={{ fontSize: '0.78rem', color: 'var(--primary)', marginTop: '-8px', marginBottom: '12px', fontWeight: 500 }}>
                    💡 Suggested Range: ₹{range.min.toLocaleString('en-IN')} – ₹{range.max.toLocaleString('en-IN')}
                  </p>;
                }
                return null;
              })()}
            </div>
            <div className="flex">
              <div style={{ flex: 1 }}>
                <label className="label">Quantity</label>
                <input className="input" type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
              </div>
              {selected?.category !== 'Water Pump' && (
                <div style={{ flex: 1 }}>
                  <label className="label">Length (Meters)</label>
                  <input className="input" type="number" min="100" placeholder="Min 100m" value={form.length} onChange={(e) => setForm({ ...form, length: e.target.value })} required />
                </div>
              )}
            </div>
            <div>
              <label className="label">Additional Details</label>
              <textarea className="input" rows="3" value={form.additionalDetails} onChange={(e) => setForm({ ...form, additionalDetails: e.target.value })} />
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
