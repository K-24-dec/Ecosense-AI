import React, { useState } from 'react';
import { 
  Sun, 
  Wind, 
  Battery, 
  Sparkles, 
  Activity, 
  Trash2, 
  CheckCircle,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { UserProfile } from '../types';

interface EnergyEstimatorProps {
  user: UserProfile | null;
  onUserUpdate: (updated: UserProfile) => void;
}

export default function EnergyEstimator({ user, onUserUpdate }: EnergyEstimatorProps) {
  // Solar state parameters
  const [solarArea, setSolarArea] = useState<number>(100); // sqm
  const [solarRad, setSolarRad] = useState<number>(5.2); // kWh/m²/day
  const [panelEff, setPanelEff] = useState<number>(21); // %

  // Wind state parameters
  const [windDiameter, setWindDiameter] = useState<number>(6); // meters
  const [windSpeed, setWindSpeed] = useState<number>(5.5); // m/s

  const [savingLog, setSavingLog] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState<boolean>(false);

  // Solar Sizing calculations
  const solarCapacityKwp = parseFloat(((solarArea * (panelEff / 100))).toFixed(2));
  const solarYearlyKwh = Math.round(solarCapacityKwp * solarRad * 365 * 0.78);
  const solarCarbonOffsetTons = parseFloat(((solarYearlyKwh * 0.82) / 1000).toFixed(2));

  // Wind Sizing calculations
  const windSweptArea = Math.PI * Math.pow(windDiameter / 2, 2);
  const windPowerKwh = Math.round(0.5 * 1.2 * windSweptArea * Math.pow(windSpeed, 3) * 0.35 * 8760 / 1000); // 8760 hours/yr
  const windCarbonOffsetTons = parseFloat(((windPowerKwh * 0.82) / 1000).toFixed(2));

  const handleSaveSizing = async (type: 'Solar' | 'Wind') => {
    setSavingLog(true);
    const value = type === 'Solar' ? solarYearlyKwh : windPowerKwh;
    const carbon = type === 'Solar' ? solarCarbonOffsetTons : windCarbonOffsetTons;
    
    try {
      const res = await fetch('/api/energy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: `${type} Sizing Sizing`, 
          value, 
          unit: "kWh/yr", 
          carbonAvoided: carbon 
        })
      });
      const data = await res.json();
      if (data.success) {
        onUserUpdate(data.user);
        alert(`Sizing analysis saved! Your EcoSense points have been boosted!`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingLog(false);
    }
  };

  const handleFetchRecommendations = async () => {
    setLoadingAI(true);
    setRecommendations('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chatId: "chat_general", 
          message: `Provide 3 highly technical energy recommendations for a facility operating a solar PV of ${solarCapacityKwp} kWp (efficiency ${panelEff}%) and wind rotor of diameter ${windDiameter} meters with wind speed of ${windSpeed} m/s.` 
        })
      });
      const data = await res.json();
      setRecommendations(data.text);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Ribbon header */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Sun className="h-5 w-5 text-emerald-600" />
          Renewable Sizing Estimator
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Evaluate clean microgeneration capacities, solar PV yield arrays, kinetic wind formulas, and carbon avoidance indexation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Solar Estimator Sizing */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                <Sun className="h-4.5 w-4.5 text-amber-500" />
                Rooftop Solar PV Sizing Estimator
              </h3>
              <span className="text-[10px] font-mono text-slate-400 font-bold">MATH MODEL v2.0</span>
            </div>

            {/* Slider 1: Area */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Rooftop Usable Surface Area</span>
                <span className="font-mono text-slate-800 font-extrabold">{solarArea} m²</span>
              </div>
              <input 
                type="range"
                min="10"
                max="1000"
                value={solarArea}
                onChange={(e) => setSolarArea(parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Slider 2: Irradiance */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Mean Daily Solar Irradiance</span>
                <span className="font-mono text-slate-800 font-extrabold">{solarRad.toFixed(1)} kWh/m²/day</span>
              </div>
              <input 
                type="range"
                min="2.0"
                max="8.0"
                step="0.1"
                value={solarRad}
                onChange={(e) => setSolarRad(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Slider 3: Panel Eff */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Standard Photovoltaic Module Efficiency</span>
                <span className="font-mono text-slate-800 font-extrabold">{panelEff}%</span>
              </div>
              <input 
                type="range"
                min="15"
                max="26"
                value={panelEff}
                onChange={(e) => setPanelEff(parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Solar Calculations Readout panel */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 font-mono text-xs">
              <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200 pb-1.5">SOLAR PV SIZING MATRIX</p>
              
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500">Solar Array Sizing Capacity</span>
                <span className="text-amber-600 font-black">{solarCapacityKwp} kWp</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500">Annual Clean Yield</span>
                <span className="text-emerald-700 font-black">{solarYearlyKwh.toLocaleString()} kWh/yr</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500">Carbon Offset Metrics</span>
                <span className="text-teal-700 font-black">-{solarCarbonOffsetTons} Tons CO₂/yr</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button 
              onClick={() => handleSaveSizing('Solar')}
              disabled={savingLog}
              className="w-full text-center bg-white hover:bg-slate-50 text-slate-700 text-xs py-2.5 rounded-xl font-bold border border-slate-200 transition shadow-sm"
            >
              Commit Solar Sizing Estimate (+{Math.round(solarCarbonOffsetTons * 5)} XP)
            </button>
          </div>
        </div>

        {/* Wind Estimator Sizing */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                <Wind className="h-4.5 w-4.5 text-sky-500" />
                Kinetic Wind Estimator
              </h3>
              <span className="text-[10px] font-mono text-slate-400 font-bold">AERODYNAMIC MODEL v1.5</span>
            </div>

            {/* Parameter 1: Rotor diameter */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Rotor Diameter</span>
                <span className="font-mono text-slate-800 font-extrabold">{windDiameter} meters</span>
              </div>
              <input 
                type="range"
                min="2"
                max="30"
                value={windDiameter}
                onChange={(e) => setWindDiameter(parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Parameter 2: Wind Speed */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Mean Site Wind Velocity</span>
                <span className="font-mono text-slate-800 font-extrabold">{windSpeed.toFixed(1)} m/s</span>
              </div>
              <input 
                type="range"
                min="2.0"
                max="15.0"
                step="0.1"
                value={windSpeed}
                onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Wind Calculations Readout panel */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 font-mono text-xs">
              <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200 pb-1.5">WIND YIELD MATRIX</p>
              
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500">Rotor Swept Footprint</span>
                <span className="text-sky-600 font-black">{windSweptArea.toFixed(1)} m²</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500">Annual Wind Yield</span>
                <span className="text-emerald-700 font-black">{windPowerKwh.toLocaleString()} kWh/yr</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500">Carbon Offset Metrics</span>
                <span className="text-teal-700 font-black">-{windCarbonOffsetTons} Tons CO₂/yr</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button 
              onClick={() => handleSaveSizing('Wind')}
              disabled={savingLog}
              className="w-full text-center bg-white hover:bg-slate-50 text-slate-700 text-xs py-2.5 rounded-xl font-bold border border-slate-200 transition shadow-sm"
            >
              Commit Wind Sizing Estimate (+{Math.round(windCarbonOffsetTons * 5)} XP)
            </button>
          </div>
        </div>

      </div>

      {/* AI Recommendations Drawer */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center border-b border-slate-150 pb-3 mb-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
            <Lightbulb className="h-4.5 w-4.5 text-amber-500" />
            AI Energy Efficiency Sizing Auditor
          </h3>
          <button 
            onClick={handleFetchRecommendations}
            disabled={loadingAI}
            className="flex items-center gap-1 text-[11px] font-sans font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition shadow-sm"
          >
            {loadingAI ? "Auditing systems..." : "Trigger AI Sizing Recommendation"}
          </button>
        </div>

        {recommendations ? (
          <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl">
            <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed font-semibold">{recommendations}</p>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic font-semibold">Click the recommendation trigger above to synthesize technical grid stabilization strategies based on your current PV sizing metrics.</p>
        )}
      </div>

    </div>
  );
}
