import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import BorewellQuote from './pages/BorewellQuote';
import './index.css';

function App() {
  const [user, setUser] = useState(null);

  // ✅ CHECK localStorage ON EVERY CHANGE
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedToken) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (e) {
          console.error('Invalid user data in localStorage');
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } else {
        setUser(null);
      }
    };

    // Initial check
    checkAuth();

    // ✅ LISTEN FOR STORAGE CHANGES (Fixes login issue)
    window.addEventListener('storage', checkAuth);
    
    // Check every 500ms for login state changes
    const interval = setInterval(checkAuth, 500);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="App">
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/borewell-quote" element={<BorewellQuote />} />
      </Routes>
    </div>
  );
}

export default App;
