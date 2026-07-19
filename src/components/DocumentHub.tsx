import React, { useState } from 'react';
import { FileText, Sparkles, CheckCircle, HelpCircle, AlertCircle, UploadCloud } from 'lucide-react';

interface DocumentHubProps {
  onPointsUpdate: (pts: number) => void;
}

export default function DocumentHub({ onPointsUpdate }: DocumentHubProps) {
  const [docName, setDocName] = useState<string>('environmental_impact_report.txt');
  const [docText, setDocText] = useState<string>(
    `EcoSense Industrial Facility Audit Draft\n` +
    `Total annual greenhouse gas emissions: 148.4 metric tons CO2-eq\n` +
    `Water consumption: 340,000 Liters primarily inside refrigeration cooling cycles.\n` +
    `Waste stream composition: 65% Recyclable cardboard packaging, 25% Organic bio-materials, 10% Mixed Polymers.\n` +
    `Current compliance factor: B-grade. Potential off-peak HVAC savings unidentified.`
  );
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [queryResponse, setQueryResponse] = useState<string>('');

  const handleDocumentAudit = async () => {
    if (!docText.trim()) return;
    setLoading(true);
    setAnalysisResult(null);
    setQueryResponse('');
    try {
      const res = await fetch('/api/document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: docName, fileContent: docText })
      });
      const data = await res.json();
      if (data.analysis) {
        setAnalysisResult(data.analysis);
        onPointsUpdate(50); // Reward for document auditing
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQueryDocument = async () => {
    if (!query.trim() || !docText.trim()) return;
    setLoading(true);
    setQueryResponse('');
    try {
      const res = await fetch('/api/document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fileName: docName, 
          fileContent: docText,
          question: query 
        })
      });
      const data = await res.json();
      if (data.answer) {
        setQueryResponse(data.answer);
        onPointsUpdate(15);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSampleReport = () => {
    setDocName("municipal_solid_waste_sih.txt");
    setDocText(
      "Smart City Waste Audit - Delhi Sector 4\n" +
      "Daily waste collection: 12.4 Tons\n" +
      "Unsegregated landfill ratio: 42%\n" +
      "Target recyclables recovery rate: 90% by year 2028\n" +
      "Major emissions source: Open decomposition methane plumes."
    );
    setAnalysisResult(null);
    setQueryResponse('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="h-5 w-5 text-emerald-600" />
          AI Document Intelligence Hub
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Perform natural language audits on complex compliance drafts, sustainability contracts, or raw industrial text logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Editor Area */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm">Active Sustainability Document</h3>
            <button 
              onClick={loadSampleReport}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              Load SIH Sample
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium">Document Identifier</label>
            <input 
              type="text" 
              value={docName} 
              onChange={(e) => setDocName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium">Ecological Content Payload</label>
            <textarea 
              rows={8}
              value={docText}
              onChange={(e) => setDocText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono leading-relaxed"
              placeholder="Paste compliance texts, utility logs, or contract details here..."
            />
          </div>

          <button
            onClick={handleDocumentAudit}
            disabled={loading || !docText.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-sm"
          >
            {loading ? "AI Parsing Document Vectors..." : "Synthesize Complete AI Audit Report"}
          </button>
        </div>

        {/* Audit Results */}
        <div className="lg:col-span-6 space-y-6">
          
          {analysisResult && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-xs font-mono font-bold text-emerald-600 uppercase">AUDIT RESULT</span>
                <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full font-bold">
                  Sust. Grade: {analysisResult.sustainabilityGrade}
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">{analysisResult.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                  "{analysisResult.summary}"
                </p>
              </div>

              <div className="space-y-1.5 text-xs">
                <p className="font-bold text-slate-800">Carbon Footprint Disclosed:</p>
                <p className="font-mono text-emerald-600 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-lg w-fit font-bold">
                  {analysisResult.carbonFootprintMentioned}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-800">Targeted Decarbonization Steps:</p>
                <div className="space-y-1.5">
                  {analysisResult.actionableRecommendations?.map((rec: string, i: number) => (
                    <div key={i} className="flex gap-2 text-xs text-slate-600">
                      <span className="text-emerald-500 font-bold shrink-0">✓</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Natural Language Query on the Active Document */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-emerald-600 animate-pulse" />
              Document Vector Q&A
            </h3>
            <p className="text-xs text-slate-500">
              Query specific paragraphs of this text to evaluate circular economy compliance or extract facts.
            </p>

            <div className="flex gap-2">
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. What is the greenhouse gas emissions rate?"
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500/40"
              />
              <button 
                onClick={handleQueryDocument}
                disabled={loading || !query.trim()}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-4 py-2 rounded-xl font-bold transition"
              >
                Ask AI
              </button>
            </div>

            {queryResponse && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed font-sans">
                {queryResponse}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
