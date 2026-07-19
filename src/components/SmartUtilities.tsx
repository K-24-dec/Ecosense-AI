import React, { useState, useEffect } from 'react';
import { Zap, Activity, BatteryCharging, Droplet, Flame, FilePlus } from 'lucide-react';
import { UtilityRecord } from '../types';

export default function SmartUtilities() {
  const [logs, setLogs] = useState<UtilityRecord[]>([]);
  const [electricity, setElectricity] = useState<string>('');
  const [water, setWater] = useState<string>('');
  const [gas, setGas] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = () => {
    fetch('/api/utilities')
      .then(res => res.json())
      .then(data => setLogs(data || []))
      .catch(err => console.error("Error fetching utilities:", err));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!electricity || !water || !gas) return;
    setLoading(true);

    try {
      const res = await fetch('/api/utilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          electricity: parseFloat(electricity),
          water: parseFloat(water),
          gas: parseFloat(gas)
        })
      });
      const data = await res.json();
      if (data.success) {
        setLogs(prev => [data.log, ...prev]);
        setElectricity('');
        setWater('');
        setGas('');
        alert("Smart utility consumption packet broadcast successfully!");
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
          <Zap className="h-5 w-5 text-emerald-600" />
          Smart Utilities Telemetry Loop
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Monitor building resource metrics, electrical grids, water networks, and methane utility loops.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <FilePlus className="h-4.5 w-4.5 text-emerald-600" />
            Submit Daily Utility Log
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <BatteryCharging className="h-4 w-4 text-amber-500" /> Electricity (in kWh)
              </label>
              <input 
                type="number"
                step="0.1"
                required
                value={electricity}
                onChange={(e) => setElectricity(e.target.value)}
                placeholder="e.g. 142.5"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Droplet className="h-4 w-4 text-blue-500" /> Water Consumption (in Liters)
              </label>
              <input 
                type="number"
                step="1"
                required
                value={water}
                onChange={(e) => setWater(e.target.value)}
                placeholder="e.g. 340"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-orange-500" /> Gas Utility (in m³)
              </label>
              <input 
                type="number"
                step="0.1"
                required
                value={gas}
                onChange={(e) => setGas(e.target.value)}
                placeholder="e.g. 14.2"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !electricity || !water || !gas}
              className="w-full text-center bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs py-2.5 rounded-xl font-bold transition shadow-sm"
            >
              {loading ? "Transmitting utilities packet..." : "Broadcast utility values"}
            </button>
          </form>
        </div>

        {/* Dashboard Grid & Historical table */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Avg Power</p>
              <p className="text-xl font-extrabold text-slate-800 mt-1 font-mono">132.8 <span className="text-[10px] font-normal text-slate-400">kWh</span></p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Avg Water</p>
              <p className="text-xl font-extrabold text-slate-800 mt-1 font-mono">290.4 <span className="text-[10px] font-normal text-slate-400">L</span></p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Avg Gas</p>
              <p className="text-xl font-extrabold text-slate-800 mt-1 font-mono">11.6 <span className="text-[10px] font-normal text-slate-400">m³</span></p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 text-sm">Utility Telemetry Streams</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-mono uppercase text-[9px] pb-2">
                    <th className="py-2.5">TIMESTAMP</th>
                    <th>ELECTRICITY</th>
                    <th>WATER</th>
                    <th>GAS UTILITY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-mono">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/55">
                      <td className="py-3 text-slate-400">{new Date(log.date).toLocaleString()}</td>
                      <td className="font-semibold text-slate-800">{log.electricity} kWh</td>
                      <td>{log.water} Liters</td>
                      <td>{log.gas} m³</td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400 italic">No utilities packet broadcast.</td>
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
