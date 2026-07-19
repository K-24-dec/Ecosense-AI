import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Trash2, 
  Sun, 
  Droplet, 
  Activity, 
  Zap, 
  Factory, 
  Package, 
  Trees, 
  FileText, 
  Eye, 
  BookOpen, 
  ShieldCheck, 
  ChevronRight,
  Leaf,
  Menu,
  X
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ activeTab, setActiveTab, user, isOpen, setIsOpen }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Tech Dashboard', icon: LayoutDashboard, category: 'Main' },
    { id: 'chat', label: 'AI Chat Assistant', icon: MessageSquare, category: 'AI Tools' },
    { id: 'document', label: 'AI Document Hub', icon: FileText, category: 'AI Tools' },
    { id: 'vision', label: 'AI Vision Classifier', icon: Eye, category: 'AI Tools' },
    { id: 'waste', label: 'Waste Segregator', icon: Trash2, category: 'Clean Tech' },
    { id: 'energy', label: 'Renewable Estimator', icon: Sun, category: 'Clean Tech' },
    { id: 'water', label: 'Water Conserver', icon: Droplet, category: 'Clean Tech' },
    { id: 'monitoring', label: 'Eco Monitoring', icon: Activity, category: 'Analytics' },
    { id: 'utilities', label: 'Smart Utilities', icon: Zap, category: 'Analytics' },
    { id: 'manufacturing', label: 'Circular Factory', icon: Factory, category: 'Industry' },
    { id: 'packaging', label: 'Eco Packaging', icon: Package, category: 'Industry' },
    { id: 'infrastructure', label: 'Green Canopy', icon: Trees, category: 'Industry' },
    { id: 'docs', label: 'Documentation', icon: BookOpen, category: 'Help' },
    { id: 'verification', label: 'SIH Integration Hub', icon: ShieldCheck, category: 'Help' },
  ];

  const categories = ['Main', 'AI Tools', 'Clean Tech', 'Analytics', 'Industry', 'Help'];

  return (
    <>
      {/* Mobile Sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex w-68 flex-col bg-emerald-900 text-emerald-50 border-r border-emerald-950 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header Branding */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-emerald-950 bg-emerald-950">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-800 shadow-sm">
              <Leaf className="h-5 w-5 text-emerald-300 animate-pulse" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white font-sans">
                EcoSphere AI
              </span>
              <p className="text-[9px] font-mono tracking-widest text-emerald-300 uppercase opacity-80">SIH Theme 2</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1 text-emerald-300 hover:bg-emerald-800 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card */}
        {user && (
          <div className="px-5 py-4 border-b border-emerald-950 bg-emerald-950/20">
            <div className="flex items-center gap-3">
              <img 
                src={user.profileImageUrl} 
                alt={user.fullName}
                className="h-9 w-9 rounded-full border border-emerald-700 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user.fullName}</p>
                <p className="text-[10px] text-emerald-300/80 truncate font-mono">{user.role}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5">
              <span className="text-[10px] font-medium text-emerald-200">System Points</span>
              <div className="flex items-center gap-1 font-mono text-xs font-bold text-white">
                {user.points} XP
              </div>
            </div>
          </div>
        )}

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-4">
          {categories.map((category) => {
            const items = menuItems.filter((i) => i.category === category);
            if (items.length === 0) return null;
            return (
              <div key={category} className="space-y-1">
                <p className="px-2 text-[10px] font-bold tracking-wider text-emerald-300/60 uppercase font-sans">
                  {category}
                </p>
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsOpen(false);
                        }}
                        className={`
                          flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-150
                          ${isActive 
                            ? 'bg-emerald-800/50 text-white shadow-sm font-bold' 
                            : 'text-emerald-100/70 hover:bg-emerald-800/30 hover:text-white'}
                        `}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-emerald-300/70'}`} />
                        <span className="flex-1 text-left">{item.label}</span>
                        {isActive && <ChevronRight className="h-3 w-3 text-emerald-300" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Info footer */}
        <div className="p-4 border-t border-emerald-950 bg-emerald-950/30 font-sans text-[9px] text-emerald-300/50 flex flex-col gap-0.5">
          <p>CLEAN TECH PORTAL v1.1</p>
          <p>SIH COMPLIANCE ONLINE</p>
        </div>
      </aside>
    </>
  );
}
