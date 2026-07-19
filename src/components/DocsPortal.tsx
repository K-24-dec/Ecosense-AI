import React, { useState } from 'react';
import { 
  FileText, 
  Terminal, 
  Database, 
  HelpCircle, 
  Sparkles, 
  Activity, 
  CheckCircle,
  Copy,
  BookOpen
} from 'lucide-react';

export default function DocsPortal() {
  const [activeTab, setActiveTab] = useState<'Manual' | 'API' | 'Database'>('Manual');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Code block copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      
      {/* Ribbon Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-emerald-400" />
          EcoSense AI Technical Docs Portal
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Explore mathematical formulas, full REST API endpoints, Drizzle/Supabase schemas, and the SIH user manuals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Navigation panel */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm h-fit space-y-1.5">
          <button
            onClick={() => setActiveTab('Manual')}
            className={`w-full text-left text-xs font-semibold px-4 py-3 rounded-xl transition flex items-center gap-2
              ${activeTab === 'Manual' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-950 hover:text-slate-200'}`}
          >
            <BookOpen className="h-4.5 w-4.5" />
            SIH User Manual
          </button>
          
          <button
            onClick={() => setActiveTab('API')}
            className={`w-full text-left text-xs font-semibold px-4 py-3 rounded-xl transition flex items-center gap-2
              ${activeTab === 'API' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-950 hover:text-slate-200'}`}
          >
            <Terminal className="h-4.5 w-4.5" />
            REST API Routes
          </button>

          <button
            onClick={() => setActiveTab('Database')}
            className={`w-full text-left text-xs font-semibold px-4 py-3 rounded-xl transition flex items-center gap-2
              ${activeTab === 'Database' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-950 hover:text-slate-200'}`}
          >
            <Database className="h-4.5 w-4.5" />
            Database Schema
          </button>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-9 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm min-h-[400px]">
          
          {activeTab === 'Manual' && (
            <div className="space-y-5">
              <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm border-b border-slate-800 pb-3">
                <BookOpen className="h-4.5 w-4.5 text-emerald-400" />
                SIH Theme 2 - Smart Sustainability Platform User Manual
              </h3>
              
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <p>
                  Welcome to **EcoSense AI**, an intelligent, multi-module sustainable operations workspace designed specifically for the **Smart India Hackathon (SIH)**. Our platform empowers industries, municipal boards, and smart cities to optimize resources, reduce carbon footprints, and track compliance using state-of-the-art AI.
                </p>

                <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-2">
                  <p className="font-bold text-slate-200 uppercase text-[10px] tracking-widest font-mono text-emerald-400">HOW TO EVALUATE THE WORKSPACE:</p>
                  <ul className="space-y-2 pl-4 list-decimal text-slate-300 font-medium">
                    <li>**Dashboard monitoring**: Review real-time particulate indices and carbon footprint meters aggregating live data across all active modules.</li>
                    <li>**Multimodal AI Waste Classification**: Open the **Waste Stream** module and upload or click a sample card (e.g. Lithium Battery, water bottles). The underlying Gemini model classifies the item, details exact disposal prep instructions, and suggests bio-packaging circular replacements.</li>
                    <li>**Renewable Energy sizing**: Use the **Clean Energy Sizing** sliders to simulate solar PV and wind turbine configurations based on kinetic and thermodynamic formulas. Save your logs to watch the global carbon metric drop on the main dashboard.</li>
                    <li>**Diagnostic Document audits**: Drop a CSV or report TXT file in the **Report Auditing** module to scan, score, and query contents using natural language Q&A.</li>
                    <li>**Speak to AI Voice assistant**: Toggle the **EcoSense Copilot** drawer, hold or click the speech microphone button, and speak your directives (e.g., "how can we recycle chemical solvents?"). The copilot parses and reads the technical advice aloud!</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'API' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                  <Terminal className="h-4.5 w-4.5 text-emerald-400" />
                  REST API Endpoint Catalog
                </h3>
                <span className="text-[10px] font-mono text-emerald-400">REST SPEC v1.0</span>
              </div>

              <div className="space-y-4 text-xs font-mono">
                {/* Endpoint 1 */}
                <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 px-2 py-0.5 rounded text-[10px]">POST</span>
                    <span className="text-slate-200 font-bold">/api/vision</span>
                  </div>
                  <p className="text-slate-400 text-[11px] font-sans">Processes image payloads using Gemini multimodal APIs to extract material categories, compliance guidelines, and eco alternatives.</p>
                </div>

                {/* Endpoint 2 */}
                <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 px-2 py-0.5 rounded text-[10px]">POST</span>
                    <span className="text-slate-200 font-bold">/api/chat</span>
                  </div>
                  <p className="text-slate-400 text-[11px] font-sans">Proxies standard chat queries directly to Google Gemini client-safe pipelines, managing chat history threads.</p>
                </div>

                {/* Endpoint 3 */}
                <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20 px-2 py-0.5 rounded text-[10px]">GET</span>
                    <span className="text-slate-200 font-bold">/api/analytics</span>
                  </div>
                  <p className="text-slate-400 text-[11px] font-sans">Returns global statistics aggregation across Waste, Energy, Water, Utilities, and Infrastructure databases.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Database' && (
            <div className="space-y-5">
              <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm border-b border-slate-800 pb-3">
                <Database className="h-4.5 w-4.5 text-emerald-400" />
                Drizzle & Supabase Database Definition
              </h3>

              <div className="space-y-4 text-xs font-mono">
                <p className="text-slate-400 font-sans leading-relaxed">
                  The primary data relations are stored inside Supabase / postgres tables and mapped client-side via Type definitions:
                </p>

                <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl relative">
                  <button 
                    onClick={() => copyToClipboard(`export interface UserProfile {
  username: string;
  points: number;
  badgeLevel: string;
  co2Saved: number;
}

export interface WasteRecord {
  id: string;
  type: string;
  weight: number;
  points: number;
  co2Impact: number;
  date: string;
}`)}
                    className="absolute top-3 right-3 text-slate-500 hover:text-slate-300"
                    title="Copy code"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <pre className="text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
{`export interface UserProfile {
  username: string;
  points: number;
  badgeLevel: string;
  co2Saved: number;
}

export interface WasteRecord {
  id: string;
  type: string;
  weight: number;
  points: number;
  co2Impact: number;
  date: string;
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
