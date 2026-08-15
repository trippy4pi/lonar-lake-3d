import React from 'react';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw,
  MapPin,
  Sun,
  Moon
} from 'lucide-react';

export default function Navbar({
  audioEnabled,
  onToggleAudio,
  onResetView,
  darkMode = true,
  onToggleDarkMode
}) {
  return (
    <header className="glass-panel-glow" style={{
      position: 'absolute',
      top: '16px',
      left: '16px',
      right: '16px',
      zIndex: 10,
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px'
    }}>
      {/* Brand info with Clickable Google Maps Location Pin Icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <a
          href="https://www.google.com/maps/place/lonar+lake/data=!4m2!3m1!1s0x3bd0831f7893dac5:0xc44092ad4c581487?sa=X&ved=1t:155783&ictx=111"
          target="_blank"
          rel="noopener noreferrer"
          title="View Lonar Lake on Google Maps"
          style={{
            background: 'linear-gradient(135deg, #38bdf8, #a855f7)',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, boxShadow 0.2s ease',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.boxShadow = '0 0 22px rgba(56, 189, 248, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1.0)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(56, 189, 248, 0.4)';
          }}
        >
          <MapPin size={20} color="#fff" />
        </a>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
          <h1 style={{ 
            fontSize: '1.35rem', 
            fontWeight: '700', 
            letterSpacing: '-0.01em', 
            color: 'var(--text-main)',
            lineHeight: 1.1
          }}>
            LONAR CRATER 3D
          </h1>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>
            by{' '}
            <a
              href="https://www.picmica.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--accent-cyan)',
                textDecoration: 'none',
                fontWeight: '600'
              }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              Picmica
            </a>
          </span>
        </div>
      </div>

      {/* Header Controls / Utilities */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          className="hud-btn"
          onClick={onToggleAudio}
          title={audioEnabled ? "Mute Ambient Crater Audio" : "Enable Ambient Crater Audio"}
        >
          {audioEnabled ? <Volume2 size={16} color="var(--accent-cyan)" /> : <VolumeX size={16} />}
          <span>{audioEnabled ? "Audio ON" : "Audio OFF"}</span>
        </button>

        <button
          className="hud-btn"
          onClick={onResetView}
          title="Reset Camera View"
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>

        {/* Dark / Light Mode Toggle Button */}
        <button
          className="hud-btn"
          onClick={onToggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={16} color="var(--accent-amber)" /> : <Moon size={16} color="var(--accent-purple)" />}
          <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>
    </header>
  );
}
