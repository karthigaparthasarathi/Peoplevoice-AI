import React, { useState } from 'react';
import { DevelopmentReport } from '../types';
import { Page1AnalysisView } from './Page1AnalysisView';
import { Page2HotspotView } from './Page2HotspotView';
import { Page3PolicyView } from './Page3PolicyView';
import { AudioBriefingPlayer } from './AudioBriefingPlayer';
import { 
  FileText, 
  Layers, 
  MapPin, 
  Building, 
  ShieldCheck, 
  Printer, 
  Calendar, 
  Hash, 
  Check, 
  Share2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface DossierContainerProps {
  report: DevelopmentReport;
  onPrint: () => void;
  onCopyDossier: () => void;
  copied: boolean;
}

export const DossierContainer: React.FC<DossierContainerProps> = ({
  report,
  onPrint,
  onCopyDossier,
  copied,
}) => {
  const [viewMode, setViewMode] = useState<'all' | 'p1' | 'p2' | 'p3'>('all');

  return (
    <div className="space-y-6 printable-dossier">
      {/* Audio Executive Briefing Bar */}
      <AudioBriefingPlayer report={report} />

      {/* Dossier Meta Strip & Page Selector (Dark Theme) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 no-print shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 shadow-sm">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-mono-code uppercase">
                Official Government Development Dossier
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-mono-code font-bold">
                Verified Policy Brief
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono-code mt-0.5">
              <span>Docket ID: <span className="text-amber-300 font-bold">{report.id}</span></span>
              <span>•</span>
              <span>State: <span className="text-emerald-300 font-bold">{report.page2.state}</span></span>
              <span>•</span>
              <span>District: <span className="text-emerald-300 font-bold">{report.page2.district}</span></span>
            </div>
          </div>
        </div>

        {/* Page Switcher in Dark Mode */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === 'all'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All 3 Pages
          </button>
          <button
            onClick={() => setViewMode('p1')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === 'p1'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Page 1: Citizen
          </button>
          <button
            onClick={() => setViewMode('p2')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === 'p2'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Page 2: Hotspots
          </button>
          <button
            onClick={() => setViewMode('p3')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === 'p3'
                ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Page 3: Policy
          </button>
        </div>
      </div>

      {/* Official Government Memorandum Header */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 text-center space-y-2 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600" />
        <div className="text-[11px] font-mono-code uppercase tracking-widest text-slate-400 font-bold">
          GOVERNMENT OF TAMIL NADU • DEVELOPMENT MONITORING AND EVALUATION OFFICE
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-serif-gov">
          CITIZEN GRIEVANCE INTEGRATED DEVELOPMENT REPORT
        </h2>
        <div className="text-xs text-amber-300 font-mono-code font-bold">
          Ref No: <span className="underline">{report.id}</span> | Date: {new Date(report.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </div>
        <div className="text-xs text-slate-400 max-w-2xl mx-auto pt-1 font-sans">
          Submitted under the 3-Layer Administrative Review Protocol for immediate remedial sanction, regional cluster mitigation, and strategic policy reform.
        </div>
      </div>

      {/* Page 1: Citizen Input Analysis */}
      {(viewMode === 'all' || viewMode === 'p1') && (
        <div className="page-break-after">
          <Page1AnalysisView
            data={report.page1}
            citizenInput={report.citizenInput}
            district={report.page2.district}
            state={report.page2.state}
            docketId={report.id}
          />
        </div>
      )}

      {/* Page 2: Hotspot Dashboard Metrics */}
      {(viewMode === 'all' || viewMode === 'p2') && (
        <div className="page-break-after">
          <Page2HotspotView
            data={report.page2}
            docketId={report.id}
          />
        </div>
      )}

      {/* Page 3: Government Insights & Policy Recommendations */}
      {(viewMode === 'all' || viewMode === 'p3') && (
        <div>
          <Page3PolicyView
            data={report.page3}
            docketId={report.id}
            district={report.page2.district}
            category={report.page1.category}
          />
        </div>
      )}

      {/* Official Sign-off and Authentication Footer in Dark Mode */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 mt-8 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400 font-mono-code">
          <div>
            <span className="text-slate-500 uppercase font-semibold block mb-1">Authenticating Agency</span>
            <span className="text-slate-200 font-bold block">CivicPulse Intelligence Engine</span>
            <span>Government Development Advisory Node</span>
          </div>
          <div>
            <span className="text-slate-500 uppercase font-semibold block mb-1">Operational Dispatch</span>
            <span className="text-emerald-400 font-bold block">Direct to Competent Nodal Secretary</span>
            <span>District Collectorate Action Intimated</span>
          </div>
          <div className="md:text-right">
            <span className="text-slate-500 uppercase font-semibold block mb-1">Compliance Timestamp</span>
            <span className="text-slate-200 font-semibold block">{report.timestamp}</span>
            <span className="text-amber-400 font-bold">Electronic Gazette Validated</span>
          </div>
        </div>
      </div>
    </div>
  );
};
