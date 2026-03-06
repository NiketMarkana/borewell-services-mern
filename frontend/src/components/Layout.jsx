import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <strong>Borewell Services & Pipes</strong>
          <div>Quality borewell drilling, HDPE/PVC pipes, submersible motors.</div>
        </div>
        <div>
          <div>Contact: +91 8071794067</div>
          <div>Email: support@splendor.com</div>
          <div>Address: Unit:1-NH 8-B, Shining Gate, Shapar Industrial Area, Tal - Kotda, Sangani, Dist.,rajkot Unit: 2- Plot No 18 to 21, vavdi industrial area , vavdi , rajkot, 360004Rajkot-360024, Gujarat, India</div>
        </div>
      </div>
    </div>
  </footer>
);

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <nav className="nav">
        <div className="container nav-inner">
          <div style={{ fontWeight: 800, fontSize: 18 }}>
            <Link to="/">Borewell & Pipes</Link>
          </div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/services">Borewell Services</Link>
            <Link to="/maintenance">Maintenance</Link>
            {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
            {['admin', 'employee'].includes(user?.role) && <Link to="/orders">Manage Orders</Link>}
            {user?.role === 'user' && <Link to="/orders">My Orders</Link>}
            <Link to="/contact">Contact</Link>
            {!user && <Link to="/login">Login</Link>}
            {!user && <Link to="/register">Register</Link>}
            {user && (
              <button className="button outline" onClick={logout}>
                Logout ({user.name})
              </button>
            )}
          </div>
        </div>
      </nav>
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

