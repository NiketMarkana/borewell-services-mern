import { useState, useEffect } from 'react'
import axios from 'axios'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => {
        setProducts(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Products load error:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Products & Services
        </h1>
        
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500 mb-4">No products available</p>
            <p className="text-lg text-gray-400">Run <code>npm run seed</code> in backend first</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <div key={product._id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl p-8 hover:-translate-y-2 transition-all border border-gray-100">
                <img 
                  src={product.image || 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=No+Image'} 
                  alt={product.name} 
                  className="w-full h-48 object-cover rounded-xl mb-6"
                />
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{product.name}</h3>
                <p className="text-gray-600 mb-6 min-h-[60px]">{product.description || 'High quality borewell service/product'}</p>
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-green-600">₹{product.price?.toLocaleString()}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p><strong>Category:</strong> {product.category?.toUpperCase()}</p>
                    {product.specs && (
                      <p className="break-words"><strong>Specs:</strong> {JSON.stringify(product.specs)}</p>
                    )}
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200">
                  Book Service / Enquiry
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
