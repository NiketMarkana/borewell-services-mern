import { Link, useLocation } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-white drop-shadow-lg">
          💧 Borewell Services
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/" className={`hover:text-blue-200 ${location.pathname === '/' ? 'underline' : ''}`}>Home</Link>
          <Link to="/products" className={`hover:text-blue-200 ${location.pathname === '/products' ? 'underline' : ''}`}>Products</Link>
          {token && (
            <>
              <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
              {user.role === 'admin' && <Link to="/admin" className="hover:text-blue-200">Admin</Link>}
              <button onClick={logout} className="flex items-center space-x-1 hover:text-blue-200">
                <LogOut size={20} /> <span>Logout</span>
              </button>
            </>
          )}
          {!token && (
            <>
              <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 font-medium">Login</Link>
              <Link to="/register" className="bg-transparent border-2 border-white text-white px-4 py-2 rounded-lg hover:bg-white hover:text-blue-600 font-medium">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
