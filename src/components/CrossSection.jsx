import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

export default function CrossSection({ active = false }) {
  if (!active) return null;

  return (
    <group position={[0, -2.5, 0]}>
      {/* Underground Cutaway Plane Visual Geometry */}
      <mesh position={[0, -3.5, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[29.8, 7.0, 0.1]} />
        <meshStandardMaterial color="#1a1c23" roughness={0.9} />
      </mesh>

      {/* Layer 1: Deccan Traps Basalt Flow #1 (Top Weathered) */}
      <mesh position={[0, -0.8, 0.08]}>
        <planeGeometry args={[29.6, 1.4]} />
        <meshStandardMaterial color="#8c7d6b" roughness={0.9} />
      </mesh>

      {/* Layer 2: Deccan Traps Basalt Flow #2 (Compact Volcanic Basalt) */}
      <mesh position={[0, -2.2, 0.08]}>
        <planeGeometry args={[29.6, 1.4]} />
        <meshStandardMaterial color="#4d5360" roughness={0.8} />
      </mesh>

      {/* Layer 3: Deccan Traps Basalt Flow #3 (Deep Dense Basalt Basement) */}
      <mesh position={[0, -3.6, 0.08]}>
        <planeGeometry args={[29.6, 1.4]} />
        <meshStandardMaterial color="#2d323e" roughness={0.9} />
      </mesh>

      {/* Parabolic Impact Breccia Lens (Shattered Impact Melt & Maskelynite) */}
      <mesh position={[0, -2.2, 0.12]} rotation={[0, 0, 0]}>
        <ringGeometry args={[0, 5.8, 32, 1, 0, Math.PI]} />
        <meshStandardMaterial color="#b48ead" roughness={0.7} opacity={0.9} transparent={true} />
      </mesh>

      {/* 3D Underground Annotations */}
      <group position={[0, -2.2, 0.2]}>
        <Html position={[0, -0.6, 0]} center>
          <div style={{
            background: 'rgba(180, 142, 173, 0.9)',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            border: '1px solid rgba(255,255,255,0.4)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}>
            💥 Sub-surface Impact Breccia Lens (~130m Depth)
          </div>
        </Html>

        <Html position={[-9.0, 0.8, 0]} center>
          <div style={{
            background: 'rgba(77, 83, 96, 0.9)',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            🌋 Layered Deccan Basalt Flows (65 Ma)
          </div>
        </Html>

        <Html position={[7.5, 0.2, 0]} center>
          <div style={{
            background: 'rgba(56, 189, 248, 0.9)',
            color: '#000',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '700',
            whiteSpace: 'nowrap'
          }}>
            💧 Hydrothermal Spring Aquifer Conduit
          </div>
        </Html>
      </group>
    </group>
  );
}
