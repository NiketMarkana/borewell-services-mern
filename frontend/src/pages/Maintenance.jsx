import React from 'react';

const blocks = [
  {
    title: 'Borewell – User Side Maintenance',
    do: [
      'Use borewell water regularly (long gaps cause silting).',
      'Install a sand filter / screen at delivery point.',
      'Keep borewell cap sealed to prevent dust, insects, and surface water.',
      'Maintain proper drainage around borewell to avoid dirty water entry.',
      'Check water color and sand content monthly.'
    ],
    avoid: [
      'Over-pumping beyond recommended hours.',
      'Running pump when water level is low.',
      'Allowing chemicals, sewage, or oil near borewell area.'
    ],
    call: [
      'Water turns muddy or sandy.',
      'Sudden drop in water yield.',
      'Pump vibration or unusual noise.'
    ]
  },
  {
    title: 'HDPE & PVC Pipes – User Side Maintenance',
    do: [
      'Protect from direct sunlight (use cover or underground).',
      'Ensure proper support/clamps to avoid sagging.',
      'Check joints for leakage every 3–6 months.',
      'Flush pipeline occasionally to remove sediments.',
      'Use proper solvent cement at joints (PVC).',
      'Inspect joints and valves periodically (PVC).'
    ],
    avoid: [
      'Sharp bends or twisting (HDPE).',
      'Exceeding pressure rating (HDPE).',
      'Dragging pipes on sharp surfaces (HDPE).',
      'Hot water flow unless CPVC (PVC).',
      'Direct sun exposure for long periods (PVC).',
      'Excess pressure (PVC).'
    ],
    call: [
      'Cracks appear.',
      'Frequent joint leakage.',
      'Pressure drop.'
    ]
  },
  {
    title: 'Submersible Motor / Pump – User Side Maintenance',
    do: [
      'Ensure proper voltage supply (use stabilizer if needed).',
      'Install dry-run protection and overload relay.',
      'Run motor at least once in 7–10 days.',
      'Check control panel for loose connections.',
      'Monitor electricity consumption changes.'
    ],
    avoid: [
      'Frequent ON/OFF switching.',
      'Running pump without water.',
      'Using undersized cables.'
    ],
    call: [
      'Motor trips frequently.',
      'Low water pressure.',
      'High power consumption.',
      'Burning smell or noise.'
    ]
  }
];

const Maintenance = () => (
  <div className="container section">
    <h2>Maintenance Guides</h2>
    <div className="grid cards-3">
      {blocks.map(block => (
        <div className="card" key={block.title}>
          <h3>{block.title}</h3>
          <div><strong>Do</strong></div>
          <ul>{block.do.map(item => <li key={item}>{item}</li>)}</ul>
          <div><strong>Avoid</strong></div>
          <ul>{block.avoid.map(item => <li key={item}>{item}</li>)}</ul>
          <div><strong>Call service if</strong></div>
          <ul>{block.call.map(item => <li key={item}>{item}</li>)}</ul>
        </div>
      ))}
    </div>
  </div>
);

export default Maintenance;

