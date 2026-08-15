import React, { useMemo, useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { 
  generateGeologyTexture, 
  generateElevationTexture, 
  generateShockTexture 
} from '../utils/textureGenerator';

// Lightweight CPU Gaussian Smooth Filter
function smoothMatrix(matrix, passes = 4) {
  if (!matrix || passes <= 0) return matrix;
  const rows = matrix.length;
  const cols = matrix[0].length;
  let curr = matrix;

  for (let p = 0; p < passes; p++) {
    const next = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        let sum = 0;
        let totalW = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
              const w = (dr === 0 && dc === 0) ? 4 : (dr === 0 || dc === 0) ? 2 : 1;
              sum += curr[nr][nc] * w;
              totalW += w;
            }
          }
        }
        row.push(sum / totalW);
      }
      next.push(row);
    }
    curr = next;
  }
  return curr;
}

export default function LonarTerrain({ 
  viewMode = 'SATELLITE', 
  smoothPasses = 4,
  texScale = 0.95,
  texOffsetX = 0.0,
  texOffsetY = 0.0,
  showGrid = true,
  epochIndex = 4, // 0: Pre-Impact, 1: Impact Day, 2: Medieval, 3: Pink Bloom, 4: Present
  onDemLoaded
}) {
  const meshRef = useRef();
  const [realDemData, setRealDemData] = useState(null);

  // Preload Satellite & Grid Textures in GPU Memory
  const satelliteTextures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    
    const preTex = loader.load('/real_lonar_prehistoric_satellite.jpg');
    preTex.wrapS = THREE.ClampToEdgeWrapping;
    preTex.wrapT = THREE.ClampToEdgeWrapping;
    preTex.colorSpace = THREE.SRGBColorSpace;

    const impactTex = loader.load('/real_lonar_impact_event_satellite.jpg');
    impactTex.wrapS = THREE.ClampToEdgeWrapping;
    impactTex.wrapT = THREE.ClampToEdgeWrapping;
    impactTex.colorSpace = THREE.SRGBColorSpace;

    const medTex = loader.load('/real_lonar_medieval_satellite.jpg');
    medTex.wrapS = THREE.ClampToEdgeWrapping;
    medTex.wrapT = THREE.ClampToEdgeWrapping;
    medTex.colorSpace = THREE.SRGBColorSpace;

    const cleanTex = loader.load('/real_lonar_aligned_satellite.jpg');
    cleanTex.wrapS = THREE.ClampToEdgeWrapping;
    cleanTex.wrapT = THREE.ClampToEdgeWrapping;
    cleanTex.colorSpace = THREE.SRGBColorSpace;

    const gridOverlayTex = loader.load('/lonar_latlon_grid_overlay.png');
    gridOverlayTex.wrapS = THREE.ClampToEdgeWrapping;
    gridOverlayTex.wrapT = THREE.ClampToEdgeWrapping;
    gridOverlayTex.colorSpace = THREE.SRGBColorSpace;

    return { preTex, impactTex, medTex, cleanTex, gridOverlayTex };
  }, []);

  // Map epochIndex to corresponding base satellite texture
  const activeSatelliteTex = useMemo(() => {
    if (epochIndex === 0) return satelliteTextures.preTex;
    if (epochIndex === 1) return satelliteTextures.impactTex;
    if (epochIndex === 2) return satelliteTextures.medTex;
    return satelliteTextures.cleanTex;
  }, [epochIndex, satelliteTextures]);

  // Apply texture scale & offset to all textures
  useEffect(() => {
    const texs = [
      satelliteTextures.preTex, 
      satelliteTextures.impactTex, 
      satelliteTextures.medTex, 
      satelliteTextures.cleanTex,
      satelliteTextures.gridOverlayTex
    ];

    texs.forEach((tex) => {
      if (tex) {
        tex.center.set(0.5, 0.5);
        tex.repeat.set(texScale, texScale);
        tex.offset.set(texOffsetX, texOffsetY);
        tex.needsUpdate = true;
      }
    });
  }, [satelliteTextures, texScale, texOffsetX, texOffsetY]);

  // Fetch real SRTM elevation JSON
  useEffect(() => {
    fetch('/real_lonar_dem.json')
      .then((res) => res.json())
      .then((data) => {
        setRealDemData(data);
        if (onDemLoaded) onDemLoaded(data);
      })
      .catch((err) => console.warn('Could not load real_lonar_dem.json', err));
  }, []);

  // Procedural textures
  const proceduralTextures = useMemo(() => ({
    GEOLOGY: generateGeologyTexture(),
    ELEVATION: generateElevationTexture(),
    SHOCK: generateShockTexture()
  }), []);

  // Smooth Elevation Matrix
  const smoothedMatrix = useMemo(() => {
    if (!realDemData) return null;
    return smoothMatrix(realDemData.elevations, smoothPasses);
  }, [realDemData, smoothPasses]);

  // Construct 3D Geometry dynamically based on epochIndex
  const geometry = useMemo(() => {
    // Epoch 0: PRE-IMPACT PALEO-DEM (Unbroken Deccan Basalt Plateau)
    if (epochIndex === 0) {
      const geo = new THREE.PlaneGeometry(30, 30, 100, 100);
      const pos = geo.attributes.position;

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const lavaRidge = Math.sin(x * 0.4 + y * 0.2) * 0.14 + Math.cos(x * 0.2 - y * 0.3) * 0.10;
        const streamDrainage = -(x * 0.015 + y * 0.01);
        pos.setZ(i, 0.55 + lavaRidge + streamDrainage);
      }

      geo.computeVertexNormals();
      return geo;
    }

    // Epoch 1-4: REAL NASA SRTM 30m RADAR DEM TOPOGRAPHY
    if (realDemData && smoothedMatrix) {
      const { gridSize, minElevation, maxElevation } = realDemData;
      const geo = new THREE.PlaneGeometry(30, 30, gridSize - 1, gridSize - 1);
      const pos = geo.attributes.position;

      for (let r = 0; r < gridSize; r++) {
        const demRow = gridSize - 1 - r;
        for (let c = 0; c < gridSize; c++) {
          const idx = r * gridSize + c;
          const rawElev = smoothedMatrix[demRow][c];
          
          const normH = (rawElev - minElevation) / (maxElevation - minElevation);
          const zHeight = -3.2 + normH * 3.7;

          pos.setZ(idx, zHeight);
        }
      }

      geo.computeVertexNormals();
      return geo;
    }

    // Temporary baseline plane while JSON loads
    const geo = new THREE.PlaneGeometry(30, 30, 80, 80);
    geo.computeVertexNormals();
    return geo;
  }, [epochIndex, realDemData, smoothedMatrix]);

  const activeTexture = viewMode === 'SATELLITE' 
    ? activeSatelliteTex 
    : (proceduralTextures[viewMode] || activeSatelliteTex);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {/* Base Terrain Mesh */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          map={activeTexture}
          roughness={0.7}
          metalness={0.1}
          side={THREE.DoubleSide}
          wireframe={viewMode === 'WIRE'}
        />
      </mesh>

      {/* Transparent Lat / Lon Grid Overlay Mesh (Available in all epochs & visual modes) */}
      {showGrid && (
        <mesh geometry={geometry}>
          <meshBasicMaterial
            map={satelliteTextures.gridOverlayTex}
            transparent={true}
            opacity={0.92}
            depthTest={true}
            depthWrite={false}
            polygonOffset={true}
            polygonOffsetFactor={-1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
