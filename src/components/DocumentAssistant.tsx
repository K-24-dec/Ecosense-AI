import React, { useState } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Sparkles, 
  Plus, 
  HelpCircle, 
  Send, 
  CheckCircle,
  FileCheck,
  Search
} from 'lucide-react';

interface DocumentAssistantProps {
  onPointsUpdate: (pts: number) => void;
}

export default function DocumentAssistant({ onPointsUpdate }: DocumentAssistantProps) {
  const [fileName, setFileName] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<any | null>(null);

  // Q&A state
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [loadingQA, setLoadingQA] = useState<boolean>(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setFileContent(text);
        triggerDocumentAnalysis(file.name, text);
      };
      reader.readAsText(file);
    }
  };

  const triggerDocumentAnalysis = async (name: string, content: string) => {
    setLoading(true);
    setAnalysis(null);
    setAnswer('');
    try {
      const res = await fetch('/api/document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: name, fileContent: content })
      });
      const data = await res.json();
      setAnalysis(data.analysis);
      onPointsUpdate(50); // reward points
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQueryDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !fileContent) return;
    setLoadingQA(true);
    setAnswer('');
    
    try {
      const res = await fetch('/api/document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fileName, 
          fileContent, 
          question 
        })
      });
      const data = await res.json();
      setAnswer(data.answer);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQA(false);
    }
  };

  const handleSaveToAudits = async () => {
    if (!analysis) return;
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Audit - ${analysis.title}`,
          type: "AI Document Summary",
          score: analysis.sustainabilityGrade === "A" ? 95 : analysis.sustainabilityGrade === "B" ? 84 : 72,
          summary: analysis.summary
        })
      });
      const data = await res.json();
      if (data.id) {
        alert("This AI audit has been permanently registered in your team's historical audit trail database!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Ribbon Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <FileText className="h-5 w-5 text-emerald-400" />
          AI Document Assistant & Compliance Auditor
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Upload ESG checklists, factory audit CSV sheets, or carbon reports. Summarize targets and test compliance parameters using Gemini.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Upload Zone & Results */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                <UploadCloud className="h-4.5 w-4.5 text-emerald-400" />
                Audit Upload Center
              </h3>
              <span className="text-[10px] font-mono text-slate-400">CSV, PDF, TXT COMPLIANT</span>
            </div>

            {/* Drag Drop selector */}
            <div className="border border-dashed border-slate-800 bg-slate-950/40 hover:bg-slate-950/70 rounded-xl p-8 flex flex-col items-center justify-center relative cursor-pointer group">
              <input 
                type="file" 
                accept=".txt,.csv,.json,.pdf,.docx"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <FileCheck className="h-10 w-10 text-slate-500 group-hover:text-emerald-400 transition mb-2" />
              <p className="text-xs font-semibold text-slate-300 group-hover:text-slate-100">Click to upload audit file</p>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">Upload CSV, PDF, or text datasets up to 10MB</p>
            </div>

            {/* Loaded filename */}
            {fileName && (
              <div className="flex items-center gap-2 bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-300">
                <FileText className="h-4 w-4 text-emerald-400" />
                <span>Buffer Locked: {fileName}</span>
              </div>
            )}

            {/* Spinner */}
            {loading && (
              <div className="text-xs text-emerald-400 font-mono flex items-center gap-2 py-4">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                Gemini scanning columns and calculating ecological weights...
              </div>
            )}

            {/* Analysis Results Display */}
            {analysis && (
              <div className="border border-emerald-500/20 bg-emerald-500/5 p-5 rounded-xl space-y-4">
                <div className="flex justify-between items-center border-b border-emerald-500/20 pb-2">
                  <span className="text-xs font-mono font-bold text-emerald-400">EXECUTIVE SUMMARY AUDIT</span>
                  <span className="text-xs font-mono font-bold text-teal-300">
                    ECO GRADE: {analysis.sustainabilityGrade}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="text-sm font-bold text-slate-100">{analysis.title}</p>
                  <p className="text-slate-300 leading-relaxed mt-2">{analysis.summary}</p>
                  <p className="text-slate-300 font-mono mt-2">Carbon footprints located: <span className="text-emerald-400 font-bold">{analysis.carbonFootprintMentioned}</span></p>
                </div>

                <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 text-xs space-y-2">
                  <p className="font-bold text-emerald-300">AI compliance suggestions:</p>
                  <ul className="space-y-1.5 pl-4 list-disc text-slate-300">
                    {analysis.actionableRecommendations.map((rec: string, i: number) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={handleSaveToAudits}
                  className="w-full text-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2 rounded-lg transition"
                >
                  Register in community historical audit trail database (+50 XP)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Q&A Column */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm border-b border-slate-800 pb-3 mb-3">
              <Search className="h-4.5 w-4.5 text-emerald-400" />
              Document Q&A Portal
            </h3>

            {fileContent ? (
              <form onSubmit={handleQueryDocument} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium">Ask questions regarding this report</label>
                  <textarea 
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g. What is the raw boiler idle load mentioned in section B?"
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg p-2.5 text-xs focus:outline-none focus:border-emerald-500/30 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingQA || !question.trim()}
                  className="w-full flex items-center justify-center gap-1.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 py-2 rounded-lg font-bold transition"
                >
                  <Send className="h-3.5 w-3.5 text-slate-400" />
                  Query Document
                </button>
              </form>
            ) : (
              <p className="text-xs text-slate-500 italic">Please upload a compliance report in the Left pane to activate standard Q&A document reading grids.</p>
            )}

            {/* Q&A Answer container */}
            {loadingQA && (
              <div className="text-xs text-emerald-400 font-mono animate-pulse py-2">
                Reading columns and synthesizing answering patterns...
              </div>
            )}

            {answer && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-xs">
                <p className="font-bold text-emerald-400 mb-1">AI Answer:</p>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{answer}</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
