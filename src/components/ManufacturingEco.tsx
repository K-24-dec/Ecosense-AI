import React, { useState, useEffect } from 'react';
import { 
  Factory, 
  Settings, 
  RotateCcw, 
  Activity, 
  BarChart, 
  Sparkles,
  HelpCircle,
  TrendingDown,
  Plus
} from 'lucide-react';
import { ManufacturingRecord } from '../types';

export default function ManufacturingEco() {
  const [logs, setLogs] = useState<ManufacturingRecord[]>([]);
  const [material, setMaterial] = useState<string>('');
  const [scrap, setScrap] = useState<string>('');
  const [eff, setEff] = useState<string>('');
  const [co2, setCo2] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [aiTip, setAiTip] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState<boolean>(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = () => {
    fetch('/api/manufacturing')
      .then(res => res.json())
      .then(data => setLogs(data || []))
      .catch(err => console.error(err));
  };

  const handleLogManufacturing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!material || !scrap || !eff || !co2) return;
    setLoading(true);

    try {
      const res = await fetch('/api/manufacturing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawMaterial: parseFloat(material),
          scrapRate: parseFloat(scrap),
          carbonEfficiency: parseFloat(eff),
          co2Emissions: parseFloat(co2)
        })
      });
      const data = await res.json();
      if (data.success) {
        setLogs(prev => [data.log, ...prev]);
        setMaterial('');
        setScrap('');
        setEff('');
        setCo2('');
        alert("Circular manufacturing audit logged!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchCircularAI = async () => {
    setLoadingAI(true);
    setAiTip('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: "chat_general",
          message: `Provide 3 actionable industrial symbiosis suggestions for a manufacturing facility with raw material flow of ${material || '1200'} kg, scrap rate of ${scrap || '2.4'}%, and CO2 emissions of ${co2 || '1.8'} tons.`
        })
      });
      const data = await res.json();
      setAiTip(data.text);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(false);
    }
  };

  const latest = logs[0] || { rawMaterial: 1200, scrapRate: 2.4, carbonEfficiency: 92, co2Emissions: 1.8 };

  return (
    <div className="space-y-6">
      
      {/* Ribbon Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Factory className="h-5 w-5 text-emerald-400" />
          Circular Manufacturing & Materials Optimization
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Optimize raw material flows, mitigate scrap rates, track factory-level CO₂ efficiency, and implement industrial symbiosis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Dynamic circular loops illustration & metrics */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
              <RotateCcw className="h-4.5 w-4.5 text-emerald-400 animate-spin [animation-duration:10s]" />
              Closed-Loop Symbiosis Diagram
            </h3>
            <span className="text-[10px] font-mono text-slate-400">SYMBIOSIS v1.2</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-center bg-slate-950 p-6 rounded-xl border border-slate-850">
            {/* SVG closed-loop diagram */}
            <svg viewBox="0 0 200 200" className="w-40 h-40 shrink-0">
              <defs>
                <linearGradient id="circGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              {/* Circular track */}
              <circle cx="100" cy="100" r="75" fill="none" stroke="rgba(51, 65, 85, 0.2)" strokeWidth="8" />
              {/* Active flow arrow */}
              <path d="M 100 25 A 75 75 0 1 1 25 100" fill="none" stroke="url(#circGrad)" strokeWidth="8" strokeLinecap="round" />
              {/* Central hub icon */}
              <circle cx="100" cy="100" r="35" fill="rgba(15, 23, 42, 0.9)" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="2" />
              <text x="100" y="105" textAnchor="middle" className="fill-emerald-400 font-mono text-[9px] font-bold">CIRCULAR</text>
            </svg>

            <div className="space-y-3 flex-1 text-xs font-mono">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-1">FACTORY INTAKE COMPLIANCE</p>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Material Intake</span>
                <span className="text-slate-200 font-bold">{latest.rawMaterial} kg/cycle</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Scrap Bypass Rate</span>
                <span className="text-red-400 font-bold">{latest.scrapRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Carbon Integration Index</span>
                <span className="text-emerald-400 font-bold">{latest.carbonEfficiency}% Eff</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Greenhouse Burden</span>
                <span className="text-teal-300 font-bold">{latest.co2Emissions} Tons CO₂-eq</span>
              </div>
            </div>
          </div>
        </div>

        {/* Industrial Symbiosis form */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm border-b border-slate-800 pb-3 mb-4">
            <Plus className="h-4 w-4 text-emerald-400" />
            Industrial Audit Form
          </h3>

          <form onSubmit={handleLogManufacturing} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Raw Material Flow (kg)</label>
              <input 
                type="number"
                required
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. 1200"
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg p-2.5 text-xs focus:outline-none focus:border-emerald-500/30 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Bypass Scrap Rate (%)</label>
              <input 
                type="number"
                step="0.1"
                required
                value={scrap}
                onChange={(e) => setScrap(e.target.value)}
                placeholder="e.g. 2.4"
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg p-2.5 text-xs focus:outline-none focus:border-emerald-500/30 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Carbon Efficiency (%)</label>
              <input 
                type="number"
                required
                value={eff}
                onChange={(e) => setEff(e.target.value)}
                placeholder="e.g. 92"
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg p-2.5 text-xs focus:outline-none focus:border-emerald-500/30 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">CO₂ Greenhouse Weight (Tons)</label>
              <input 
                type="number"
                step="0.01"
                required
                value={co2}
                onChange={(e) => setCo2(e.target.value)}
                placeholder="e.g. 1.8"
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg p-2.5 text-xs focus:outline-none focus:border-emerald-500/30 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !material || !scrap || !eff || !co2}
              className="w-full text-center bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs py-2.5 rounded-xl font-bold transition"
            >
              {loading ? "Recording factory audit..." : "Commit Manufacturing Log"}
            </button>
          </form>
        </div>

      </div>

      {/* AI Symbiosis strategies drawer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
          <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
            <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
            AI Symbiosis Optimization Advisor
          </h3>
          <button 
            onClick={handleFetchCircularAI}
            disabled={loadingAI}
            className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded"
          >
            {loadingAI ? "Synthesizing loops..." : "Generate Symbiosis advice"}
          </button>
        </div>

        {aiTip ? (
          <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl">
            <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">{aiTip}</p>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">Click the advice trigger above to query generative circular blueprints aligning raw aluminum, copper, and silicate scrap streams into adjacent industrial supply nets.</p>
        )}
      </div>

    </div>
  );
}
