import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-32 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-black mb-8 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Borewell Services
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Complete solution for borewell drilling, HDPE pipes, water pumps and maintenance services
          </p>
          <Link 
            to="/products" 
            className="inline-block bg-white text-blue-600 px-12 py-6 rounded-3xl text-2xl font-bold hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >
            Explore Services →
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Our Services
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: '🛠️ Borewell Drilling', desc: 'Up to 500ft deep borewells with guaranteed yield', price: 'From ₹25,000' },
              { title: '🔧 HDPE Pipes', desc: '4"-12" industrial grade pipes', price: 'From ₹4,500' },
              { title: '💧 Water Pumps', desc: '1-10HP submersible & centrifugal pumps', price: 'From ₹8,500' }
            ].map((service, i) => (
              <div key={i} className="group bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-4 transition-all duration-300 border border-gray-100">
                <div className="text-5xl mb-6">{service.title.split(' ')[0]}</div>
                <h3 className="text-3xl font-bold mb-6 text-gray-800 group-hover:text-blue-600 transition-colors">{service.title.split(' ').slice(1).join(' ')}</h3>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">{service.desc}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">{service.price}</span>
                  <Link to="/products" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
