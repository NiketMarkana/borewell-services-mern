import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Check admin role from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user || user.role !== 'admin') {
      alert('❌ Admin access required!');
      navigate('/');
      return;
    }

    // ✅ Fake users data for testing (no API call)
    const fakeUsers = [
      { _id: '1', name: 'Markana Niket', email: 'niketpatelrjt6@gmail.com', phone: '9512624094', role: 'admin' },
      { _id: '2', name: 'Test User', email: 'testuser@gmail.com', phone: '9876543210', role: 'user' }
    ];
    
    setUsers(fakeUsers);
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">🔄 Loading Admin Panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-6">
            👑 Admin Dashboard
          </h1>
          <p className="text-2xl text-gray-600 font-semibold">Complete User Management</p>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
              <tr>
                <th className="p-8 text-left font-bold text-xl">👤 Name</th>
                <th className="p-8 text-left font-bold text-xl">📧 Email</th>
                <th className="p-8 text-left font-bold text-xl">📱 Phone</th>
                <th className="p-8 text-left font-bold text-xl">🎭 Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50 transition-all duration-200">
                  <td className="p-8 font-bold text-xl text-gray-900">{user.name}</td>
                  <td className="p-8 text-lg text-gray-700 max-w-lg">{user.email}</td>
                  <td className="p-8 text-lg text-gray-700">{user.phone}</td>
                  <td>
                    <span className={`px-6 py-3 rounded-full text-lg font-bold shadow-lg ${
                      user.role === 'admin'
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
