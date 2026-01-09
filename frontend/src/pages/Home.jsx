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


    </div>
  )
}

export default Home 
