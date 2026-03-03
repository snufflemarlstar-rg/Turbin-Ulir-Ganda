import { Results, ThermoInputs, DesignTargets, Volumetrics } from '../utils/orcCalculator';

interface ResultsPanelProps {
  results: Results;
  inputs: ThermoInputs;
  targets: DesignTargets;
  volumetrics: Volumetrics;
}

function formatNumber(value: number, decimals: number = 2, suffix: string = ''): string {
  if (!isFinite(value) || isNaN(value)) return '—';
  if (Math.abs(value) >= 1e6) {
    return `${(value / 1e6).toFixed(decimals)} M${suffix}`;
  }
  if (Math.abs(value) >= 1e3) {
    return `${(value / 1e3).toFixed(decimals)} k${suffix}`;
  }
  if (Math.abs(value) < 0.01 && value !== 0) {
    return `${value.toExponential(decimals)} ${suffix}`;
  }
  return `${value.toFixed(decimals)} ${suffix}`;
}

export function ResultsPanel({ results, inputs, targets }: ResultsPanelProps) {
  if (!results.valid) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">⚠️</span>
          <h3 className="text-lg font-semibold text-red-800">Calculation Error</h3>
        </div>
        <p className="text-red-700">{results.error_message}</p>
        <div className="mt-4 text-sm text-red-600">
          <p>Suggestions:</p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>Check that inlet temperature is above saturation temperature</li>
            <li>Ensure inlet pressure is higher than outlet pressure</li>
            <li>Verify operating conditions are within fluid limits</li>
            <li>Try using the "Recommended Conditions" button</li>
          </ul>
        </div>
      </div>
    );
  }

  const sections = [
    {
      title: 'Thermodynamic States',
      icon: '🌡️',
      color: 'blue',
      items: [
        { label: 'Inlet Enthalpy (h₁)', value: formatNumber(results.h1 / 1000, 2, 'kJ/kg') },
        { label: 'Inlet Entropy (s₁)', value: formatNumber(results.s1 / 1000, 3, 'kJ/kg·K') },
        { label: 'Inlet Density (ρ_in)', value: formatNumber(results.rho_in, 2, 'kg/m³') },
        { label: 'Saturation Temp (inlet)', value: formatNumber(results.Tsat_in - 273.15, 1, '°C') },
        { label: 'Superheat', value: formatNumber(results.superheat_in, 1, '°C') },
        { label: 'Isentropic Outlet Temp (T₂s)', value: formatNumber(results.T2s - 273.15, 1, '°C') },
        { label: 'Actual Outlet Temp (T₂a)', value: formatNumber(results.T2a - 273.15, 1, '°C') },
        { label: 'Outlet Density (ρ_out)', value: formatNumber(results.rho_out, 2, 'kg/m³') },
        { label: 'Isentropic Δh', value: formatNumber(results.dh_isen / 1000, 2, 'kJ/kg') },
        { label: 'Actual Work', value: formatNumber(results.w_actual / 1000, 2, 'kJ/kg') },
        { label: 'Mass Flow Rate', value: formatNumber(results.m_dot, 3, 'kg/s') },
      ]
    },
    {
      title: 'Rotor Geometry',
      icon: '⚙️',
      color: 'green',
      items: [
        { label: 'Male OD (D_male)', value: formatNumber(results.D_male * 1000, 1, 'mm') },
        { label: 'Female OD (D_fem)', value: formatNumber(results.D_fem * 1000, 1, 'mm') },
        { label: 'Axial Length (L)', value: formatNumber(results.L_axial * 1000, 1, 'mm') },
        { label: 'Center Distance (C)', value: formatNumber(results.C_center * 1000, 1, 'mm') },
        { label: 'Male Root Ø', value: formatNumber(results.d_male_minor * 1000, 1, 'mm') },
        { label: 'Female Root Ø', value: formatNumber(results.d_fem_minor * 1000, 1, 'mm') },
        { label: 'L/D Ratio', value: formatNumber(results.L_axial / results.D_male, 2) },
        { label: 'Swept Volume', value: formatNumber(results.V_rev * 1e6, 1, 'cm³/rev') },
      ]
    },
    {
      title: 'Volumetric Flows',
      icon: '💨',
      color: 'purple',
      items: [
        { label: 'Inlet Vol. Flow (V̇_in)', value: formatNumber(results.Vdot_in * 1000, 2, 'L/s') },
        { label: 'Outlet Vol. Flow (V̇_out)', value: formatNumber(results.Vdot_out * 1000, 2, 'L/s') },
        { label: 'Volume Ratio', value: formatNumber(results.Vdot_out / results.Vdot_in, 2) },
        { label: 'Inlet Port Area', value: formatNumber(results.A_in * 1e4, 1, 'cm²') },
        { label: 'Outlet Port Area', value: formatNumber(results.A_out * 1e4, 1, 'cm²') },
      ]
    },
    {
      title: 'Mechanics',
      icon: '🔧',
      color: 'orange',
      items: [
        { label: 'Shaft Torque', value: formatNumber(results.torque_Nm, 1, 'N·m') },
        { label: 'Angular Velocity', value: formatNumber(results.omega_rad_s, 2, 'rad/s') },
        { label: 'Tip Speed', value: formatNumber(results.tip_speed_mps, 1, 'm/s') },
        { label: 'Tip Speed Status', value: results.tip_speed_mps < 80 ? '✅ OK' : '⚠️ High' },
      ]
    },
    {
      title: 'Timing Gear Forces',
      icon: '⚡',
      color: 'red',
      items: [
        { label: 'Tangential (Ft)', value: formatNumber(results.gear_Ft / 1000, 2, 'kN') },
        { label: 'Axial (Fa)', value: formatNumber(results.gear_Fa / 1000, 2, 'kN') },
        { label: 'Radial (Fr)', value: formatNumber(results.gear_Fr / 1000, 2, 'kN') },
        { label: 'Male Gear Pitch Ø', value: formatNumber(results.gear_D_male * 1000, 1, 'mm') },
        { label: 'Female Gear Pitch Ø', value: formatNumber(results.gear_D_fem * 1000, 1, 'mm') },
      ]
    },
    {
      title: 'Axial Thrust (after balancing)',
      icon: '📐',
      color: 'indigo',
      items: [
        { label: 'Male Rotor Thrust', value: formatNumber(results.F_thrust_male / 1000, 2, 'kN') },
        { label: 'Female Rotor Thrust', value: formatNumber(results.F_thrust_fem / 1000, 2, 'kN') },
        { label: 'Pressure Difference', value: formatNumber((inputs.P_in_bar - inputs.P_out_bar), 1, 'bar') },
      ]
    },
    {
      title: 'ORC Cycle',
      icon: '♻️',
      color: 'teal',
      items: [
        { label: 'Condenser Sat. Temp (T₃)', value: formatNumber(results.T3 - 273.15, 1, '°C') },
        { label: 'Pump Outlet Temp (T₄)', value: formatNumber(results.T4 - 273.15, 1, '°C') },
        { label: 'Pump Work', value: formatNumber(results.w_pump / 1000, 2, 'kJ/kg') },
        { label: 'Heater Duty (Q_in)', value: formatNumber(results.Q_in / 1000, 1, 'kJ/kg') },
        { label: 'Condenser Duty (Q_out)', value: formatNumber(results.Q_out / 1000, 1, 'kJ/kg') },
        { label: 'Gross Cycle Efficiency', value: formatNumber(results.eta_cycle_gross * 100, 2, '%') },
        { label: 'Net Cycle Efficiency', value: formatNumber(results.eta_cycle_net * 100, 2, '%') },
      ]
    },
  ];

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    teal: 'bg-teal-100 text-teal-600',
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="text-sm opacity-80">Shaft Power</div>
          <div className="text-2xl font-bold">{(targets.P_shaft_W / 1000).toFixed(0)} kW</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="text-sm opacity-80">Mass Flow</div>
          <div className="text-2xl font-bold">{results.m_dot.toFixed(2)} kg/s</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="text-sm opacity-80">Cycle η (net)</div>
          <div className="text-2xl font-bold">{(results.eta_cycle_net * 100).toFixed(1)}%</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="text-sm opacity-80">Male Rotor OD</div>
          <div className="text-2xl font-bold">{(results.D_male * 1000).toFixed(0)} mm</div>
        </div>
      </div>

      {/* Detail Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClasses[section.color]}`}>
                {section.icon}
              </span>
              {section.title}
            </h3>
            <div className="space-y-2">
              {section.items.map((item) => (
                <div key={item.label} className="flex justify-between items-center py-1 border-b border-gray-50">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className="text-sm font-semibold text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
