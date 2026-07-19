import React, { useState, useEffect } from 'react';
import { Trees, Leaf, Sparkles, TrendingUp, RefreshCw, Eye } from 'lucide-react';
import { UserProfile, InfrastructureRecord } from '../types';

interface GreenCanopyProps {
  user: UserProfile | null;
  onUserUpdate: (updated: UserProfile) => void;
}

export default function GreenCanopy({ user, onUserUpdate }: GreenCanopyProps) {
  const [stats, setStats] = useState<InfrastructureRecord | null>(null);
  const [count, setCount] = useState<string>('5');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = () => {
    fetch('/api/infrastructure')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setStats(data[0]);
        }
      })
      .catch(err => console.error("Error fetching canopy stats:", err));
  };

  const handlePlantSaplings = async () => {
    const saplingsNum = parseInt(count);
    if (!saplingsNum || saplingsNum <= 0) return;
    setLoading(true);

    try {
      const res = await fetch('/api/infrastructure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'plant', count: saplingsNum })
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
        onUserUpdate(data.user);
        alert(`Congratulations! You have planted ${saplingsNum} virtual saplings! Your EcoSense Score is boosted!`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Trees className="h-5 w-5 text-emerald-600 animate-pulse" />
          Smart City Canopy & Tree Plantation Tracker
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Catalog municipal tree plantation, calculate localized tree canopy areas, and project the offset of carbon dioxide over a 15-year lifecycle.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Plant form card */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3 mb-2">
              <Leaf className="h-4.5 w-4.5 text-emerald-600" />
              Sponsor Tree Plantation Drive
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              Each sapling adds approximately 3.2 m² of protective shade cover and mitigates up to 22 kg of gaseous CO₂ annually upon maturity.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Number of Saplings to Plant</label>
              <input 
                type="number"
                required
                value={count}
                onChange={(e) => setCount(e.target.value)}
                placeholder="e.g. 5"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono font-bold"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handlePlantSaplings}
              disabled={loading || !count}
              className="w-full text-center bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs py-2.5 rounded-xl font-bold transition shadow-sm"
            >
              {loading ? "Registering Trees..." : `Sponsor Saplings (+${parseInt(count || '0') * 150} XP)`}
            </button>
          </div>
        </div>

        {/* Display Stats */}
        <div className="lg:col-span-7 space-y-6">
          {stats && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">TREES TRACKED</span>
                <span className="text-3xl font-extrabold text-slate-800 font-mono tracking-tight">{stats.treesTracked}</span>
                <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-semibold">
                  <TrendingUp className="h-3 w-3" /> Deployed on site
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">CANOPY SHADE AREA</span>
                <span className="text-3xl font-extrabold text-slate-800 font-mono tracking-tight">{stats.canopyArea.toFixed(1)} <span className="text-xs font-normal text-slate-400">m²</span></span>
                <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-semibold">
                  <Sparkles className="h-3 w-3" /> Micro-climate cooling
                </p>
              </div>

              <div className="col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">ANNUAL CO₂ MITIGATION FROM BIOMASS</span>
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-extrabold text-emerald-600 font-mono">-{stats.offsetKgs.toLocaleString()} kg / yr</span>
                  <span className="text-xs text-slate-400">Status: <span className="text-emerald-500 font-bold uppercase">{stats.status}</span></span>
                </div>
              </div>
            </div>
          )}

          {/* Graphical Representation of growing trees */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider">Simulated Micro-forest Canopy Density</h4>
            <div className="flex flex-wrap gap-2 items-end justify-center min-h-[100px] bg-slate-50 border border-slate-200 p-4 rounded-xl">
              {Array.from({ length: Math.min(stats?.treesTracked || 0, 48) }).map((_, i) => (
                <div 
                  key={i} 
                  className="w-5 h-8 bg-gradient-to-t from-emerald-700 to-emerald-400 rounded-t-full relative group animate-bounce"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[8px] font-mono rounded px-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    Tree #{i+1}
                  </span>
                </div>
              ))}
              {(!stats || stats.treesTracked === 0) && (
                <p className="text-xs text-slate-400 italic">No trees planted in the canopy yet. Use the card to plant some!</p>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
