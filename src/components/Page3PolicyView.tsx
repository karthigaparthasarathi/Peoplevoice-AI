import React from 'react';
import { Page3Policy } from '../types';
import { DistrictTrendsChart } from './DistrictTrendsChart';
import { 
  Compass, 
  Target, 
  Map, 
  CheckSquare, 
  Coins, 
  ShieldCheck, 
  FileCheck2,
  Workflow,
  Sparkles,
  TrendingUp
} from 'lucide-react';

interface Page3Props {
  data: Page3Policy;
  docketId: string;
  district?: string;
  category?: string;
}

export const Page3PolicyView: React.FC<Page3Props> = ({
  data,
  docketId,
  district = 'Madurai',
  category = 'Water',
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-slate-100">
      {/* Official Page Header Banner in Dark Indigo */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 font-serif-gov text-sm font-bold border border-indigo-500/40 shadow-xs">
            03
          </span>
          <div>
            <span className="text-[11px] font-mono-code uppercase tracking-wider text-indigo-400 font-bold">
              Operational Layer 3
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              PAGE 3: GOVERNMENT INSIGHTS & POLICY RECOMMENDATIONS
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold font-mono-code flex items-center gap-1.5 shadow-xs">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            Executive Cabinet Briefing
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 1. Top Issues Identified (Core Systemic Problem) */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300 font-mono-code">
                Top Issues Identified
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono-code">
              [Systemic Core Problem Synthesis]
            </span>
          </div>
          <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-4 shadow-xs">
            <p className="text-sm text-slate-100 leading-relaxed font-semibold">
              {data.topIssuesIdentified}
            </p>
          </div>
        </div>

        {/* 2. Affected Regions (Region/District Impact Analysis) */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Map className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono-code">
                Affected Regions
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono-code">
              [Region / District Impact Analysis]
            </span>
          </div>
          <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg p-4 shadow-xs">
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {data.affectedRegions}
            </p>
          </div>
        </div>

        {/* RECHARTS 12-MONTH LINE CHART COMPONENT */}
        <div>
          <DistrictTrendsChart 
            district={district} 
            category={category} 
          />
        </div>

        {/* 3. Policy Recommendations (1-2 Strategic Macro-Level Policy Steps) */}
        <div className="bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-950 border border-indigo-900/50 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 font-mono-code">
                Policy Recommendations
              </span>
            </div>
            <span className="text-[11px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2.5 py-0.5 rounded-md font-mono-code font-bold">
              Macro-Level Policy Interventions
            </span>
          </div>

          <div className="space-y-3">
            {data.policyRecommendations && data.policyRecommendations.length > 0 ? (
              data.policyRecommendations.map((rec, index) => (
                <div 
                  key={index}
                  className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-colors p-4 rounded-xl flex items-start gap-3.5 shadow-xs"
                >
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-300 text-xs font-bold font-mono-code border border-indigo-500/40 mt-0.5">
                    {index + 1}
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-100 font-semibold leading-relaxed">
                      {rec}
                    </p>
                    <span className="inline-block text-[11px] text-indigo-400 font-mono-code font-medium">
                      Target: State Government Policy Gazette / Administrative Sanction
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                <p className="text-sm text-slate-200">
                  Formulate statutory coordination protocols between local municipal bodies and utility agencies.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Preventative Governance Framework & Estimated Capital Outlay */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Preventative Framework */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2 font-mono-code">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Preventative Governance Framework
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {data.preventativeFramework || 
                'Establish automated GIS telemetry with bi-weekly District Collectorate reviews and mandatory vendor escrow bonds.'}
            </p>
          </div>

          {/* Programmatic Budget Outlay */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2 font-mono-code">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              Estimated Programmatic Allocation
            </span>
            <div className="text-base font-bold text-amber-300 font-mono-code">
              {data.estimatedBudgetCapEx || '₹3.50 Cr – ₹6.00 Cr (Phase 1 Targeted Outlay)'}
            </div>
            <span className="text-[11px] text-slate-400 font-mono-code block mt-1">
              Funding: State Urban & Rural Infrastructure Development Fund
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
