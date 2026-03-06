import React, { useEffect, useState, useMemo } from 'react';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'service', 'product'
  const [selectedTab, setSelectedTab] = useState('All');
  const [statusInput, setStatusInput] = useState('');

  const isAdminOrEmployee = ['admin', 'employee'].includes(user?.role);

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const endpoint = isAdminOrEmployee ? '/admin/orders' : '/orders/my-orders';
      const { data } = await api.get(endpoint);
      const list = isAdminOrEmployee ? (data.data || []) : data;

      let processedList = [...list];
      if (isAdminOrEmployee) {
        processedList = processedList.filter(o => !['Cancelled'].includes(o.status));
        processedList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }
      setOrders(processedList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  // Reset status tab when type filter changes
  useEffect(() => {
    setSelectedTab('All');
  }, [typeFilter]);

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!newStatus) return alert('Select a status first');
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      await fetchOrders();
      setStatusInput('');
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update');
    }
  };

  const removeOrder = async (id, isCancel = false) => {
    const msg = isCancel
      ? 'Are you sure you want to cancel this pending order?'
      : 'Are you sure you want to remove this cancelled order from your history?';

    if (!window.confirm(msg)) return;
    try {
      await api.delete(`/orders/${id}`);
      setOrders(orders.filter(o => o._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to remove order');
    }
  };

  const getVisibleOrders = useMemo(() => {
    let result = [...orders];
    if (typeFilter === 'service') {
      result = result.filter(o => o.type === 'service');
    } else if (['HDPE', 'PVC', 'Water Pump'].includes(typeFilter)) {
      result = result.filter(o =>
        o.type === 'product' &&
        o.items?.some(item =>
          item.category === typeFilter || (item.product?.category === typeFilter)
        )
      );
    }
    return result;
  }, [orders, typeFilter]);

  const getUniqueStatuses = () => {
    const list = new Set(getVisibleOrders.map(o => o.status));
    return ['All', ...Array.from(list)];
  };

  const filteredOrders = useMemo(() => {
    let result = getVisibleOrders;
    if (selectedTab !== 'All') {
      result = result.filter(o => o.status === selectedTab);
    }
    return result;
  }, [getVisibleOrders, selectedTab]);

  if (loading) return <div className="container section">Loading...</div>;

  return (
    <div className="container section">
      <h2 style={{ marginBottom: '1.5rem' }}>{isAdminOrEmployee ? 'Manage System Orders' : 'My Orders'}</h2>

      {isAdminOrEmployee && (
        <>
          {/* Order Type Filter */}
          <div className="card-actions" style={{ marginBottom: '1rem', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className={`button ${typeFilter === 'all' ? 'primary' : 'outline'}`}
              style={{ borderRadius: '25px', padding: '10px 24px' }}
              onClick={() => setTypeFilter('all')}
            >
              All Orders
            </button>
            <button
              className={`button ${typeFilter === 'service' ? 'primary' : 'outline'}`}
              style={{ borderRadius: '25px', padding: '10px 24px' }}
              onClick={() => setTypeFilter('service')}
            >
              Borewell Services
            </button>
            <button
              className={`button ${typeFilter === 'HDPE' ? 'primary' : 'outline'}`}
              style={{ borderRadius: '25px', padding: '10px 24px' }}
              onClick={() => setTypeFilter('HDPE')}
            >
              HDPE
            </button>
            <button
              className={`button ${typeFilter === 'PVC' ? 'primary' : 'outline'}`}
              style={{ borderRadius: '25px', padding: '10px 24px' }}
              onClick={() => setTypeFilter('PVC')}
            >
              PVC
            </button>
            <button
              className={`button ${typeFilter === 'Water Pump' ? 'primary' : 'outline'}`}
              style={{ borderRadius: '25px', padding: '10px 24px' }}
              onClick={() => setTypeFilter('Water Pump')}
            >
              Water Pump
            </button>
          </div>

          <div className="card-actions" style={{ marginBottom: '2.5rem', justifyContent: 'center' }}>
            {getUniqueStatuses().map(s => (
              <button
                key={s}
                className={`button ${s === selectedTab ? 'secondary' : 'outline'}`}
                style={{ borderRadius: '20px' }}
                onClick={() => setSelectedTab(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="grid cards-3">
        {filteredOrders.length === 0 ? (
          <div className="muted" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>No orders found.</div>
        ) : filteredOrders.map(order => (
          <div className="card shadow-lg" key={order._id}>
            <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 800, color: 'var(--primary)' }}>
                {order.type === 'service' ? 'Borewell Service' : 'Product Order'}
              </div>
              <StatusBadge status={order.status} />
            </div>

            {isAdminOrEmployee && (
              <div style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{order.contact?.name || order.user?.name}</div>
                <div className="muted" style={{ fontSize: '0.8rem' }}>{order.contact?.email || order.user?.email}</div>
              </div>
            )}

            <div className="muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
              Placed: {dayjs(order.createdAt).format('DD MMM YYYY, HH:mm')}
            </div>

            <div style={{ flex: 1 }}>
              {order.type === 'service' ? (
                <div style={{ fontSize: '0.95rem' }}>
                  <div><strong>Name:</strong> {order.serviceDetails?.name}</div>
                  <div><strong>Mobile:</strong> {order.contact?.mobile || order.serviceDetails?.mobile}</div>
                  <div><strong>Email:</strong> {order.contact?.email}</div>
                  <div><strong>Preferred Date:</strong> {dayjs(order.serviceDetails?.date).format('DD MMM YYYY')}</div>
                  <div><strong>Depth:</strong> {order.serviceDetails?.depthFeet} ft</div>
                  {isAdminOrEmployee && (
                    <>
                      <div><strong>Address:</strong> {order.serviceDetails?.address}</div>
                      {order.serviceDetails?.locationDescription && <div><strong>Location:</strong> {order.serviceDetails?.locationDescription}</div>}
                      {order.serviceDetails?.additionalNotes && <div><strong>Notes:</strong> {order.serviceDetails?.additionalNotes}</div>}
                    </>
                  )}
                  {order.serviceDetails?.images?.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      <strong style={{ display: 'block', marginBottom: '8px' }}>Site Images:</strong>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {order.serviceDetails.images.map((imgSrc, idx) => (
                          <a key={idx} href={imgSrc} target="_blank" rel="noopener noreferrer">
                            <img
                              src={imgSrc}
                              alt={`Site Photo ${idx + 1}`}
                              style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }}
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ fontSize: '0.95rem' }}>
                  <div style={{ marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                    {order.contact?.name && <div><strong>Customer Name:</strong> {order.contact.name}</div>}
                    <div><strong>Mobile:</strong> {order.contact?.mobile}</div>
                    <div><strong>Email:</strong> {order.contact?.email}</div>
                    {order.contact?.address && <div><strong>Delivery Address:</strong> {order.contact.address}</div>}
                    {order.contact?.deliveryDate && (
                      <div><strong>Requested Delivery Date:</strong> {new Date(order.contact.deliveryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                    )}
                  </div>
                  {order.items?.map(item => (
                    <div key={item._id} style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontWeight: 700 }}>{item.productName} × {item.quantity} {item.unit || 'units'}</div>
                      <div style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>₹{item.price?.toLocaleString('en-IN')}</div>
                      {item.additionalDetails && (
                        <div style={{ marginTop: '6px', fontSize: '0.85rem', color: 'var(--text-light)', background: 'var(--bg)', borderRadius: '6px', padding: '6px 10px' }}>
                          {item.additionalDetails.split('. ').filter(Boolean).map((detail, i) => (
                            <div key={i}>• {detail}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div style={{ fontWeight: 800, marginTop: '12px', color: 'var(--primary-dark)', fontSize: '1.1rem' }}>Total Amount: ₹{order.totalAmount}</div>
                </div>
              )}
            </div>

            {isAdminOrEmployee ? (
              <>
                <div className="flex" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <select
                    className="input"
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value)}
                    style={{ marginBottom: 0, padding: '8px', fontSize: '0.9rem' }}
                  >
                    <option value="">Update Status</option>
                    {(order.type === 'service' ?
                      ['Pending', 'Approved', 'In Process', 'Cancelled', 'Completed'] :
                      ['Pending', 'Approved', 'Processing', 'Shipped/Dispatched', 'Delivered', 'Cancelled']
                    ).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button className="button" style={{ padding: '8px 16px' }} onClick={() => updateOrderStatus(order._id, statusInput)}>Set</button>
                </div>
                {['Delivered', 'Completed'].includes(order.status) && (
                  <button className="button outline" style={{ width: '100%', marginTop: '1rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => removeOrder(order._id)}>Remove from history</button>
                )}
              </>
            ) : (
              <>
                <div style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Status History</div>
                  <ul className="muted" style={{ paddingLeft: '1.2rem', fontSize: '0.85rem' }}>
                    {order.statusHistory?.slice(-3).map((h, idx) => (
                      <li key={idx}>{h.status} – {dayjs(h.timestamp).format('DD MMM')}</li>
                    ))}
                  </ul>
                </div>
                {['Cancelled', 'Rejected'].includes(order.status) && (
                  <button className="button outline" style={{ width: '100%', marginTop: '1rem' }} onClick={() => removeOrder(order._id)}>Remove from history</button>
                )}
                {order.status === 'Pending' && (
                  <button className="button outline" style={{ width: '100%', marginTop: '1rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => removeOrder(order._id, true)}>Cancel Order</button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
