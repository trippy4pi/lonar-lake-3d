import React from 'react';
import { X, Layers, Flame, Compass, Droplets, Zap, ShieldAlert } from 'lucide-react';

export default function GeologyPanel({ onClose }) {
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
          <Layers size={22} color="var(--accent-cyan)" />
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Lonar Crater Geomorphology</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deccan Traps Flood Basalt Target</p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Rarity & Scientific Importance Alert Box */}
      <div style={{
        background: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '10px',
        padding: '12px',
        fontSize: '0.82rem',
        lineHeight: '1.5'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: 'var(--accent-amber)', marginBottom: '4px' }}>
          <ShieldAlert size={16} /> World's Only Hyper-Velocity Basalt Impact Crater
        </div>
        Lonar Lake is extremely rare because it formed entirely in <strong>dense, stratified basaltic lava flows</strong> of the Deccan Traps. It serves as a terrestrial analogue for planetary impact craters on <strong>Mars, Venus, and the Moon</strong>.
      </div>

      {/* Key Morphometry Specs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Crater Diameter</div>
          <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>1.8 km</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Nearly circular rim</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Crater Depth</div>
          <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--accent-amber)' }}>137 m</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Below outer plain</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Raised Rim Height</div>
          <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--accent-emerald)' }}>~20 m</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Overturned ejecta flap</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Impact Age</div>
          <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-purple)' }}>52k - 570k BP</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Pleistocene Epoch</div>
        </div>
      </div>

      {/* Stratigraphy & Rock Layers */}
      <div>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Flame size={16} color="var(--accent-amber)" /> Basalt Stratigraphy (Deccan Traps)
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '10px' }}>
          The inner slopes of Lonar Crater expose multiple horizontal lava flows created during volcanic eruptions 65 million years ago:
        </p>

        <ul style={{ fontSize: '0.8rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '8px', listStyle: 'none' }}>
          <li style={{ background: 'rgba(255,255,255,0.04)', padding: '8px 12px', borderRadius: '6px', borderLeft: '3px solid #ebcb8b' }}>
            <strong>1. Upper Weathered Basalt & Soil:</strong> 5–10m of altered yellowish-brown basaltic soil and slope wash.
          </li>
          <li style={{ background: 'rgba(255,255,255,0.04)', padding: '8px 12px', borderRadius: '6px', borderLeft: '3px solid #8fbcbb' }}>
            <strong>2. Vesicular Basalt Flow Unit:</strong> Highly porous basalt filled with gas vesicles and zeolites.
          </li>
          <li style={{ background: 'rgba(255,255,255,0.04)', padding: '8px 12px', borderRadius: '6px', borderLeft: '3px solid #5e81ac' }}>
            <strong>3. Dense Compact Basalt:</strong> Hard, dark microcrystalline plagioclase-augite volcanic rock.
          </li>
          <li style={{ background: 'rgba(255,255,255,0.04)', padding: '8px 12px', borderRadius: '6px', borderLeft: '3px solid #b48ead' }}>
            <strong>4. Sub-Surface Impact Breccia Lens:</strong> Shattered fragments of basalt embedded in impact melt glass.
          </li>
        </ul>
      </div>

      {/* Soda Lake Hydrology & Microbes */}
      <div>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Droplets size={16} color="var(--accent-pink)" /> Soda Lake Chemistry & Color Shifts
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          Lonar Lake has no natural outlet. Evaporation concentrates salts, resulting in an extreme alkaline pH (~10.5) and high salinity. In 2020, the lake suddenly turned <strong>vibrant pink</strong> due to a bloom of halo-alkaliphilic micro-algae (<em>Dunaliella salina</em>) responding to increased salinity and warm solar irradiation!
        </p>
      </div>
    </div>
  );
}
