import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

/**
 * 3D Water Body Component with Scientific Salinity & pH Telemetry Colors:
 * - Monsoon Season (pH 9.5 - 10.0): Deep Emerald Green (#0E5A36 - Spirulina bloom)
 * - Dry / Summer Season (pH 10.0 - 10.5): Greenish-Blue to Cyan (#1A6F75 - Alkaline scatter)
 * - Peak Evaporation (pH 10.5 - 10.8): Murky Greenish-Brown (#5B5834 - Shift phase)
 * - Extreme Drought / Heat (pH > 10.8): Vibrant Rose Pink (#D14D73 - Haloarchaea & Dunaliella)
 */

export default function WaterBody({ phLevel = 10.5, waterLevel = 0, visible = true }) {
  const waterRef = useRef();

  // Compute Water Color & Shader Properties based on Scientific Telemetry
  const { waterColor, emissiveColor, emissiveIntensity, roughness, metalness } = useMemo(() => {
    if (phLevel > 10.8) {
      // Extreme Drought / Heat (pH 10.8 - 11.2+): Vibrant Rose Pink (#D14D73)
      return {
        waterColor: new THREE.Color('#D14D73'),
        emissiveColor: new THREE.Color('#D14D73'),
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.3
      };
    } else if (phLevel > 10.5) {
      // Peak Evaporation / Transition Phase (pH 10.5 - 10.8): Murky Greenish-Brown (#5B5834)
      return {
        waterColor: new THREE.Color('#5B5834'),
        emissiveColor: new THREE.Color('#000000'),
        emissiveIntensity: 0,
        roughness: 0.35,
        metalness: 0.5
      };
    } else if (phLevel > 10.0) {
      // Dry / Summer Season (pH 10.0 - 10.5): Greenish-Blue to Cyan (#1A6F75)
      return {
        waterColor: new THREE.Color('#1A6F75'),
        emissiveColor: new THREE.Color('#000000'),
        emissiveIntensity: 0,
        roughness: 0.1,
        metalness: 0.8
      };
    } else if (phLevel >= 9.5) {
      // Monsoon Season (pH 9.5 - 10.0): Deep Emerald Green (#0E5A36)
      return {
        waterColor: new THREE.Color('#0E5A36'),
        emissiveColor: new THREE.Color('#000000'),
        emissiveIntensity: 0,
        roughness: 0.15,
        metalness: 0.75
      };
    } else {
      // Freshwater Dilution (pH < 9.5)
      return {
        waterColor: new THREE.Color('#228b22'),
        emissiveColor: new THREE.Color('#000000'),
        emissiveIntensity: 0,
        roughness: 0.2,
        metalness: 0.7
      };
    }
  }, [phLevel]);

  // Animate surface wave oscillations while maintaining North-East offset (X=0.45, Z=-0.85)
  useFrame(({ clock }) => {
    if (waterRef.current) {
      const t = clock.getElapsedTime();
      waterRef.current.position.x = 0.45;
      waterRef.current.position.z = -0.85;
      waterRef.current.position.y = -2.7 + (waterLevel * 0.05) + Math.sin(t * 1.5) * 0.03;
    }
  });

  if (!visible) return null;

  return (
    <mesh 
      ref={waterRef} 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0.45, -2.7, -0.85]}
    >
      <circleGeometry args={[4.45, 48]} />
      <meshStandardMaterial
        color={waterColor}
        emissive={emissiveColor}
        emissiveIntensity={emissiveIntensity}
        roughness={roughness}
        metalness={metalness}
        transparent={true}
        opacity={0.92}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
