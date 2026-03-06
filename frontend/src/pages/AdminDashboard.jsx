import React, { useState, useEffect } from 'react';
import api from '../api/client';

const StarDisplay = ({ value }) => (
  <span style={{ color: '#f59e0b', fontSize: '1rem', letterSpacing: 1 }}>
    {'★'.repeat(value)}{'☆'.repeat(5 - value)}
  </span>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [reviews, setReviews] = useState([]);

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'HDPE',
    subCategory: '',
    price: '',
    description: '',
    unit: 'piece',
    image: '',
    isAvailable: true
  });

  // Employee Form State
  const [empForm, setEmpForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    countryCode: '+91',
    departments: []
  });

  const availableDepartments = ['Borewell Services', 'HDPE', 'PVC', 'Water Pump'];

  useEffect(() => {
    if (activeTab === 'employees') {
      fetchEmployees();
    } else if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'reviews') {
      fetchReviews();
    }
  }, [activeTab]);

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 10) {
      setEmpForm({ ...empForm, phone: val });
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/employees');
      setEmployees(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products?all=true');
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/reviews/all');
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      setReviews(reviews.filter(r => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete review');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, {
          ...productForm,
          price: Number(productForm.price)
        });
        alert('Product updated successfully!');
      } else {
        await api.post('/products', {
          ...productForm,
          price: Number(productForm.price)
        });
        alert('Product added successfully!');
      }
      setProductForm({ name: '', category: 'HDPE', subCategory: '', price: '', description: '', unit: 'piece', image: '' });
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to process product');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      subCategory: product.subCategory || '',
      price: product.price,
      description: product.description || '',
      unit: product.unit,
      image: product.image || '',
      isAvailable: product.isAvailable !== undefined ? product.isAvailable : true
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      setLoading(true);
      await api.delete(`/products/${id}`);
      fetchProducts();
      alert('Product deleted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    if (empForm.phone.length !== 10) {
      alert('Phone number must be exactly 10 digits');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...empForm,
        phone: empForm.phone.includes(' ') ? empForm.phone : `${empForm.countryCode} ${empForm.phone}`
      };

      if (editingEmployee) {
        await api.put(`/admin/employees/${editingEmployee._id}`, payload);
        alert('Employee updated successfully!');
      } else {
        await api.post('/admin/employees', payload);
        alert('Employee added successfully!');
      }

      setEmpForm({ name: '', email: '', phone: '', password: '', address: '', countryCode: '+91', departments: [] });
      setEditingEmployee(null);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to process employee');
    } finally {
      setLoading(false);
    }
  };

  const handleEditEmployee = (emp) => {
    setEditingEmployee(emp);
    const parts = emp.phone.split(' ');
    setEmpForm({
      name: emp.name,
      email: emp.email,
      phone: parts.length > 1 ? parts[1] : emp.phone,
      password: '', // Keep empty for security, handle optional update on backend if needed
      address: emp.address || '',
      countryCode: parts.length > 1 ? parts[0] : '+91',
      departments: emp.departments || []
    });
  };

  const handleCancelEmpEdit = () => {
    setEditingEmployee(null);
    setEmpForm({ name: '', email: '', phone: '', password: '', address: '', countryCode: '+91', departments: [] });
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to remove this employee?')) return;
    try {
      await api.delete(`/admin/employees/${id}`);
      setEmployees(employees.filter(emp => emp._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="container section">
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
        <button
          className={`button ${activeTab === 'products' ? 'primary' : 'outline'}`}
          onClick={() => setActiveTab('products')}
          style={{ borderRadius: '25px', padding: '10px 24px' }}
        >
          Manage Products
        </button>
        <button
          className={`button ${activeTab === 'employees' ? 'primary' : 'outline'}`}
          onClick={() => setActiveTab('employees')}
          style={{ borderRadius: '25px', padding: '10px 24px' }}
        >
          Manage Employees
        </button>
        <button
          className={`button ${activeTab === 'reviews' ? 'primary' : 'outline'}`}
          onClick={() => setActiveTab('reviews')}
          style={{ borderRadius: '25px', padding: '10px 24px' }}
        >
          ⭐ Reviews
        </button>
      </div>

      {activeTab === 'products' ? (
        <div className="grid" style={{ gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
          <div className="card shadow-lg" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--primary-dark)' }}>
              {editingProduct ? 'Update Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleProductSubmit} className="form">
              <div className="form-group">
                <label className="label">Product Name</label>
                <input
                  className="input"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. 75mm HDPE Pipe"
                  required
                />
              </div>
              <div className="flex" style={{ gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="label">Category</label>
                  <select
                    className="input"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    required
                  >
                    <option value="HDPE">HDPE</option>
                    <option value="PVC">PVC</option>
                    <option value="Water Pump">Water Pump</option>
                  </select>
                </div>
                {productForm.category === 'Water Pump' && (
                  <div style={{ flex: 1 }}>
                    <label className="label">Sub-Category</label>
                    <select
                      className="input"
                      value={productForm.subCategory}
                      onChange={(e) => setProductForm({ ...productForm, subCategory: e.target.value })}
                      required
                    >
                      <option value="">Select sub-category</option>
                      <option value="Borewell Pump">Borewell Pump</option>
                      <option value="Openwell Pump">Openwell Pump</option>
                    </select>
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <label className="label">Price (₹)</label>
                  <input
                    className="input"
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="250"
                    required
                  />
                </div>
              </div>
              <div className="flex" style={{ gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="label">Default Unit</label>
                  <select
                    className="input"
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    required
                  >
                    <option value="piece">piece</option>
                    <option value="meter">meter</option>
                    <option value="feet">feet</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">Image Path / URL</label>
                  <input
                    className="input"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="/assets/pvc.png"
                  />
                </div>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={productForm.isAvailable}
                  onChange={(e) => setProductForm({ ...productForm, isAvailable: e.target.checked })}
                />
                <label htmlFor="isAvailable" style={{ margin: 0, cursor: 'pointer' }}>Available for Customers</label>
              </div>
              <div className="form-group">
                <label className="label">Description</label>
                <textarea
                  className="input"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Technical specifications..."
                  rows="3"
                />
              </div>
              <div className="card-actions">
                <button type="submit" className="button shadow" style={{ flex: 2 }} disabled={loading}>
                  {loading ? 'Processing...' : editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                {editingProduct && (
                  <button
                    type="button"
                    className="button outline"
                    style={{ flex: 1, borderColor: 'var(--danger)', color: 'var(--danger)' }}
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({ name: '', category: 'HDPE', subCategory: '', price: '', description: '', unit: 'piece', image: '', isAvailable: true });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Product List */}
          <div className="card shadow-lg" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Existing Products</h3>
            {loading && products.length === 0 ? (
              <p>Loading products...</p>
            ) : products.length === 0 ? (
              <p className="muted">No products found.</p>
            ) : (
              <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '8px' }}>
                <div className="grid cards-1" style={{ gap: '1rem' }}>
                  {products.map(p => (
                    <div key={p._id} className="card outline" style={{ padding: '1rem', background: '#f8fafc' }}>
                      <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{p.name}</div>
                          <div className="muted" style={{ fontSize: '0.9rem' }}>
                            {p.category} {p.subCategory ? `(${p.subCategory})` : ''} • ₹{p.price}/{p.unit}
                            {!p.isAvailable && <span style={{ color: 'var(--danger)', marginLeft: '10px', fontWeight: 600 }}>(Unavailable)</span>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="button outline"
                            style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                            onClick={() => handleEditProduct(p)}
                          >
                            Edit
                          </button>
                          <button
                            className="button outline"
                            style={{ padding: '4px 12px', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                            onClick={() => handleDeleteProduct(p._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div >
      ) : activeTab === 'reviews' ? (
        <div className="card shadow-lg" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>⭐ All Reviews</h3>
          {loading ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="muted">No reviews submitted yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reviews.map(r => (
                <div key={r._id} className="card outline" style={{ padding: '1rem', background: '#f8fafc' }}>
                  <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700 }}>{r.userName}</span>
                        <span className="badge" style={{
                          background: r.targetType === 'product' ? '#eff6ff' : '#f0fdf4',
                          color: r.targetType === 'product' ? '#2563eb' : '#16a34a',
                          fontSize: '0.75rem', padding: '2px 8px'
                        }}>
                          {r.targetType === 'product' ? '📦 Product' : '🔧 Service'}
                        </span>
                        <span className="muted" style={{ fontSize: '0.8rem' }}>
                          {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <StarDisplay value={r.rating} />
                      {r.comment && <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: 'var(--text)' }}>"{r.comment}"</p>}
                      <p className="muted" style={{ fontSize: '0.78rem', marginTop: 4 }}>
                        Target: {r.targetType} / {r.targetId.length > 24 ? `${r.targetId.slice(0, 12)}…` : r.targetId}
                      </p>
                    </div>
                    <button
                      className="button outline"
                      style={{ color: 'var(--danger)', borderColor: 'var(--danger)', padding: '4px 12px', fontSize: '0.8rem', flexShrink: 0 }}
                      onClick={() => handleDeleteReview(r._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
          {/* Add/Edit Employee Form */}
          <div className="card shadow-lg" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>
              {editingEmployee ? 'Update Employee Details' : 'Register New Employee'}
            </h3>
            <form onSubmit={handleEmployeeSubmit} className="form">
              <div className="form-group">
                <label className="label">Full Name</label>
                <input className="input" value={empForm.name} onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })} required placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label className="label">Email</label>
                <input className="input" type="email" value={empForm.email} onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })} required placeholder="john@example.com" />
              </div>
              <div className="flex" style={{ gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="label">Phone</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select
                      className="input"
                      value={empForm.countryCode}
                      onChange={(e) => setEmpForm({ ...empForm, countryCode: e.target.value })}
                      style={{ width: '80px', padding: '0 4px', fontSize: '0.85rem' }}
                    >
                      <option value="+91">+91</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+61">+61</option>
                    </select>
                    <input
                      className="input"
                      value={empForm.phone}
                      onChange={handlePhoneChange}
                      required
                      placeholder="10-digit number"
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">Password {!editingEmployee && <span style={{ color: 'red' }}>*</span>}</label>
                  <input
                    className="input"
                    type="password"
                    value={empForm.password}
                    onChange={(e) => setEmpForm({ ...empForm, password: e.target.value })}
                    required={!editingEmployee}
                    placeholder={editingEmployee ? "Leave blank to keep same" : "Min 6 chars"}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="label">Address</label>
                <textarea className="input" value={empForm.address} onChange={(e) => setEmpForm({ ...empForm, address: e.target.value })} placeholder="Residential address" rows="2" />
              </div>

              <div className="form-group">
                <label className="label">Assign Departments</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#f1f5f9', padding: '12px', borderRadius: '8px' }}>
                  {availableDepartments.map(dept => (
                    <label key={dept} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={empForm.departments.includes(dept)}
                        onChange={(e) => {
                          const newDepts = e.target.checked
                            ? [...empForm.departments, dept]
                            : empForm.departments.filter(d => d !== dept);
                          setEmpForm({ ...empForm, departments: newDepts });
                        }}
                      />
                      {dept}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                <button type="submit" className="button shadow" style={{ flex: 1 }} disabled={loading}>
                  {loading ? 'Processing...' : editingEmployee ? 'Update Employee' : 'Add Employee'}
                </button>
                {editingEmployee && (
                  <button type="button" className="button outline" onClick={handleCancelEmpEdit} style={{ flex: 1 }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Employee List */}
          <div className="card shadow-lg" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Existing Employees</h3>
            {loading && employees.length === 0 ? (
              <p>Loading employees...</p>
            ) : employees.length === 0 ? (
              <p className="muted">No employees registered yet.</p>
            ) : (
              <div className="grid cards-1" style={{ gap: '1rem' }}>
                {employees.map(emp => (
                  <div key={emp._id} className="card outline" style={{ padding: '1rem', background: '#f8fafc' }}>
                    <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{emp.name}</div>
                        <div className="muted" style={{ fontSize: '0.9rem' }}>{emp.email}</div>
                        <div style={{ fontSize: '0.9rem', marginTop: '4px' }}><strong>Phone:</strong> {emp.phone}</div>
                        <div style={{ marginTop: '10px' }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>Departments:</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {emp.departments?.length > 0 ? (
                              emp.departments.map(dept => (
                                <span
                                  key={dept}
                                  style={{
                                    fontSize: '0.7rem',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--primary)',
                                    background: '#eff6ff',
                                    color: 'var(--primary)',
                                    fontWeight: 500
                                  }}
                                >
                                  {dept}
                                </span>
                              ))
                            ) : (
                              <span className="muted" style={{ fontSize: '0.7rem' }}>No departments assigned</span>
                            )}
                          </div>
                        </div>
                        {emp.address && <div style={{ fontSize: '0.9rem', marginTop: '8px' }}><strong>Addr:</strong> {emp.address}</div>}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="button outline"
                          style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                          onClick={() => handleEditEmployee(emp)}
                        >
                          Edit
                        </button>
                        <button
                          className="button outline"
                          style={{ color: 'var(--danger)', borderColor: 'var(--danger)', padding: '4px 12px', fontSize: '0.8rem' }}
                          onClick={() => handleDeleteEmployee(emp._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
