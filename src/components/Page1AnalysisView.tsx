import React from 'react';
import { Page1Analysis } from '../types';
import { 
  AlertTriangle, 
  Clock, 
  Send, 
  CheckCircle2, 
  Building, 
  Users, 
  ArrowRight,
  ShieldAlert,
  Flame,
  Droplet,
  Zap,
  Activity,
  GraduationCap,
  Package
} from 'lucide-react';

interface Page1Props {
  data: Page1Analysis;
  citizenInput: string;
  district: string;
  state: string;
  docketId: string;
}

export const Page1AnalysisView: React.FC<Page1Props> = ({
  data,
  citizenInput,
  district,
  state,
  docketId,
}) => {
  // Category styling helper
  const getCategoryIcon = (category: string) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('road')) return <Flame className="w-4 h-4 text-orange-400" />;
    if (cat.includes('water')) return <Droplet className="w-4 h-4 text-sky-400" />;
    if (cat.includes('electric') || cat.includes('power')) return <Zap className="w-4 h-4 text-amber-400" />;
    if (cat.includes('health')) return <Activity className="w-4 h-4 text-rose-400" />;
    if (cat.includes('edu')) return <GraduationCap className="w-4 h-4 text-emerald-400" />;
    return <Package className="w-4 h-4 text-slate-400" />;
  };

  const getPriorityBadge = (priority: string) => {
    const prio = (priority || '').toLowerCase();
    if (prio === 'high') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse shadow-sm">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          High Priority (Urgent SLA)
        </span>
      );
    }
    if (prio === 'medium') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          Medium Priority (Standard SLA)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        Low Priority (Routine Queue)
      </span>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-slate-100">
      {/* Official Page Header Banner in Dark Mode */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 font-serif-gov text-sm font-bold border border-amber-500/40 shadow-sm">
            01
          </span>
          <div>
            <span className="text-[11px] font-mono-code uppercase tracking-wider text-amber-400 font-bold">
              Operational Layer 1
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              PAGE 1: CITIZEN INPUT ANALYSIS
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getPriorityBadge(data.priorityLevel)}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Raw Ingested Citizen Voice Container */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 relative shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono-code">
            <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              [Raw Ingested Citizen Voice]
            </span>
            <span className="text-slate-400 font-medium">Origin: {district}, {state}</span>
          </div>
          <p className="text-sm text-slate-200 italic leading-relaxed pl-3.5 border-l-3 border-amber-500/80 font-sans">
            "{citizenInput}"
          </p>
        </div>

        {/* The 5 Key Required Items from Prompt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Category */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1.5 font-mono-code">
              {getCategoryIcon(data.category)}
              Category
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-bold text-white tracking-wide">
                {data.category}
              </span>
              <span className="text-xs text-slate-400 font-mono-code">
                Urban & Rural Civic Sector
              </span>
            </div>
          </div>

          {/* 2. Priority Level */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1.5 font-mono-code">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Priority Level
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className={`text-xl font-bold tracking-wide ${
                data.priorityLevel === 'High' ? 'text-rose-400' :
                data.priorityLevel === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {data.priorityLevel}
              </span>
              <span className="text-xs text-slate-400 font-mono-code font-medium">
                Target SLA: {data.slaResponseDays ? `${data.slaResponseDays * 24}h (${data.slaResponseDays} Days)` : 'Within 48h'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. One-line Summary */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono-code">
              One-line Summary
            </span>
            <span className="text-[11px] text-slate-500 font-mono-code">Executive Headline</span>
          </div>
          <h4 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight leading-snug">
            {data.oneLineSummary}
          </h4>
        </div>

        {/* 4. Impact Assessment */}
        <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 font-mono-code">
              Impact Assessment
            </span>
            <span className="text-[11px] text-slate-400 ml-auto">(Effects on daily life & local economy)</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 rounded-lg border border-indigo-900/30">
            {data.impactAssessment}
          </p>
          {data.affectedDemographics && (
            <p className="text-xs text-slate-400 mt-2.5 flex items-center gap-1.5 font-sans">
              <span className="text-slate-500 font-semibold font-mono-code">Demographic impact:</span> {data.affectedDemographics}
            </p>
          )}
        </div>

        {/* 5. Suggested Government Action */}
        <div className="bg-gradient-to-br from-emerald-950/30 via-slate-950 to-slate-950 border border-emerald-900/50 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 font-mono-code">
                Suggested Government Action
              </span>
            </div>
            <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-md font-mono-code font-bold">
              Directive Order
            </span>
          </div>
          <p className="text-sm text-emerald-100 leading-relaxed font-semibold bg-emerald-950/40 p-4 rounded-lg border border-emerald-800/40 shadow-xs">
            {data.suggestedGovernmentAction}
          </p>

          {data.department && (
            <div className="mt-3.5 pt-3 border-t border-emerald-900/40 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Nodal Authority:</span>
                <span className="font-bold text-emerald-300">{data.department}</span>
              </div>
              <div className="flex items-center gap-1 font-mono-code text-[11px] text-amber-300 font-bold">
                <span>Direct Escalation</span>
                <ArrowRight className="w-3 h-3 text-amber-400" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
