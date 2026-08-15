/**
 * Lonar Crater Impact Physics Calculator
 * Scientific formulas for hypervelocity bolide impacts in Deccan Traps Basalt
 */

// Basalt Target Density: ~2900 kg/m^3
// Iron-Nickel Meteorite Density: ~7800 kg/m^3 (or Chondrite ~3500 kg/m^3)
const BASALT_DENSITY = 2900; 

export function calculateImpactPhysics({
  meteorDiameter = 60, // meters
  meteorVelocity = 20, // km/s
  meteorDensity = 7800, // kg/m^3 (Iron Meteorite like Lonar's suspected impactor)
  impactAngle = 45 // degrees
}) {
  // Volume of spherical meteoroid: V = (4/3) * PI * (r^3)
  const radius = meteorDiameter / 2;
  const volume = (4 / 3) * Math.PI * Math.pow(radius, 3); // m^3
  const mass = volume * meteorDensity; // kg

  // Kinetic Energy: E_k = 0.5 * m * v^2
  const vMS = meteorVelocity * 1000; // m/s
  const energyJoules = 0.5 * mass * Math.pow(vMS, 2);
  
  // 1 Megaton TNT = 4.184 x 10^15 Joules
  const energyMegatons = energyJoules / 4.184e15;

  // Impact Scaling Law for Basalt Target (Holsapple & Housen crater scaling)
  // D_transient = 1.16 * (density_m / density_t)^0.33 * (d^0.78) * (v^0.44) * (g^-0.22) * sin(angle)^0.33
  const sinAngle = Math.sin((impactAngle * Math.PI) / 180);
  const densityRatio = meteorDensity / BASALT_DENSITY;
  
  const estimatedRimDiameter = 1.8 * Math.pow(energyMegatons / 6, 0.28); // km normalized to Lonar's 6 MT impact
  const estimatedDepth = estimatedRimDiameter * 1000 * 0.13; // ~130m to 150m for simple bowl craters

  // Shock Metamorphism Peak Pressure (GPa)
  // Maskelynite glass forms at >60 GPa; Shatter cones form at 20-40 GPa
  const peakShockPressureGPa = 0.5 * (meteorDensity * 1e-3) * Math.pow(meteorVelocity, 2); 
  const seismicMagnitude = 0.67 * Math.log10(energyJoules) - 5.87;

  return {
    massKg: mass.toExponential(2),
    energyJoules: energyJoules.toExponential(2),
    energyMegatons: energyMegatons.toFixed(2),
    craterDiameterKm: estimatedRimDiameter.toFixed(2),
    craterDepthMeters: Math.round(estimatedDepth),
    peakShockPressureGPa: Math.round(peakShockPressureGPa),
    seismicMagnitude: seismicMagnitude.toFixed(1),
    maskelyniteFormed: peakShockPressureGPa >= 50,
    shatterConesFormed: peakShockPressureGPa >= 20,
  };
}
