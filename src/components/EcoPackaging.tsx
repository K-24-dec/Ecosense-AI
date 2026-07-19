import React, { useState, useEffect } from 'react';
import { Package, Sparkles, Plus, Check } from 'lucide-react';
import { PackagingRecord } from '../types';

export default function EcoPackaging() {
  const [logs, setLogs] = useState<PackagingRecord[]>([]);
  const [original, setOriginal] = useState<string>('');
  const [greenAlt, setGreenAlt] = useState<string>('');
  const [costChange, setCostChange] = useState<string>('');
  const [score, setScore] = useState<string>('85');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = () => {
    fetch('/api/packaging')
      .then(res => res.json())
      .then(data => setLogs(data || []))
      .catch(err => console.error(err));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!original || !greenAlt || !costChange) return;
    setLoading(true);

    try {
      const res = await fetch('/api/packaging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original,
          greenAlt,
          costChange: parseFloat(costChange),
          score: parseInt(score)
        })
      });
      const data = await res.json();
      if (data.success) {
        setLogs(prev => [data.log, ...prev]);
        setOriginal('');
        setGreenAlt('');
        setCostChange('');
        alert("Sustainable alternative substitution cataloged!");
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
          <Package className="h-5 w-5 text-emerald-600" />
          Sustainable Packaging Material Substitutions
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Evaluate micro-costs, materials life-cycles, and catalog eco-friendly cellulose and mycelium composite substitutes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <Plus className="h-4.5 w-4.5 text-emerald-600" />
            Substitute Materials Card
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Original Single-use Material</label>
              <input 
                type="text"
                required
                value={original}
                onChange={(e) => setOriginal(e.target.value)}
                placeholder="e.g. Polystyrene Foam Packing"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Sustainable Replacement Alternative</label>
              <input 
                type="text"
                required
                value={greenAlt}
                onChange={(e) => setGreenAlt(e.target.value)}
                placeholder="e.g. Molded Mycelium Mushroom Caps"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Net Cost Impact per Unit (in %)</label>
              <input 
                type="number"
                required
                value={costChange}
                onChange={(e) => setCostChange(e.target.value)}
                placeholder="e.g. +3.5 or -1.2"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Eco Circularity Index Score (0 - 100)</label>
              <input 
                type="range"
                min="30"
                max="100"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 font-bold">
                <span>Medium (30)</span>
                <span className="text-emerald-600">Selected: {score}/100</span>
                <span>Perfect (100)</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !original || !greenAlt || !costChange}
              className="w-full text-center bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs py-2.5 rounded-xl font-bold transition shadow-sm"
            >
              {loading ? "Cataloging replacement..." : "Commit Packaging Substitution"}
            </button>
          </form>
        </div>

        {/* Alternatives Catalog table */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 text-sm">Circular Packaging Catalog</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-mono uppercase text-[9px] pb-2">
                  <th className="py-2.5">ORIGINAL OUTBOUND</th>
                  <th>GREEN ALTERNATIVE</th>
                  <th>COST IMPACT</th>
                  <th>CIRCULAR INDEX</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/55">
                    <td className="py-3 font-semibold text-slate-700">{log.original}</td>
                    <td className="text-emerald-700 font-bold flex items-center gap-1.5 mt-2">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> {log.greenAlt}
                    </td>
                    <td className="font-mono text-slate-600">{log.costChange >= 0 ? `+${log.costChange}%` : `${log.costChange}%`}</td>
                    <td>
                      <span className="font-mono bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded font-bold text-[10px]">
                        {log.score}/100
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
