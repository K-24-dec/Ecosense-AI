import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Eye, 
  Sparkles, 
  FilePlus, 
  AlertTriangle, 
  Activity, 
  CheckCircle,
  FileText,
  UploadCloud,
  Check
} from 'lucide-react';
import { WasteRecord, UserProfile } from '../types';

interface WasteManagerProps {
  user: UserProfile | null;
  onPointsUpdate: (pts: number) => void;
  onUserUpdate: (updated: UserProfile) => void;
}

export default function WasteManager({ user, onPointsUpdate, onUserUpdate }: WasteManagerProps) {
  const [logs, setLogs] = useState<WasteRecord[]>([]);
  const [materialType, setMaterialType] = useState<string>('Organic');
  const [weight, setWeight] = useState<string>('');
  const [loadingLog, setLoadingLog] = useState<boolean>(false);
  const [loadingVision, setLoadingVision] = useState<boolean>(false);

  // Vision states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visionResult, setVisionResult] = useState<any | null>(null);

  const sampleTrashItems = [
    {
      name: "Water Bottle",
      img: "https://images.unsplash.com/photo-1616149562385-1d84e79478bb?auto=format&fit=crop&q=80&w=300",
      type: "Plastic"
    },
    {
      name: "Cardboard Packaging",
      img: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=300",
      type: "Paper"
    },
    {
      name: "Lithium Battery",
      img: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=300",
      type: "Hazardous"
    }
  ];

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = () => {
    fetch('/api/waste')
      .then(res => res.json())
      .then(data => setLogs(data || []))
      .catch(err => console.error("Error fetching waste logs:", err));
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || parseFloat(weight) <= 0) return;

    setLoadingLog(true);
    try {
      const res = await fetch('/api/waste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: materialType, weight: parseFloat(weight) })
      });
      const data = await res.json();
      if (data.success) {
        setLogs(prev => [data.log, ...prev]);
        onUserUpdate(data.user);
        setWeight('');
      }
    } catch (err) {
      console.error("Error logging waste:", err);
    } finally {
      setLoadingLog(false);
    }
  };

  // Convert uploaded file to base64 for vision processing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        triggerVisionAnalysis(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (imgUrl: string) => {
    setSelectedImage(imgUrl);
    // Convert url to base64 or fetch directly via mock classifier
    triggerVisionAnalysis(imgUrl);
  };

  const triggerVisionAnalysis = async (imgData: string) => {
    setLoadingVision(true);
    setVisionResult(null);
    try {
      const res = await fetch('/api/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imgData })
      });
      const data = await res.json();
      setVisionResult(data.result);
      if (data.result && !data.isDemoMode) {
        onPointsUpdate(40); // Reward for smart audit
      }
    } catch (err) {
      console.error("Vision API error:", err);
    } finally {
      setLoadingVision(false);
    }
  };

  const handleSaveVisionLog = async () => {
    if (!visionResult) return;
    try {
      const res = await fetch('/api/waste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: visionResult.category === 'Paper' ? 'Paper' : visionResult.category === 'Plastic' ? 'Plastic' : visionResult.category === 'Hazardous' ? 'Hazardous' : 'E-Waste', 
          weight: 1.0 
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLogs(prev => [data.log, ...prev]);
        onUserUpdate(data.user);
        alert("Item added successfully to your sorted waste inventory logs!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Ribbon Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Trash2 className="h-5 w-5 text-emerald-600" />
          Waste Segregation & Vision Recognition
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Perform automated materials audit, log recyclables compliance, and prevent hazardous leachings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Module 17: AI Vision Material Classifier */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4 text-emerald-600" />
                AI Multimodal Material Spectrometer
              </h3>
              <span className="text-[10px] font-mono text-emerald-700 font-bold border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                GEMINI VISION ACTIVE
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Drag-and-drop a material photo to detect materials, or pick an SIH sample catalog below:
            </p>

            {/* Sample Picker Grid */}
            <div className="grid grid-cols-3 gap-3">
              {sampleTrashItems.map((item, i) => (
                <div 
                  key={i}
                  onClick={() => handleSelectSample(item.img)}
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 hover:border-emerald-300 transition duration-150 shadow-sm"
                >
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className="h-20 w-full object-cover transition duration-150 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-white/95 border-t border-slate-150 p-1.5 text-center">
                    <p className="text-[10px] font-bold text-slate-800 truncate">{item.name}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Zone */}
            <div className="border border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 rounded-xl p-6 flex flex-col items-center justify-center relative cursor-pointer group transition">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <UploadCloud className="h-8 w-8 text-slate-400 group-hover:text-emerald-600 transition mb-2" />
              <p className="text-xs font-bold text-slate-600 group-hover:text-slate-900">Click to upload material image</p>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">PNG, JPG, WEBP (Supports live camera captures)</p>
            </div>

            {/* Selected Image Preview & Spinner */}
            {selectedImage && (
              <div className="mt-4 border border-slate-200 p-3 rounded-xl bg-slate-50 flex flex-col items-center">
                <img 
                  src={selectedImage} 
                  alt="Pre-analysis buffer" 
                  className="max-h-44 rounded-lg object-contain border border-slate-200 bg-white"
                  referrerPolicy="no-referrer"
                />
                {loadingVision && (
                  <div className="mt-3 text-xs text-emerald-700 font-mono flex items-center gap-2 font-bold">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    Gemini sorting molecules...
                  </div>
                )}
              </div>
            )}

            {/* Analysis Result Box */}
            {visionResult && (
              <div className="mt-4 border border-emerald-200 bg-emerald-50/30 p-5 rounded-xl space-y-3.5 shadow-inner">
                <div className="flex justify-between items-center border-b border-emerald-100 pb-2">
                  <span className="text-xs font-bold text-emerald-700 uppercase font-mono">AUDIT COMPLETED</span>
                  <div className="flex items-center gap-1.5 font-mono text-xs text-teal-700 font-bold">
                    Recyclability Index: {visionResult.recyclabilityScore}%
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-sm font-extrabold text-slate-800">{visionResult.itemDetected}</p>
                  <p className="text-xs text-slate-500 font-mono">Category: <span className="text-emerald-700 font-bold">{visionResult.category}</span></p>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium mt-2">{visionResult.segregationInstructions}</p>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs">
                  <p className="font-bold text-emerald-700 mb-1">Circular Packaging Alternatives:</p>
                  <p className="text-slate-600 italic">"{visionResult.ecoAlternatives}"</p>
                  <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold">
                    <span>CO2 Saved by recycling:</span>
                    <span className="text-emerald-700 font-bold">{visionResult.estimatedCo2Offset}</span>
                  </div>
                </div>

                <button
                  onClick={handleSaveVisionLog}
                  className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg transition shadow-sm"
                >
                  Log item in waste history (+{visionResult.recyclabilityScore} XP)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Module 7: Waste Segregation Logging Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm border-b border-slate-150 pb-3 mb-4">
              <FilePlus className="h-4 w-4 text-emerald-600" />
              Manual Segregation Form
            </h3>

            <form onSubmit={handleAddLog} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 font-medium">Material Classification</label>
                <select 
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                >
                  <option value="Organic">Organic Biodegradables</option>
                  <option value="Plastic">Polymers & Plastics</option>
                  <option value="Paper">Paper & Cardboards</option>
                  <option value="Metal">Scrap Metal Cores</option>
                  <option value="Glass">Silicate Glass Containers</option>
                  <option value="E-Waste">Silicon & Electronics</option>
                  <option value="Hazardous">Hazardous Chemicals</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 font-medium">Weight (in kg)</label>
                <input 
                  type="number"
                  step="0.1"
                  required
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 4.2"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loadingLog || !weight}
                className="w-full text-center bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs py-2.5 rounded-xl font-bold transition shadow-sm"
              >
                {loadingLog ? "Recording log..." : "Commit Segregation Entry"}
              </button>
            </form>
          </div>

          {/* Hazardous alert warning box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm border-b border-slate-150 pb-3 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Hazardous Compliance Alerts
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Industrial chemical deposits, heavy lead/mercury battery packs require designated segregation vaults. Never drop hazardous elements in normal community landfill streams.
            </p>
            <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl text-[11px] text-amber-800 font-mono flex gap-2 font-bold">
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping mt-1" />
              <span>Vault C-1 humidity is elevated. Scheduled chemical check recommended.</span>
            </div>
          </div>
        </div>

      </div>

      {/* Historical logs table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 text-sm">Disposed Inventory Trail</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-mono uppercase text-[9px] pb-2">
                <th className="py-2.5">DISPOSAL TIME</th>
                <th>CLASSIFICATION</th>
                <th>WEIGHT IN KG</th>
                <th>XP AWARDED</th>
                <th>CO₂ AVOIDED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/55">
                  <td className="py-3 font-mono text-slate-400">{new Date(log.date).toLocaleString()}</td>
                  <td className="font-semibold text-slate-800">{log.type}</td>
                  <td className="font-mono font-bold">{log.weight.toFixed(1)} kg</td>
                  <td className="font-mono text-emerald-700 font-extrabold">+{log.points} XP</td>
                  <td className="font-mono text-teal-700 font-extrabold">{log.co2Impact} kg</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400 italic">No waste segregations logged yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
