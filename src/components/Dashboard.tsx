import React, { useState, useEffect } from 'react';
import { 
  TrendingDown, 
  TrendingUp, 
  Leaf, 
  Trash2, 
  Droplet, 
  Sun, 
  MapPin, 
  Download, 
  Sparkles, 
  Calendar, 
  CloudSun,
  Layers,
  Wind
} from 'lucide-react';
import { UserProfile, ReportRecord } from '../types';

interface DashboardProps {
  user: UserProfile | null;
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ user, onNavigate }: DashboardProps) {
  const [forecast, setForecast] = useState<any[]>([]);
  const [insight, setInsight] = useState<string>('');
  const [activeMapStation, setActiveMapStation] = useState<string>('solar_canopy');
  const [exporting, setExporting] = useState<boolean>(false);
  const [reports, setReports] = useState<ReportRecord[]>([]);

  useEffect(() => {
    // Fetch AI Forecasts
    fetch('/api/ai/forecast')
      .then(res => res.json())
      .then(data => {
        setForecast(data.forecast || []);
        setInsight(data.insight || '');
      })
      .catch(err => console.error("Forecast fetch error:", err));

    // Fetch reports
    fetch('/api/reports')
      .then(res => res.json())
      .then(data => {
        setReports(data || []);
      })
      .catch(err => console.error("Reports fetch error:", err));
  }, []);

  // Eco-City Stations definitions
  const stations = {
    solar_canopy: {
      name: "Rooftop Solar Array Alpha",
      coords: { x: 120, y: 150 },
      status: "Optimal",
      metrics: { generation: "45.2 kWp", efficiency: "94%", carbonSaved: "32.1 kg/day" },
      color: "from-amber-400 to-orange-500",
      description: "Aggregated smart inverter node gathering renewable energy from local community building micro-grids."
    },
    biodigester: {
      name: "Municipal Organic Biodigester Block",
      coords: { x: 380, y: 110 },
      status: "Active",
      metrics: { organicInput: "1.2 Tons", biogasYield: "168 m³", temp: "37.5°C" },
      color: "from-emerald-400 to-teal-600",
      description: "Thermophilic dry anaerobic digestion unit processing segregated biomass to harvest energy-dense biomethane."
    },
    hydro_filter: {
      name: "Rainwater Harvesting & Filtration Hub",
      coords: { x: 260, y: 280 },
      status: "Monitoring",
      metrics: { tankStorage: "85%", flowRate: "3.2 L/s", phLevel: "7.1" },
      color: "from-blue-400 to-indigo-600",
      description: "Centralized graywater treatment cell integrated with rainwater gravity collectors across administrative modules."
    },
    air_sensor: {
      name: "IoT Environmental AQI Grid Station 4",
      coords: { x: 520, y: 220 },
      status: "Active",
      metrics: { aqi: "42 (Good)", co2: "395 ppm", temperature: "24.2°C" },
      color: "from-sky-400 to-blue-500",
      description: "Low-power carbon, particulate (PM2.5/PM10), temperature, and humidity telemetric logging module."
    },
    circular_factory: {
      name: "Closed-Loop Manufacturing Complex",
      coords: { x: 450, y: 340 },
      status: "Action Required",
      metrics: { scrapRate: "2.4%", carbonEfficiency: "92%", idleLoad: "18.2 kW" },
      color: "from-purple-400 to-indigo-500",
      description: "Assembly plant utilizing recycled aluminum cores with telemetry monitoring scrap bypass pathways."
    }
  };

  const handleExport = (type: 'PDF' | 'Excel') => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      // Create element to download
      const content = `EcoSense AI ${type} Export\nGenerated At: ${new Date().toLocaleString()}\nCO2 Mitigated: ${user?.impactMetrics.co2Saved.toFixed(1)} kg\nWaste Recycled: ${user?.impactMetrics.wasteRecycled.toFixed(1)} kg\nWater Saved: ${user?.impactMetrics.waterSaved.toFixed(0)} L\nTrees Planted: ${user?.impactMetrics.treesPlanted} units`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ecosense_impact_report_${Date.now()}.${type === 'PDF' ? 'pdf' : 'csv'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Upper Welcome Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Intelligent Sustainability Hub <span className="text-emerald-700 font-semibold text-xs bg-emerald-50 border border-emerald-200/50 px-2.5 py-0.5 rounded-full">SIH 2026 Theme 2</span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Real-time IoT environmental tracking, resource modeling, and generative circular AI strategies.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-semibold text-emerald-600 tracking-wider font-mono">GRID CONNECTED</span>
          <div className="flex gap-1.5">
            <button 
              onClick={() => handleExport('PDF')}
              disabled={exporting}
              className="flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-700 text-xs px-2.5 py-1.5 rounded-lg transition font-medium shadow-sm"
            >
              <Download className="h-3.5 w-3.5 text-slate-400" />
              PDF Report
            </button>
            <button 
              onClick={() => handleExport('Excel')}
              disabled={exporting}
              className="flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-700 text-xs px-2.5 py-1.5 rounded-lg transition font-medium shadow-sm"
            >
              <Download className="h-3.5 w-3.5 text-slate-400" />
              CSV Export
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-300 transition duration-150 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CO₂ MITIGATED</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Leaf className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {user?.impactMetrics.co2Saved.toFixed(1)} <span className="text-xs font-normal text-slate-500">kg</span>
            </span>
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-semibold">
              <TrendingUp className="h-3.5 w-3.5" /> +12.4% this cycle
            </p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl relative overflow-hidden group hover:border-teal-300 transition duration-150 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">WASTE SORTED</span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-600 border border-teal-100">
              <Trash2 className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {user?.impactMetrics.wasteRecycled.toFixed(1)} <span className="text-xs font-normal text-slate-500">kg</span>
            </span>
            <p className="text-xs text-teal-600 flex items-center gap-1 mt-1 font-semibold">
              <TrendingUp className="h-3.5 w-3.5" /> +8.2% sorted compliance
            </p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl relative overflow-hidden group hover:border-blue-300 transition duration-150 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">WATER RECLAIMED</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Droplet className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {user?.impactMetrics.waterSaved.toFixed(0)} <span className="text-xs font-normal text-slate-500">L</span>
            </span>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1 font-semibold">
              <TrendingUp className="h-3.5 w-3.5" /> Graywater RWH active
            </p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl relative overflow-hidden group hover:border-amber-300 transition duration-150 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TREES SPONSORED</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <Sun className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {user?.impactMetrics.treesPlanted} <span className="text-xs font-normal text-slate-500">Saplings</span>
            </span>
            <p className="text-xs text-amber-600 flex items-center gap-1 mt-1 font-semibold">
              <TrendingUp className="h-3.5 w-3.5" /> Active canopy tracking
            </p>
          </div>
        </div>
      </div>

      {/* Main Core Section - Smart Eco-City Vector Map & Interactive Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive SVG Smart City Environmental Map */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-emerald-600" />
                Interactive EcoSense Smart City Grid
              </h2>
              <p className="text-[11px] text-slate-500">Visual mapping of decentralized green tech assets. Click a node to inspect.</p>
            </div>
            <span className="text-[9px] font-mono border border-slate-200 text-slate-500 bg-white px-2 py-0.5 rounded font-bold">MAP v1.0</span>
          </div>

          <div className="flex-1 bg-slate-50 p-6 relative flex items-center justify-center min-h-[340px]">
            {/* SVG Map Graphics */}
            <svg viewBox="0 0 640 400" className="w-full max-w-[600px] h-auto text-slate-300">
              {/* Background city network grids */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(226, 232, 240, 0.8)" strokeWidth="1" />
                </pattern>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(16, 185, 129, 0.05)" />
                  <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Connecting eco-grid transmission lines */}
              <path d="M 120 150 L 260 280 L 450 340 L 380 110 L 120 150" fill="url(#glow)" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 260 280 L 520 220 L 380 110" fill="none" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="1" />

              {/* Eco-Canopy background tree symbols */}
              <circle cx="80" cy="80" r="15" fill="rgba(16, 185, 129, 0.04)" />
              <circle cx="100" cy="70" r="10" fill="rgba(16, 185, 129, 0.03)" />
              <circle cx="580" cy="120" r="25" fill="rgba(16, 185, 129, 0.03)" />
              <circle cx="560" cy="150" r="15" fill="rgba(16, 185, 129, 0.04)" />

              {/* Node Stations Render */}
              {Object.entries(stations).map(([id, s]) => {
                const isActive = activeMapStation === id;
                return (
                  <g 
                    key={id} 
                    className="cursor-pointer group"
                    onClick={() => setActiveMapStation(id)}
                  >
                    {/* Ring highlight */}
                    <circle 
                      cx={s.coords.x} 
                      cy={s.coords.y} 
                      r={isActive ? 22 : 16} 
                      className={`fill-white stroke-2 transition-all duration-300 ${isActive ? 'stroke-emerald-600' : 'stroke-slate-200 group-hover:stroke-slate-300'}`} 
                    />
                    {/* Glowing core */}
                    <circle 
                      cx={s.coords.x} 
                      cy={s.coords.y} 
                      r="8" 
                      className={`transition-all duration-300 ${id === 'solar_canopy' ? 'fill-amber-500' : id === 'biodigester' ? 'fill-emerald-500' : id === 'hydro_filter' ? 'fill-blue-500' : id === 'air_sensor' ? 'fill-sky-500' : 'fill-purple-500'}`} 
                    />
                    <text 
                      x={s.coords.x} 
                      y={s.coords.y - (isActive ? 28 : 22)} 
                      textAnchor="middle" 
                      className={`text-[9px] font-sans font-bold transition-all duration-300 fill-slate-500 group-hover:fill-slate-800 ${isActive ? 'fill-emerald-700 font-extrabold' : ''}`}
                    >
                      {id.replace('_', ' ').toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Selected Station Telemetry Card */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold border border-emerald-200 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                Station Active
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                LIVE FEED
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 mt-3">
              {stations[activeMapStation as keyof typeof stations].name}
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">
              {stations[activeMapStation as keyof typeof stations].description}
            </p>

            <div className="mt-5 space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 pb-1 font-mono">REAL-TIME TELEMETRY</p>
              {Object.entries(stations[activeMapStation as keyof typeof stations].metrics).map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-mono text-slate-800 font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <button 
              onClick={() => {
                const tab = activeMapStation === 'solar_canopy' ? 'energy' : 
                            activeMapStation === 'biodigester' ? 'waste' : 
                            activeMapStation === 'hydro_filter' ? 'water' : 
                            activeMapStation === 'circular_factory' ? 'manufacturing' : 'monitoring';
                onNavigate(tab);
              }}
              className="w-full text-center bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 rounded-xl border border-slate-200 transition"
            >
              Open Resource Sizing Panel
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Row - AI Forecasting & Custom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Customized SVG Utility Optimization Trends Chart */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <Layers className="h-4 w-4 text-emerald-600" />
                Resource Analytics & Sustainability Curves
              </h3>
              <p className="text-[11px] text-slate-500">Monthly forecasting comparison across power grid offsets and greywater yields.</p>
            </div>
            <div className="flex gap-4 font-mono text-[9px] font-bold">
              <span className="flex items-center gap-1.5 text-amber-600"><span className="h-2 w-2 rounded bg-amber-500" /> SOLAR POWER (kWh)</span>
              <span className="flex items-center gap-1.5 text-blue-600"><span className="h-2 w-2 rounded bg-blue-500" /> RECLAIMED WATER (L)</span>
            </div>
          </div>

          {/* Custom SVG Line and Bar Chart */}
          <div className="h-56 w-full flex items-end">
            <div className="w-full flex justify-between px-4 h-full relative pt-6">
              {/* Gridlines */}
              <div className="absolute inset-x-0 bottom-10 border-b border-slate-100/70" />
              <div className="absolute inset-x-0 bottom-24 border-b border-slate-100/70" />
              <div className="absolute inset-x-0 bottom-38 border-b border-slate-100/70" />
              <div className="absolute inset-x-0 bottom-52 border-b border-slate-100/70" />

              {/* Values plots */}
              {[
                { m: 'Jan', sol: 35, wat: 210 },
                { m: 'Feb', sol: 45, wat: 240 },
                { m: 'Mar', sol: 65, wat: 290 },
                { m: 'Apr', sol: 80, wat: 340 },
                { m: 'May', sol: 95, wat: 380 },
                { m: 'Jun', sol: 110, wat: 410 },
              ].map((item, index) => {
                // Sizing coefficients
                const solHeight = (item.sol / 120) * 100; // max 120
                const watHeight = (item.wat / 500) * 100; // max 500
                return (
                  <div key={index} className="flex-1 flex flex-col items-center justify-end h-full relative z-10">
                    <div className="flex gap-2 items-end w-full max-w-[60px]">
                      {/* Solar grid block */}
                      <div 
                        style={{ height: `${solHeight}%` }}
                        className="w-1/2 rounded-t bg-gradient-to-t from-amber-500 to-amber-300 min-h-[4px] relative group"
                      >
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 px-1.5 py-0.5 rounded text-[8px] font-mono text-white opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-30">
                          {item.sol} kWh
                        </span>
                      </div>
                      {/* Water grid block */}
                      <div 
                        style={{ height: `${watHeight}%` }}
                        className="w-1/2 rounded-t bg-gradient-to-t from-blue-500 to-sky-350 min-h-[4px] relative group"
                      >
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 px-1.5 py-0.5 rounded text-[8px] font-mono text-white opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-30">
                          {item.wat} L
                        </span>
                      </div>
                    </div>
                    <span className="mt-2 text-[10px] font-mono text-slate-400 font-bold uppercase">{item.m}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* AI Predictive Regressions and Insights Panel */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <Sparkles className="h-4.5 w-4.5 text-emerald-600" />
              EcoSense Predictive AI
            </h3>
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
              <p className="text-xs text-slate-600 italic leading-relaxed font-medium">
                "{insight || 'Analysing current platform vectors...'}"
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">MONTHLY CARBON REGRESSION</p>
              {forecast.slice(0, 3).map((f, i) => (
                <div key={i} className="flex justify-between items-center text-xs bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg">
                  <span className="font-mono text-slate-500 font-bold">{f.month} Forecast</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-emerald-700 font-bold">-{f.predictedCo2} T</span>
                    <span className="text-[9px] text-slate-400 font-bold border border-slate-200 px-1.5 rounded bg-white">{f.confidenceInterval}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <button 
              onClick={() => onNavigate('chat')}
              className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-sm"
            >
              <Sparkles className="h-4 w-4" />
              Query AI Strategy Partner
            </button>
          </div>
        </div>
      </div>

      {/* Reports & Audits Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Historical Eco Audits</h3>
            <p className="text-xs text-slate-400">SIH Audit trails and verification logs created for this ecosystem.</p>
          </div>
          <button 
            onClick={() => onNavigate('document')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 font-sans"
          >
            + GENERATE AUDIT
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-mono uppercase text-[9px] tracking-wider pb-2">
                <th className="py-2.5">REPORT TITLE</th>
                <th>CLASSIFICATION</th>
                <th>CREATION DATE</th>
                <th>INTEGRITY SCORE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {reports.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-50/50">
                  <td className="py-3 font-semibold text-slate-800">{rep.title}</td>
                  <td>{rep.type}</td>
                  <td className="font-mono text-slate-400">{new Date(rep.createdAt).toLocaleDateString()}</td>
                  <td className="font-mono text-emerald-700 font-extrabold">{rep.score}/100</td>
                  <td>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold">
                      {rep.status}
                    </span>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 italic">No historical reports compiled. Use the AI Document Assistant to extract audits!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
