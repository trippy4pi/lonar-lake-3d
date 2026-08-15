import * as THREE from 'three';

/**
 * Generates procedural canvas textures for Lonar Lake 3D Terrain
 * Colors are calibrated to match HUD Legend cards 100% pixel-identically.
 */

export function generateSatelliteTexture(width = 2048, height = 2048) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const cx = width / 2;
  const cy = height / 2;
  const outerRimR = width * 0.38;
  const innerRimR = width * 0.33;
  const lakeR = width * 0.20;
  const secondaryCraterCx = cx + width * 0.18;
  const secondaryCraterCy = cy - height * 0.18;
  const secondaryCraterR = width * 0.05;

  // 1. Base Agricultural Deccan Basalt Plain (Outer)
  const plainGrad = ctx.createRadialGradient(cx, cy, outerRimR, cx, cy, width * 0.7);
  plainGrad.addColorStop(0, '#3a4734');
  plainGrad.addColorStop(0.4, '#4d3d2c');
  plainGrad.addColorStop(1, '#2c3325');
  ctx.fillStyle = plainGrad;
  ctx.fillRect(0, 0, width, height);

  // Patchy agrarian fields noise
  for (let i = 0; i < 400; i++) {
    const fx = Math.random() * width;
    const fy = Math.random() * height;
    const distToCenter = Math.hypot(fx - cx, fy - cy);
    if (distToCenter > outerRimR) {
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(74, 94, 60, 0.4)' : 'rgba(92, 75, 54, 0.4)';
      const fw = 30 + Math.random() * 80;
      const fh = 30 + Math.random() * 80;
      ctx.fillRect(fx, fy, fw, fh);
    }
  }

  // 2. Outer Ejecta Blanket (Lighter weathered basaltic dust around rim)
  const ejectaGrad = ctx.createRadialGradient(cx, cy, innerRimR, cx, cy, outerRimR * 1.25);
  ejectaGrad.addColorStop(0, '#8c7d6b');
  ejectaGrad.addColorStop(0.6, '#6e5e4d');
  ejectaGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = ejectaGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, outerRimR * 1.25, 0, Math.PI * 2);
  ctx.fill();

  // 3. Inner Slopes (Lush Greenery / Teak Forest Sanctuary)
  const slopeGrad = ctx.createRadialGradient(cx, cy, lakeR * 1.05, cx, cy, innerRimR);
  slopeGrad.addColorStop(0, '#1b3b18');
  slopeGrad.addColorStop(0.5, '#2d5427');
  slopeGrad.addColorStop(1, '#50633b');
  ctx.fillStyle = slopeGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, innerRimR, 0, Math.PI * 2);
  ctx.fill();

  // Forest texture noise on slope
  for (let i = 0; i < 1500; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = lakeR * 1.05 + Math.random() * (innerRimR - lakeR * 1.05);
    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r;
    ctx.fillStyle = Math.random() > 0.3 ? 'rgba(15, 45, 15, 0.6)' : 'rgba(40, 75, 30, 0.5)';
    ctx.beginPath();
    ctx.arc(px, py, 2 + Math.random() * 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. Shoreline Salt & Alkaline Crust (White/Yellowish Ring)
  const shoreGrad = ctx.createRadialGradient(cx, cy, lakeR * 0.92, cx, cy, lakeR * 1.08);
  shoreGrad.addColorStop(0, 'rgba(235, 230, 210, 0.9)');
  shoreGrad.addColorStop(0.5, 'rgba(210, 195, 160, 0.8)');
  shoreGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = shoreGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, lakeR * 1.08, 0, Math.PI * 2);
  ctx.fill();

  // 5. Central Soda Lake (Deep Mineral Teal / Microbe Green)
  const lakeGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, lakeR);
  lakeGrad.addColorStop(0, '#0b4035');
  lakeGrad.addColorStop(0.6, '#145c4c');
  lakeGrad.addColorStop(0.9, '#247a66');
  lakeGrad.addColorStop(1, '#4a9e88');
  ctx.fillStyle = lakeGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, lakeR, 0, Math.PI * 2);
  ctx.fill();

  // 6. Secondary Crater (Ambar Lake / Little Lonar)
  ctx.fillStyle = '#223826';
  ctx.beginPath();
  ctx.arc(secondaryCraterCx, secondaryCraterCy, secondaryCraterR * 1.3, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#10473a';
  ctx.beginPath();
  ctx.arc(secondaryCraterCx, secondaryCraterCy, secondaryCraterR * 0.7, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function generateGeologyTexture(width = 2048, height = 2048) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const cx = width / 2;
  const cy = height / 2;
  const outerRimR = width * 0.38;
  const innerRimR = width * 0.33;
  const lakeR = width * 0.20;

  // 1. Outer Ejecta & Debris Blanket (#15803d - Impact Debris & Boulders)
  ctx.fillStyle = '#15803d';
  ctx.fillRect(0, 0, width, height);

  // Ejecta border ring details
  const ejectaGrad = ctx.createRadialGradient(cx, cy, innerRimR, cx, cy, outerRimR * 1.3);
  ejectaGrad.addColorStop(0, '#15803d');
  ejectaGrad.addColorStop(1, '#166534');
  ctx.fillStyle = ejectaGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, outerRimR * 1.3, 0, Math.PI * 2);
  ctx.fill();

  // 2. Deep Basalt Rock Wall Rim Bedrock (#312e81 - Deep Basalt Bedrock)
  ctx.fillStyle = '#312e81';
  ctx.beginPath();
  ctx.arc(cx, cy, outerRimR, 0, Math.PI * 2);
  ctx.fill();

  // 3. Crater Slope Sand & Scree (#d97706 - Sand & Scree Slopes)
  ctx.fillStyle = '#d97706';
  ctx.beginPath();
  ctx.arc(cx, cy, innerRimR * 0.9, 0, Math.PI * 2);
  ctx.fill();

  // 4. Soda Lake Basin Mud Floor (#0e7490 - Soda Lake Mud)
  ctx.fillStyle = '#0e7490';
  ctx.beginPath();
  ctx.arc(cx, cy, lakeR * 1.05, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function generateElevationTexture(width = 2048, height = 2048) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const cx = width / 2;
  const cy = height / 2;
  const outerRimR = width * 0.38;
  const innerRimR = width * 0.33;
  const lakeR = width * 0.20;

  // Continuous Elevation Gradient matching HUD scale bar stops 100%:
  // 479m (#1e1b4b) -> 510m (#0284c7) -> 540m (#10b981) -> 570m (#f97316) -> 608m (#ffffff)
  const elevGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, width * 0.5);
  elevGrad.addColorStop(0, '#1e1b4b'); // 479m (Lake Floor)
  elevGrad.addColorStop(lakeR / (width * 0.5), '#1e1b4b'); // 479m Lake bed
  elevGrad.addColorStop((lakeR * 1.3) / (width * 0.5), '#0284c7'); // 510m Lower Slopes
  elevGrad.addColorStop(innerRimR / (width * 0.5), '#10b981'); // 540m Mid Slopes
  elevGrad.addColorStop(outerRimR / (width * 0.5), '#ffffff'); // 608m Rim Crest Peak
  elevGrad.addColorStop((outerRimR * 1.15) / (width * 0.5), '#f97316'); // 570m Outer Slopes
  elevGrad.addColorStop(1, '#10b981'); // Outer Basalt Plain (~540m)
  
  ctx.fillStyle = elevGrad;
  ctx.fillRect(0, 0, width, height);

  // Overlay Thin White Contour Lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2;
  for (let r = 30; r < width * 0.48; r += 28) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function generateShockTexture(width = 2048, height = 2048) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const cx = width / 2;
  const cy = height / 2;
  const outerRimR = width * 0.38;
  const innerRimR = width * 0.33;
  const lakeR = width * 0.20;

  // Outer Unshocked Basalt Plateau (#312e81 - 0 GPa)
  ctx.fillStyle = '#312e81';
  ctx.fillRect(0, 0, width, height);

  // Concentric Radial Shock Pressure Zones matching HUD scale bar stops 100%:
  // 0 GPa (#312e81) -> 15 GPa (#0284c7) -> 30 GPa (#f59e0b) -> 45 GPa (#ef4444) -> >60 GPa (#e11d48)
  const shockGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerRimR * 1.4);
  shockGrad.addColorStop(0, '#e11d48'); // >60 GPa (Impact Core / Silicate Melt)
  shockGrad.addColorStop((lakeR * 0.6) / (outerRimR * 1.4), '#ef4444'); // 45 GPa
  shockGrad.addColorStop(lakeR / (outerRimR * 1.4), '#f59e0b'); // 30 GPa (PDFs & Breccia)
  shockGrad.addColorStop(innerRimR / (outerRimR * 1.4), '#0284c7'); // 15 GPa
  shockGrad.addColorStop(1, '#312e81'); // 0 GPa (Unshocked Basalt Bedrock)
  
  ctx.fillStyle = shockGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, outerRimR * 1.4, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}
