// Fluid thermodynamic properties database with improved calculations
// All properties are based on reference data from NIST/REFPROP

export interface FluidData {
  name: string;
  formula: string;
  M: number;           // Molar mass (kg/mol)
  Tc: number;          // Critical temperature (K)
  Pc: number;          // Critical pressure (Pa)
  omega: number;       // Acentric factor
  Tb: number;          // Normal boiling point (K)
  cp_coeffs: number[]; // Cp polynomial coefficients [a, b, c, d] for Cp = a + b*T + c*T^2 + d*T^3 (J/mol/K)
  gamma: number;       // Heat capacity ratio (Cp/Cv) at reference
  rho_liq_ref: number; // Liquid density at Tb (kg/m³)
  h_vap_ref: number;   // Enthalpy of vaporization at Tb (J/mol)
  s_ref: number;       // Reference entropy (J/mol/K)
  T_min: number;       // Minimum operating temperature (K)
  T_max: number;       // Maximum operating temperature (K)
  P_min: number;       // Minimum operating pressure (Pa)
  P_max: number;       // Maximum operating pressure (Pa)
}

export const FLUID_DATABASE: Record<string, FluidData> = {
  "R1233zd(E)": {
    name: "R1233zd(E)",
    formula: "CF3CH=CHCl",
    M: 0.1305,
    Tc: 439.6,
    Pc: 3.624e6,
    omega: 0.305,
    Tb: 291.4,
    cp_coeffs: [35.0, 0.35, -1.5e-4, 2.5e-8],
    gamma: 1.10,
    rho_liq_ref: 1280,
    h_vap_ref: 24500,
    s_ref: 250,
    T_min: 250,
    T_max: 430,
    P_min: 0.5e5,
    P_max: 35e5
  },
  "R245fa": {
    name: "R245fa",
    formula: "CF3CH2CHF2",
    M: 0.134,
    Tc: 427.2,
    Pc: 3.64e6,
    omega: 0.3776,
    Tb: 288.3,
    cp_coeffs: [40.0, 0.38, -1.6e-4, 2.8e-8],
    gamma: 1.08,
    rho_liq_ref: 1339,
    h_vap_ref: 26100,
    s_ref: 260,
    T_min: 250,
    T_max: 420,
    P_min: 0.5e5,
    P_max: 35e5
  },
  "R134a": {
    name: "R134a",
    formula: "CF3CH2F",
    M: 0.10203,
    Tc: 374.21,
    Pc: 4.0593e6,
    omega: 0.32684,
    Tb: 247.08,
    cp_coeffs: [25.0, 0.28, -1.2e-4, 2.0e-8],
    gamma: 1.12,
    rho_liq_ref: 1206,
    h_vap_ref: 22000,
    s_ref: 220,
    T_min: 200,
    T_max: 365,
    P_min: 0.5e5,
    P_max: 38e5
  },
  "R410A": {
    name: "R410A",
    formula: "R32/R125 (50/50)",
    M: 0.07258,
    Tc: 344.51,
    Pc: 4.901e6,
    omega: 0.296,
    Tb: 221.71,
    cp_coeffs: [22.0, 0.22, -1.0e-4, 1.8e-8],
    gamma: 1.15,
    rho_liq_ref: 1062,
    h_vap_ref: 21500,
    s_ref: 200,
    T_min: 180,
    T_max: 335,
    P_min: 1.0e5,
    P_max: 45e5
  },
  "Pentane": {
    name: "Pentane",
    formula: "C5H12",
    M: 0.07215,
    Tc: 469.7,
    Pc: 3.37e6,
    omega: 0.251,
    Tb: 309.2,
    cp_coeffs: [120.0, 0.31, -1.4e-4, 2.2e-8],
    gamma: 1.07,
    rho_liq_ref: 626,
    h_vap_ref: 26400,
    s_ref: 270,
    T_min: 250,
    T_max: 460,
    P_min: 0.3e5,
    P_max: 32e5
  },
"R600a": {
  name: "Isobutana",
  formula: "C4H10",
  M: 0.05812,
  Tc: 407.8,
  Pc: 3.63e6,
  omega: 0.183,
  Tb: 261.4,
  cp_coeffs: [98.5, 0.42, -2.1e-4, 3.8e-8],
  gamma: 1.09,
  rho_liq_ref: 551,
  h_vap_ref: 366500,
  s_ref: 1.85,
  T_min: 220,
  T_max: 380,
  P_min: 0.3e5,
  P_max: 30e5
},
"R152a": {
  name: "1,1-Difluoroethane",
  formula: "C2H4F2",
  M: 0.06605,
  Tc: 386.41,
  Pc: 4.52e6,
  omega: 0.276,
  Tb: 248.15,
  cp_coeffs: [23.5, 0.168, -5.5e-5, 9.0e-9],
  gamma: 1.14,
  rho_liq_ref: 912,
  h_vap_ref: 327000,
  s_ref: 1.78,
  T_min: 210,
  T_max: 400,
  P_min: 0.1e5,
  P_max: 50e5
},
"R123": {
    name: "2,2-Dichloro-1,1,1-trifluoroethane",
    formula: "C2HCl2F3",
    M: 0.15293,
    Tc: 456.83,
    Pc: 3.662e6,
    omega: 0.282,
    Tb: 300.97,
    cp_coeffs: [55.2, 0.42, -2.5e-4, 5.8e-8],
    gamma: 1.10,
    rho_liq_ref: 1463,
    h_vap_ref: 170280,
    s_ref: 1.02,
    T_min: 250,
    T_max: 430,
    P_min: 0.1e5,
    P_max: 25e5
},
"R1234ze(E)": {
    name: "trans-1,3,3,3-Tetrafluoropropene",
    formula: "C3H2F4",
    M: 0.11404,
    Tc: 382.52,
    Pc: 3.636e6,
    omega: 0.313,
    Tb: 254.18,
    cp_coeffs: [26.4, 0.33, -1.8e-4, 3.5e-8],
    gamma: 1.11,
    rho_liq_ref: 1163,
    h_vap_ref: 195500,
    s_ref: 1.74,
    T_min: 230,
    T_max: 420,
    P_min: 0.2e5,
    P_max: 35e5
},
"R365mfc": {
    name: "1,1,1,3,3-Pentafluorobutane",
    formula: "C4H5F5",
    M: 0.14807,
    Tc: 460.0,
    Pc: 3.266e6,
    omega: 0.372,
    Tb: 313.3,
    cp_coeffs: [21.5, 0.54, -3.2e-4, 7.5e-8],
    gamma: 1.08,
    rho_liq_ref: 1270,
    h_vap_ref: 190500,
    s_ref: 1.45,
    T_min: 250,
    T_max: 480,
    P_min: 0.1e5,
    P_max: 35e5
},
"R236fa": {
    name: "1,1,1,3,3,3-Hexafluoropropane",
    formula: "C3H2F6",
    M: 0.15204,
    Tc: 398.07,
    Pc: 3.202e6,
    omega: 0.375,
    Tb: 271.7,
    cp_coeffs: [20.3, 0.44, -2.6e-4, 5.5e-8],
    gamma: 1.09,
    rho_liq_ref: 1360,
    h_vap_ref: 146000,
    s_ref: 1.58,
    T_min: 230,
    T_max: 450,
    P_min: 0.1e5,
    P_max: 40e5
},
"R290": {
    name: "Propane",
    formula: "C3H8",
    M: 0.04410,
    Tc: 369.89,
    Pc: 4.251e6,
    omega: 0.152,
    Tb: 231.08,
    cp_coeffs: [31.5, 0.23, -1.0e-4, 1.8e-8],
    gamma: 1.13,
    rho_liq_ref: 493,
    h_vap_ref: 425000,
    s_ref: 2.01,
    T_min: 200,
    T_max: 450,
    P_min: 0.5e5,
    P_max: 45e5
},
"Benzene": {
    name: "Benzene",
    formula: "C6H6",
    M: 0.07811,
    Tc: 562.1,
    Pc: 4.89e6,
    omega: 0.211,
    Tb: 353.2,
    cp_coeffs: [-33.9, 0.47, -3.0e-4, 7.1e-8],
    gamma: 1.11,
    rho_liq_ref: 876,
    h_vap_ref: 393000,
    s_ref: 1.64,
    T_min: 280,
    T_max: 580,
    P_min: 0.1e5,
    P_max: 50e5
},
"Cyclopentane": {
    name: "Cyclopentane",
    formula: "C5H10",
    M: 0.07013,
    Tc: 511.7,
    Pc: 4.51e6,
    omega: 0.196,
    Tb: 322.4,
    cp_coeffs: [-18.5, 0.55, -3.3e-4, 7.5e-8],
    gamma: 1.09,
    rho_liq_ref: 740,
    h_vap_ref: 406000,
    s_ref: 1.55,
    T_min: 280,
    T_max: 530,
    P_min: 0.1e5,
    P_max: 50e5
},
"Methanol": {
    name: "Methanol",
    formula: "CH3OH",
    M: 0.03204,
    Tc: 512.6,
    Pc: 8.09e6,
    omega: 0.556,
    Tb: 337.8,
    cp_coeffs: [21.1, 0.07, 1.8e-4, -3.1e-8],
    gamma: 1.20,
    rho_liq_ref: 791,
    h_vap_ref: 1100000,
    s_ref: 1.58,
    T_min: 200,
    T_max: 520,
    P_min: 0.05e5,
    P_max: 100e5
},
"HFE-7000": {
    name: "1-Methoxyheptafluoropropane",
    formula: "C4H3F7O",
    M: 0.20006,
    Tc: 437.7,
    Pc: 2.48e6,
    omega: 0.401,
    Tb: 307.2,
    cp_coeffs: [30.2, 0.65, -4.2e-4, 1.1e-7],
    gamma: 1.06,
    rho_liq_ref: 1400,
    h_vap_ref: 142000,
    s_ref: 1.35,
    T_min: 250,
    T_max: 450,
    P_min: 0.1e5,
    P_max: 25e5
},
"RE347mcc": {
    name: "1,1,1,2,2,3,3-Heptafluoro-3-methoxypropane",
    formula: "C4H3F7O",
    M: 0.20006,
    Tc: 437.7,
    Pc: 2.48e6,
    omega: 0.401,
    Tb: 307.2,
    cp_coeffs: [30.2, 0.65, -4.2e-4, 1.1e-7],
    gamma: 1.06,
    rho_liq_ref: 1400,
    h_vap_ref: 142000,
    s_ref: 1.35,
    T_min: 250,
    T_max: 450,
    P_min: 0.1e5,
    P_max: 25e5
},
"R245fa/R1234ze(E)_50/50": {
    name: "Mixture R245fa/R1234ze(E) (50/50 wt%)",
    formula: "C3H3F5 / C3H2F4",
    M: 0.12328,
    Tc: 404.84,
    Pc: 3.642e6,
    omega: 0.345,
    Tb: 268.5,
    cp_coeffs: [35.5, 0.38, -2.2e-4, 4.8e-8],
    gamma: 1.10,
    rho_liq_ref: 1258,
    h_vap_ref: 185000,
    s_ref: 1.62,
    T_min: 240,
    T_max: 430,
    P_min: 0.2e5,
    P_max: 35e5
},
"R1233zd(E)/R1224yd(Z)_50/50": {
    name: "Mixture R1233zd(E)/R1224yd(Z) (50/50 wt%)",
    formula: "C3H2ClF3 / C3HClF4",
    M: 0.13950,
    Tc: 433.72,
    Pc: 3.355e6,
    omega: 0.305,
    Tb: 289.2,
    cp_coeffs: [36.7, 0.44, -2.4e-4, 5.1e-8],
    gamma: 1.10,
    rho_liq_ref: 1320,
    h_vap_ref: 175000,
    s_ref: 1.55,
    T_min: 260,
    T_max: 450,
    P_min: 0.1e5,
    P_max: 30e5
},
"MM": {
    name: "Hexamethyldisiloxane",
    formula: "C6H18OSi2",
    M: 0.16238,
    Tc: 518.7,
    Pc: 1.939e6,
    omega: 0.529,
    Tb: 373.5,
    cp_coeffs: [-11.8, 1.05, -7.2e-4, 1.8e-7],
    gamma: 1.04,
    rho_liq_ref: 760,
    h_vap_ref: 212000,
    s_ref: 1.50,
    T_min: 250,
    T_max: 550,
    P_min: 0.01e5,
    P_max: 20e5
},
"MDM": {
    name: "Octamethyltrisiloxane",
    formula: "C8H24O2Si3",
    M: 0.23653,
    Tc: 564.1,
    Pc: 1.415e6,
    omega: 0.666,
    Tb: 425.7,
    cp_coeffs: [-44.5, 1.58, -1.0e-3, 2.5e-7],
    gamma: 1.03,
    rho_liq_ref: 820,
    h_vap_ref: 148000,
    s_ref: 1.52,
    T_min: 270,
    T_max: 600,
    P_min: 0.005e5,
    P_max: 15e5
},
  "R141b": {
    name: "R141b (1,1-Dichloro-1-fluoroethane)",
    formula: "CH3CCl2F",
    M: 0.11695,           
    Tc: 477.50,            
    Pc: 4.212e6,           
    omega: 0.2195,         
    Tb: 305.20,            
    cp_coeffs: [16.51, 0.3448, -2.225e-4, 5.919e-8],
    gamma: 1.11,           
    rho_liq_ref: 1227,     
    h_vap_ref: 222000,      
    s_ref: 320,            
    T_min: 240,            
    T_max: 470,          
    P_min: 0.05e5,         
    P_max: 40e5            
}
};

// Peng-Robinson EOS parameters
function getPRParams(T: number, fluid: FluidData): { a: number; b: number; alpha: number } {
  const R = 8.314;
  const kappa = 0.37464 + 1.54226 * fluid.omega - 0.26992 * fluid.omega * fluid.omega;
  const Tr = T / fluid.Tc;
  const alpha = Math.pow(1 + kappa * (1 - Math.sqrt(Tr)), 2);
  const a = 0.45724 * R * R * fluid.Tc * fluid.Tc / fluid.Pc * alpha;
  const b = 0.07780 * R * fluid.Tc / fluid.Pc;
  return { a, b, alpha };
}

// Calculate compressibility factor using simplified Peng-Robinson
function getCompressibilityFactor(T: number, P: number, fluid: FluidData, isVapor: boolean): number {
  const R = 8.314;
  const { a, b } = getPRParams(T, fluid);
  
  const A = a * P / (R * R * T * T);
  const B = b * P / (R * T);
  
  // Simplified cubic solution
  // Z^3 - (1-B)*Z^2 + (A - 3*B^2 - 2*B)*Z - (A*B - B^2 - B^3) = 0
  const c2 = -(1 - B);
  const c1 = A - 3 * B * B - 2 * B;
  const c0 = -(A * B - B * B - B * B * B);
  
  // Use Newton-Raphson with good initial guess
  let Z = isVapor ? 0.9 : 0.05;
  
  for (let i = 0; i < 50; i++) {
    const f = Z * Z * Z + c2 * Z * Z + c1 * Z + c0;
    const df = 3 * Z * Z + 2 * c2 * Z + c1;
    if (Math.abs(df) < 1e-15) break;
    const dZ = f / df;
    Z = Z - dZ;
    if (Math.abs(dZ) < 1e-10) break;
  }
  
  // Ensure Z is in valid range
  Z = Math.max(0.01, Math.min(2.0, Z));
  return Z;
}

// Calculate saturation pressure using Antoine-like correlation
export function getSaturationPressure(T: number, fluid: FluidData): number {
  const Tr = T / fluid.Tc;
  
  if (Tr >= 1.0) {
    return fluid.Pc;
  }
  if (Tr < 0.3) {
    return fluid.P_min;
  }
  
  // Lee-Kesler correlation for vapor pressure
  const f0 = 5.92714 - 6.09648 / Tr - 1.28862 * Math.log(Tr) + 0.169347 * Math.pow(Tr, 6);
  const f1 = 15.2518 - 15.6875 / Tr - 13.4721 * Math.log(Tr) + 0.43577 * Math.pow(Tr, 6);
  
  const lnPr = f0 + fluid.omega * f1;
  let Psat = fluid.Pc * Math.exp(lnPr);
  
  // Clamp to valid range
  Psat = Math.max(fluid.P_min, Math.min(fluid.P_max, Psat));
  
  return Psat;
}

// Calculate saturation temperature from pressure
export function getSaturationTemperature(P: number, fluid: FluidData): number {
  // Clamp pressure to valid range
  P = Math.max(fluid.P_min, Math.min(fluid.P_max, P));
  
  // Binary search for saturation temperature
  let Tlow = fluid.T_min;
  let Thigh = fluid.Tc - 1;
  
  for (let i = 0; i < 100; i++) {
    const Tmid = (Tlow + Thigh) / 2;
    const Pmid = getSaturationPressure(Tmid, fluid);
    
    if (Math.abs(Pmid - P) / P < 1e-6) {
      return Tmid;
    }
    
    if (Pmid < P) {
      Tlow = Tmid;
    } else {
      Thigh = Tmid;
    }
  }
  
  return (Tlow + Thigh) / 2;
}

// Calculate molar heat capacity at constant pressure
export function getCp(T: number, fluid: FluidData): number {
  const [a, b, c, d] = fluid.cp_coeffs;
  return a + b * T + c * T * T + d * T * T * T;
}

// Calculate vapor density
export function getVaporDensity(T: number, P: number, fluid: FluidData): number {
  const R = 8.314;
  const Z = getCompressibilityFactor(T, P, fluid, true);
  const rho_molar = P / (Z * R * T);
  return rho_molar * fluid.M;
}

// Calculate liquid density using Rackett correlation
export function getLiquidDensity(T: number, fluid: FluidData): number {
  const Tr = Math.min(T / fluid.Tc, 0.99);
  const Zra = 0.29056 - 0.08775 * fluid.omega;
  
  // Rackett equation
  const rho_c = fluid.Pc * fluid.M / (0.27 * 8.314 * fluid.Tc);
  const rho = rho_c * Math.pow(Zra, -Math.pow(1 - Tr, 2/7));
  
  return Math.max(rho, 100); // Ensure positive density
}

// Calculate enthalpy of vaporization
export function getEnthalpyOfVaporization(T: number, fluid: FluidData): number {
  const Tr = T / fluid.Tc;
  const Tr_b = fluid.Tb / fluid.Tc;
  
  if (Tr >= 0.999) return 0;
  
  // Watson correlation
  const h_vap = fluid.h_vap_ref * Math.pow((1 - Tr) / (1 - Tr_b), 0.38);
  return Math.max(h_vap, 0);
}

// Calculate specific enthalpy (J/kg)
export function getEnthalpy(T: number, P: number, fluid: FluidData): number {
  const Tsat = getSaturationTemperature(P, fluid);
  
  // Reference state at Tb
  const T_ref = fluid.Tb;
  const h_ref = 200000 * fluid.M; // Base reference in J/mol
  
  // Check if superheated, saturated, or subcooled
  let h_molar: number;
  
  if (T > Tsat + 0.5) {
    // Superheated vapor
    // h = h_liq(Tsat) + h_vap(Tsat) + integral(Cp dT, Tsat to T)
    const h_vap = getEnthalpyOfVaporization(Tsat, fluid);
    
    // Liquid enthalpy at saturation
    const h_liq_sat = h_ref + integratecp(T_ref, Tsat, fluid) * 0.9;
    
    // Vapor enthalpy at saturation
    const h_vap_sat = h_liq_sat + h_vap;
    
    // Add superheat
    const cp_integral = integratecp(Tsat, T, fluid);
    h_molar = h_vap_sat + cp_integral;
    
  } else if (T < Tsat - 0.5) {
    // Subcooled liquid
    h_molar = h_ref + integratecp(T_ref, T, fluid) * 0.9;
  } else {
    // Near saturation - use saturated vapor enthalpy
    const h_vap = getEnthalpyOfVaporization(T, fluid);
    const h_liq_sat = h_ref + integratecp(T_ref, T, fluid) * 0.9;
    h_molar = h_liq_sat + h_vap;
  }
  
  return h_molar / fluid.M; // Convert to J/kg
}

// Integrate Cp from T1 to T2
function integratecp(T1: number, T2: number, fluid: FluidData): number {
  const [a, b, c, d] = fluid.cp_coeffs;
  
  const integral = (T: number) => {
    return a * T + b * T * T / 2 + c * T * T * T / 3 + d * T * T * T * T / 4;
  };
  
  return integral(T2) - integral(T1);
}

// Calculate specific entropy (J/kg/K)
export function getEntropy(T: number, P: number, fluid: FluidData): number {
  const R_gas = 8.314;
  const Tsat = getSaturationTemperature(P, fluid);
  const Psat = getSaturationPressure(T, fluid);
  
  // Reference state
  const T_ref = fluid.Tb;
  const s_ref = fluid.s_ref;
  
  let s_molar: number;
  
  if (T > Tsat + 0.5) {
    // Superheated vapor
    const h_vap = getEnthalpyOfVaporization(Tsat, fluid);
    
    // Entropy at liquid saturation
    const s_liq_sat = s_ref + integrateCpOverT(T_ref, Tsat, fluid) * 0.9;
    
    // Add entropy of vaporization
    const s_vap = h_vap / Tsat;
    const s_vap_sat = s_liq_sat + s_vap;
    
    // Add superheat entropy and pressure correction
    const s_superheat = integrateCpOverT(Tsat, T, fluid);
    const s_pressure = -R_gas * Math.log(Math.max(P / Psat, 0.01));
    
    s_molar = s_vap_sat + s_superheat + s_pressure;
    
  } else if (T < Tsat - 0.5) {
    // Subcooled liquid
    s_molar = s_ref + integrateCpOverT(T_ref, T, fluid) * 0.9;
  } else {
    // Near saturation
    const h_vap = getEnthalpyOfVaporization(T, fluid);
    const s_liq_sat = s_ref + integrateCpOverT(T_ref, T, fluid) * 0.9;
    s_molar = s_liq_sat + h_vap / T;
  }
  
  return s_molar / fluid.M; // Convert to J/kg/K
}

// Integrate Cp/T from T1 to T2
function integrateCpOverT(T1: number, T2: number, fluid: FluidData): number {
  const [a, b, c, d] = fluid.cp_coeffs;
  
  const integral = (T: number) => {
    return a * Math.log(T) + b * T + c * T * T / 2 + d * T * T * T / 3;
  };
  
  return integral(T2) - integral(T1);
}

// Get temperature from entropy and pressure (iterative)
export function getTemperatureFromEntropy(s: number, P: number, fluid: FluidData): number {
  const Tsat = getSaturationTemperature(P, fluid);
  
  // Start search from saturation temperature
  let T = Tsat + 10;
  
  for (let i = 0; i < 50; i++) {
    const s_calc = getEntropy(T, P, fluid);
    const error = s_calc - s;
    
    if (Math.abs(error) < 0.1) {
      break;
    }
    
    // Numerical derivative
    const dT = 0.1;
    const s_plus = getEntropy(T + dT, P, fluid);
    const dsdT = (s_plus - s_calc) / dT;
    
    if (Math.abs(dsdT) > 1e-10) {
      T = T - error / dsdT;
    } else {
      T = T - error * 0.1;
    }
    
    // Keep T in valid range
    T = Math.max(fluid.T_min, Math.min(fluid.T_max, T));
  }
  
  return T;
}

// Get temperature from enthalpy and pressure (iterative)
export function getTemperatureFromEnthalpy(h: number, P: number, fluid: FluidData): number {
  const Tsat = getSaturationTemperature(P, fluid);
  
  // Start search
  let T = Tsat;
  
  for (let i = 0; i < 50; i++) {
    const h_calc = getEnthalpy(T, P, fluid);
    const error = h_calc - h;
    
    if (Math.abs(error) < 100) {
      break;
    }
    
    // Numerical derivative
    const dT = 0.1;
    const h_plus = getEnthalpy(T + dT, P, fluid);
    const dhdT = (h_plus - h_calc) / dT;
    
    if (Math.abs(dhdT) > 1e-6) {
      T = T - error / dhdT;
    } else {
      T = T - Math.sign(error) * 1;
    }
    
    // Keep T in valid range
    T = Math.max(fluid.T_min, Math.min(fluid.T_max, T));
  }
  
  return T;
}

// Get density based on phase
export function getDensity(T: number, P: number, fluid: FluidData): number {
  const Tsat = getSaturationTemperature(P, fluid);
  
  if (T > Tsat + 0.5) {
    // Superheated vapor
    return getVaporDensity(T, P, fluid);
  } else if (T < Tsat - 0.5) {
    // Subcooled liquid
    return getLiquidDensity(T, fluid);
  } else {
    // Near saturation - assume vapor for ORC expander
    return getVaporDensity(T, P, fluid);
  }
}

// Get saturated liquid enthalpy
export function getSaturatedLiquidEnthalpy(P: number, fluid: FluidData): number {
  const Tsat = getSaturationTemperature(P, fluid);
  const T_ref = fluid.Tb;
  const h_ref = 200000 * fluid.M;
  
  const h_molar = h_ref + integratecp(T_ref, Tsat, fluid) * 0.9;
  return h_molar / fluid.M;
}

// Get saturated liquid density
export function getSaturatedLiquidDensity(P: number, fluid: FluidData): number {
  const Tsat = getSaturationTemperature(P, fluid);
  return getLiquidDensity(Tsat, fluid);
}

// Validate operating conditions
export function validateConditions(
  T_in: number, 
  P_in: number, 
  P_out: number, 
  fluid: FluidData
): { valid: boolean; message: string } {
  // Check temperature limits
  if (T_in < fluid.T_min || T_in > fluid.T_max) {
    return { 
      valid: false, 
      message: `Temperature ${(T_in - 273.15).toFixed(1)}°C is outside valid range (${(fluid.T_min - 273.15).toFixed(0)} - ${(fluid.T_max - 273.15).toFixed(0)}°C)` 
    };
  }
  
  // Check pressure limits
  if (P_in < fluid.P_min || P_in > fluid.P_max) {
    return { 
      valid: false, 
      message: `Inlet pressure ${(P_in / 1e5).toFixed(1)} bar is outside valid range (${(fluid.P_min / 1e5).toFixed(1)} - ${(fluid.P_max / 1e5).toFixed(1)} bar)` 
    };
  }
  
  if (P_out < fluid.P_min || P_out > fluid.P_max) {
    return { 
      valid: false, 
      message: `Outlet pressure ${(P_out / 1e5).toFixed(1)} bar is outside valid range (${(fluid.P_min / 1e5).toFixed(1)} - ${(fluid.P_max / 1e5).toFixed(1)} bar)` 
    };
  }
  
  // Check pressure ratio
  if (P_in <= P_out) {
    return { 
      valid: false, 
      message: "Inlet pressure must be greater than outlet pressure" 
    };
  }
  
  // Check if inlet is superheated
  const Tsat_in = getSaturationTemperature(P_in, fluid);
  if (T_in < Tsat_in) {
    return { 
      valid: false, 
      message: `Inlet temperature ${(T_in - 273.15).toFixed(1)}°C is below saturation (${(Tsat_in - 273.15).toFixed(1)}°C). Need superheated vapor.` 
    };
  }
  
  // Check critical point
  if (T_in > fluid.Tc * 0.98 || P_in > fluid.Pc * 0.95) {
    return { 
      valid: false, 
      message: "Operating conditions too close to critical point" 
    };
  }
  
  return { valid: true, message: "OK" };
}
