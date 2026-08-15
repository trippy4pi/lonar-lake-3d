import React from 'react';
import { X, Compass, Globe, Mountain } from 'lucide-react';

const COMPARISON_DATA = [
  {
    name: 'Lonar Crater',
    location: 'Maharashtra, India',
    target: 'Deccan Traps Basalt',
    diameter: '1.8 km',
    depth: '137 m',
    age: '~52,000 BP',
    highlight: 'Only hypervelocity basalt impact crater on Earth with alkaline soda lake',
    color: '#38bdf8'
  },
  {
    name: 'Barringer Crater',
    location: 'Arizona, USA',
    target: 'Limestone & Sandstone',
    diameter: '1.2 km',
    depth: '170 m',
    age: '~50,000 BP',
    highlight: 'Classic bowl-shaped impact crater in sedimentary rock target',
    color: '#f59e0b'
  },
  {
    name: 'Pingualuit Crater',
    location: 'Quebec, Canada',
    target: 'Granite & Gneiss',
    diameter: '3.4 km',
    depth: '267 m',
    age: '1.4 Million BP',
    highlight: 'Deep blue freshwater lake in crystalline Canadian Shield shield rock',
    color: '#10b981'
  },
  {
    name: 'Gusev Crater (Mars)',
    location: 'Aeolis Quadrangle, Mars',
    target: 'Martian Basaltic Plains',
    diameter: '166 km',
    depth: '1.5 km',
    age: '~3.7 Billion BP',
    highlight: 'Huge Martian basalt impact basin explored by NASA Spirit rover',
    color: '#f43f5e'
  }
];

export default function CraterComparisonModal({ onClose }) {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel-glow" style={{
        width: '900px',
        maxWidth: '100%',
        maxHeight: '90vh',
        padding: '30px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Compass size={28} color="var(--accent-cyan)" />
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Global Impact Crater Comparison</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Comparing Target Geology, Morphometry & Planetary Analogues</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {COMPARISON_DATA.map((c, idx) => (
            <div key={idx} style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              padding: '18px',
              border: `1px solid ${c.color}44`,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ borderBottom: `2px solid ${c.color}`, paddingBottom: '8px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: c.color }}>{c.name}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.location}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Target Rock: </span>
                  <strong style={{ color: '#fff' }}>{c.target}</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Rim Diameter: </span>
                  <strong className="font-mono" style={{ color: c.color }}>{c.diameter}</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Crater Depth: </span>
                  <strong className="font-mono" style={{ color: '#fff' }}>{c.depth}</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Impact Age: </span>
                  <strong className="font-mono" style={{ color: 'var(--text-muted)' }}>{c.age}</strong>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '6px' }}>
                "{c.highlight}"
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
