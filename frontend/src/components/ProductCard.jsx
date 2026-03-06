import React from 'react';

const ProductCard = ({ product, onSelect }) => {
  const getFallbackImage = (product) => {
    const name = product.name?.toLowerCase() || '';
    const cat = product.category;

    if (name.includes('coil')) return '/assets/coil.png';
    if (name.includes('black')) return '/assets/black.png';
    if (name.includes('sprinkler')) return '/assets/sprinkler.png';

    if (cat === 'HDPE') return '/assets/hdpe.png';
    if (cat === 'PVC') return '/assets/pvc.png';
    if (cat === 'Submersible' || cat === 'Water Pump') return '/assets/submersible.png';
    return '/assets/hero.png';
  };

  return (
    <div className="card shadow-lg">
      <img src={product.image || getFallbackImage(product)} alt={product.name} />
      <h3 style={{ marginBottom: '0.25rem' }}>{product.name}</h3>
      <div className="muted" style={{ marginBottom: '0.5rem', fontWeight: 500 }}>
        {product.category} • {product.unit}
      </div>
      <p className="muted" style={{ flex: 1, fontSize: '0.9rem' }}>{product.description}</p>
      <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>₹{product.price}</div>
        <button className="button shadow" onClick={() => onSelect(product)}>Order Now</button>
      </div>
    </div>
  );
};

export default ProductCard;

