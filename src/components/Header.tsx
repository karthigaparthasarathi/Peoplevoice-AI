import React from 'react';
import { 
  Building2, 
  FileText, 
  MapPin, 
  BarChart3, 
  ShieldCheck, 
  Printer, 
  Share2, 
  Copy, 
  Sparkles,
  Layers,
  Check,
  Mic
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'dossier' | 'map' | 'policy' | 'batch';
  setActiveTab: (tab: 'dossier' | 'map' | 'policy' | 'batch') => void;
  onPrint: () => void;
  onCopyDossier: () => void;
  copied: boolean;
  docketId: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onPrint,
  onCopyDossier,
  copied,
  docketId,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-md sticky top-0 z-40 shadow-xl">
      {/* Top Gazette Status Ribbon (Dark Emerald & Slate) */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950/70 border-b border-emerald-900/40 px-4 py-1.5 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-emerald-300 tracking-wide uppercase text-[11px]">
            Government of Tamil Nadu • தமிழ்நாடு அரசு
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 hidden sm:inline">Development Monitoring & Policy Expert Portal</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono-code">
          <span className="text-emerald-400 hidden sm:inline flex items-center gap-1.5 font-medium">
            <Mic className="w-3.5 h-3.5 text-emerald-400" />
            Web Speech Dictation Live
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400">Docket:</span>
          <span className="text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/50 font-bold">
            {docketId}
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Emblem & Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-slate-900 border border-amber-500/40 shadow-lg shadow-amber-950/50 flex items-center justify-center text-amber-100 flex-shrink-0">
            {/* Tamil Nadu Temple Gopuram / Civic emblem motif */}
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-amber-300" fill="currentColor">
              <path d="M12 2L9 7h6L12 2zm-5 6h10l-1 4H8l-1-4zm-2 5h14l-1 5H6l-1-5zm-2 6h18v3H3v-3z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                CivicPulse
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Tamil Nadu Policy Intelligence
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Citizen Grievance Processing & 3-Layer Development Advisory System (தமிழ்நாடு மக்கள் குறைதீர்ப்பு)
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* View Switcher in Dark Mode */}
          <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab('dossier')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'dossier'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>3-Page Dossier</span>
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>TN Hotspots</span>
            </button>
            <button
              onClick={() => setActiveTab('policy')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'policy'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Macro Policy</span>
            </button>
            <button
              onClick={() => setActiveTab('batch')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'batch'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Batch Queue</span>
            </button>
          </div>

          {/* Quick Memo Utility Buttons */}
          <button
            onClick={onCopyDossier}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 transition-colors flex items-center gap-1.5 font-medium shadow-sm"
            title="Copy Report in Official Gazette Text Format"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Copy Memo</span>
              </>
            )}
          </button>

          <button
            onClick={onPrint}
            className="px-3 py-1.5 text-xs rounded-lg border border-amber-600/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors flex items-center gap-1.5 font-bold shadow-sm"
            title="Print Official 3-Page Government Development Report"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
