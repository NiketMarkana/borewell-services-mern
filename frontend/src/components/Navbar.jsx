import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            💧 Borewell Pro
          </Link>
          <div className="space-x-4">
            <Link to="/" className="px-4 py-2 hover:bg-blue-100 rounded-lg transition-all">Home</Link>
            <Link to="/products" className="px-4 py-2 hover:bg-blue-100 rounded-lg transition-all">Products</Link>
            <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-all font-medium">Login</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
