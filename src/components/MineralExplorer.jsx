import React from 'react';
import { X, Gem, Zap, Layers, Sparkles } from 'lucide-react';

const MINERALS = [
  {
    name: 'Maskelynite Glass',
    formula: 'Isotropic Plagioclase Glass',
    shockPressure: '>60 GPa',
    color: '#f43f5e',
    summary: 'Unique diaplectic glass created when hyper-velocity shock waves melt plagioclase feldspar without disrupting bulk rock texture. Lonar is the premier terrestrial location for studying maskelynite!'
  },
  {
    name: 'Shatter Cones',
    formula: 'Striated Conical Basalt Fractures',
    shockPressure: '20 - 40 GPa',
    color: '#f59e0b',
    summary: 'Striated conical fracture structures in host basalt that point back toward the original hypervelocity impact focus point.'
  },
  {
    name: 'Augite (Clinopyroxene)',
    formula: '(Ca,Mg,Fe,Al)₂ (Si,Al)₂O₆',
    shockPressure: 'Target Rock Crystalline',
    color: '#10b981',
    summary: 'Dark silicate mineral abundant in Deccan Traps flood basalts. Gives Lonar basalt rock its dark grey-black appearance.'
  },
  {
    name: 'Plagioclase Feldspar',
    formula: 'NaAlSi₃O₈ - CaAl₂Si₂O₈',
    shockPressure: 'Target Rock Crystalline',
    color: '#38bdf8',
    summary: 'Lath-shaped framework silicate mineral. Under extreme impact shock, its crystal lattice collapses to form Maskelynite.'
  },
  {
    name: 'Impact Breccia & Micro-Breccia',
    formula: 'Angular Basalt Fragments + Melt',
    shockPressure: 'Impact Excavation Zone',
    color: '#a855f7',
    summary: 'Fragmented basalt rock cemented together by melted impact glass, forming a sub-surface layer beneath the crater floor.'
  }
];

export default function MineralExplorer({ onClose }) {
  return (
    <div className="glass-panel-glow" style={{
      position: 'absolute',
      top: '90px',
      right: '20px',
      width: '420px',
      maxHeight: 'calc(100vh - 180px)',
      zIndex: 20,
      padding: '24px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Gem size={22} color="var(--accent-purple)" />
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Basalt Minerals & Shock Minerals</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deccan Traps & Impact Metamorphism</p>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      {/* Mineral Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {MINERALS.map((min, idx) => (
          <div key={idx} style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '10px',
            padding: '14px',
            borderLeft: `4px solid ${min.color}`,
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '700', fontSize: '0.92rem', color: '#fff' }}>{min.name}</span>
              <span className="font-mono" style={{ fontSize: '0.7rem', color: min.color, background: `${min.color}22`, padding: '2px 6px', borderRadius: '4px' }}>
                {min.shockPressure}
              </span>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {min.formula}
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
              {min.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
