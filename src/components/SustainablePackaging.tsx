import React, { useState } from 'react';
import { 
  Package, 
  HelpCircle, 
  Sparkles, 
  ArrowRightLeft, 
  CheckCircle, 
  Layers,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export default function SustainablePackaging() {
  const [originalMat, setOriginalMat] = useState<string>('Expanded Polystyrene (Styrofoam)');
  const [greenMat, setGreenMat] = useState<string>('Mycelium Bio-Packaging (Mushroom)');
  const [costIndex, setCostIndex] = useState<number>(5); // percent change
  const [savingLog, setSavingLog] = useState<boolean>(false);

  // High fidelity materials catalog
  const materials = {
    'Expanded Polystyrene (Styrofoam)': { type: "Synthetic Polymer", cost: 100, degradation: "500+ years", co2: "4.2 kg", score: 12, waterResist: "Excellent", loadRate: "High" },
    'Single-Use PET Wrapper': { type: "Synthetic Polymer", cost: 80, degradation: "450 years", co2: "3.5 kg", score: 18, waterResist: "Excellent", loadRate: "Medium" },
    'Corrugated Cardboard Box': { type: "Paper Composite", cost: 120, degradation: "2 months", co2: "0.8 kg", score: 82, waterResist: "Poor", loadRate: "High" },
    'Mycelium Bio-Packaging (Mushroom)': { type: "Bio-Composite", cost: 150, degradation: "30 days", co2: "0.15 kg", score: 96, waterResist: "Good", loadRate: "High" },
    'Seaweed Alginate Films': { type: "Bio-Polymer", cost: 130, degradation: "14 days", co2: "0.08 kg", score: 98, waterResist: "Medium", loadRate: "Low" },
    'Cornstarch PLA Containers': { type: "Bio-Plastic", cost: 140, degradation: "6 months", co2: "1.1 kg", score: 78, waterResist: "Good", loadRate: "Medium" }
  };

  const handleSavePackagingLog = async () => {
    setSavingLog(true);
    const orig = materials[originalMat as keyof typeof materials];
    const green = materials[greenMat as keyof typeof materials];
    
    try {
      const res = await fetch('/api/packaging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original: originalMat,
          greenAlt: greenMat,
          costChange: green.cost - orig.cost,
          score: green.score
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Packaging lifecycle comparison committed successfully!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingLog(false);
    }
  };

  const origStats = materials[originalMat as keyof typeof materials];
  const greenStats = materials[greenMat as keyof typeof materials];

  return (
    <div className="space-y-6">
      
      {/* Ribbon Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Package className="h-5 w-5 text-emerald-400" />
          Sustainable Packaging & Lifecycle Matrix
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Perform comparative packaging material audits, examine degradation timelines, and calculate manufacturing cost-benefit ratios.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Material Selection & Comparison Cards */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
              <ArrowRightLeft className="h-4.5 w-4.5 text-emerald-400" />
              Packaging Comparison Desk
            </h3>
            <span className="text-[10px] font-mono text-slate-400">LIFECYCLE AUDIT</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Original Material selection */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-medium">Standard Packing Material</label>
                <select 
                  value={originalMat}
                  onChange={(e) => setOriginalMat(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg p-2.5 text-xs focus:outline-none focus:border-emerald-500/30 font-semibold"
                >
                  {Object.keys(materials).map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Stats card Original */}
              <div className="bg-slate-950 p-4 rounded-xl border border-red-500/10 space-y-2.5 font-mono text-xs">
                <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider pb-1 border-b border-slate-800">PETROLEUM BASELINE</p>
                <div className="flex justify-between">
                  <span className="text-slate-500">Base Class</span>
                  <span className="text-slate-300 font-semibold">{origStats.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CO2 Footprint (kg/unit)</span>
                  <span className="text-red-400 font-bold">{origStats.co2}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Degradation Span</span>
                  <span className="text-slate-300 font-semibold">{origStats.degradation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Water Resistance</span>
                  <span className="text-slate-300 font-semibold">{origStats.waterResist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Material Health Grade</span>
                  <span className="text-red-400 font-extrabold">{origStats.score}/100</span>
                </div>
              </div>
            </div>

            {/* Green Material selection */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-medium">Eco-Alternative Material</label>
                <select 
                  value={greenMat}
                  onChange={(e) => setGreenMat(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg p-2.5 text-xs focus:outline-none focus:border-emerald-500/30 font-semibold"
                >
                  {Object.keys(materials).map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Stats card Green */}
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/10 space-y-2.5 font-mono text-xs">
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider pb-1 border-b border-slate-800">CIRCULAR REPLACEMENT</p>
                <div className="flex justify-between">
                  <span className="text-slate-500">Base Class</span>
                  <span className="text-slate-300 font-semibold">{greenStats.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CO2 Footprint (kg/unit)</span>
                  <span className="text-emerald-400 font-bold">{greenStats.co2}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Degradation Span</span>
                  <span className="text-emerald-300 font-bold">{greenStats.degradation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Water Resistance</span>
                  <span className="text-slate-300 font-semibold">{greenStats.waterResist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Material Health Grade</span>
                  <span className="text-emerald-400 font-extrabold">{greenStats.score}/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial & Lifecycle Advisor Box */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm border-b border-slate-800 pb-3 mb-3">
              <Layers className="h-4.5 w-4.5 text-emerald-400" />
              Cost & Benefit Audit
            </h3>

            {/* Calculations block */}
            <div className="space-y-3 font-mono text-xs bg-slate-950 p-4 rounded-xl border border-slate-850">
              <div className="flex justify-between">
                <span className="text-slate-400">Raw Manufacturing Cost delta</span>
                <span className={greenStats.cost > origStats.cost ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {greenStats.cost > origStats.cost ? `+${greenStats.cost - origStats.cost}%` : `${greenStats.cost - origStats.cost}%`}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 mt-2">
                <span className="text-slate-400">Landfill Lifespan reduction</span>
                <span className="text-emerald-400 font-bold">99.8%</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl">
              <p className="text-[11px] text-slate-400 leading-relaxed italic">
                Replacing **{originalMat}** with **{greenMat}** reduces manufacturing carbon overhead by **{parseFloat((parseFloat(origStats.co2) - parseFloat(greenStats.co2)).toFixed(2))} kg CO₂** per unit, shaving off landfill persistence.
              </p>
            </div>
          </div>

          <button
            onClick={handleSavePackagingLog}
            disabled={savingLog || originalMat === greenMat}
            className="w-full text-center bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs py-2.5 rounded-xl font-bold transition mt-6"
          >
            {savingLog ? "Recording audit..." : "Broadcast comparative packaging audit"}
          </button>
        </div>

      </div>

    </div>
  );
}
