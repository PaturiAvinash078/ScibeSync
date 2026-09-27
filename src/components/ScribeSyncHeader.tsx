import React, { useEffect, useState } from 'react';

interface ScribeSyncHeaderProps {
  className?: string;
  onLogoClick?: () => void;
  showSubtitle?: boolean;
}

export const ScribeSyncLogo: React.FC<{ size?: number; className?: string; customLogoUrl?: string | null }> = ({
  size = 42,
  className = '',
  customLogoUrl
}) => {
  const [activeLogo, setActiveLogo] = useState<string | null>(customLogoUrl || null);

  useEffect(() => {
    if (customLogoUrl !== undefined) {
      setActiveLogo(customLogoUrl);
    } else {
      const stored = localStorage.getItem('scribesync_custom_logo');
      if (stored) setActiveLogo(stored);
    }

    const handleLogoUpdate = () => {
      const updated = localStorage.getItem('scribesync_custom_logo');
      setActiveLogo(updated);
    };

    window.addEventListener('scribesync_logo_changed', handleLogoUpdate);
    return () => window.removeEventListener('scribesync_logo_changed', handleLogoUpdate);
  }, [customLogoUrl]);

  if (activeLogo) {
    return (
      <div
        className={`relative rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-md border-2 border-slate-700/60 bg-black ${className}`}
        style={{
          width: size,
          height: size
        }}
      >
        <img src={activeLogo} alt="ScribeSync Logo" className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-full flex items-center justify-center shrink-0 shadow-md ${className}`}
      style={{
        width: size,
        height: size,
        background: 'radial-gradient(circle at 35% 30%, #475569 0%, #1e293b 45%, #050811 100%)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.45), inset 0 1.5px 2px rgba(255, 255, 255, 0.4)'
      }}
    >
      {/* Sleek ScribeSync Dual-Loop Stylus & Cloud "S" Emblem */}
      <svg
        viewBox="0 0 100 100"
        className="w-[72%] h-[72%] text-white fill-none"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))' }}
      >
        <defs>
          <linearGradient id="scribeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>

        {/* Fountain pen nib at top right of S curve */}
        <path
          d="M 66 22 L 76 27 L 68 35 L 61 28 Z"
          fill="url(#scribeGrad)"
        />
        {/* Ink slit line on nib */}
        <line x1="71" y1="24.5" x2="64.5" y2="31.5" stroke="#1e293b" strokeWidth="1.2" />

        {/* Smooth Top 'S' Arc sweeping from nib into central curve */}
        <path
          d="M 64 30 C 58 24, 40 23, 33 32 C 26 41, 30 50, 48 53 C 68 56, 73 66, 66 77 C 59 87, 36 86, 28 78"
          stroke="url(#scribeGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Sync return arrow head at bottom left curve */}
        <path
          d="M 24 82 L 27 75 L 34 81 Z"
          fill="url(#scribeGrad)"
        />

        {/* Subtle center digital sync dot */}
        <circle cx="50" cy="51" r="2.2" fill="#38bdf8" />
      </svg>
    </div>
  );
};

export const ScribeSyncHeader: React.FC<ScribeSyncHeaderProps> = ({ className = '', onLogoClick, showSubtitle = false }) => {
  return (
    <div className={`flex items-center space-x-2.5 select-none ${className}`}>
      <button 
        type="button"
        onClick={onLogoClick} 
        className="cursor-pointer transition-transform active:scale-95 flex items-center space-x-2.5 text-left"
        title="ScribeSync"
      >
        <ScribeSyncLogo size={42} />
        <div>
          <span className="font-scribesync-brand text-2xl tracking-normal block leading-none">
            ScribeSync
          </span>
          {showSubtitle && (
            <span className="text-[10px] text-slate-500 font-mono tracking-wider block mt-0.5">
              SMART SCAN &amp; STUDY
            </span>
          )}
        </div>
      </button>
    </div>
  );
};
