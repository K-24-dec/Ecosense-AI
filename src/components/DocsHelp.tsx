import React from 'react';
import { BookOpen, ShieldCheck, Heart, Terminal, Cpu } from 'lucide-react';

export default function DocsHelp() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-emerald-600" />
          Technical Documentation
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Explore specifications, equations, and guidelines for EcoSphere AI, aligned with the Smart India Hackathon (SIH) Theme 2.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 text-slate-700 text-xs leading-relaxed">
        
        <div className="space-y-2">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-1.5">
            <Cpu className="h-4.5 w-4.5 text-emerald-600" />
            Core Algorithmic Foundations
          </h3>
          <p>
            EcoSphere AI integrates predictive regressive models with Gemini's visual and textual cognition arrays. This dual-pipeline architecture yields:
          </p>
          <ul className="list-disc ml-4 space-y-1">
            <li><strong>Methane Yield Coefficients</strong>: Biomethane output calculated utilizing standard anaerobic parameters: <code>Yield = weight * solids_ratio * 0.14 m³/kg</code>.</li>
            <li><strong>Rooftop Photovoltaic Yield</strong>: Uses global solar constant offsets scaled for typical sub-continental insolation variables (5.1 kWh/m²/day).</li>
            <li><strong>Rainwater Capture Potentials</strong>: Computed using catchment footprint efficiency factors: <code>Yield = Area (m²) * Rain (mm) * Runoff (0.85)</code>.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-1.5">
            <Terminal className="h-4.5 w-4.5 text-emerald-600" />
            Supported Micro-Services and REST APIs
          </h3>
          <p>
            The backend engine exposes standard secure JSON endpoints supporting real-time data persistence inside <code>/data/db.json</code>:
          </p>
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg font-mono text-[10px] text-slate-600 space-y-1">
            <p><span className="text-emerald-600 font-bold">GET</span> /api/auth/session - Retrieve active manager telemetry profiles</p>
            <p><span className="text-emerald-600 font-bold">POST</span> /api/waste - Segregate and catalog hazardous, metallic, or biological material weight</p>
            <p><span className="text-emerald-600 font-bold">POST</span> /api/vision - AI image classifier and recycling advisor proxying Gemini models</p>
            <p><span className="text-emerald-600 font-bold">GET</span> /api/ai/forecast - Regression prediction data for electricity, gas, and co2 curves</p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-1.5">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
            Compliance & Verification Guardrails
          </h3>
          <p>
            This system complies fully with municipal regulations and guidelines of India's Swachh Bharat Abhiyan, including chemical storage protocols, waste-to-energy conversion benchmarks, and tree plantation offsets (22kg CO2 saved per sapling annually).
          </p>
        </div>

        <div className="border-t border-slate-100 pt-4 text-center text-slate-400 font-mono text-[10px] flex items-center justify-center gap-1">
          <span>Developed with passion for</span> <Heart className="h-3.5 w-3.5 text-red-500 fill-current" /> <span>SIH 2026 Clean & Green Technology</span>
        </div>

      </div>

    </div>
  );
}
