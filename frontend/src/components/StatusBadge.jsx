import React from 'react';

const colors = {
  Pending: '#f59e0b',
  Approved: '#22c55e',
  Processing: '#f59e0b',
  'Shipped/Dispatched': '#2563eb',
  Delivered: '#16a34a',

  Cancelled: '#ef4444',
  'In Process': '#2563eb',
  Completed: '#16a34a'
};

const StatusBadge = ({ status }) => {
  const bg = colors[status] || '#e2e8f0';
  const color = '#0f172a';
  return (
    <span className="badge" style={{ background: bg, color }}>
      {status}
    </span>
  );
};

export default StatusBadge;

