import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BorewellQuote = () => {
  const [formData, setFormData] = useState({
    feet: '', 
    soilType: '', 
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Gujarat',
    zipCode: '',
    country: 'India',
    name: '', 
    phone: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('borewellQuote', JSON.stringify(formData));
    alert(`Request submitted for ${formData.feet} at ${formData.addressLine1}, ${formData.city}! We'll contact you at ${formData.phone}`);
    navigate('/products');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 py-20">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
            🛠️ Borewell Quote
          </h1>
          <p className="text-xl text-gray-700">Submit your request for instant quote</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Depth Range */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">Required Depth Range</label>
              <select name="feet" value={formData.feet} onChange={handleChange} required
                      className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 text-lg">
                <option value="">Select depth range</option>
                <option value="100-200">100-200 feet</option>
                <option value="200-300">200-300 feet</option>
                <option value="300-500">300-500 feet (Most Common)</option>
                <option value="500-1000">500-1000 feet</option>
                <option value="1000-1500">1000-1500 feet (Deep)</option>
                <option value="1500-2000">1500-2000 feet</option>
                <option value="2000+">2000+ feet (Very Deep)</option>
              </select>
            </div>

            {/* Soil Type */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">Soil Type</label>
              <select name="soilType" value={formData.soilType} onChange={handleChange} required
                      className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 text-lg">
                <option value="">Select soil</option>
                <option value="Rocky">Rocky/Black stone</option>
                <option value="Hard">Hard soil</option>
                <option value="Sandy">Sandy/Loose soil</option>
                <option value="Clay">Clay soil</option>
              </select>
            </div>

            {/* 📍 NEW DETAILED ADDRESS FIELDS */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">House/Flat/Street Address (Address Line 1)</label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                required
                placeholder=""
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 text-lg"
              />
            </div>

            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">Area/Locality (Address Line 2 - Optional)</label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                placeholder=""
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 text-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-900 mb-3">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder=""
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 text-lg"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-900 mb-3">Postal Code / ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  placeholder=""
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 text-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-900 mb-3">State</label>
                <select name="state" value={formData.state} onChange={handleChange} required
                        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 text-lg">
                  <option value="Gujarat">Gujarat</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-900 mb-3">Country</label>
                <select name="country" value={formData.country} onChange={handleChange} required
                        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 text-lg">
                  <option value="India">India</option>
                </select>
              </div>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-900 mb-3">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder=""
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 text-lg"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-900 mb-3">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder=""
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 text-lg"
                />
              </div>
            </div>

            {/* ✅ NEW BUTTON TEXT */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-6 px-8 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all duration-300"
            >
              Submit Request →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BorewellQuote;
