/**
 * Web Audio API Sound System for Lonar Crater 3D
 * Features:
 * - Real Studio-Recorded Natural Water Ripples Audio (/audio/water_ripples.mp3)
 * - Soft Ambient Crater Wind (Epochs 2, 3, 4)
 * - Impact Day Subterranean Magma/Lava Sound Engine (Epoch 1): Deep molten magma rumble anchored at lake floor
 * - Prehistoric Forest Canopy Sound Engine (Epoch 0 ~50,000 BP): Organic leaves rustling, canopy breeze & procedural forest bird chirps anchored at forest tree level
 * - Instantaneous Audio ON / OFF Master Switch
 */

let audioCtx = null;
let windGain = null;
let windFilter = null;
let windLfo = null;
let windNoiseSource = null;

let waterGain = null;
let waterSource = null;
let waterAudioBuffer = null;

let lavaGain = null;
let lavaFilter = null;
let lavaSubOsc = null;
let lavaLfo = null;
let lavaNoiseSource = null;

let forestGain = null;
let forestFilter = null;
let forestLfo = null;
let forestNoiseSource = null;
let forestBirdTimer = null;

let isAudioRunning = false;
let isWaterActive = true;
let currentEpochIdx = 4;
let currentCamY = 15;

export function initAudio() {
  if (audioCtx) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();
}

/**
 * Load and decode authentic real water audio sample
 */
async function loadWaterAudioBuffer() {
  if (waterAudioBuffer || !audioCtx) return;
  try {
    const response = await fetch('/audio/water_ripples.mp3');
    const arrayBuffer = await response.arrayBuffer();
    waterAudioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  } catch (err) {
    console.warn('Water audio sample load error:', err);
  }
}

/**
 * Procedural Prehistoric Forest Bird Chirp & Trill Generator (~50,000 BP)
 */
function schedulePrehistoricBirds() {
  if (!isAudioRunning || !audioCtx || currentEpochIdx !== 0 || currentCamY > 14.0) {
    forestBirdTimer = setTimeout(schedulePrehistoricBirds, 800);
    return;
  }

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  // Prehistoric bird chirp frequency leap (e.g. 1900 Hz -> 2700 Hz -> 2100 Hz)
  const baseFreq = 1800 + Math.random() * 800;
  osc.type = 'sine';
  osc.frequency.setValueAtTime(baseFreq, now);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.4, now + 0.05);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + 0.12);

  const forestHeightProximity = Math.max(0, Math.min(1, (14.0 - currentCamY) / 12.0));
  const birdVol = (0.02 + Math.random() * 0.035) * forestHeightProximity;

  gain.gain.setValueAtTime(birdVol, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.13);

  // Random interval between bird chirps (550ms - 1700ms)
  const nextDelay = 550 + Math.random() * 1150;
  forestBirdTimer = setTimeout(schedulePrehistoricBirds, nextDelay);
}

/**
 * Toggle Master Ambient Crater Soundscape
 */
export async function toggleAmbientWind(enable, showWater = true) {
  initAudio();
  if (!audioCtx) return;

  isWaterActive = showWater;

  if (enable) {
    isAudioRunning = true;

    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const bufferSize = audioCtx.sampleRate * 3;

    // Load real water sound file in background
    await loadWaterAudioBuffer();

    // ----------------------------------------------------
    // 1. Procedural Soft Pink Noise Buffer for Crater Wind
    // ----------------------------------------------------
    if (!windNoiseSource) {
      const windBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const windData = windBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        windData[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        windData[i] *= 0.03;
        b6 = white * 0.115926;
      }

      windNoiseSource = audioCtx.createBufferSource();
      windNoiseSource.buffer = windBuffer;
      windNoiseSource.loop = true;

      windFilter = audioCtx.createBiquadFilter();
      windFilter.type = 'lowpass';
      windFilter.frequency.setValueAtTime(380, now);

      windLfo = audioCtx.createOscillator();
      const windLfoGain = audioCtx.createGain();
      windLfo.frequency.setValueAtTime(0.2, now);
      windLfoGain.gain.setValueAtTime(50, now);
      windLfo.connect(windLfoGain);
      windLfoGain.connect(windFilter.frequency);

      windGain = audioCtx.createGain();
      windGain.gain.setValueAtTime(0.001, now);

      windNoiseSource.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(audioCtx.destination);

      windNoiseSource.start();
      windLfo.start();
    }

    // ----------------------------------------------------
    // 2. Real Recorded Natural Water Ripples Audio Source
    // ----------------------------------------------------
    if (waterAudioBuffer && !waterSource) {
      waterSource = audioCtx.createBufferSource();
      waterSource.buffer = waterAudioBuffer;
      waterSource.loop = true;

      waterGain = audioCtx.createGain();
      waterGain.gain.setValueAtTime(0.0001, now);

      waterSource.connect(waterGain);
      waterGain.connect(audioCtx.destination);

      waterSource.start(now);
    }

    // ----------------------------------------------------
    // 3. Impact Day Subterranean Lava Sound Synthesizer
    // ----------------------------------------------------
    if (!lavaNoiseSource) {
      const lavaBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const lavaData = lavaBuffer.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lavaData[i] = (lastOut + (0.04 * white)) / 1.04;
        lastOut = lavaData[i];
        lavaData[i] *= 1.4;
      }

      lavaNoiseSource = audioCtx.createBufferSource();
      lavaNoiseSource.buffer = lavaBuffer;
      lavaNoiseSource.loop = true;

      lavaFilter = audioCtx.createBiquadFilter();
      lavaFilter.type = 'lowpass';
      lavaFilter.frequency.setValueAtTime(160, now);

      lavaLfo = audioCtx.createOscillator();
      const lavaLfoGain = audioCtx.createGain();
      lavaLfo.frequency.setValueAtTime(0.35, now);
      lavaLfoGain.gain.setValueAtTime(65, now);
      lavaLfo.connect(lavaLfoGain);
      lavaLfoGain.connect(lavaFilter.frequency);

      lavaSubOsc = audioCtx.createOscillator();
      const lavaSubGain = audioCtx.createGain();
      lavaSubOsc.type = 'sine';
      lavaSubOsc.frequency.setValueAtTime(55, now);
      lavaSubGain.gain.setValueAtTime(0.12, now);
      lavaSubOsc.connect(lavaSubGain);

      lavaGain = audioCtx.createGain();
      lavaGain.gain.setValueAtTime(0.0001, now);

      lavaNoiseSource.connect(lavaFilter);
      lavaFilter.connect(lavaGain);
      lavaSubGain.connect(lavaGain);
      lavaGain.connect(audioCtx.destination);

      lavaNoiseSource.start();
      lavaLfo.start();
      lavaSubOsc.start();
    }

    // ----------------------------------------------------
    // 4. Prehistoric Forest Leaves Rustle & Breeze (~50,000 BP)
    // ----------------------------------------------------
    if (!forestNoiseSource) {
      const forestBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const forestData = forestBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        forestData[i] = (Math.random() * 2 - 1) * 0.025; // Organic leaf rustle noise
      }

      forestNoiseSource = audioCtx.createBufferSource();
      forestNoiseSource.buffer = forestBuffer;
      forestNoiseSource.loop = true;

      forestFilter = audioCtx.createBiquadFilter();
      forestFilter.type = 'bandpass';
      forestFilter.frequency.setValueAtTime(1200, now); // Leaves rustle frequency
      forestFilter.Q.setValueAtTime(0.9, now);

      forestLfo = audioCtx.createOscillator();
      const forestLfoGain = audioCtx.createGain();
      forestLfo.frequency.setValueAtTime(0.16, now); // Soft canopy breeze swell
      forestLfoGain.gain.setValueAtTime(320, now);
      forestLfo.connect(forestLfoGain);
      forestLfoGain.connect(forestFilter.frequency);

      forestGain = audioCtx.createGain();
      forestGain.gain.setValueAtTime(0.0001, now);

      forestNoiseSource.connect(forestFilter);
      forestFilter.connect(forestGain);
      forestGain.connect(audioCtx.destination);

      forestNoiseSource.start();
      forestLfo.start();
    }

    // Start prehistoric bird chirp scheduler
    if (forestBirdTimer) clearTimeout(forestBirdTimer);
    schedulePrehistoricBirds();

  } else {
    // ----------------------------------------------------
    // INSTANT MASTER AUDIO OFF
    // ----------------------------------------------------
    isAudioRunning = false;

    if (windGain && audioCtx) {
      windGain.gain.cancelScheduledValues(audioCtx.currentTime);
      windGain.gain.setValueAtTime(0, audioCtx.currentTime);
    }
    if (waterGain && audioCtx) {
      waterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      waterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    }
    if (lavaGain && audioCtx) {
      lavaGain.gain.cancelScheduledValues(audioCtx.currentTime);
      lavaGain.gain.setValueAtTime(0, audioCtx.currentTime);
    }
    if (forestGain && audioCtx) {
      forestGain.gain.cancelScheduledValues(audioCtx.currentTime);
      forestGain.gain.setValueAtTime(0, audioCtx.currentTime);
    }

    if (forestBirdTimer) clearTimeout(forestBirdTimer);

    if (audioCtx && audioCtx.state !== 'suspended') {
      audioCtx.suspend();
    }
  }
}

/**
 * Enable/Disable Lake Water sound output
 */
export function setWaterSoundVisible(visible) {
  isWaterActive = visible;
  if (!waterGain || !audioCtx || !isAudioRunning) return;
  if (!visible) {
    waterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    waterGain.gain.setValueAtTime(0, audioCtx.currentTime);
  }
}

/**
 * Dynamic Rim Peak, Lake Floor, Lava & Prehistoric Forest Audio Modulation
 */
export function updateDynamicAudio(cameraX, cameraY, cameraZ, epochIndex = 4) {
  currentEpochIdx = epochIndex;
  currentCamY = cameraY || 15;

  if (!isAudioRunning || !audioCtx || audioCtx.state === 'suspended' || !windFilter) return;

  const now = audioCtx.currentTime;
  const cx = cameraX || 0;
  const cy = cameraY || 0;
  const cz = cameraZ || 0;

  // ------------------------------------------------------------------
  // EPOCH 0: ~50,000 BP PREHISTORIC FOREST (NO WIND / NO WATER / NO LAVA)
  // ------------------------------------------------------------------
  if (epochIndex === 0) {
    if (windGain) windGain.gain.setTargetAtTime(0, now, 0.05);
    if (waterGain) waterGain.gain.setTargetAtTime(0, now, 0.05);
    if (lavaGain) lavaGain.gain.setTargetAtTime(0, now, 0.05);

    if (forestGain) {
      // Anchored at prehistoric forest tree canopy height (Y ~ 1.5 - 4.5)
      const forestProximity = Math.max(0, Math.min(1, (16.0 - cy) / 14.0));
      const targetForestVol = forestProximity * 0.16; // Leaves rustling & canopy breeze
      forestGain.gain.setTargetAtTime(Math.max(0.0001, targetForestVol), now, 0.08);
    }
    return;
  }

  // ------------------------------------------------------------------
  // EPOCH 1: IMPACT DAY — MAGMA LAVA SOUND AT BASIN FLOOR (NO WIND / NO WATER / NO FOREST)
  // ------------------------------------------------------------------
  if (epochIndex === 1) {
    if (windGain) windGain.gain.setTargetAtTime(0, now, 0.05);
    if (waterGain) waterGain.gain.setTargetAtTime(0, now, 0.05);
    if (forestGain) forestGain.gain.setTargetAtTime(0, now, 0.05);

    if (lavaGain) {
      const dx = cx - 0;
      const dy = cy - (-2.5);
      const dz = cz - 0;
      const distFromBasinFloor = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const lavaProximity = Math.max(0, 1 - distFromBasinFloor / 28.0);
      const targetLavaVol = lavaProximity * 0.28;
      lavaGain.gain.setTargetAtTime(Math.max(0.0001, targetLavaVol), now, 0.08);
    }
    return;
  }

  // ------------------------------------------------------------------
  // EPOCHS 2, 3, 4: STANDARD CRATER WIND & WATER ACTIVE (NO LAVA / NO FOREST)
  // ------------------------------------------------------------------
  if (lavaGain) lavaGain.gain.setTargetAtTime(0, now, 0.05);
  if (forestGain) forestGain.gain.setTargetAtTime(0, now, 0.05);

  // Horizontal distance from crater center (0,0)
  const horizDist = Math.sqrt(cx * cx + cz * cz);
  const rimRadius = 6.5;

  // Rim Proximity
  const distFromRimRadius = Math.abs(horizDist - rimRadius);
  const rimProximity = Math.max(0, 1 - distFromRimRadius / 10);
  
  // Height proximity to Rim Peak (Y ~ 2.0)
  const heightFromRim = Math.abs(cy - 2.0);
  const heightFactor = Math.max(0, 1 - heightFromRim / 22);

  const totalRimIntensity = Math.min(1, rimProximity * 0.7 + heightFactor * 0.3);

  // 1. Wind Filter Frequency
  const targetCutoff = 220 + totalRimIntensity * 400;
  windFilter.frequency.setTargetAtTime(targetCutoff, now, 0.08);

  // 2. Wind Master Volume
  if (windGain) {
    const targetWindVol = 0.015 + totalRimIntensity * 0.095;
    windGain.gain.setTargetAtTime(targetWindVol, now, 0.08);
  }

  // 3. Water Sound Volume: Smoothly activates near Lake Floor (Y < 6.0)
  if (waterGain) {
    if (!isWaterActive) {
      waterGain.gain.setTargetAtTime(0.0001, now, 0.08);
    } else {
      const waterProximity = Math.max(0, Math.min(1, (6.0 - cy) / 8.5));
      const targetWaterVol = waterProximity * 0.085;
      waterGain.gain.setTargetAtTime(Math.max(0.0001, targetWaterVol), now, 0.08);
    }
  }
}

export function playEpochTransitionSFX() {
  // Silent era change
}
