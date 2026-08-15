import React, { useState } from 'react';
import { X, Zap, Flame, ShieldAlert, Volume2, Sparkles } from 'lucide-react';
import { calculateImpactPhysics } from '../utils/impactPhysics';
import { playImpactRumble } from '../utils/soundEffects';

export default function ImpactSimulator({ onClose }) {
  const [meteorDiameter, setMeteorDiameter] = useState(60);
  const [meteorVelocity, setMeteorVelocity] = useState(20);
  const [impactAngle, setImpactAngle] = useState(45);
  const [composition, setComposition] = useState('IRON');

  const densityMap = {
    IRON: 7800, // Iron-Nickel meteoroid (like Lonar suspect)
    CHONDRITE: 3500, // Stony meteorite
    COMET: 1000 // Ice/Dust comet
  };

  const results = calculateImpactPhysics({
    meteorDiameter,
    meteorVelocity,
    meteorDensity: densityMap[composition],
    impactAngle
  });

  return (
    <div className="glass-panel-glow" style={{
      position: 'absolute',
      top: '90px',
      right: '20px',
      width: '440px',
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
          <Zap size={22} color="var(--accent-amber)" />
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Impact Physics Simulator</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hyper-Velocity Basalt Collision Engine</p>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      {/* Sliders Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Impactor Type */}
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            Impactor Composition
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
            <button
              className={`hud-btn ${composition === 'IRON' ? 'active' : ''}`}
              onClick={() => setComposition('IRON')}
              style={{ fontSize: '0.75rem', padding: '6px' }}
            >
              Iron (7.8 g/cm³)
            </button>

            <button
              className={`hud-btn ${composition === 'CHONDRITE' ? 'active' : ''}`}
              onClick={() => setComposition('CHONDRITE')}
              style={{ fontSize: '0.75rem', padding: '6px' }}
            >
              Stony (3.5 g/cm³)
            </button>

            <button
              className={`hud-btn ${composition === 'COMET' ? 'active' : ''}`}
              onClick={() => setComposition('COMET')}
              style={{ fontSize: '0.75rem', padding: '6px' }}
            >
              Comet (1.0 g/cm³)
            </button>
          </div>
        </div>

        {/* Meteorite Diameter Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Bolide Diameter</span>
            <span className="font-mono" style={{ color: 'var(--accent-amber)' }}>{meteorDiameter} meters</span>
          </div>
          <input
            type="range"
            min="20"
            max="180"
            value={meteorDiameter}
            onChange={(e) => setMeteorDiameter(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-amber)', cursor: 'pointer' }}
          />
        </div>

        {/* Impact Velocity Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Impact Velocity</span>
            <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>{meteorVelocity} km/s</span>
          </div>
          <input
            type="range"
            min="11"
            max="35"
            value={meteorVelocity}
            onChange={(e) => setMeteorVelocity(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
          />
        </div>

        {/* Impact Angle Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Trajectory Trajectory Angle</span>
            <span className="font-mono" style={{ color: 'var(--accent-emerald)' }}>{impactAngle}°</span>
          </div>
          <input
            type="range"
            min="15"
            max="90"
            value={impactAngle}
            onChange={(e) => setImpactAngle(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-emerald)', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Computed Physics Output Cards */}
      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-glow)' }}>
        <h3 style={{ fontSize: '0.85rem', color: 'var(--accent-amber)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} /> Calculated Impact Energy & Crater Metrics
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Kinetic Energy</div>
            <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-amber)' }}>
              {results.energyMegatons} MT
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>TNT Equivalent (~400x Hiroshima)</div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Peak Shock Pressure</div>
            <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-rose)' }}>
              {results.peakShockPressureGPa} GPa
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Hypervelocity Shock Wave</div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Calculated Rim Diameter</div>
            <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>
              {results.craterDiameterKm} km
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Actual Lonar: 1.8 km</div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Crater Depth</div>
            <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-emerald)' }}>
              {results.craterDepthMeters} m
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Actual Lonar: 137 m</div>
          </div>
        </div>
      </div>

      {/* Audio Acoustic Impact Test Button */}
      <button
        className="hud-btn"
        onClick={() => playImpactRumble()}
        style={{
          width: '100%',
          justifyContent: 'center',
          padding: '12px',
          background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.2), rgba(245, 158, 11, 0.2))',
          borderColor: 'var(--accent-rose)',
          fontWeight: '700',
          fontSize: '0.9rem'
        }}
      >
        <Volume2 size={18} color="var(--accent-rose)" />
        <span>Simulate Audio Impact Shockwave</span>
      </button>
    </div>
  );
}
