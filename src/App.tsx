import { useState, useMemo } from 'react';
import { InputPanel } from './components/InputPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { ChartsPanel } from './components/ChartsPanel';
import { PythonCodePanel } from './components/PythonCodePanel';
import {
  solve,
  defaultInputs,
  defaultTargets,
  defaultVolumetrics,
  defaultGeometry,
  defaultPorts,
  defaultThrust,
  ThermoInputs,
  DesignTargets,
  Volumetrics
} from './utils/orcCalculator';

type TabType = 'inputs' | 'results' | 'charts' | 'code';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('inputs');
  const [inputs, setInputs] = useState<ThermoInputs>(defaultInputs);
  const [targets, setTargets] = useState<DesignTargets>(defaultTargets);
  const [volumetrics, setVolumetrics] = useState<Volumetrics>(defaultVolumetrics);

  // Calculate results whenever inputs change
  const results = useMemo(() => {
    return solve(inputs, targets, volumetrics, defaultGeometry, defaultPorts, defaultThrust);
  }, [inputs, targets, volumetrics]);

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'inputs', label: 'Design Inputs', icon: '⚙️' },
    { id: 'results', label: 'Results', icon: '📊' },
    { id: 'charts', label: 'Charts', icon: '📈' },
    { id: 'code', label: 'Python Code', icon: '🐍' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
              <span className="text-3xl">🔄</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">ORC Twin-Screw Expander Calculator</h1>
              <p className="text-blue-100 text-sm">
                Design Tool for Organic Rankine Cycle Expanders
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Status Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium text-gray-700">
                Fluid: <span className="text-blue-600">{inputs.fluid}</span>
              </span>
              <span className="text-gray-300">|</span>
              <span className="font-medium text-gray-700">
                {inputs.P_in_bar} → {inputs.P_out_bar} bar
              </span>
              <span className="text-gray-300">|</span>
              <span className="font-medium text-gray-700">
                {(targets.P_shaft_W / 1000).toFixed(0)} kW
              </span>
            </div>
            <div className={`flex items-center gap-2 text-sm font-medium ${
              results.valid ? 'text-green-600' : 'text-red-600'
            }`}>
              <span className={`w-2 h-2 rounded-full ${results.valid ? 'bg-green-500' : 'bg-red-500'}`} />
              {results.valid ? 'Valid Calculation' : 'Error'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'inputs' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <InputPanel
                inputs={inputs}
                targets={targets}
                volumetrics={volumetrics}
                onInputsChange={setInputs}
                onTargetsChange={setTargets}
                onVolumetricsChange={setVolumetrics}
              />
            </div>
            <div className="lg:col-span-1">
              {/* Quick Results Summary */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 sticky top-20">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">📋</span>
                  Quick Results
                </h3>
                
                {results.valid ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Mass Flow</span>
                      <span className="font-semibold text-gray-900">{results.m_dot.toFixed(3)} kg/s</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Male OD</span>
                      <span className="font-semibold text-gray-900">{(results.D_male * 1000).toFixed(1)} mm</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Female OD</span>
                      <span className="font-semibold text-gray-900">{(results.D_fem * 1000).toFixed(1)} mm</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Axial Length</span>
                      <span className="font-semibold text-gray-900">{(results.L_axial * 1000).toFixed(1)} mm</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Torque</span>
                      <span className="font-semibold text-gray-900">{results.torque_Nm.toFixed(1)} N·m</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Tip Speed</span>
                      <span className={`font-semibold ${results.tip_speed_mps < 80 ? 'text-green-600' : 'text-red-600'}`}>
                        {results.tip_speed_mps.toFixed(1)} m/s
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Cycle η (gross)</span>
                      <span className="font-semibold text-gray-900">{(results.eta_cycle_gross * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Cycle η (net)</span>
                      <span className="font-semibold text-blue-600">{(results.eta_cycle_net * 100).toFixed(2)}%</span>
                    </div>
                    
                    <button
                      onClick={() => setActiveTab('results')}
                      className="w-full mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      View Full Results →
                    </button>
                  </div>
                ) : (
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-red-700 text-sm">{results.error_message}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <ResultsPanel
            results={results}
            inputs={inputs}
            targets={targets}
            volumetrics={volumetrics}
          />
        )}

        {activeTab === 'charts' && (
          <ChartsPanel
            results={results}
            inputs={inputs}
            targets={targets}
            volumetrics={volumetrics}
          />
        )}

        {activeTab === 'code' && (
          <PythonCodePanel
            inputs={inputs}
            targets={targets}
            volumetrics={volumetrics}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-3">About</h4>
              <p className="text-sm">
                ORC Twin-Screw Expander Calculator for preliminary design of 500 kW class 
                organic Rankine cycle expanders. Based on thermodynamic and geometric calculations.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Features</h4>
              <ul className="text-sm space-y-1">
                <li>• Thermodynamic cycle analysis</li>
                <li>• Rotor geometry sizing</li>
                <li>• Gear force calculations</li>
                <li>• Multiple working fluids</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Supported Fluids</h4>
              <ul className="text-sm space-y-1">
                <li>• R1233zd(E) - Low GWP refrigerant</li>
                <li>• R245fa - Common ORC fluid</li>
                <li>• R134a - Refrigerant</li>
                <li>• R410A - Refrigerant blend</li>
                <li>• Pentane - Hydrocarbon</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
            <p>ORC Expander Calculator • Web-based design tool</p>
            <p className="text-gray-500 mt-1">
              Note: Uses simplified thermodynamic models. For precise calculations, use Python version with CoolProp.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
