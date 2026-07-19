import React, { useState, useEffect } from 'react';
import { Factory, Sparkles, AlertTriangle, TrendingDown, ClipboardList } from 'lucide-react';
import { ManufacturingRecord } from '../types';

export default function CircularFactory() {
  const [logs, setLogs] = useState<ManufacturingRecord[]>([]);
  const [rawMaterial, setRawMaterial] = useState<string>('');
  const [scrapRate, setScrapRate] = useState<string>('');
  const [carbonEff, setCarbonEff] = useState<string>('92');
  const [loading, setLoading] = useState<boolean>(false);

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
    if (!rawMaterial || !scrapRate) return;
    setLoading(true);

    const mat = parseFloat(rawMaterial);
    const scrap = parseFloat(scrapRate);
    const eff = parseFloat(carbonEff);
    // Rough carbon equation
    const emissions = parseFloat(((mat * 0.0015) * (1 + (scrap / 100)) * (2 - (eff / 100))).toFixed(3));

    try {
      const res = await fetch('/api/manufacturing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawMaterial: mat,
          scrapRate: scrap,
          carbonEfficiency: eff,
          co2Emissions: emissions
        })
      });
      const data = await res.json();
      if (data.success) {
        setLogs(prev => [data.log, ...prev]);
        setRawMaterial('');
        setScrapRate('');
        alert("Manufacturing loop audit packet successfully committed!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Ribbon Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Factory className="h-5 w-5 text-emerald-600" />
          Circular Manufacturing Factory Floor
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Perform scrap rate analysis, track raw material inputs, audit carbon emissions, and optimize closed-loop manufacturing chains.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form log */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <ClipboardList className="h-4.5 w-4.5 text-emerald-600" />
            Log Factory Batch Output
          </h3>

          <form onSubmit={handleLogManufacturing} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Raw Material Input (in kg)</label>
              <input 
                type="number"
                required
                value={rawMaterial}
                onChange={(e) => setRawMaterial(e.target.value)}
                placeholder="e.g. 1500"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Scrap Bypass Rate (in %)</label>
              <input 
                type="number"
                step="0.1"
                required
                value={scrapRate}
                onChange={(e) => setScrapRate(e.target.value)}
                placeholder="e.g. 2.4"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Carbon Intensity Efficiency (in %)</label>
              <input 
                type="number"
                required
                value={carbonEff}
                onChange={(e) => setCarbonEff(e.target.value)}
                placeholder="e.g. 94"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !rawMaterial || !scrapRate}
              className="w-full text-center bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs py-2.5 rounded-xl font-bold transition shadow-sm"
            >
              {loading ? "Registering Batch..." : "Commit Manufacturing Log"}
            </button>
          </form>
        </div>

        {/* Info & History */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex gap-3 text-xs text-emerald-800">
            <Sparkles className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Closed Loop Circularity Incentive</p>
              <p className="mt-1 text-slate-600 leading-relaxed">
                By maintaining a scrap bypass rate under 2.5% and a carbon intensity factor above 92%, this factory node remains fully aligned with the Indian Smart City Zero-Waste certification metrics.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 text-sm">Industrial Floor Audit History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-mono uppercase text-[9px] pb-2">
                    <th className="py-2.5">DATE</th>
                    <th>RAW MATERIAL</th>
                    <th>SCRAP RATE</th>
                    <th>CARBON EFF.</th>
                    <th>CO₂ EMISSIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-mono">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/55">
                      <td className="py-3 text-slate-400">{new Date(log.date).toLocaleDateString()}</td>
                      <td className="font-semibold text-slate-800">{log.rawMaterial} kg</td>
                      <td className="text-red-500 font-bold">{log.scrapRate}%</td>
                      <td className="text-emerald-600 font-bold">{log.carbonEfficiency}%</td>
                      <td>{log.co2Emissions} Tons</td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400 italic">No historical batch runs committed.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
