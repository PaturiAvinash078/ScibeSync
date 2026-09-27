import React, { useEffect, useState } from 'react';
import { ScribeSyncLogo } from './ScribeSyncHeader';
import { ArrowRight, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    // 7-second high-fidelity intro sequence:
    // 0s-1.2s: Logo Badge zooms in centered
    // 1.2s-3.5s: "ScribeSync" text reveals fully (all letters with final 'c')
    // 3.5s-5.5s: Tagline & sync pulses appear
    // 5.5s-7.0s: Progress bar hits 100% & completes

    const p1 = setTimeout(() => setPhase(1), 1200);
    const p2 = setTimeout(() => setPhase(2), 3500);
    const p3 = setTimeout(() => setPhase(3), 5500);
    const finish = setTimeout(() => onComplete(), 7000);

    // Progress bar ticker over 7000ms
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1.45;
      });
    }, 100);

    return () => {
      clearTimeout(p1);
      clearTimeout(p2);
      clearTimeout(p3);
      clearTimeout(finish);
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-graph-paper select-none overflow-hidden"
    >
      {/* Top right spherical gradient orb matching the video frame */}
      <div 
        className="absolute -top-20 -right-20 w-88 h-88 rounded-full pointer-events-none opacity-80 animate-pulse duration-3000"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #94a3b8 0%, #475569 50%, #1e293b 85%, transparent 100%)',
          boxShadow: '0 20px 45px rgba(0,0,0,0.18)'
        }}
      />

      {/* Top right Skip button */}
      <button
        onClick={onComplete}
        className="absolute top-6 right-6 z-20 flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900/10 hover:bg-slate-900/20 text-slate-800 text-xs font-semibold backdrop-blur-xs transition-all cursor-pointer border border-slate-400/40"
      >
        <span>Skip</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      {/* Center animated logo & brand text */}
      <div className="flex flex-col items-center justify-center z-10 px-6 max-w-md w-full">
        <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-4">
          {/* Logo Badge */}
          <div className="animate-in zoom-in-50 duration-700 transform scale-110 sm:scale-125">
            <ScribeSyncLogo size={76} />
          </div>

          {/* Full Brand Name - Explicitly guarantees all letters "ScribeSync" are visible without truncation */}
          <div 
            className={`transition-all duration-700 ease-out flex items-center overflow-visible ${
              phase >= 1 
                ? 'opacity-100 translate-x-0 scale-100' 
                : 'opacity-0 -translate-x-6 scale-95'
            }`}
          >
            <h1 className="font-scribesync-brand text-4xl sm:text-5xl tracking-normal text-slate-900 whitespace-nowrap pl-1">
              ScribeSync
            </h1>
          </div>
        </div>

        {/* Phase 2: Tagline */}
        <div 
          className={`text-center space-y-1 transition-all duration-700 ${
            phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-xs sm:text-sm font-semibold text-slate-700 font-serif tracking-wide">
            Paper Feel. Cloud Speed. AI Brain.
          </p>
          <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-500 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
            <span>Smart Document Digitize &amp; Categorize</span>
          </div>
        </div>

        {/* Phase 3 & Progress bar */}
        <div className="w-64 mt-10 space-y-2">
          <div className="w-full bg-slate-300/80 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-slate-900 h-full rounded-full transition-all duration-100 ease-out"
              style={{ width: `${Math.min(100, Math.round(progress))}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-600 font-mono">
            <span>
              {phase === 0 && 'Initializing scanner...'}
              {phase === 1 && 'Syncing stroke engine...'}
              {phase === 2 && 'Calibrating AI categorizer...'}
              {phase >= 3 && 'Ready to study'}
            </span>
            <span className="font-bold">{Math.min(100, Math.round(progress))}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
