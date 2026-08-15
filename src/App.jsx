import React, { useState, useEffect, useRef } from 'react';
import LonarCanvas from './components/LonarCanvas';
import Navbar from './components/Navbar';
import HUDOverlay from './components/HUDOverlay';
import { toggleAmbientWind } from './utils/soundEffects';
import { 
  Sparkles, 
  X,
  Compass,
  Flame,
  Landmark,
  Microscope,
  Satellite,
  Info
} from 'lucide-react';

const BADGES = {
  0: { 
    text: '~50,000 BP Pre-Impact Plateau', 
    info: 'Dense prehistoric forest on the flat basalt plateau before the meteor crash.', 
    bg: 'rgba(34, 197, 94, 0.2)', 
    color: '#22c55e', 
    lightColor: '#15803d',
    lightBg: 'rgba(21, 128, 61, 0.14)',
    icon: Compass 
  },
  1: { 
    text: 'Impact Day Hypervelocity Collision', 
    info: 'A massive meteor strikes Earth at high speed, excavating the deep crater basin.', 
    bg: 'rgba(239, 68, 68, 0.2)', 
    color: '#ef4444', 
    lightColor: '#b91c1c',
    lightBg: 'rgba(185, 28, 28, 0.14)',
    icon: Flame 
  },
  2: { 
    text: '~1,200 AD Medieval Temple Era', 
    info: 'Ancient temples are built along the lush crater slopes and freshwater springs.', 
    bg: 'rgba(234, 179, 8, 0.2)', 
    color: '#eab308', 
    lightColor: '#a16207',
    lightBg: 'rgba(161, 98, 7, 0.14)',
    icon: Landmark 
  },
  3: { 
    text: 'June 2020 Pink Lake Bloom', 
    info: 'High heat & salt levels trigger haloarchaea microbes, turning the water bright pink!', 
    bg: 'rgba(236, 72, 153, 0.2)', 
    color: '#ec4899', 
    lightColor: '#be185d',
    lightBg: 'rgba(190, 24, 93, 0.14)',
    icon: Microscope 
  },
  4: { 
    text: 'Present Day Modern Satellite DEM', 
    info: 'Current 3D topography and satellite map of Lonar Crater.', 
    bg: 'rgba(56, 189, 248, 0.2)', 
    color: '#38bdf8', 
    lightColor: '#0284c7',
    lightBg: 'rgba(2, 132, 199, 0.14)',
    icon: Satellite 
  }
};

export default function App() {
  const [viewMode, setViewMode] = useState('SATELLITE');
  const [phLevel, setPhLevel] = useState(10.5);
  const [waterLevel, setWaterLevel] = useState(0);
  const [cameraPreset, setCameraPreset] = useState('DEFAULT');
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showWater, setShowWater] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [epochIndex, setEpochIndex] = useState(4);
  const [realDemInfo, setRealDemInfo] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [smoothPasses, setSmoothPasses] = useState(2);
  const [texScale, setTexScale] = useState(1.0);
  const [texOffsetX, setTexOffsetX] = useState(0);
  const [texOffsetY, setTexOffsetY] = useState(0);
  const [isIdle, setIsIdle] = useState(false);

  // Epoch Tooltip Hover State
  const [showEpochTooltip, setShowEpochTooltip] = useState(false);
  const epochTooltipTimerRef = useRef(null);

  const handleMouseEnterEpoch = () => {
    if (epochTooltipTimerRef.current) clearTimeout(epochTooltipTimerRef.current);
    setShowEpochTooltip(true);
  };

  const handleMouseLeaveEpoch = () => {
    if (epochTooltipTimerRef.current) clearTimeout(epochTooltipTimerRef.current);
    epochTooltipTimerRef.current = setTimeout(() => {
      setShowEpochTooltip(false);
    }, 350);
  };

  // 10-Second Mouse / Keyboard Inactivity Timer for Auto-Hiding HUD
  useEffect(() => {
    let idleTimer;

    const resetIdleTimer = () => {
      setIsIdle(false);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setIsIdle(true);
      }, 10000); // 10 seconds idle timeout
    };

    resetIdleTimer();

    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('mousedown', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('touchstart', resetIdleTimer);

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('mousedown', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      window.removeEventListener('touchstart', resetIdleTimer);
    };
  }, []);

  // Sync [data-theme] attribute on document root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleToggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    toggleAmbientWind(next, showWater);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSelectPreset = (presetName) => {
    setCameraPreset({ name: presetName, key: Date.now() });
  };

  const handleResetView = () => {
    setViewMode('SATELLITE');
    setPhLevel(10.5);
    setWaterLevel(0);
    setCameraPreset({ name: 'DEFAULT', key: Date.now() });
    setAutoRotate(true);
    setSelectedHotspot(null);
    setShowWater(true);
    setShowGrid(true);
    setEpochIndex(4);
  };

  const currentBadge = BADGES[epochIndex] || BADGES[4];
  const BadgeIcon = currentBadge.icon;
  const badgeColor = darkMode ? currentBadge.color : currentBadge.lightColor;
  const badgeBg = darkMode ? currentBadge.bg : currentBadge.lightBg;

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* 3D WebGL Canvas (Always Active & Responds to Mouse Drag Rotation) */}
      <LonarCanvas
        viewMode={viewMode}
        phLevel={phLevel}
        waterLevel={waterLevel}
        cameraPreset={cameraPreset}
        autoRotate={autoRotate}
        setAutoRotate={setAutoRotate}
        onSelectHotspot={(poi) => setSelectedHotspot(poi)}
        activeHotspotId={selectedHotspot?.id}
        smoothPasses={smoothPasses}
        texScale={texScale}
        texOffsetX={texOffsetX}
        texOffsetY={texOffsetY}
        showGrid={showGrid}
        epochIndex={epochIndex}
        onDemLoaded={(info) => setRealDemInfo(info)}
        showWater={showWater}
        darkMode={darkMode}
      />

      {/* Smooth Auto-Hiding HUD Overlay Wrapper (Always visible on mobile via .hud-wrapper CSS) */}
      <div className="hud-wrapper" style={{
        opacity: isIdle ? 0 : 1,
        pointerEvents: 'none',
        transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 20
      }}>
        {/* Epoch Indicator Badge with Dark / Light Mode Support & Hover Tooltip */}
        <div 
          className="mobile-hide" 
          onMouseEnter={handleMouseEnterEpoch}
          onMouseLeave={handleMouseLeaveEpoch}
          style={{
            position: 'absolute',
            top: '90px',
            left: '20px',
            zIndex: 15,
            pointerEvents: 'auto',
            background: badgeBg,
            border: `1px solid ${badgeColor}`,
            color: badgeColor,
            padding: '8px 14px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backdropFilter: 'var(--glass-blur)',
            WebkitBackdropFilter: 'var(--glass-blur)',
            boxShadow: `0 0 15px ${badgeBg}`,
            cursor: 'help',
            transition: 'all 0.3s ease'
          }}
        >
          <BadgeIcon size={16} />
          <span>{currentBadge.text}</span>

          {/* Floating Hover Tooltip Card directly below badge */}
          {showEpochTooltip && (
            <div
              onMouseEnter={handleMouseEnterEpoch}
              onMouseLeave={handleMouseLeaveEpoch}
              style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                marginTop: '10px',
                width: '320px',
                padding: '12px 16px',
                background: 'var(--bg-card)',
                backdropFilter: 'var(--glass-blur)',
                WebkitBackdropFilter: 'var(--glass-blur)',
                border: `1px solid ${badgeColor}`,
                borderRadius: '12px',
                boxShadow: `0 12px 30px rgba(0, 0, 0, 0.25), 0 0 15px ${badgeBg}`,
                zIndex: 30,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                pointerEvents: 'auto'
              }}
            >
              <Info size={16} color={badgeColor} style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.76rem', color: 'var(--text-main)', lineHeight: '1.45', fontWeight: '600' }}>
                {currentBadge.info}
              </p>
            </div>
          )}
        </div>

        {/* Top Header Navbar */}
        <div style={{ pointerEvents: 'auto' }}>
          <Navbar
            audioEnabled={audioEnabled}
            onToggleAudio={handleToggleAudio}
            onResetView={handleResetView}
            darkMode={darkMode}
            onToggleDarkMode={handleToggleDarkMode}
          />
        </div>

        {/* Lower Control HUD Overlay */}
        <HUDOverlay
          viewMode={viewMode}
          setViewMode={setViewMode}
          phLevel={phLevel}
          setPhLevel={setPhLevel}
          cameraPreset={cameraPreset}
          setCameraPreset={handleSelectPreset}
          autoRotate={autoRotate}
          setAutoRotate={setAutoRotate}
          showWater={showWater}
          setShowWater={setShowWater}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          epochIndex={epochIndex}
          setEpochIndex={setEpochIndex}
        />

        {/* Hotspot Click Detail Popup Modal (Hidden on Mobile) */}
        {selectedHotspot && epochIndex !== 0 && (
          <div className="glass-panel-glow mobile-hide" style={{
            position: 'absolute',
            top: showWater ? '135px' : '170px',
            left: '20px',
            width: '360px',
            zIndex: 25,
            pointerEvents: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: selectedHotspot.color }}>
                <Sparkles size={18} />
                <span>{selectedHotspot.title}</span>
              </div>
              <button onClick={() => setSelectedHotspot(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
              {selectedHotspot.summary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
