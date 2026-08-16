import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import LonarTerrain from './LonarTerrain';
import WaterBody from './WaterBody';
import Hotspots from './Hotspots';
import PrehistoricForest from './PrehistoricForest';
import { updateDynamicAudio } from '../utils/soundEffects';

// Camera Bounding Area Limits
const BOUNDS = {
  targetX: [-30.0, 30.0],
  targetZ: [-30.0, 30.0],
  targetY: [-8.0, 20.0],
  posX: [-38.0, 38.0],
  posZ: [-38.0, 38.0],
  posY: [-25.0, 55.0], // Unlocked full vertical range
  minDistance: 0.5,
  maxDistance: 55.0
};

// Hidden Easter Egg Plane rendered under the lake basin (Invisible from above, visible ONLY from below)
function UpsideDownEasterEgg() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 512, 128);
    ctx.font = 'bold 34px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#ef4444'; // Glowing Stranger-Things Red
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 18;
    ctx.fillText('You are in Upside Down', 256, 64);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  return (
    <mesh position={[0.45, -3.25, -0.85]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[8, 2]} />
      <meshBasicMaterial
        map={texture}
        transparent={true}
        side={THREE.FrontSide} // Backface culling hides it from above; visible strictly when looking up from underneath!
      />
    </mesh>
  );
}

function CameraController({ cameraPreset, autoRotate, setAutoRotate, epochIndex }) {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  const keysPressed = useRef({});

  // Global Key & Pointer Listeners (Auto-OFF autoRotate on manual navigation)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', '+', '=', '-', '_', 'w', 'a', 's', 'd'].includes(key)) {
        if (autoRotate && setAutoRotate) {
          setAutoRotate(false);
        }
      }
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', '+', '=', '-', '_'].includes(key)) {
        e.preventDefault();
      }
      keysPressed.current[key] = true;
      keysPressed.current[e.code.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      keysPressed.current[key] = false;
      keysPressed.current[e.code.toLowerCase()] = false;
    };

    const handlePointerDown = () => {
      if (autoRotate && setAutoRotate) {
        setAutoRotate(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    const canvasDom = gl.domElement;
    if (canvasDom) {
      canvasDom.addEventListener('pointerdown', handlePointerDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (canvasDom) {
        canvasDom.removeEventListener('pointerdown', handlePointerDown);
      }
    };
  }, [autoRotate, setAutoRotate, gl]);

  // Update Camera Presets deterministically on every trigger
  useEffect(() => {
    if (!camera || !controlsRef.current) return;
    const presetName = typeof cameraPreset === 'object' ? cameraPreset.name : cameraPreset;

    if (presetName === 'TOP_DOWN') {
      // Slightly zoomed out Top-Down Aerial Map View
      camera.position.set(0, 42, 0.1);
      controlsRef.current.target.set(0, 0, 0);
    } else if (presetName === 'RIM_VIEW') {
      camera.position.set(7.78, 1.85, -5.89);
      controlsRef.current.target.set(0.0, -2.4, 0.0);
    } else if (presetName === 'LAKE_VIEW') {
      // Centered Lake Floor view: Positioned right near the center of the lake basin (0, -1.8, 1.2)
      camera.position.set(0, -1.8, 1.2);
      controlsRef.current.target.set(0.0, -2.3, 0.0);
    } else {
      // Slightly zoomed out 3D Perspective Orbit View
      camera.position.set(22, 19, 25);
      controlsRef.current.target.set(0, -1, 0);
    }
    controlsRef.current.update();
  }, [cameraPreset, camera]);

  // Smooth 60fps Keyboard & Dynamic Audio Modulation Loop
  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    // Dynamic Crater Rim, Lake Proximity & Impact Day Magma Lava Audio Modulation
    updateDynamicAudio(camera.position.x, camera.position.y, camera.position.z, epochIndex);

    const keys = keysPressed.current;
    const moveSpeed = 12 * delta;
    const rotSpeed = 1.4 * delta;
    const zoomSpeed = 14 * delta;

    let posUpdated = false;
    let rotUpdated = false;

    // WASD Movement (Pan camera position horizontally relative to view direction)
    if (keys['w'] || keys['keyw']) {
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      dir.y = 0;
      dir.normalize().multiplyScalar(moveSpeed);
      camera.position.add(dir);
      controlsRef.current.target.add(dir);
      posUpdated = true;
    }
    if (keys['s'] || keys['keys']) {
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      dir.y = 0;
      dir.normalize().multiplyScalar(-moveSpeed);
      camera.position.add(dir);
      controlsRef.current.target.add(dir);
      posUpdated = true;
    }
    if (keys['a'] || keys['keya']) {
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
      right.multiplyScalar(-moveSpeed);
      camera.position.add(right);
      controlsRef.current.target.add(right);
      posUpdated = true;
    }
    if (keys['d'] || keys['keyd']) {
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
      right.multiplyScalar(moveSpeed);
      camera.position.add(right);
      controlsRef.current.target.add(right);
      posUpdated = true;
    }

    // Arrow Keys: Unlocked Full 360-Degree Camera Rotation Loop (Yaw & Pitch)
    const viewDir = new THREE.Vector3();
    camera.getWorldDirection(viewDir);
    const targetDist = camera.position.distanceTo(controlsRef.current.target);

    if (keys['arrowleft']) {
      viewDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotSpeed);
      rotUpdated = true;
    }
    if (keys['arrowright']) {
      viewDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), -rotSpeed);
      rotUpdated = true;
    }
    if (keys['arrowup']) {
      // Unlocked 360 Pitch Upward
      const right = new THREE.Vector3().crossVectors(viewDir, camera.up).normalize();
      viewDir.applyAxisAngle(right, rotSpeed * 0.75);
      rotUpdated = true;
    }
    if (keys['arrowdown']) {
      // Unlocked 360 Pitch Downward
      const right = new THREE.Vector3().crossVectors(viewDir, camera.up).normalize();
      viewDir.applyAxisAngle(right, -rotSpeed * 0.75);
      rotUpdated = true;
    }

    if (rotUpdated) {
      controlsRef.current.target.copy(camera.position).add(viewDir.multiplyScalar(targetDist));
    }

    // Zoom (+ / - Keys)
    if (keys['+'] || keys['='] || keys['numpadadd']) {
      const zoomDir = new THREE.Vector3();
      camera.getWorldDirection(zoomDir);
      camera.position.add(zoomDir.multiplyScalar(zoomSpeed));
      posUpdated = true;
    }
    if (keys['-'] || keys['_'] || keys['numpadsubtract']) {
      const zoomDir = new THREE.Vector3();
      camera.getWorldDirection(zoomDir);
      camera.position.sub(zoomDir.multiplyScalar(zoomSpeed));
      posUpdated = true;
    }

    // Clamp Camera Target and Position within Bounding Area
    controlsRef.current.target.x = THREE.MathUtils.clamp(controlsRef.current.target.x, BOUNDS.targetX[0], BOUNDS.targetX[1]);
    controlsRef.current.target.z = THREE.MathUtils.clamp(controlsRef.current.target.z, BOUNDS.targetZ[0], BOUNDS.targetZ[1]);
    controlsRef.current.target.y = THREE.MathUtils.clamp(controlsRef.current.target.y, BOUNDS.targetY[0], BOUNDS.targetY[1]);

    camera.position.x = THREE.MathUtils.clamp(camera.position.x, BOUNDS.posX[0], BOUNDS.posX[1]);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, BOUNDS.posZ[0], BOUNDS.posZ[1]);
    camera.position.y = THREE.MathUtils.clamp(camera.position.y, BOUNDS.posY[0], BOUNDS.posY[1]);

    if (posUpdated || rotUpdated) {
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={true}
      dampingFactor={0.05}
      autoRotate={autoRotate}
      autoRotateSpeed={0.8}
      minDistance={BOUNDS.minDistance}
      maxDistance={BOUNDS.maxDistance}
      minPolarAngle={0}
      maxPolarAngle={Math.PI} // Unlocked full 180-degree spherical pitch rotation
    />
  );
}

export default function LonarCanvas({
  viewMode,
  phLevel,
  waterLevel,
  cameraPreset,
  autoRotate,
  setAutoRotate,
  onSelectHotspot,
  activeHotspotId,
  smoothPasses,
  texScale,
  texOffsetX,
  texOffsetY,
  showGrid,
  epochIndex,
  onDemLoaded,
  showWater,
  darkMode
}) {
  // Liquid water is impossible during Pre-Impact (Epoch 0), Impact Day (Epoch 1), or in non-Satellite visual modes (Geology, Elevation DEM, Shock)
  const isWaterImpossible = epochIndex === 0 || epochIndex === 1;
  const isWaterVisible = showWater && !isWaterImpossible && viewMode === 'SATELLITE';

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  const bgColor = darkMode ? '#07090e' : '#cbd5e1';
  const skyColor = darkMode ? '#38bdf8' : '#e0f2fe';
  const groundColor = darkMode ? '#07090e' : '#64748b';

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        dpr={[1, 1.5]} // Thermal Optimization: Cap pixel ratio to 1.5x on 3x retina mobile screens to prevent GPU overheating!
        gl={{ 
          antialias: true, 
          alpha: false, 
          powerPreference: isMobile ? 'default' : 'high-performance',
          preserveDrawingBuffer: false 
        }}
        camera={{ position: [22, 19, 25], fov: 45 }}
      >
        <color attach="background" args={[bgColor]} />
        
        {/* Constant Lighting Setup supporting Dark / Light theme */}
        <ambientLight intensity={darkMode ? 0.6 : 0.75} />
        <hemisphereLight skyColor={skyColor} groundColor={groundColor} intensity={darkMode ? 0.65 : 0.8} />
        
        {/* Directional Sun Light (Golden Angle 45°) */}
        <directionalLight
          position={[18, 18, 12]}
          intensity={darkMode ? 1.6 : 1.8}
        />

        <LonarTerrain 
          viewMode={viewMode} 
          smoothPasses={smoothPasses}
          texScale={texScale}
          texOffsetX={texOffsetX}
          texOffsetY={texOffsetY}
          showGrid={showGrid}
          epochIndex={epochIndex}
          onDemLoaded={onDemLoaded}
        />
        
        {/* Render 3D Randomized Prehistoric Forest ONLY in ~50,000 BP Epoch AND Satellite Visual Mode */}
        <PrehistoricForest visible={epochIndex === 0 && viewMode === 'SATELLITE'} count={isMobile ? 80 : 200} />

        <WaterBody phLevel={phLevel} waterLevel={waterLevel} visible={isWaterVisible} />
        {epochIndex !== 0 && <Hotspots onSelectHotspot={onSelectHotspot} activeHotspotId={activeHotspotId} />}

        {/* Hidden Easter Egg: "You are in Upside Down" under the lake basin */}
        <UpsideDownEasterEgg />

        <CameraController 
          cameraPreset={cameraPreset} 
          autoRotate={autoRotate} 
          setAutoRotate={setAutoRotate} 
          epochIndex={epochIndex} 
        />
      </Canvas>
    </div>
  );
}
