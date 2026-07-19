import React, { useState, useEffect } from 'react';
import { Menu, Leaf, Sparkles, Activity } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AiChat from './components/AiChat';
import WasteManager from './components/WasteManager';
import EnergyEstimator from './components/EnergyEstimator';
import WaterSanitation from './components/WaterSanitation';
import EnvironmentalMonitor from './components/EnvironmentalMonitor';
import SmartUtilities from './components/SmartUtilities';
import ManufacturingEco from './components/CircularFactory';
import SustainablePackaging from './components/EcoPackaging';
import GreenInfrastructure from './components/GreenCanopy';
import DocumentAssistant from './components/DocumentHub';
import DocsPortal from './components/DocsHelp';
import VerificationHub from './components/IntegrationHub';
import { UserProfile } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = () => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
        }
      })
      .catch((err) => console.error("Error loading session:", err));
  };

  const handlePointsUpdate = (pts: number) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      points: user.points + pts,
    };
    setUser(updatedUser);

    // Save back to express database
    fetch('/api/auth/update-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser),
    }).catch((err) => console.error(err));
  };

  const handleUserUpdate = (updated: UserProfile) => {
    setUser(updated);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Upper Header Nav */}
        <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 lg:hidden transition"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-sans">
                Smart City Monitor
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-xs font-semibold text-slate-600">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                <span>Status:</span>
                <span className="text-emerald-700 uppercase">{user.points > 2000 ? "Zero Waste Gold" : "Sustainability Champion"}</span>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Inner Component Workspace */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto w-full">
            {activeTab === 'dashboard' && (
              <Dashboard user={user} onNavigate={setActiveTab} />
            )}
            {activeTab === 'chat' && (
              <AiChat onPointsUpdate={handlePointsUpdate} />
            )}
            {activeTab === 'document' && (
              <DocumentAssistant onPointsUpdate={handlePointsUpdate} />
            )}
            {(activeTab === 'vision' || activeTab === 'waste') && (
              <WasteManager user={user} onPointsUpdate={handlePointsUpdate} onUserUpdate={handleUserUpdate} />
            )}
            {activeTab === 'energy' && (
              <EnergyEstimator user={user} onUserUpdate={handleUserUpdate} />
            )}
            {activeTab === 'water' && (
              <WaterSanitation user={user} onUserUpdate={handleUserUpdate} />
            )}
            {activeTab === 'monitoring' && (
              <EnvironmentalMonitor />
            )}
            {activeTab === 'utilities' && (
              <SmartUtilities />
            )}
            {activeTab === 'manufacturing' && (
              <ManufacturingEco />
            )}
            {activeTab === 'packaging' && (
              <SustainablePackaging />
            )}
            {activeTab === 'infrastructure' && (
              <GreenInfrastructure user={user} onUserUpdate={handleUserUpdate} />
            )}
            {activeTab === 'docs' && (
              <DocsPortal />
            )}
            {activeTab === 'verification' && (
              <VerificationHub />
            )}
          </div>
        </main>

      </div>
    </div>
  );
}
