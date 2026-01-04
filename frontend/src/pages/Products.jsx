import { Link } from 'react-router-dom';

const Products = () => {
  const services = [
    {
      title: "Borewell Services",
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop",
      icon: "🛠️",
      link: "/borewell-quote"
    },
    {
      title: "HDPE/PVC Pipe Products", 
      image: "https://images.unsplash.com/photo-1586579519010-1ee1ff6ddb2e?w=400&h=300&fit=crop",
      icon: "🔧",
      link: "#"
    },
    {
      title: "Submersible Pumps",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop", 
      icon: "💧",
      link: "#"
    },
    {
      title: "Maintenance",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      icon: "🔧",
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Our Services
          </h1>
          <p className="text-xl text-gray-600">Complete borewell solutions</p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-4 transition-all duration-500 overflow-hidden h-full">
                {/* Image */}
                <div className="h-64 bg-cover bg-center relative group-hover:scale-110 transition-transform duration-500" 
                     style={{ backgroundImage: `url(${service.image})` }}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
                  <div className="absolute top-6 left-6">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">{service.icon}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    {service.title}
                  </h3>
                  
                  {/* Explore Button */}
                  <div className="flex justify-center">
                    <Link 
                      to={service.link}
                      className={`px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-white ${
                        index === 0 
                          ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700' 
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                      }`}
                    >
                      Explore →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
