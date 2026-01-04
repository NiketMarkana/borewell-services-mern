import React from 'react';

const Home = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Borewell, HDPE Pipe & Water Pump Services</h1>
      <p className="text-xl text-center mb-8">Book services and buy products easily online.</p>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl mb-4">Borewell Drilling</h2>
          <p>Reliable deep borewell services up to 500ft.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl mb-4">HDPE Pipes</h2>
          <p>High-quality pipes in all sizes and grades.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl mb-4">Water Pumps</h2>
          <p>Submersible and centrifugal pumps installation.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
