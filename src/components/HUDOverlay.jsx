import React, { useState, useRef } from 'react';
import { 
  Eye, 
  Droplets, 
  Video, 
  Map, 
  Activity, 
  Layers,
  EyeOff,
  Grid,
  History,
  Info,
  Compass,
  Mountain,
  Waves,
  Maximize2,
  RotateCw,
  Palette,
  ExternalLink,
  BookOpen,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { setWaterSoundVisible } from '../utils/soundEffects';

const EPOCHS = [
  { id: 0, year: '~50,000 BP', name: 'Pre-Impact Plateau' },
  { id: 1, year: 'Impact Day', name: 'Hypervelocity Collision' },
  { id: 2, year: '~1,200 AD', name: 'Medieval Temple Era' },
  { id: 3, year: 'June 2020', name: 'Pink Lake Bloom' },
  { id: 4, year: 'Present Day', name: 'Modern Satellite DEM' }
];

const DATA_SOURCES = [
  {
    id: 1,
    title: 'NASA SRTM 30m Global Digital Elevation Model (DEM)',
    description: '30m spatial resolution radar topography telemetry for Lonar crater rim (608m MSL) & basin floor (479m MSL).',
    linkText: 'USGS EarthExplorer DEM Data',
    url: 'https://earthexplorer.usgs.gov/'
  },
  {
    id: 2,
    title: 'Geological Survey of India (GSI) National Geo-Heritage Monuments',
    description: 'Deccan Traps flood basalt stratigraphy, ejecta blanket debris mapping, and shock metamorphism survey.',
    linkText: 'GSI National Geo-Heritage Sites Repository',
    url: 'https://www.gsi.gov.in/web/guest/geo-heritage-sites'
  },
  {
    id: 3,
    title: 'CSIR-NEERI & ARI Haloarchaea Microbes Remote Sensing Study (2020)',
    description: 'Limnology study on Haloarchaea carotenoid bloom & hyper-alkalinity (pH 9.5 – 11.2) published in NIH NCBI Geo-Bio Journal.',
    linkText: 'NIH NCBI PMC8574169: Haloarchaea Pigmentation in Lonar Lake',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8574169/'
  },
  {
    id: 4,
    title: 'LPI / GSA Shock Metamorphic Effects Handbook (French, B.M.)',
    description: 'Impact shock pressure equation of state (0 – 60+ GPa), shatter cones, Planar Deformation Features (PDFs), and Maskelynite glass.',
    linkText: 'LPI/USRA Traces of Catastrophe: Shock-Metamorphic Handbook',
    url: 'https://www.lpi.usra.edu/publications/books/CB-954/cb-954.intro.html'
  },
  {
    id: 5,
    title: 'Archaeological Survey of India (ASI) Protected Monuments (Maharashtra)',
    description: 'Historical records of Daitya Sudan & Chalukya / Yadava temple architecture (~1,200 AD) and crater forestation history.',
    linkText: 'ASI List of Protected Monuments in Maharashtra',
    url: 'https://asi.nic.in/protected-monuments-in-maharashtra/'
  }
];

// Helper to resolve exact water hex color based strictly on pH value
const getPhColor = (ph) => {
  if (ph > 10.8) return '#D14D73'; // Vibrant Rose Pink (pH 10.8 - 11.2+)
  if (ph > 10.5) return '#5B5834'; // Murky Greenish-Brown (pH 10.5 - 10.8)
  if (ph > 10.0) return '#1A6F75'; // Greenish-Blue Cyan (pH 10.0 - 10.5)
  if (ph >= 9.5) return '#0E5A36'; // Deep Emerald Green (pH 9.5 - 10.0)
  return '#228b22';               // Freshwater Green (pH < 9.5)
};

export default function HUDOverlay({
  viewMode,
  setViewMode,
  phLevel,
  setPhLevel,
  cameraPreset,
  setCameraPreset,
  autoRotate,
  setAutoRotate,
  showWater,
  setShowWater,
  showGrid,
  setShowGrid,
  epochIndex,
  setEpochIndex
}) {
  const [showSources, setShowSources] = useState(false);
  const [showDisclaimerTooltip, setShowDisclaimerTooltip] = useState(false);
  const leaveTimerRef = useRef(null);
  const disclaimerTimerRef = useRef(null);

  const currentEpoch = EPOCHS[epochIndex] || EPOCHS[4];
  const isWaterImpossible = epochIndex === 0 || epochIndex === 1;
  const isWaterCardHidden = isWaterImpossible || viewMode !== 'SATELLITE';
  const activePresetName = typeof cameraPreset === 'object' ? cameraPreset.name : cameraPreset;
  const activePhColor = getPhColor(phLevel);

  const handleEpochSelect = (idx) => {
    setEpochIndex(idx);
    if (idx === 0) {
      setViewMode('SATELLITE'); // Force Satellite mode in ~50,000 BP
      if (activePresetName === 'LAKE_VIEW') {
        setCameraPreset('DEFAULT'); // Force default orbit perspective if user was in Lake View
      }
    } else if (idx === 2) setPhLevel(9.8);      // Medieval ~1200 AD (Freshspring Inflow & Spirulina Cyanobacteria - pH 9.8)
    else if (idx === 3) setPhLevel(11.2); // June 2020 (Hyper-saline Pink Algae Bloom - pH 11.2)
    else if (idx === 4) setPhLevel(10.5); // Present Day (CSIR-NEERI Baseline Soda Alkalinity - pH 10.5)
  };

  // Grace Period Handlers for Sources Card
  const handleMouseEnterSources = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setShowSources(true);
  };

  const handleMouseLeaveSources = () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    leaveTimerRef.current = setTimeout(() => {
      setShowSources(false);
    }, 350);
  };

  // Grace Period Handlers for Extended Projection Offset Disclaimer Tooltip
  const handleMouseEnterDisclaimer = () => {
    if (disclaimerTimerRef.current) {
      clearTimeout(disclaimerTimerRef.current);
      disclaimerTimerRef.current = null;
    }
    setShowDisclaimerTooltip(true);
  };

  const handleMouseLeaveDisclaimer = () => {
    if (disclaimerTimerRef.current) clearTimeout(disclaimerTimerRef.current);
    disclaimerTimerRef.current = setTimeout(() => {
      setShowDisclaimerTooltip(false);
    }, 350);
  };

  const isPreImpact = epochIndex === 0;

  return (
    <>
      {/* Upper Right Corner: Lake Water Controls (Shrinks on mobile when water is OFF) */}
      {!isWaterCardHidden ? (
        <div className={`glass-panel water-card-panel ${!showWater ? 'water-off' : ''}`} style={{
          position: 'absolute',
          top: '90px',
          right: '16px',
          zIndex: 15,
          pointerEvents: 'auto',
          padding: '12px 18px',
          display: 'flex',
          gap: '18px',
          alignItems: 'center'
        }}>
          {/* Drain Water / Lake Toggle Button (Icon Removed) */}
          <button
            className={`hud-btn ${!showWater ? 'active' : ''}`}
            onClick={() => {
              const next = !showWater;
              setShowWater(next);
              setWaterSoundVisible(next);
            }}
            style={{
              borderColor: showWater ? 'var(--accent-cyan)' : 'var(--accent-amber)',
              color: showWater ? 'var(--accent-cyan)' : 'var(--accent-amber)',
              padding: '8px 14px',
              whiteSpace: 'nowrap'
            }}
            title="Toggle Lake Water ON / OFF"
          >
            <span>{showWater ? 'Lake Water ON' : 'Lake Water OFF'}</span>
          </button>

          {/* Clean Lake pH Slider with spacious gap between header & range input */}
          {showWater && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '175px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-main)', fontWeight: '600' }}>
                  <Droplets size={16} color={activePhColor} />
                  <span>Lake pH</span>
                </span>
                <span className="font-mono" style={{ color: activePhColor, fontWeight: '700' }}>
                  pH {phLevel.toFixed(1)}
                </span>
              </div>

              {/* Range Slider with gradient track matching #0E5A36 -> #1A6F75 -> #5B5834 -> #D14D73 */}
              <input
                type="range"
                min="7.0"
                max="11.5"
                step="0.1"
                value={phLevel}
                onChange={(e) => setPhLevel(Number(e.target.value))}
                style={{ 
                  width: '100%', 
                  accentColor: activePhColor, 
                  cursor: 'pointer',
                  borderRadius: '4px',
                  height: '6px',
                  background: 'linear-gradient(to right, #228b22 0%, #0E5A36 30%, #1A6F75 55%, #5B5834 78%, #D14D73 100%)'
                }}
              />
            </div>
          )}
        </div>
      ) : viewMode !== 'SATELLITE' ? (
        /* Legend & Scale Card with Line Breaks on Bracket Annotations */
        <div className="glass-panel" style={{
          position: 'absolute',
          top: '90px',
          right: '16px',
          zIndex: 15,
          pointerEvents: 'auto',
          padding: '14px 22px',
          width: '440px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={16} />
              {viewMode === 'ELEVATION' && 'Elevation DEM Scale (Meters MSL)'}
              {viewMode === 'GEOLOGY' && 'Geology Formations Legend'}
              {viewMode === 'SHOCK' && 'Shock Pressure Scale (GigaPascals)'}
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
              {viewMode === 'ELEVATION' && 'NASA SRTM Radar Topography — Height above Mean Sea Level (MSL)'}
              {viewMode === 'GEOLOGY' && 'Geological Survey of India (GSI) map — Rock formations & sediment layers'}
              {viewMode === 'SHOCK' && 'Impact Physics Model — Shockwave pressure decay from meteor collision point'}
            </span>
          </div>

          {/* Elevation DEM Scale with Pixel-Aligned Ticks */}
          {viewMode === 'ELEVATION' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{
                height: '20px',
                borderRadius: '5px',
                background: 'linear-gradient(to right, #1e1b4b 0%, #0284c7 25%, #10b981 50%, #f97316 75%, #ffffff 100%)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)',
                overflow: 'hidden'
              }} />

              {/* Tick Lines Positioned Exactly at 0%, 25%, 50%, 75%, 100% */}
              <div style={{ position: 'relative', width: '100%', height: '8px' }}>
                <span style={{ position: 'absolute', left: '0%', width: '2px', height: '8px', background: 'var(--text-muted)' }} />
                <span style={{ position: 'absolute', left: '25%', transform: 'translateX(-50%)', width: '2px', height: '8px', background: 'var(--text-muted)' }} />
                <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: '2px', height: '8px', background: 'var(--text-muted)' }} />
                <span style={{ position: 'absolute', left: '75%', transform: 'translateX(-50%)', width: '2px', height: '8px', background: 'var(--text-muted)' }} />
                <span style={{ position: 'absolute', right: '0%', width: '2px', height: '8px', background: 'var(--text-muted)' }} />
              </div>

              {/* Tick Labels Pixel-Aligned to Ticks */}
              <div style={{ position: 'relative', width: '100%', height: '36px', fontSize: '0.72rem', color: 'var(--text-main)', fontFamily: 'var(--font-mono)', fontWeight: '600', lineHeight: '1.3' }}>
                <span style={{ position: 'absolute', left: '0%', textAlign: 'left' }}>
                  479m<br />
                  <span style={{ fontSize: '0.63rem', color: 'var(--text-muted)', fontWeight: '400' }}>(Lake Floor)</span>
                </span>
                <span style={{ position: 'absolute', left: '25%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                  510m
                </span>
                <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                  540m
                </span>
                <span style={{ position: 'absolute', left: '75%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                  570m
                </span>
                <span style={{ position: 'absolute', right: '0%', textAlign: 'right' }}>
                  608m<br />
                  <span style={{ fontSize: '0.63rem', color: 'var(--text-muted)', fontWeight: '400' }}>(Rim Crest)</span>
                </span>
              </div>
            </div>
          )}

          {/* Simplified Geology Legend */}
          {viewMode === 'GEOLOGY' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '0.76rem', color: 'var(--text-main)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#312e81', border: '1px solid #6366f1' }} />
                <span>Deep Basalt Rock Wall (Rim Bedrock)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#15803d', border: '1px solid #22c55e' }} />
                <span>Impact Debris & Boulders (Ejecta)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#d97706', border: '1px solid #f59e0b' }} />
                <span>Crater Slope Sand & Scree</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#0e7490', border: '1px solid #06b6d4' }} />
                <span>Soda Lake Basin Mud (479m)</span>
              </div>
            </div>
          )}

          {/* Shock Pressure Scale with Pixel-Aligned Ticks */}
          {viewMode === 'SHOCK' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{
                height: '20px',
                borderRadius: '5px',
                background: 'linear-gradient(to right, #312e81 0%, #0284c7 25%, #f59e0b 50%, #ef4444 75%, #e11d48 100%)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)',
                overflow: 'hidden'
              }} />

              {/* Tick Lines Positioned Exactly at 0%, 25%, 50%, 75%, 100% */}
              <div style={{ position: 'relative', width: '100%', height: '8px' }}>
                <span style={{ position: 'absolute', left: '0%', width: '2px', height: '8px', background: 'var(--text-muted)' }} />
                <span style={{ position: 'absolute', left: '25%', transform: 'translateX(-50%)', width: '2px', height: '8px', background: 'var(--text-muted)' }} />
                <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: '2px', height: '8px', background: 'var(--text-muted)' }} />
                <span style={{ position: 'absolute', left: '75%', transform: 'translateX(-50%)', width: '2px', height: '8px', background: 'var(--text-muted)' }} />
                <span style={{ position: 'absolute', right: '0%', width: '2px', height: '8px', background: 'var(--text-muted)' }} />
              </div>

              {/* Tick Labels Pixel-Aligned to Ticks */}
              <div style={{ position: 'relative', width: '100%', height: '36px', fontSize: '0.72rem', color: 'var(--text-main)', fontFamily: 'var(--font-mono)', fontWeight: '600', lineHeight: '1.3' }}>
                <span style={{ position: 'absolute', left: '0%', textAlign: 'left' }}>
                  0 GPa<br />
                  <span style={{ fontSize: '0.63rem', color: 'var(--text-muted)', fontWeight: '400' }}>(Basalt)</span>
                </span>
                <span style={{ position: 'absolute', left: '25%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                  15 GPa
                </span>
                <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                  30 GPa<br />
                  <span style={{ fontSize: '0.63rem', color: 'var(--text-muted)', fontWeight: '400' }}>(PDFs)</span>
                </span>
                <span style={{ position: 'absolute', left: '75%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                  45 GPa
                </span>
                <span style={{ position: 'absolute', right: '0%', textAlign: 'right' }}>
                  &gt;60 GPa<br />
                  <span style={{ fontSize: '0.63rem', color: 'var(--text-muted)', fontWeight: '400' }}>(Melt)</span>
                </span>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Bottom Main HUD Controls Bar (Responsive Mobile Optimized) */}
      <div className="bottom-hud-bar" style={{
        position: 'absolute',
        bottom: '18px',
        left: '18px',
        right: '12px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'flex-end',
        gap: '14px',
        pointerEvents: 'none'
      }}>
        {/* 1. Historical Timeline Slider Panel (Always Visible, Full Width on Mobile) */}
        <div className="glass-panel mobile-full-width" style={{
          pointerEvents: 'auto',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '450px',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--accent-purple)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <History size={16} /> Historical Timeline Slider
            </div>
            <span className="font-mono" style={{ fontSize: '0.76rem', color: 'var(--accent-cyan)', fontWeight: '700' }}>
              {currentEpoch.year}
            </span>
          </div>

          {/* Timeline Slider Input */}
          <input
            type="range"
            min="0"
            max="4"
            step="1"
            value={epochIndex}
            onChange={(e) => handleEpochSelect(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-purple)', cursor: 'pointer' }}
          />

          {/* Timeline Stepper Buttons */}
          <div style={{ display: 'flex', gap: '5px', marginTop: '2px' }}>
            {EPOCHS.map((ep) => (
              <button
                key={ep.id}
                onClick={() => handleEpochSelect(ep.id)}
                className={`hud-btn ${epochIndex === ep.id ? 'active' : ''}`}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  fontSize: '0.68rem',
                  justifyContent: 'center',
                  borderColor: epochIndex === ep.id ? 'var(--accent-purple)' : 'var(--border-subtle)'
                }}
                title={`${ep.year}: ${ep.name}`}
              >
                {ep.year}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Terrain Visual Mode Toolbar (Hidden on Mobile) */}
        <div className="glass-panel mobile-hide" style={{
          pointerEvents: 'auto',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flexShrink: 0,
          position: 'relative'
        }}>
          {/* Friendly, Understandable Extended Tooltip Component with Author Credit */}
          {showDisclaimerTooltip && (
            <div 
              onMouseEnter={handleMouseEnterDisclaimer}
              onMouseLeave={handleMouseLeaveDisclaimer}
              style={{
                position: 'absolute',
                bottom: '100%',
                left: '0',
                marginBottom: '14px',
                width: '360px',
                padding: '16px 20px',
                background: 'rgba(15, 23, 42, 0.94)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '14px',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.7), 0 0 20px rgba(245, 158, 11, 0.2)',
                zIndex: 35,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                pointerEvents: 'auto'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', fontWeight: '700', fontSize: '0.8rem', borderBottom: '1px solid rgba(245, 158, 11, 0.25)', paddingBottom: '8px' }}>
                <AlertTriangle size={16} />
                <span>Note on 3D Terrain Alignment</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                Overlaying the satellite image onto the 3D terrain model might not be 100% perfect, so some visual features could appear slightly shifted.
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.48' }}>
                I apologize for any minor inaccuracies and am always open to your suggestions and feedback for improvements!
              </p>
              <div style={{ fontSize: '0.76rem', color: 'var(--accent-cyan)', fontWeight: '700', textAlign: 'right', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                — Abhishek
              </div>
            </div>
          )}

          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Palette size={16} /> Terrain Visual Mode
            </span>

            {/* Warning Trigger Badge with Grace Period Hover Handlers */}
            <div 
              onMouseEnter={handleMouseEnterDisclaimer}
              onMouseLeave={handleMouseLeaveDisclaimer}
              onClick={() => {
                if (disclaimerTimerRef.current) clearTimeout(disclaimerTimerRef.current);
                setShowDisclaimerTooltip(!showDisclaimerTooltip);
              }}
              style={{ 
                fontSize: '0.64rem', 
                color: 'var(--accent-amber)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                cursor: 'pointer',
                textTransform: 'none',
                fontWeight: '500',
                padding: '2px 6px',
                borderRadius: '6px',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                transition: 'all 0.2s ease'
              }}
            >
              <AlertTriangle size={12} color="var(--accent-amber)" />
              <span>*Projection disclaimer</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <button
              className={`hud-btn ${viewMode === 'SATELLITE' ? 'active' : ''}`}
              onClick={() => setViewMode('SATELLITE')}
            >
              <Eye size={15} />
              <span>Satellite</span>
            </button>

            <button
              className={`hud-btn ${viewMode === 'GEOLOGY' ? 'active' : ''}`}
              onClick={() => !isPreImpact && setViewMode('GEOLOGY')}
              disabled={isPreImpact}
              style={{
                opacity: isPreImpact ? 0.38 : 1,
                cursor: isPreImpact ? 'not-allowed' : 'pointer',
                filter: isPreImpact ? 'grayscale(0.8)' : 'none'
              }}
              title={isPreImpact ? "Geology map unavailable in ~50,000 BP (Pre-Impact Plateau)" : "Deccan Traps Geology Layer"}
            >
              <Layers size={15} />
              <span>Geology</span>
            </button>

            <button
              className={`hud-btn ${viewMode === 'ELEVATION' ? 'active' : ''}`}
              onClick={() => !isPreImpact && setViewMode('ELEVATION')}
              disabled={isPreImpact}
              style={{
                opacity: isPreImpact ? 0.38 : 1,
                cursor: isPreImpact ? 'not-allowed' : 'pointer',
                filter: isPreImpact ? 'grayscale(0.8)' : 'none'
              }}
              title={isPreImpact ? "Elevation DEM scale unavailable in ~50,000 BP (Pre-Impact Plateau)" : "NASA SRTM 30m Elevation DEM"}
            >
              <Map size={15} />
              <span>Elevation DEM</span>
            </button>

            <button
              className={`hud-btn ${viewMode === 'SHOCK' ? 'active' : ''}`}
              onClick={() => !isPreImpact && setViewMode('SHOCK')}
              disabled={isPreImpact}
              style={{
                opacity: isPreImpact ? 0.38 : 1,
                cursor: isPreImpact ? 'not-allowed' : 'pointer',
                filter: isPreImpact ? 'grayscale(0.8)' : 'none'
              }}
              title={isPreImpact ? "Shock pressure map unavailable in ~50,000 BP (Pre-Impact Plateau)" : "Impact Shock Wave Pressure Model"}
            >
              <Activity size={15} />
              <span>Shock Pressure</span>
            </button>

            {/* Lat / Lon Grid Toggle Button */}
            <button
              className={`hud-btn ${showGrid ? 'active' : ''}`}
              onClick={() => setShowGrid(!showGrid)}
              title="Toggle Lat / Lon Coordinate Grid Overlay"
            >
              <Grid size={15} color={showGrid ? 'var(--accent-cyan)' : 'currentColor'} />
              <span>{showGrid ? 'Grid ON' : 'Grid OFF'}</span>
            </button>
          </div>
        </div>

        {/* 3. Camera Navigation Control Panel (Hidden on Mobile) */}
        <div className="glass-panel mobile-hide" style={{
          pointerEvents: 'auto',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flexShrink: 0
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Video size={16} /> Camera Navigation Controls
            </span>
            <span style={{ fontSize: '0.64rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: '500', marginLeft: '10px' }}>
              Move: WASD Keys • Rotate: Arrow Keys • Zoom: +/- Keys
            </span>
          </div>
          <div style={{ display: 'flex', gap: '5px' }}>
            {/* Auto Rotate button positioned FIRST to the left of Perspective */}
            <button
              className={`hud-btn ${autoRotate ? 'active' : ''}`}
              onClick={() => setAutoRotate(!autoRotate)}
              style={{
                borderColor: autoRotate ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                color: autoRotate ? 'var(--accent-cyan)' : 'var(--text-muted)'
              }}
              title="Auto-Rotate Model (Default ON, turns OFF automatically on manual navigation)"
            >
              <RotateCw size={15} className={autoRotate ? 'hotspot-beacon' : ''} />
              <span>Auto Rotate</span>
            </button>

            <button
              className={`hud-btn ${activePresetName === 'DEFAULT' ? 'active' : ''}`}
              onClick={() => setCameraPreset('DEFAULT')}
              title="3D Free Orbit Perspective View"
            >
              <Compass size={15} />
              <span>Perspective</span>
            </button>

            <button
              className={`hud-btn ${activePresetName === 'TOP_DOWN' ? 'active' : ''}`}
              onClick={() => setCameraPreset('TOP_DOWN')}
              title="Top-Down Aerial Bird's-Eye Map View"
            >
              <Maximize2 size={15} />
              <span>Top Map</span>
            </button>

            <button
              className={`hud-btn ${activePresetName === 'RIM_VIEW' ? 'active' : ''}`}
              onClick={() => setCameraPreset('RIM_VIEW')}
              title="Standing on the Highest Crater Rim Peak (608m MSL)"
            >
              <Mountain size={15} />
              <span>Rim View</span>
            </button>

            <button
              className={`hud-btn ${activePresetName === 'LAKE_VIEW' ? 'active' : ''}`}
              onClick={() => !isPreImpact && setCameraPreset('LAKE_VIEW')}
              disabled={isPreImpact}
              style={{
                opacity: isPreImpact ? 0.38 : 1,
                cursor: isPreImpact ? 'not-allowed' : 'pointer',
                filter: isPreImpact ? 'grayscale(0.8)' : 'none'
              }}
              title={isPreImpact ? "Lake basin floor view unavailable in ~50,000 BP (Pre-Impact Plateau)" : "Standing on the Lake Floor Basin Shoreline (479m MSL)"}
            >
              <Waves size={15} />
              <span>Lake Floor</span>
            </button>
          </div>
        </div>

        {/* 4. Compact Square 'i' Data Sources Button (Hidden on Mobile) */}
        <div 
          className="mobile-hide"
          style={{ position: 'relative', pointerEvents: 'auto', flexShrink: 0, marginLeft: 'auto' }}
          onMouseEnter={handleMouseEnterSources}
          onMouseLeave={handleMouseLeaveSources}
        >
          {/* Floating Hover Card positioned directly above the square button */}
          {showSources && (
            <div 
              className="glass-panel-glow" 
              onMouseEnter={handleMouseEnterSources}
              onMouseLeave={handleMouseLeaveSources}
              style={{
                position: 'absolute',
                bottom: '100%',
                right: '0',
                marginBottom: '16px',
                width: '460px',
                maxHeight: '620px',
                overflowY: 'auto',
                padding: '18px 22px',
                zIndex: 30,
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.85), 0 0 25px rgba(56, 189, 248, 0.3)',
                pointerEvents: 'auto'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                <BookOpen size={18} color="var(--accent-cyan)" />
                <span style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '0.02em' }}>
                  Scientific Data Sources & Citations
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {DATA_SOURCES.map((src) => (
                  <div key={src.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.76rem', lineHeight: '1.45' }}>
                    <div style={{ fontWeight: '700', color: 'var(--accent-cyan)', display: 'flex', gap: '6px' }}>
                      <span>{src.id})</span>
                      <span>{src.title}</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', paddingLeft: '18px' }}>
                      {src.description}
                    </p>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        paddingLeft: '18px',
                        color: 'var(--accent-amber)',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: '600',
                        fontSize: '0.73rem'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                      <span>{src.linkText}</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prominent Square Trigger Button (52px x 52px) */}
          <div className="glass-panel" style={{
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <button
              className={`hud-btn ${showSources ? 'active' : ''}`}
              onClick={() => {
                if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
                setShowSources(!showSources);
              }}
              title="Click or hover to view Scientific Data Sources & Citations"
              style={{
                borderColor: showSources ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                color: showSources ? 'var(--accent-cyan)' : 'var(--text-main)',
                width: '52px',
                height: '52px',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px'
              }}
            >
              <Info size={26} color="var(--accent-cyan)" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
