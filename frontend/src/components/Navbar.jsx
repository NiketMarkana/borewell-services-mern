import { Link } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 py-4">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            💧 Borewell Pro
          </Link>
          
          {/* Navigation Links + Auth */}
          <div className="flex items-center space-x-6">
            {/* Main Links - Always visible */}
            <Link to="/" className="hover:text-blue-600 font-semibold transition-colors">Home</Link>
            <Link to="/products" className="hover:text-blue-600 font-semibold transition-colors">Products</Link>
            
            {/* AUTH SECTION */}
            {user ? (
              /* ✅ LOGGED IN: Name Only + Logout */
              <div className="flex items-center space-x-4 ml-4">
                {/* User Name Only */}
                <span className="text-lg font-bold text-gray-800 bg-gray-100 px-4 py-2 rounded-xl shadow-md">
                  {user.name}
                </span>
                
                {/* Admin Button - Admin Only */}
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  >
                    👑 Admin
                  </Link>
                )}
                
                {/* Logout Button */}
                <button 
                  onClick={logout} 
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              /* ✅ NOT LOGGED IN: Single Login + Sign Up */
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-2xl font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-lg"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
