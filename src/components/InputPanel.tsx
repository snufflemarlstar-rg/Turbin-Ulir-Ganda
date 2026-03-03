import {
  ThermoInputs,
  DesignTargets,
  Volumetrics,
  getFluidList,
  getFluidInfo,
  getRecommendedConditions
} from '../utils/orcCalculator';

interface InputPanelProps {
  inputs: ThermoInputs;
  targets: DesignTargets;
  volumetrics: Volumetrics;
  onInputsChange: (inputs: ThermoInputs) => void;
  onTargetsChange: (targets: DesignTargets) => void;
  onVolumetricsChange: (volumetrics: Volumetrics) => void;
}

export function InputPanel({
  inputs,
  targets,
  volumetrics,
  onInputsChange,
  onTargetsChange,
  onVolumetricsChange
}: InputPanelProps) {
  const fluids = getFluidList();
  const fluidInfo = getFluidInfo(inputs.fluid);

  const handleFluidChange = (fluid: string) => {
    const recommended = getRecommendedConditions(fluid);
    onInputsChange({
      ...inputs,
      fluid,
      T_in_C: recommended.T_in_C,
      P_in_bar: recommended.P_in_bar,
      P_out_bar: recommended.P_out_bar
    });
  };

  const handleUseRecommended = () => {
    const recommended = getRecommendedConditions(inputs.fluid);
    onInputsChange({
      ...inputs,
      T_in_C: recommended.T_in_C,
      P_in_bar: recommended.P_in_bar,
      P_out_bar: recommended.P_out_bar
    });
  };

  return (
    <div className="space-y-6">
      {/* Working Fluid */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">💧</span>
          Working Fluid
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Fluid</label>
            <select
              value={inputs.fluid}
              onChange={(e) => handleFluidChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {fluids.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          
          {fluidInfo && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-gray-500">Formula:</span> <span className="font-mono">{fluidInfo.formula}</span></div>
                <div><span className="text-gray-500">M:</span> {(fluidInfo.M * 1000).toFixed(2)} g/mol</div>
                <div><span className="text-gray-500">T<sub>c</sub>:</span> {(fluidInfo.Tc - 273.15).toFixed(1)}°C</div>
                <div><span className="text-gray-500">P<sub>c</sub>:</span> {(fluidInfo.Pc / 1e5).toFixed(1)} bar</div>
                <div><span className="text-gray-500">T<sub>b</sub>:</span> {(fluidInfo.Tb - 273.15).toFixed(1)}°C</div>
                <div><span className="text-gray-500">ω:</span> {fluidInfo.omega.toFixed(3)}</div>
              </div>
            </div>
          )}
          
          <button
            onClick={handleUseRecommended}
            className="w-full py-2 px-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            Use Recommended Conditions for {inputs.fluid}
          </button>
        </div>
      </div>

      {/* Operating Conditions */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">🌡️</span>
          Operating Conditions
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Inlet Pressure (bar)
            </label>
            <input
              type="number"
              value={inputs.P_in_bar}
              onChange={(e) => onInputsChange({ ...inputs, P_in_bar: parseFloat(e.target.value) || 0 })}
              step="0.5"
              min="0.5"
              max="50"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Inlet Temperature (°C)
            </label>
            <input
              type="number"
              value={inputs.T_in_C}
              onChange={(e) => onInputsChange({ ...inputs, T_in_C: parseFloat(e.target.value) || 0 })}
              step="5"
              min="-50"
              max="250"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Outlet Pressure (bar)
            </label>
            <input
              type="number"
              value={inputs.P_out_bar}
              onChange={(e) => onInputsChange({ ...inputs, P_out_bar: parseFloat(e.target.value) || 0 })}
              step="0.5"
              min="0.1"
              max="20"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-end">
            <div className="bg-gray-50 rounded-lg p-2 text-sm w-full">
              <span className="text-gray-500">Pressure Ratio:</span>
              <span className="font-semibold ml-2">{(inputs.P_in_bar / inputs.P_out_bar).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Design Targets */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">⚡</span>
          Design Targets
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shaft Power (kW)
            </label>
            <input
              type="number"
              value={targets.P_shaft_W / 1000}
              onChange={(e) => onTargetsChange({ ...targets, P_shaft_W: (parseFloat(e.target.value) || 0) * 1000 })}
              step="50"
              min="10"
              max="5000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rotor Speed (rpm)
            </label>
            <input
              type="number"
              value={targets.speed_rpm}
              onChange={(e) => onTargetsChange({ ...targets, speed_rpm: parseFloat(e.target.value) || 0 })}
              step="100"
              min="1000"
              max="20000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Efficiencies */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">📊</span>
          Efficiencies
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Isentropic η (%)
            </label>
            <input
              type="number"
              value={(inputs.eta_is * 100).toFixed(0)}
              onChange={(e) => onInputsChange({ ...inputs, eta_is: (parseFloat(e.target.value) || 0) / 100 })}
              step="1"
              min="50"
              max="95"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mechanical η (%)
            </label>
            <input
              type="number"
              value={(inputs.eta_mech * 100).toFixed(0)}
              onChange={(e) => onInputsChange({ ...inputs, eta_mech: (parseFloat(e.target.value) || 0) / 100 })}
              step="1"
              min="80"
              max="99"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Volumetric η (%)
            </label>
            <input
              type="number"
              value={(volumetrics.eta_vol * 100).toFixed(0)}
              onChange={(e) => onVolumetricsChange({ ...volumetrics, eta_vol: (parseFloat(e.target.value) || 0) / 100 })}
              step="1"
              min="70"
              max="98"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pump η (%)
            </label>
            <input
              type="number"
              value={(inputs.eta_pump * 100).toFixed(0)}
              onChange={(e) => onInputsChange({ ...inputs, eta_pump: (parseFloat(e.target.value) || 0) / 100 })}
              step="1"
              min="50"
              max="95"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Generator η (%)
            </label>
            <input
              type="number"
              value={(inputs.eta_gen * 100).toFixed(0)}
              onChange={(e) => onInputsChange({ ...inputs, eta_gen: (parseFloat(e.target.value) || 0) / 100 })}
              step="1"
              min="90"
              max="99"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Geometry Coefficients */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600">⚙️</span>
          Geometry Coefficients
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              C<sub>v</sub> (0.14-0.18)
            </label>
            <input
              type="number"
              value={volumetrics.C_v}
              onChange={(e) => onVolumetricsChange({ ...volumetrics, C_v: parseFloat(e.target.value) || 0 })}
              step="0.01"
              min="0.10"
              max="0.25"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              L/D Ratio
            </label>
            <input
              type="number"
              value={volumetrics.L_over_D}
              onChange={(e) => onVolumetricsChange({ ...volumetrics, L_over_D: parseFloat(e.target.value) || 0 })}
              step="0.1"
              min="1.0"
              max="2.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
