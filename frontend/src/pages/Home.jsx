import React from 'react';
import { Link } from 'react-router-dom';

const cardData = [
  { title: 'Borewell Services', to: '/services', desc: 'Request borewell drilling with full details', img: '/assets/hero.png' },
  { title: 'HDPE Pipe Products', to: '/products?category=HDPE', desc: 'Sprinkler, coil, black pipes', img: '/assets/hdpe.png' },
  { title: 'PVC Pipe Products', to: '/products?category=PVC', desc: 'UPVC, agricultural, round pipes', img: '/assets/pvc.png' },
  { title: 'Water Pump Products', to: '/products?category=Water Pump', desc: 'Borewell & Openwell submersible pumps', img: '/assets/submersible.png' },
  { title: 'Maintenance Guides', to: '/maintenance', desc: 'Do/Avoid tips for all categories', img: '/assets/maintenance.png' }
];

const Home = () => (
  <div className="container">
    <section className="hero">
      <h1 style={{ fontSize: 32, marginBottom: 10 }}>Borewell Services & Pipes</h1>
      <p className="muted">End-to-end borewell, HDPE/PVC pipes, and submersible motors with transparent tracking.</p>
      <div className="card-actions" style={{ justifyContent: 'center', marginTop: 14 }}>
        <Link to="/services" className="button">Book Borewell Service</Link>
        <Link to="/products" className="button secondary">Shop Products</Link>
      </div>
    </section>

    <section className="section">
      <h2 style={{ marginBottom: '2rem' }}>Explore Our Categories</h2>
      <div className="grid cards-4">
        {cardData.map(card => (
          <Link key={card.title} to={card.to} className="card shadow-lg">
            <img src={card.img} alt={card.title} />
            <h3 style={{ marginTop: '0.5rem' }}>{card.title}</h3>
            <p className="muted">{card.desc}</p>
            <div style={{ marginTop: 'auto', fontWeight: 700, color: 'var(--primary)', padding: '12px 0' }}>Discover More →</div>
          </Link>
        ))}
      </div>
    </section>
  </div>
);

export default Home;

