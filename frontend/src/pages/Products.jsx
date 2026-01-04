import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data));
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Products & Services</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {products.map(product => (
          <div key={product._id} className="bg-white p-6 rounded-lg shadow border">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <p className="mb-2">{product.description}</p>
            <p className="text-2xl font-bold text-green-600 mb-4">₹{product.price}</p>
            <p className="mb-4"><strong>Specs:</strong> {JSON.stringify(product.specs)}</p>
            <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 w-full">
              Book Now / Enquiry
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
