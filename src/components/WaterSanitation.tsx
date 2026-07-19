import React, { useState } from 'react';
import { 
  Droplet, 
  Sparkles, 
  Activity, 
  HelpCircle, 
  AlertTriangle,
  Flame,
  CheckCircle,
  TrendingDown
} from 'lucide-react';
import { UserProfile } from '../types';

interface WaterSanitationProps {
  user: UserProfile | null;
  onUserUpdate: (updated: UserProfile) => void;
}

export default function WaterSanitation({ user, onUserUpdate }: WaterSanitationProps) {
  // Rainwater harvesting inputs
  const [catchmentArea, setCatchmentArea] = useState<number>(120); // sqm
  const [annualRain, setAnnualRain] = useState<number>(850); // mm
  const [runoffCoeff, setRunoffCoeff] = useState<number>(0.85); // standard tile/metal roof

  // Leak simulation inputs
  const [leakDiameter, setLeakDiameter] = useState<number>(1.5); // mm
  const [systemPressure, setSystemPressure] = useState<number>(3.0); // bar

  // Log consumption inputs
  const [dailyUse, setDailyUse] = useState<string>('');
  const [savingLog, setSavingLog] = useState<boolean>(false);

  // Harvest calculation: Yield (L) = Area * Rain * Coeff
  const potentialHarvestLiters = Math.round(catchmentArea * annualRain * runoffCoeff);

  // Leak calculations (using simplified Torricelli flow rate calculations)
  const leakAreaSqm = Math.PI * Math.pow((leakDiameter / 1000) / 2, 2);
  const fluidVelocity = Math.sqrt(2 * (systemPressure * 100000) / 1000); // water density is 1000
  const leakRateLitersPerDay = Math.round(leakAreaSqm * fluidVelocity * 86400 * 1000);
  const waterWastedCost = parseFloat((leakRateLitersPerDay * 0.08).toFixed(2)); // mock cost rate per liter

  const handleSaveWaterLog = async () => {
    if (!dailyUse || parseFloat(dailyUse) <= 0) return;
    setSavingLog(true);
    try {
      const res = await fetch('/api/water', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consumption: parseFloat(dailyUse),
          rwhYield: potentialHarvestLiters / 365, // daily harvest share
          leaksSimulated: leakDiameter > 0 ? 1 : 0
        })
      });
      const data = await res.json();
      if (data.success) {
        onUserUpdate(data.user);
        alert(`Water consumption logged! Greywater recycling yield factored into dashboard.`);
        setDailyUse('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingLog(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header ribbon */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Droplet className="h-5 w-5 text-emerald-600 animate-pulse" />
          Water Conservation & Hydro-Sustain
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Simulate pipe leak diagnostics, dimension rainwater collectors, and audit graywater recycling networks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Rainwater harvesting calculator */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                <Droplet className="h-4.5 w-4.5 text-emerald-600" />
                Rainwater Harvesting Sizing Calculator
              </h3>
              <span className="text-[10px] font-mono text-slate-400 font-bold">SIH COMPLIANT</span>
            </div>

            {/* Area */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Catchment Area (Roof Size)</span>
                <span className="font-mono text-slate-800 font-extrabold">{catchmentArea} m²</span>
              </div>
              <input 
                type="range"
                min="10"
                max="500"
                value={catchmentArea}
                onChange={(e) => setCatchmentArea(parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Rainfall */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Average Annual Rainfall</span>
                <span className="font-mono text-slate-800 font-extrabold">{annualRain} mm</span>
              </div>
              <input 
                type="range"
                min="100"
                max="2500"
                value={annualRain}
                onChange={(e) => setAnnualRain(parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Runoff Coefficient selection */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-500 font-medium">Roof Surface Material (Runoff Coefficient)</label>
              <select 
                value={runoffCoeff}
                onChange={(e) => setRunoffCoeff(parseFloat(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
              >
                <option value="0.9">Metal Ingot Roof Sheet (90% runoff)</option>
                <option value="0.85">Concrete / Flat Tile Rooftop (85% runoff)</option>
                <option value="0.75">Standard Asphalt Shingles (75% runoff)</option>
                <option value="0.3">Soil Eco-Roof / Green Roof (30% runoff)</option>
              </select>
            </div>

            {/* Calculations Panel */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 font-mono text-xs">
              <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200 pb-1.5">HARVEST ESTIMATION</p>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500">Potential Annual Greywater Yield</span>
                <span className="text-emerald-700 font-black">{potentialHarvestLiters.toLocaleString()} Liters/yr</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500">Average Daily Storage Capture</span>
                <span className="text-teal-700 font-black">{Math.round(potentialHarvestLiters / 365)} Liters/day</span>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4 space-y-4">
            <div className="flex gap-2">
              <input 
                type="number"
                value={dailyUse}
                onChange={(e) => setDailyUse(e.target.value)}
                placeholder="Log daily water use (L)"
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
              <button 
                onClick={handleSaveWaterLog}
                disabled={savingLog || !dailyUse}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-lg font-bold transition shadow-sm"
              >
                Log daily use
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Fluid Leak Simulator */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                <Activity className="h-4.5 w-4.5 text-sky-500" />
                Dynamic Fluid Leak Simulator
              </h3>
              <span className="text-[10px] font-mono text-slate-400 font-bold">TORRICELLI FLUID EQUATIONS</span>
            </div>

            {/* Leak Diameter Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Simulated Leak Hole Diameter</span>
                <span className="font-mono text-amber-600 font-black">{leakDiameter.toFixed(1)} mm</span>
              </div>
              <input 
                type="range"
                min="0.0"
                max="5.0"
                step="0.1"
                value={leakDiameter}
                onChange={(e) => setLeakDiameter(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Pressure Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Water System Pressure</span>
                <span className="font-mono text-slate-800 font-black">{systemPressure.toFixed(1)} Bar</span>
              </div>
              <input 
                type="range"
                min="0.5"
                max="6.0"
                step="0.1"
                value={systemPressure}
                onChange={(e) => setSystemPressure(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Leak readout */}
            {leakDiameter > 0 ? (
              <div className="border border-red-200 bg-red-50 p-4 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-2 text-red-700 font-bold">
                  <AlertTriangle className="h-4.5 w-4.5" />
                  Active Fluid Leak Detected!
                </div>
                <div className="font-mono space-y-1 text-[11px] font-bold">
                  <p className="text-slate-600 font-semibold">Wasted Water Rate: <span className="text-red-700 font-bold">{leakRateLitersPerDay.toLocaleString()} Liters/day</span></p>
                  <p className="text-slate-600 font-semibold">Cumulative Utility Wasted: <span className="text-amber-700 font-bold">${waterWastedCost.toLocaleString()} USD/day</span></p>
                </div>
              </div>
            ) : (
              <div className="border border-emerald-200 bg-emerald-50 p-4 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-bold shadow-sm">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-600" />
                Pipeline integrity is sound. No leakage detected.
              </div>
            )}

            {/* Standard tips list */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <p className="font-bold text-slate-700 mb-1">Industrial Conservation Guideline:</p>
              <p className="text-slate-500 italic font-medium">"Upgrading administrative cooling loops with smart ultrasonic flow meters allows real-time pressure-drop warnings, stopping leaks under 90 seconds."</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
