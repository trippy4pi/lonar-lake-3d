import React, { useMemo } from 'react';
import * as THREE from 'three';

// Low-poly 3D Tree Instance (Optimized geometry detail for cool thermal performance)
function PrehistoricTree({ position, scale, rotation, trunkColor, foliageColor }) {
  return (
    <group position={position} scale={scale} rotation={[0, 0, rotation]}>
      {/* Tree Trunk */}
      <mesh position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.12, 0.8, 5]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>

      {/* Primary Foliage Canopy */}
      <mesh position={[0, 0, 1.0]}>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color={foliageColor} roughness={0.7} />
      </mesh>

      {/* Secondary Upper Canopy Blob */}
      <mesh position={[0.15, -0.1, 1.3]}>
        <dodecahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color={foliageColor} roughness={0.7} />
      </mesh>
    </group>
  );
}

export default function PrehistoricForest({ visible = true, count = 180 }) {
  // Generate randomized tree instances per session with 100% natural flora colors
  const trees = useMemo(() => {
    const items = [];
    // Strictly natural Deccan Traps monsoon vegetation shades
    const foliageShades = [
      '#2d5a27', // Deep Teak Forest Green
      '#3a6b35', // Deccan Monsoon Green
      '#4f772d', // Acacia Leaf Green
      '#1b4332', // Dark Evergreen
      '#4a5e30', // Sage Olive Green
      '#6b705c', // Olive Scrub
      '#8c7b48'  // Dry Season Savannah Gold
    ];
    
    // Natural bark brown colors
    const trunkShades = ['#3d2616', '#4a2e1b', '#2c1a0e', '#543d2b'];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 28;
      const y = (Math.random() - 0.5) * 28;

      const lavaRidge = Math.sin(x * 0.4 + y * 0.2) * 0.14 + Math.cos(x * 0.2 - y * 0.3) * 0.10;
      const streamDrainage = -(x * 0.015 + y * 0.01);
      const zHeight = 0.55 + lavaRidge + streamDrainage;

      // Shrunken micro-scale trees (0.16 to 0.38) for realistic terrain proportion
      const scale = 0.16 + Math.random() * 0.22;
      const rotation = Math.random() * Math.PI * 2;
      const foliageColor = foliageShades[Math.floor(Math.random() * foliageShades.length)];
      const trunkColor = trunkShades[Math.floor(Math.random() * trunkShades.length)];

      items.push({
        id: i,
        position: [x, y, zHeight],
        scale: [scale, scale, scale],
        rotation,
        foliageColor,
        trunkColor
      });
    }
    return items;
  }, [count]);

  if (!visible) return null;

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {trees.map((tree) => (
        <PrehistoricTree
          key={tree.id}
          position={tree.position}
          scale={tree.scale}
          rotation={tree.rotation}
          foliageColor={tree.foliageColor}
          trunkColor={tree.trunkColor}
        />
      ))}
    </group>
  );
}
