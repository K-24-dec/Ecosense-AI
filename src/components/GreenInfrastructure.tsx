import React, { useState, useEffect } from 'react';
import { 
  Trees, 
  MapPin, 
  Plus, 
  Leaf, 
  Sparkles, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { InfrastructureRecord, UserProfile } from '../types';

interface GreenInfrastructureProps {
  user: UserProfile | null;
  onUserUpdate: (updated: UserProfile) => void;
}

export default function GreenInfrastructure({ user, onUserUpdate }: GreenInfrastructureProps) {
  const [infra, setInfra] = useState<InfrastructureRecord | null>(null);
  const [plantingCount, setPlantingCount] = useState<string>('1');
  const [savingLog, setSavingLog] = useState<boolean>(false);
  const [trees, setTrees] = useState<{ x: number, y: number, id: number }[]>([
    { x: 120, y: 150, id: 1 },
    { x: 260, y: 180, id: 2 },
    { x: 380, y: 220, id: 3 },
    { x: 440, y: 110, id: 4 },
  ]);

  useEffect(() => {
    fetchInfrastructure();
  }, []);

  const fetchInfrastructure = () => {
    fetch('/api/infrastructure')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setInfra(data[0]);
        }
      })
      .catch(err => console.error(err));
  };

  const handlePlantTrees = async (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(plantingCount) || 1;
    setSavingLog(true);

    try {
      const res = await fetch('/api/infrastructure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: "plant", count })
      });
      const data = await res.json();
      if (data.success) {
        setInfra(data.data);
        onUserUpdate(data.user);
        
        // Randomly scatter newly planted trees on vector grid!
        const newTrees = [...trees];
        for (let i = 0; i < count; i++) {
          newTrees.push({
            x: Math.round(50 + Math.random() * 500),
            y: Math.round(50 + Math.random() * 250),
            id: Date.now() + i
          });
        }
        setTrees(newTrees);
        setPlantingCount('1');
        alert(`Success! Planted ${count} new saplings. Canopy expanded, CO₂ offsets initiated!`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingLog(false);
    }
  };

  const stats = infra || { treesTracked: 12, canopyArea: 38, offsetKgs: 264, status: "Healthy" };

  return (
    <div className="space-y-6">
      
      {/* Ribbon Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Trees className="h-5 w-5 text-emerald-400" />
          Green Infrastructure & Canopy Offset Sizing
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Monitor dynamic tree plantation counts, evaluate green building envelopes, measure urban canopy areas, and compute yearly CO₂ offsets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Canopy Plantation Map */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                <MapPin className="h-4.5 w-4.5 text-emerald-400 animate-bounce" />
                Community Canopy Plantation Grid
              </h3>
              <span className="text-[10px] font-mono text-slate-400">CANOPY ON AIR</span>
            </div>

            <p className="text-xs text-slate-400">
              Visual nursery tracking of community reforestation projects. Red dots indicate saplings; green trees represent active canopies.
            </p>

            {/* SVG Tree mapping area */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 relative min-h-[300px] flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 600 300" className="w-full max-w-[550px] h-auto">
                <defs>
                  <pattern id="cityGrass" width="50" height="50" patternUnits="userSpaceOnUse">
                    <rect width="50" height="50" fill="transparent" />
                    <circle cx="25" cy="25" r="1" fill="rgba(16, 185, 129, 0.15)" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cityGrass)" />

                {/* Connecting park path */}
                <path d="M 0 150 Q 150 100 300 150 T 600 150" fill="none" stroke="rgba(51, 65, 85, 0.2)" strokeWidth="30" strokeLinecap="round" />

                {/* Tree Icons Mapping */}
                {trees.map((t) => (
                  <g key={t.id} className="cursor-pointer group">
                    <circle cx={t.x} cy={t.y} r="14" fill="rgba(16, 185, 129, 0.15)" className="group-hover:fill-emerald-500/20 transition duration-300" />
                    {/* Trunk */}
                    <rect x={t.x - 2} y={t.y + 4} width="4" height="8" fill="#78350f" />
                    {/* Canopy leaves */}
                    <circle cx={t.x} cy={t.y} r="8" fill="#10b981" className="group-hover:fill-emerald-400 transition" />
                    <circle cx={t.x - 4} cy={t.y - 2} r="6" fill="#059669" />
                    <circle cx={t.x + 4} cy={t.y - 2} r="6" fill="#34d399" />
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Plantation form & metrics summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm border-b border-slate-800 pb-3 mb-4">
              <Plus className="h-4 w-4 text-emerald-400" />
              Plant Saplings Form
            </h3>

            <form onSubmit={handlePlantTrees} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Saplings to Plant</label>
                <input 
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={plantingCount}
                  onChange={(e) => setPlantingCount(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg p-2.5 text-xs focus:outline-none focus:border-emerald-500/30 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={savingLog || !plantingCount}
                className="w-full text-center bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/10"
              >
                {savingLog ? "Planting saplings..." : "Plant Saplings now"}
              </button>
            </form>
          </div>

          {/* Infrastructure Metrics summary card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm border-b border-slate-800 pb-3 mb-4">
              <Activity className="h-4.5 w-4.5 text-emerald-400" />
              Canopy Offset Auditing
            </h3>

            <div className="space-y-3 font-mono text-xs bg-slate-950 p-4 rounded-xl border border-slate-850">
              <div className="flex justify-between">
                <span className="text-slate-500">Trees Planted Total</span>
                <span className="text-slate-100 font-bold">{stats.treesTracked} saplings</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Canopy Area</span>
                <span className="text-emerald-400 font-bold">{stats.canopyArea.toFixed(1)} m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Yearly CO₂ Sequestration</span>
                <span className="text-teal-300 font-bold">-{stats.offsetKgs} kg/yr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nursery Health Grade</span>
                <span className="text-emerald-400 font-bold">{stats.status}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
