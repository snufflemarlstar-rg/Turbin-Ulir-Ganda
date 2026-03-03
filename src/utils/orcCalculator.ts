// ORC Expander Calculator
import {
  FluidData,
  FLUID_DATABASE,
  getEnthalpy,
  getEntropy,
  getDensity,
  getSaturationTemperature,
  getSaturatedLiquidEnthalpy,
  getSaturatedLiquidDensity,
  getTemperatureFromEnthalpy,
  validateConditions
} from './fluidProperties';

// Input interfaces
export interface ThermoInputs {
  fluid: string;
  P_in_bar: number;
  T_in_C: number;
  P_out_bar: number;
  eta_is: number;
  eta_mech: number;
  eta_pump: number;
  eta_gen: number;
}

export interface DesignTargets {
  speed_rpm: number;
  P_shaft_W: number;
}

export interface Volumetrics {
  eta_vol: number;
  C_v: number;
  L_over_D: number;
}

export interface GeometryPrefs {
  female_to_male_ratio: number;
  minor_to_major_ratio: number;
  helix_angle_deg: number;
  gear_helix_deg: number;
  gear_pressure_angle_deg: number;
}

export interface PortsPrefs {
  v_inlet_target: number;
  v_outlet_target: number;
}

export interface ThrustPrefs {
  thrust_balance_factor: number;
  shaft_diam_guess_male_mm: number;
  shaft_diam_guess_fem_mm: number;
}

// Results interface
export interface Results {
  // Validation
  valid: boolean;
  error_message: string;
  
  // Thermo
  h1: number;
  s1: number;
  T1: number;
  rho_in: number;
  h2s: number;
  T2s: number;
  dh_isen: number;
  h2a: number;
  T2a: number;
  x2a: number | null;
  rho_out: number;
  w_actual: number;
  m_dot: number;
  
  // Mechanics
  torque_Nm: number;
  tip_speed_mps: number;
  omega_rad_s: number;
  
  // Geometry
  Vdot_in: number;
  Vdot_out: number;
  V_rev: number;
  D_male: number;
  L_axial: number;
  D_fem: number;
  C_center: number;
  d_male_minor: number;
  d_fem_minor: number;
  
  // Ports
  A_in: number;
  A_out: number;
  
  // Gears
  gear_D_male: number;
  gear_D_fem: number;
  gear_Ft: number;
  gear_Fa: number;
  gear_Fr: number;
  
  // Thrust
  F_thrust_male: number;
  F_thrust_fem: number;
  
  // Cycle
  h3: number;
  T3: number;
  rho_liq: number;
  h4: number;
  T4: number;
  w_pump: number;
  Q_in: number;
  Q_out: number;
  eta_cycle_gross: number;
  eta_cycle_net: number;
  
  // Additional info
  Tsat_in: number;
  Tsat_out: number;
  superheat_in: number;
  pressure_ratio: number;
}

// Default values
export const defaultInputs: ThermoInputs = {
  fluid: "R1233zd(E)",
  P_in_bar: 14.0,
  T_in_C: 160.0,
  P_out_bar: 3.0,
  eta_is: 0.70,
  eta_mech: 0.94,
  eta_pump: 0.75,
  eta_gen: 0.97
};

export const defaultTargets: DesignTargets = {
  speed_rpm: 4500.0,
  P_shaft_W: 500000.0
};

export const defaultVolumetrics: Volumetrics = {
  eta_vol: 0.85,
  C_v: 0.16,
  L_over_D: 1.60
};

export const defaultGeometry: GeometryPrefs = {
  female_to_male_ratio: 6.0 / 5.0,
  minor_to_major_ratio: 0.65,
  helix_angle_deg: 28.0,
  gear_helix_deg: 20.0,
  gear_pressure_angle_deg: 20.0
};

export const defaultPorts: PortsPrefs = {
  v_inlet_target: 60.0,
  v_outlet_target: 65.0
};

export const defaultThrust: ThrustPrefs = {
  thrust_balance_factor: 0.4,
  shaft_diam_guess_male_mm: 110.0,
  shaft_diam_guess_fem_mm: 100.0
};

// Helper functions
function bar_to_Pa(bar: number): number {
  return bar * 1e5;
}

function C_to_K(C: number): number {
  return C + 273.15;
}

function safeDiv(a: number, b: number): number {
  if (Math.abs(b) < 1e-15) return 0;
  const result = a / b;
  if (!isFinite(result) || isNaN(result)) return 0;
  return result;
}

// safeSqrt available for future use
export function safeSqrt(x: number): number {
  if (x < 0) return 0;
  return Math.sqrt(x);
}

function safePow(base: number, exp: number): number {
  if (base < 0 && exp !== Math.floor(exp)) return 0;
  const result = Math.pow(base, exp);
  if (!isFinite(result) || isNaN(result)) return 0;
  return result;
}

// Main solver function
export function solve(
  inputs: ThermoInputs = defaultInputs,
  targets: DesignTargets = defaultTargets,
  vols: Volumetrics = defaultVolumetrics,
  geom: GeometryPrefs = defaultGeometry,
  ports: PortsPrefs = defaultPorts,
  thrust: ThrustPrefs = defaultThrust
): Results {
  // Get fluid data
  const fluid = FLUID_DATABASE[inputs.fluid];
  if (!fluid) {
    return createErrorResult(`Unknown fluid: ${inputs.fluid}`);
  }
  
  // Convert units
  const P1 = bar_to_Pa(inputs.P_in_bar);
  const P2 = bar_to_Pa(inputs.P_out_bar);
  const T1 = C_to_K(inputs.T_in_C);
  
  // Validate conditions
  const validation = validateConditions(T1, P1, P2, fluid);
  if (!validation.valid) {
    return createErrorResult(validation.message);
  }
  
  try {
    // Saturation temperatures
    const Tsat_in = getSaturationTemperature(P1, fluid);
    const Tsat_out = getSaturationTemperature(P2, fluid);
    const superheat_in = T1 - Tsat_in;
    const pressure_ratio = P1 / P2;
    
    // State 1: Inlet (superheated vapor)
    const h1 = getEnthalpy(T1, P1, fluid);
    const s1 = getEntropy(T1, P1, fluid);
    const rho_in = getDensity(T1, P1, fluid);
    
    // Validate calculated values
    if (!isFinite(h1) || !isFinite(s1) || !isFinite(rho_in) || rho_in <= 0) {
      return createErrorResult("Failed to calculate inlet state properties");
    }
    
    // State 2s: Isentropic outlet
    // Find T2s such that s(T2s, P2) = s1
    let T2s = Tsat_out + 5; // Initial guess: slightly superheated
    for (let iter = 0; iter < 100; iter++) {
      const s_calc = getEntropy(T2s, P2, fluid);
      const error = s_calc - s1;
      
      if (Math.abs(error) < 0.5) break;
      
      // Numerical derivative
      const dT = 0.1;
      const s_plus = getEntropy(T2s + dT, P2, fluid);
      const dsdT = safeDiv(s_plus - s_calc, dT);
      
      if (Math.abs(dsdT) > 1e-10) {
        T2s = T2s - safeDiv(error, dsdT);
      } else {
        T2s = T2s - error * 0.05;
      }
      
      // Keep in valid range
      T2s = Math.max(Tsat_out, Math.min(fluid.T_max, T2s));
    }
    
    const h2s = getEnthalpy(T2s, P2, fluid);
    
    // Isentropic enthalpy drop
    let dh_isen = h1 - h2s;
    if (dh_isen < 0) {
      // This shouldn't happen - indicates calculation error
      dh_isen = Math.abs(dh_isen);
    }
    if (!isFinite(dh_isen) || dh_isen < 100) {
      return createErrorResult("Invalid isentropic enthalpy drop. Check operating conditions.");
    }
    
    // Actual turbine work
    const w_turb = inputs.eta_is * dh_isen;
    
    // Mass flow rate
    const m_dot = safeDiv(targets.P_shaft_W, w_turb * inputs.eta_mech);
    if (!isFinite(m_dot) || m_dot <= 0) {
      return createErrorResult("Invalid mass flow rate calculation");
    }
    
    // Actual outlet state
    const h2a = h1 - w_turb;
    const T2a = getTemperatureFromEnthalpy(h2a, P2, fluid);
    const rho_out = getDensity(T2a, P2, fluid);
    
    if (!isFinite(rho_out) || rho_out <= 0) {
      return createErrorResult("Invalid outlet density calculation");
    }
    
    // Check for two-phase at outlet (x2a = quality, null if superheated)
    let x2a: number | null = null;
    if (T2a < Tsat_out + 1) {
      // Potentially two-phase
      const h_liq = getSaturatedLiquidEnthalpy(P2, fluid);
      const h_vap = getEnthalpy(Tsat_out + 0.1, P2, fluid);
      if (h2a < h_vap && h2a > h_liq) {
        x2a = safeDiv(h2a - h_liq, h_vap - h_liq);
        x2a = Math.max(0, Math.min(1, x2a));
      }
    }
    
    // Volumetric flows
    const Vdot_in = safeDiv(m_dot, rho_in);
    const Vdot_out = safeDiv(m_dot, rho_out);
    
    // Rotor sizing
    const rps = targets.speed_rpm / 60.0;
    const V_rev = safeDiv(Vdot_in, vols.eta_vol * rps);
    
    // Solve for male OD: V_rev = C_v * D^2 * L = C_v * D^3 * (L/D)
    const D_male = safePow(safeDiv(V_rev, vols.C_v * vols.L_over_D), 1.0 / 3.0);
    const L_axial = vols.L_over_D * D_male;
    
    // Female rotor
    const D_fem = D_male * geom.female_to_male_ratio;
    const C_center = 0.5 * (D_male + D_fem);
    
    // Minor diameters
    const d_male_minor = geom.minor_to_major_ratio * D_male;
    const d_fem_minor = geom.minor_to_major_ratio * D_fem;
    
    // Mechanics
    const omega = 2.0 * Math.PI * rps;
    const torque = safeDiv(targets.P_shaft_W, omega);
    const tip_speed = Math.PI * D_male * targets.speed_rpm / 60.0;
    
    // Port areas
    const A_in = safeDiv(Vdot_in, ports.v_inlet_target);
    const A_out = safeDiv(Vdot_out, ports.v_outlet_target);
    
    // Timing gear calculations
    const Dg_male = D_male;
    const Dg_fem = D_fem;
    const Ft = safeDiv(torque, Dg_male / 2.0);
    const beta = (geom.gear_helix_deg * Math.PI) / 180;
    const phi = (geom.gear_pressure_angle_deg * Math.PI) / 180;
    const Fa = Ft * Math.tan(beta);
    const Fr = Ft * Math.tan(phi);
    
    // Axial thrust
    const dp = bar_to_Pa(inputs.P_in_bar - inputs.P_out_bar);
    const d_male_shaft = thrust.shaft_diam_guess_male_mm / 1000.0;
    const d_fem_shaft = thrust.shaft_diam_guess_fem_mm / 1000.0;
    const A_face_male = (Math.PI / 4.0) * Math.max(D_male * D_male - d_male_shaft * d_male_shaft, 0);
    const A_face_fem = (Math.PI / 4.0) * Math.max(D_fem * D_fem - d_fem_shaft * d_fem_shaft, 0);
    const F_thrust_male = thrust.thrust_balance_factor * dp * A_face_male;
    const F_thrust_fem = thrust.thrust_balance_factor * dp * A_face_fem;
    
    // ORC Cycle calculations
    // State 3: Saturated liquid at condenser pressure
    const h3 = getSaturatedLiquidEnthalpy(P2, fluid);
    const T3 = Tsat_out;
    const rho_liq = getSaturatedLiquidDensity(P2, fluid);
    
    // Pump work (incompressible approximation)
    const w_pump_isen = safeDiv(P1 - P2, rho_liq);
    const w_pump = safeDiv(w_pump_isen, inputs.eta_pump);
    
    // State 4: Pump outlet
    const h4 = h3 + w_pump;
    const T4 = getTemperatureFromEnthalpy(h4, P1, fluid);
    
    // Heat duties
    const Q_in = h1 - h4;
    const Q_out = h2a - h3;
    
    // Cycle efficiencies
    let eta_cycle_gross = 0;
    let eta_cycle_net = 0;
    
    if (Q_in > 0) {
      const W_gross = w_turb * inputs.eta_mech * inputs.eta_gen;
      eta_cycle_gross = safeDiv(W_gross, Q_in);
      
      const W_pump_elec = safeDiv(w_pump, inputs.eta_pump);
      eta_cycle_net = safeDiv(W_gross - W_pump_elec, Q_in);
    }
    
    // Ensure efficiency is in valid range
    eta_cycle_gross = Math.max(0, Math.min(0.5, eta_cycle_gross));
    eta_cycle_net = Math.max(0, Math.min(0.5, eta_cycle_net));
    
    return {
      valid: true,
      error_message: "",
      
      // Thermo
      h1, s1, T1, rho_in,
      h2s, T2s, dh_isen,
      h2a, T2a, x2a, rho_out,
      w_actual: w_turb, m_dot,
      
      // Mechanics
      torque_Nm: torque, tip_speed_mps: tip_speed, omega_rad_s: omega,
      
      // Geometry
      Vdot_in, Vdot_out, V_rev,
      D_male, L_axial, D_fem, C_center,
      d_male_minor, d_fem_minor,
      
      // Ports
      A_in, A_out,
      
      // Gears
      gear_D_male: Dg_male, gear_D_fem: Dg_fem,
      gear_Ft: Ft, gear_Fa: Fa, gear_Fr: Fr,
      
      // Thrust
      F_thrust_male, F_thrust_fem,
      
      // Cycle
      h3, T3, rho_liq,
      h4, T4, w_pump,
      Q_in, Q_out,
      eta_cycle_gross, eta_cycle_net,
      
      // Additional
      Tsat_in, Tsat_out, superheat_in, pressure_ratio
    };
    
  } catch (error) {
    return createErrorResult(`Calculation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function createErrorResult(message: string): Results {
  return {
    valid: false,
    error_message: message,
    h1: 0, s1: 0, T1: 0, rho_in: 0,
    h2s: 0, T2s: 0, dh_isen: 0,
    h2a: 0, T2a: 0, x2a: null, rho_out: 0,
    w_actual: 0, m_dot: 0,
    torque_Nm: 0, tip_speed_mps: 0, omega_rad_s: 0,
    Vdot_in: 0, Vdot_out: 0, V_rev: 0,
    D_male: 0, L_axial: 0, D_fem: 0, C_center: 0,
    d_male_minor: 0, d_fem_minor: 0,
    A_in: 0, A_out: 0,
    gear_D_male: 0, gear_D_fem: 0,
    gear_Ft: 0, gear_Fa: 0, gear_Fr: 0,
    F_thrust_male: 0, F_thrust_fem: 0,
    h3: 0, T3: 0, rho_liq: 0,
    h4: 0, T4: 0, w_pump: 0,
    Q_in: 0, Q_out: 0,
    eta_cycle_gross: 0, eta_cycle_net: 0,
    Tsat_in: 0, Tsat_out: 0, superheat_in: 0, pressure_ratio: 0
  };
}

// Get recommended conditions for a fluid
export function getRecommendedConditions(fluidName: string): {
  T_in_C: number;
  P_in_bar: number;
  P_out_bar: number;
} {
  const fluid = FLUID_DATABASE[fluidName];
  if (!fluid) {
    return { T_in_C: 100, P_in_bar: 10, P_out_bar: 2 };
  }
  
  // Calculate reasonable operating range based on fluid properties
  const T_max_safe = Math.min(fluid.T_max - 10, fluid.Tc * 0.92);
  const T_in_K = T_max_safe;
  const T_in_C = T_in_K - 273.15;
  
  // High pressure: ~70% of critical
  const P_in = Math.min(fluid.Pc * 0.7, fluid.P_max * 0.9);
  const P_in_bar = P_in / 1e5;
  
  // Low pressure: ~10% of high pressure but above minimum
  const P_out = Math.max(P_in * 0.15, fluid.P_min * 1.5);
  const P_out_bar = P_out / 1e5;
  
  return {
    T_in_C: Math.round(T_in_C),
    P_in_bar: Math.round(P_in_bar * 10) / 10,
    P_out_bar: Math.round(P_out_bar * 10) / 10
  };
}

// Export fluid list
export function getFluidList(): string[] {
  return Object.keys(FLUID_DATABASE);
}

// Export fluid info
export function getFluidInfo(fluidName: string): FluidData | null {
  return FLUID_DATABASE[fluidName] || null;
}
