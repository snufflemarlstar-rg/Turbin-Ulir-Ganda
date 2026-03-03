import { useState } from 'react';
import { ThermoInputs, DesignTargets, Volumetrics } from '../utils/orcCalculator';

interface PythonCodePanelProps {
  inputs: ThermoInputs;
  targets: DesignTargets;
  volumetrics: Volumetrics;
}

export function PythonCodePanel({ inputs, targets, volumetrics }: PythonCodePanelProps) {
  const [copied, setCopied] = useState(false);

  const pythonCode = `# ORC Expander Calculator Configuration
# Generated from Web Calculator

from orc_expander_calc import (
    ThermoInputs, DesignTargets, Volumetrics,
    GeometryPrefs, PortsPrefs, ThrustPrefs,
    solve, summarize, plot_orc_cycle, plot_geometry
)

# Thermodynamic inputs
inputs = ThermoInputs(
    fluid="${inputs.fluid}",
    P_in_bar=${inputs.P_in_bar.toFixed(1)},
    T_in_C=${inputs.T_in_C.toFixed(1)},
    P_out_bar=${inputs.P_out_bar.toFixed(1)},
    eta_is=${inputs.eta_is.toFixed(2)},
    eta_mech=${inputs.eta_mech.toFixed(2)},
    eta_pump=${inputs.eta_pump.toFixed(2)},
    eta_gen=${inputs.eta_gen.toFixed(2)}
)

# Design targets
targets = DesignTargets(
    speed_rpm=${targets.speed_rpm.toFixed(1)},
    P_shaft_W=${targets.P_shaft_W.toFixed(0)}
)

# Volumetric parameters
vols = Volumetrics(
    eta_vol=${volumetrics.eta_vol.toFixed(2)},
    C_v=${volumetrics.C_v.toFixed(2)},
    L_over_D=${volumetrics.L_over_D.toFixed(2)}
)

# Geometry preferences (defaults)
geom = GeometryPrefs(
    female_to_male_ratio=6/5,
    minor_to_major_ratio=0.65,
    helix_angle_deg=28.0,
    gear_helix_deg=20.0,
    gear_pressure_angle_deg=20.0
)

# Port preferences (defaults)
ports = PortsPrefs(
    v_inlet_target=60.0,
    v_outlet_target=65.0
)

# Thrust preferences (defaults)
thrust = ThrustPrefs(
    thrust_balance_factor=0.4,
    shaft_diam_guess_male_mm=110.0,
    shaft_diam_guess_fem_mm=100.0
)

# Run calculation
res = solve(inputs, targets, vols, geom, ports, thrust)

# Print summary
summarize(inputs, targets, vols, geom, ports, thrust, res)

# Generate plots (optional)
# plot_orc_cycle(inputs, targets, res, save_path="orc_cycle.png")
# plot_geometry(res, inputs, targets, save_path="geometry.png")

print(f"\\n=== Quick Summary ===")
print(f"Mass flow: {res.m_dot:.3f} kg/s")
print(f"Male OD: {res.D_male*1000:.1f} mm")
print(f"Axial length: {res.L_axial*1000:.1f} mm")
print(f"Torque: {res.torque_Nm:.1f} N·m")
print(f"Net cycle efficiency: {res.eta_cycle_net*100:.2f}%")
`;

  const configJson = JSON.stringify({
    inputs,
    targets,
    volumetrics
  }, null, 2);

  const handleCopyPython = async () => {
    try {
      await navigator.clipboard.writeText(pythonCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  const handleDownloadJson = () => {
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orc_config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Python Code */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-800 px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">🐍</span>
            <span className="text-white font-medium">Python Configuration</span>
          </div>
          <button
            onClick={handleCopyPython}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            {copied ? '✓ Copied!' : 'Copy Code'}
          </button>
        </div>
        <pre className="p-4 overflow-x-auto bg-gray-900 text-gray-100 text-sm">
          <code>{pythonCode}</code>
        </pre>
      </div>

      {/* JSON Config */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-blue-800 px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>📋</span>
            <span className="text-white font-medium">JSON Configuration</span>
          </div>
          <button
            onClick={handleDownloadJson}
            className="px-4 py-1.5 rounded-lg text-sm font-medium bg-blue-700 text-white hover:bg-blue-600 transition-colors"
          >
            Download JSON
          </button>
        </div>
        <pre className="p-4 overflow-x-auto bg-gray-50 text-gray-800 text-sm">
          <code>{configJson}</code>
        </pre>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100">
        <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <span>📖</span> Usage Instructions
        </h3>
        <div className="space-y-3 text-amber-900">
          <div>
            <p className="font-medium">1. Install Dependencies:</p>
            <code className="block bg-amber-100 rounded-lg px-3 py-2 mt-1 text-sm">
              pip install CoolProp matplotlib numpy
            </code>
          </div>
          <div>
            <p className="font-medium">2. Save the main calculator file as <code className="bg-amber-100 px-1 rounded">orc_expander_calc.py</code></p>
          </div>
          <div>
            <p className="font-medium">3. Create a new file with the Python code above</p>
          </div>
          <div>
            <p className="font-medium">4. Run the script:</p>
            <code className="block bg-amber-100 rounded-lg px-3 py-2 mt-1 text-sm">
              python your_config_file.py
            </code>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-amber-200">
          <p className="text-sm text-amber-700">
            <strong>Note:</strong> This web calculator uses simplified thermodynamic calculations. 
            For precise results, use the Python version with CoolProp which provides accurate 
            equation-of-state calculations for refrigerants and organic fluids.
          </p>
        </div>
      </div>
      
      {/* GitHub Link */}
      <div className="bg-gray-900 rounded-xl p-5 text-center">
        <p className="text-gray-300 mb-3">Get the full Python source code:</p>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          View on GitHub
        </a>
      </div>
    </div>
  );
}
