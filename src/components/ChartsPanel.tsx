import { Results, ThermoInputs, DesignTargets, Volumetrics } from '../utils/orcCalculator';

interface ChartsPanelProps {
  results: Results;
  inputs: ThermoInputs;
  targets: DesignTargets;
  volumetrics: Volumetrics;
}

// Simple bar chart component
function BarChart({ 
  data, 
  title, 
  colors 
}: { 
  data: { label: string; value: number; maxValue?: number }[];
  title: string;
  colors: string[];
}) {
  const maxVal = Math.max(...data.map(d => d.maxValue || d.value), 1);
  
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, idx) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-semibold">{item.value.toFixed(1)}%</span>
            </div>
            <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((item.value / maxVal) * 100, 100)}%`,
                  backgroundColor: colors[idx % colors.length]
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Energy flow diagram
function EnergyFlowDiagram({ results }: { results: Results }) {
  const Q_in = results.Q_in / 1000;
  const W_turb = results.w_actual / 1000;
  const W_pump = results.w_pump / 1000;
  const Q_out = results.Q_out / 1000;
  
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Energy Flow (per kg)</h3>
      <div className="relative">
        {/* Grid layout for energy flow */}
        <div className="grid grid-cols-3 gap-4">
          {/* Heater */}
          <div className="bg-red-100 rounded-lg p-4 text-center border-2 border-red-300">
            <div className="text-red-600 font-semibold text-sm mb-1">🔥 Heater</div>
            <div className="text-xl font-bold text-red-700">{Q_in.toFixed(1)}</div>
            <div className="text-xs text-red-600">kJ/kg in</div>
          </div>
          
          {/* Expander */}
          <div className="bg-blue-100 rounded-lg p-4 text-center border-2 border-blue-300">
            <div className="text-blue-600 font-semibold text-sm mb-1">⚡ Expander</div>
            <div className="text-xl font-bold text-blue-700">{W_turb.toFixed(1)}</div>
            <div className="text-xs text-blue-600">kJ/kg work</div>
          </div>
          
          {/* Condenser */}
          <div className="bg-green-100 rounded-lg p-4 text-center border-2 border-green-300">
            <div className="text-green-600 font-semibold text-sm mb-1">❄️ Condenser</div>
            <div className="text-xl font-bold text-green-700">{Q_out.toFixed(1)}</div>
            <div className="text-xs text-green-600">kJ/kg out</div>
          </div>
        </div>
        
        {/* Pump below */}
        <div className="mt-4 flex justify-center">
          <div className="bg-orange-100 rounded-lg p-4 text-center border-2 border-orange-300 w-40">
            <div className="text-orange-600 font-semibold text-sm mb-1">🔄 Pump</div>
            <div className="text-xl font-bold text-orange-700">{W_pump.toFixed(2)}</div>
            <div className="text-xs text-orange-600">kJ/kg work in</div>
          </div>
        </div>
        
        {/* Flow arrows */}
        <div className="mt-4 flex justify-center gap-6 text-2xl text-gray-400">
          <span>→</span>
          <span>→</span>
          <span>→</span>
        </div>
        
        {/* Summary */}
        <div className="mt-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-600">Net Work Output</div>
              <div className="text-xl font-bold text-purple-700">{(W_turb - W_pump).toFixed(2)} kJ/kg</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Energy Balance Check</div>
              <div className="text-xl font-bold text-blue-700">
                {(Q_in - W_turb - Q_out + W_pump).toFixed(2) === '0.00' ? '✓' : `Δ = ${(Q_in - W_turb - Q_out + W_pump).toFixed(2)}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Rotor visualization
function RotorVisualization({ results }: { results: Results }) {
  const scale = 2; // pixels per mm
  const D_male_px = results.D_male * 1000 * scale;
  const D_fem_px = results.D_fem * 1000 * scale;
  const C_px = results.C_center * 1000 * scale;
  
  // SVG viewBox calculations - properly center both rotors
  const padding = 40;
  const width = D_male_px + C_px + D_fem_px / 2 + padding * 2;
  const height = Math.max(D_male_px, D_fem_px) + padding * 2;
  const centerY = height / 2;
  const maleX = padding + D_male_px / 2;
  const femX = maleX + C_px;
  
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Rotor Cross-Section</h3>
      <div className="flex justify-center overflow-x-auto">
        <svg 
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-4xl"
          style={{ minHeight: '320px' }}
        >
          {/* Male rotor */}
          <circle
            cx={maleX}
            cy={centerY}
            r={D_male_px / 2}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
          />
          <circle
            cx={maleX}
            cy={centerY}
            r={results.d_male_minor * 1000 * scale / 2}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <circle cx={maleX} cy={centerY} r="5" fill="#3B82F6" />
          <text 
            x={maleX} 
            y={centerY - D_male_px / 2 - 18} 
            textAnchor="middle" 
            fill="#1E40AF" 
            fontSize="16"
            fontWeight="bold"
          >
            Male Ø{(results.D_male * 1000).toFixed(0)}mm
          </text>
          
          {/* Female rotor */}
          <circle
            cx={femX}
            cy={centerY}
            r={D_fem_px / 2}
            fill="none"
            stroke="#EF4444"
            strokeWidth="3"
          />
          <circle
            cx={femX}
            cy={centerY}
            r={results.d_fem_minor * 1000 * scale / 2}
            fill="none"
            stroke="#EF4444"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <circle cx={femX} cy={centerY} r="5" fill="#EF4444" />
          <text 
            x={femX} 
            y={centerY - D_fem_px / 2 - 18} 
            textAnchor="middle" 
            fill="#991B1B" 
            fontSize="16"
            fontWeight="bold"
          >
            Female Ø{(results.D_fem * 1000).toFixed(0)}mm
          </text>
          
          {/* Center distance line */}
          <line
            x1={maleX}
            y1={centerY + Math.max(D_male_px, D_fem_px) / 2 + 25}
            x2={femX}
            y2={centerY + Math.max(D_male_px, D_fem_px) / 2 + 25}
            stroke="#22C55E"
            strokeWidth="2"
          />
          {/* Dimension markers */}
          <line
            x1={maleX}
            y1={centerY + Math.max(D_male_px, D_fem_px) / 2 + 20}
            x2={maleX}
            y2={centerY + Math.max(D_male_px, D_fem_px) / 2 + 30}
            stroke="#22C55E"
            strokeWidth="1.5"
          />
          <line
            x1={femX}
            y1={centerY + Math.max(D_male_px, D_fem_px) / 2 + 20}
            x2={femX}
            y2={centerY + Math.max(D_male_px, D_fem_px) / 2 + 30}
            stroke="#22C55E"
            strokeWidth="1.5"
          />
          <text 
            x={(maleX + femX) / 2} 
            y={centerY + Math.max(D_male_px, D_fem_px) / 2 + 50} 
            textAnchor="middle" 
            fill="#15803D" 
            fontSize="16"
            fontWeight="bold"
          >
            C = {(results.C_center * 1000).toFixed(1)}mm
          </text>
        </svg>
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex justify-center gap-8 text-base">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500" />
          <span className="font-medium text-gray-700">Male (5 lobes)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500" />
          <span className="font-medium text-gray-700">Female (6 lobes)</span>
        </div>
      </div>
    </div>
  );
}

// Forces visualization
function ForcesChart({ results }: { results: Results }) {
  const forces = [
    { label: 'Tangential (Ft)', value: results.gear_Ft / 1000, color: '#22C55E' },
    { label: 'Axial (Fa)', value: results.gear_Fa / 1000, color: '#F59E0B' },
    { label: 'Radial (Fr)', value: results.gear_Fr / 1000, color: '#8B5CF6' },
  ];
  
  const maxForce = Math.max(...forces.map(f => f.value), 1);
  
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Gear Forces (kN)</h3>
      <div className="flex justify-around items-end h-48">
        {forces.map((force) => (
          <div key={force.label} className="flex flex-col items-center">
            <div className="text-sm font-semibold mb-2">{force.value.toFixed(2)}</div>
            <div
              className="w-16 rounded-t-lg transition-all duration-500"
              style={{
                height: `${(force.value / maxForce) * 140}px`,
                backgroundColor: force.color
              }}
            />
            <div className="text-xs text-gray-600 mt-2 text-center">{force.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartsPanel({ results, inputs, volumetrics }: ChartsPanelProps) {
  if (!results.valid) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
        <span className="text-4xl mb-4 block">📊</span>
        <h3 className="text-lg font-semibold text-yellow-800">No Data to Display</h3>
        <p className="text-yellow-700">Fix the calculation errors to see charts.</p>
      </div>
    );
  }

  const efficiencyData = [
    { label: 'Isentropic Efficiency', value: inputs.eta_is * 100, maxValue: 100 },
    { label: 'Mechanical Efficiency', value: inputs.eta_mech * 100, maxValue: 100 },
    { label: 'Volumetric Efficiency', value: volumetrics.eta_vol * 100, maxValue: 100 },
    { label: 'Cycle Gross Efficiency', value: results.eta_cycle_gross * 100, maxValue: 30 },
    { label: 'Cycle Net Efficiency', value: results.eta_cycle_net * 100, maxValue: 30 },
  ];

  const colors = ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Top row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BarChart data={efficiencyData} title="System Efficiencies" colors={colors} />
        <EnergyFlowDiagram results={results} />
      </div>
      
      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RotorVisualization results={results} />
        <ForcesChart results={results} />
      </div>
      
      {/* Operating point summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Operating Point Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-600">Pressure Ratio</div>
            <div className="text-2xl font-bold text-blue-600">{results.pressure_ratio.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Volume Ratio</div>
            <div className="text-2xl font-bold text-green-600">
              {(results.Vdot_out / results.Vdot_in).toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Superheat</div>
            <div className="text-2xl font-bold text-orange-600">{results.superheat_in.toFixed(1)}°C</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Tip Speed</div>
            <div className={`text-2xl font-bold ${results.tip_speed_mps < 80 ? 'text-green-600' : 'text-red-600'}`}>
              {results.tip_speed_mps.toFixed(1)} m/s
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
