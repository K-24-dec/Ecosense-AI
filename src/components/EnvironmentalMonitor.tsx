import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Wind, 
  Thermometer, 
  CloudRain, 
  MapPin, 
  VolumeX, 
  Sparkles,
  Info,
  Calendar,
  AlertOctagon
} from 'lucide-react';
import { EnvironmentRecord } from '../types';

export default function EnvironmentalMonitor() {
  const [logs, setLogs] = useState<EnvironmentRecord[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('Delhi NCR');
  const [aqiInput, setAqiInput] = useState<string>('');
  const [co2Input, setCo2Input] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Simulated Indian City Grid database
  const citiesData = {
    'Delhi NCR': { aqi: 184, co2: 442, temp: 31.4, humidity: 55, noise: 72, weather: "Dusty Haze", status: "Poor" },
    'Mumbai Harbor': { aqi: 62, co2: 398, temp: 28.5, humidity: 82, noise: 68, weather: "Humid Overcast", status: "Moderate" },
    'Bengaluru Tech': { aqi: 44, co2: 392, temp: 23.8, humidity: 60, noise: 58, weather: "Clear Breeze", status: "Good" },
    'Chennai Coast': { aqi: 52, co2: 402, temp: 30.2, humidity: 76, noise: 64, weather: "Partly Cloudy", status: "Good" },
    'Hyderabad Hub': { aqi: 95, co2: 412, temp: 29.1, humidity: 52, noise: 66, weather: "Clear Sky", status: "Moderate" }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = () => {
    fetch('/api/environment')
      .then(res => res.json())
      .then(data => setLogs(data || []))
      .catch(err => console.error("Error fetching environment logs:", err));
  };

  const handleLogDiagnostic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aqiInput || !co2Input) return;
    setLoading(true);

    const cityStats = citiesData[selectedCity as keyof typeof citiesData];
    try {
      const res = await fetch('/api/environment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aqi: parseInt(aqiInput),
          co2: parseInt(co2Input),
          humidity: cityStats.humidity,
          temperature: Math.round(cityStats.temp),
          noise: cityStats.noise
        })
      });
      const data = await res.json();
      if (data.success) {
        setLogs(prev => [data.log, ...prev]);
        setAqiInput('');
        setCo2Input('');
        alert("Localized IoT environmental payload committed successfully!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentCityStats = citiesData[selectedCity as keyof typeof citiesData];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Ribbon Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-600 animate-pulse" />
          IoT Environmental Monitoring Grid
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Monitor dynamic municipal particulate indexes, ambient decibel tracking, and global warming metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Geographic City Grid Selector */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
              <MapPin className="h-4.5 w-4.5 text-emerald-600" />
              Regional Telemetric Stations Select
            </h3>
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">TELEMETRY COMPLIANT</span>
          </div>

          {/* City Pill Grid */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(citiesData).map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`
                  text-xs font-semibold px-4 py-2 rounded-xl transition border
                  ${selectedCity === city 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm' 
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'}
                `}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Active Sensor Display Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* AQI */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-2 relative overflow-hidden">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">AIR QUALITY INDEX</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight font-sans">{currentCityStats.aqi}</span>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase
                  ${currentCityStats.status === 'Good' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : currentCityStats.status === 'Moderate' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-red-50 text-red-700 border border-red-100'}
                `}>
                  {currentCityStats.status}
                </span>
              </div>
            </div>

            {/* CO2 */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">CARBON DIOXIDE</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight font-sans">{currentCityStats.co2}</span>
                <span className="text-[10px] font-mono text-slate-500 font-bold">ppm</span>
              </div>
            </div>

            {/* Temperature */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">AMBIENT HEAT INDEX</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight font-sans">{currentCityStats.temp}°C</span>
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-0.5"><Thermometer className="h-3.5 w-3.5 text-orange-500" /> {currentCityStats.weather}</span>
              </div>
            </div>

            {/* Noise */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">AMBIENT NOISE LAYER</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight font-sans">{currentCityStats.noise}</span>
                <span className="text-[10px] font-mono text-slate-500 font-bold">dB SPL</span>
              </div>
            </div>

            {/* Humidity */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">RELATIVE HUMIDITY</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight font-sans">{currentCityStats.humidity}%</span>
                <span className="text-[10px] font-mono text-slate-500 font-bold font-mono">RH %</span>
              </div>
            </div>

            {/* Alert Indicator */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex items-center justify-center text-center">
              {currentCityStats.aqi > 150 ? (
                <div className="text-red-600 font-mono text-[10px] font-bold flex flex-col items-center gap-1">
                  <AlertOctagon className="h-5 w-5 text-red-500 animate-bounce" />
                  PARTICULATE ALARM ACTIVE
                </div>
              ) : (
                <div className="text-emerald-700 font-mono text-[10px] font-bold flex flex-col items-center gap-1">
                  <Activity className="h-5 w-5 text-emerald-600" />
                  ALL SENSORS NORMAL
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Localized IoT Logger Form */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm border-b border-slate-100 pb-3 mb-2">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              Commit IoT Local Payload
            </h3>

            <form onSubmit={handleLogDiagnostic} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Reporting City Grid Node</label>
                <select 
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                >
                  {Object.keys(citiesData).map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Measured AQI</label>
                <input 
                  type="number"
                  required
                  value={aqiInput}
                  onChange={(e) => setAqiInput(e.target.value)}
                  placeholder="e.g. 84"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Measured CO2 (ppm)</label>
                <input 
                  type="number"
                  required
                  value={co2Input}
                  onChange={(e) => setCo2Input(e.target.value)}
                  placeholder="e.g. 398"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !aqiInput || !co2Input}
                className="w-full text-center bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs py-2.5 rounded-xl font-bold transition shadow-sm"
              >
                {loading ? "Transmitting telemetry..." : "Broadcast IoT Node Payload"}
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* IoT Environmental Log History */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 text-sm">IoT Broadcast Historical Stream</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-mono uppercase text-[9px] pb-2">
                <th className="py-2.5">TIMESTAMP</th>
                <th>AQI LEVEL</th>
                <th>CARBON PPM</th>
                <th>HEAT LEVEL</th>
                <th>DECIBEL DENSITY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/55">
                  <td className="py-3 text-slate-400">{new Date(log.date).toLocaleString()}</td>
                  <td className="font-bold text-slate-800">{log.aqi}</td>
                  <td>{log.co2} ppm</td>
                  <td>{log.temperature}°C (RH {log.humidity}%)</td>
                  <td>{log.noise} dB SPL</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400 italic">No localized diagnostics broadcast.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
