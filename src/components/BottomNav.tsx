import React from 'react';
import { Home, FileText, PenTool, Sparkles, Users, Settings, ScanLine } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onTriggerScan: () => void;
  unsyncedCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onTriggerScan,
  unsyncedCount = 0
}) => {
  return (
    <nav 
      aria-label="Bottom Navigation" 
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-slate-400 py-1.5 px-2 safe-area-pb shadow-2xl"
    >
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* 1. Home */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            activeTab === 'home' ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeTab === 'home' ? 'bg-slate-800 text-white' : ''}`}>
            <Home className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
        </button>

        {/* 2. Docs */}
        <button
          onClick={() => onTabChange('docs')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            activeTab === 'docs' ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl relative ${activeTab === 'docs' ? 'bg-slate-800 text-white' : ''}`}>
            {/* Custom document icon with "DOC" badge */}
            <div className="relative">
              <FileText className="w-5 h-5 stroke-[2]" />
              <span className="absolute inset-0 flex items-center justify-center text-[7px] font-black tracking-tighter text-slate-900 bg-white px-0.5 rounded-[2px] scale-75 mt-0.5">
                DOC
              </span>
            </div>
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Docs</span>
        </button>

        {/* 3. Physical */}
        <button
          onClick={() => onTabChange('physical')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer relative ${
            activeTab === 'physical' ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl relative ${activeTab === 'physical' ? 'bg-slate-800 text-white' : ''}`}>
            <PenTool className="w-5 h-5 stroke-[2.2]" />
            {unsyncedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 text-slate-950 text-[9px] font-black rounded-full flex items-center justify-center">
                {unsyncedCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Physical</span>
        </button>

        {/* 4. Center Scan Trigger (Viewfinder Button from PDF) */}
        <div className="flex-1 flex justify-center items-center">
          <button
            onClick={onTriggerScan}
            aria-label="Scan Document"
            className="w-12 h-12 rounded-2xl bg-white text-slate-950 border-2 border-slate-900 flex items-center justify-center shadow-lg active:scale-90 hover:scale-105 transition-transform cursor-pointer"
          >
            {/* QR/Scanner icon matching [ 回 ] in PDF */}
            <div className="relative w-6 h-6 border-2 border-slate-900 rounded-md flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-slate-900 rounded-xs" />
              <div className="absolute -top-1 -left-1 w-1.5 h-1.5 border-t-2 border-l-2 border-slate-900" />
              <div className="absolute -top-1 -right-1 w-1.5 h-1.5 border-t-2 border-r-2 border-slate-900" />
              <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 border-b-2 border-l-2 border-slate-900" />
              <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b-2 border-r-2 border-slate-900" />
            </div>
          </button>
        </div>

        {/* 5. AI Features */}
        <button
          onClick={() => onTabChange('ai')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            activeTab === 'ai' ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeTab === 'ai' ? 'bg-slate-800 text-white' : ''}`}>
            <Sparkles className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight whitespace-nowrap">AI Features</span>
        </button>

        {/* 6. Connect (NEW!) */}
        <button
          onClick={() => onTabChange('connect')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            activeTab === 'connect' ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeTab === 'connect' ? 'bg-slate-800 text-white' : ''}`}>
            <Users className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Connect</span>
        </button>

        {/* 7. Settings */}
        <button
          onClick={() => onTabChange('settings')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            activeTab === 'settings' ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeTab === 'settings' ? 'bg-slate-800 text-white' : ''}`}>
            <Settings className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Settings</span>
        </button>
      </div>
    </nav>
  );
};
