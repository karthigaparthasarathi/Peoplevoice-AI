import React from 'react';
import { Page2Hotspot } from '../types';
import { 
  MapPin, 
  BarChart2, 
  Layers, 
  TrendingUp, 
  Activity, 
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';

interface Page2Props {
  data: Page2Hotspot;
  docketId: string;
}

export const Page2HotspotView: React.FC<Page2Props> = ({
  data,
  docketId,
}) => {
  const getSeverityStyle = (severity?: string) => {
    const sev = (severity || 'moderate').toLowerCase();
    if (sev === 'critical') {
      return {
        badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-xs',
        bar: 'bg-rose-500',
        text: 'Critical Hotspot Alert',
      };
    }
    if (sev === 'severe') {
      return {
        badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40 shadow-xs',
        bar: 'bg-orange-500',
        text: 'Severe Hotspot Cluster',
      };
    }
    if (sev === 'watchlist') {
      return {
        badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-xs',
        bar: 'bg-blue-500',
        text: 'Under Watchlist',
      };
    }
    return {
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs',
      bar: 'bg-amber-500',
      text: 'Moderate Hotspot',
    };
  };

  const severityInfo = getSeverityStyle(data.hotspotSeverity);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-slate-100">
      {/* Official Page Header Banner in Dark Emerald */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 font-serif-gov text-sm font-bold border border-emerald-500/40 shadow-xs">
            02
          </span>
          <div>
            <span className="text-[11px] font-mono-code uppercase tracking-wider text-emerald-400 font-bold">
              Operational Layer 2
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              PAGE 2: HOTSPOT DASHBOARD METRICS
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${severityInfo.badge}`}>
            {data.hotspotSeverity || 'Severe'} Hotspot
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Core 3 Requirements Box: State, Category, Status/Count Note */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. State */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1 font-mono-code">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              State
            </span>
            <div className="text-xl font-bold text-white mt-1">
              {data.state}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono-code flex items-center gap-1 font-medium">
              <span>District:</span>
              <span className="text-emerald-300 font-bold">{data.district || 'Statewide Corridor'}</span>
            </div>
          </div>

          {/* 2. Category */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1 font-mono-code">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Category
            </span>
            <div className="text-xl font-bold text-amber-300 mt-1">
              {data.category}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-mono-code">
              Jurisdiction: State Nodal Board
            </div>
          </div>

          {/* Vulnerability Index Score */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono-code">
                <Activity className="w-3.5 h-3.5 text-rose-400" />
                Vulnerability Index
              </span>
              <span className="text-xs font-mono-code font-bold text-rose-400">
                {data.vulnerabilityIndex || 78}/100
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mt-3">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${severityInfo.bar}`}
                style={{ width: `${data.vulnerabilityIndex || 78}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 mt-2 font-mono-code flex justify-between font-medium">
              <span>Low Risk</span>
              <span className="text-rose-400 font-bold">Critical Threshold</span>
            </div>
          </div>
        </div>

        {/* 3. Status/Count Note: Tabular / Metric Entry Tracking */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono-code">
                Status / Count Note
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono-code font-medium">
              Visual Metric Telemetry Entry
            </span>
          </div>

          {/* Primary Status Note Narrative Banner */}
          <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3.5 mb-4 text-sm text-emerald-200 font-mono-code shadow-xs font-medium">
            <span className="text-emerald-400 font-bold mr-2">LOG ENTRY:</span>
            {data.statusNote}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-xs">
              <span className="text-[11px] text-slate-400 block uppercase font-mono-code font-semibold">Cluster Volume</span>
              <span className="text-lg font-bold text-white font-mono-code">
                {data.clusterCount || 47} Units
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-xs">
              <span className="text-[11px] text-slate-400 block uppercase font-mono-code font-semibold">Recurrence Trend</span>
              <span className="text-sm font-bold text-amber-300 font-mono-code">
                {data.recurrenceRate || '68% Seasonal'}
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-xs">
              <span className="text-[11px] text-slate-400 block uppercase font-mono-code font-semibold">Hotspot Tier</span>
              <span className="text-sm font-bold text-rose-300 font-mono-code">
                {data.hotspotSeverity || 'Severe'}
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-xs">
              <span className="text-[11px] text-slate-400 block uppercase font-mono-code font-semibold">Cluster District</span>
              <span className="text-sm font-bold text-emerald-300 font-mono-code">
                {data.district || 'Tamil Nadu Central'}
              </span>
            </div>
          </div>

          {/* Tabular Tracking Grid in Dark Mode */}
          <div className="overflow-x-auto bg-slate-950/50 rounded-xl border border-slate-800 shadow-xs">
            <table className="w-full text-left text-xs font-mono-code">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-bold">
                <tr>
                  <th className="py-3 px-4">Telemetry Metric</th>
                  <th className="py-3 px-4">Recorded Value</th>
                  <th className="py-3 px-4">State Benchmark</th>
                  <th className="py-3 px-4">Risk Assessment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.tabularMetrics && data.tabularMetrics.length > 0 ? (
                  data.tabularMetrics.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-2.5 px-4 font-semibold text-slate-300">{row.metric}</td>
                      <td className="py-2.5 px-4 text-amber-300 font-bold">{row.value}</td>
                      <td className="py-2.5 px-4 text-slate-400 font-medium">{row.benchmark}</td>
                      <td className="py-2.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                          row.riskLevel.toLowerCase().includes('high') || row.riskLevel.toLowerCase().includes('critical') || row.riskLevel.toLowerCase().includes('structural')
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : row.riskLevel.toLowerCase().includes('elevated') || row.riskLevel.toLowerCase().includes('delay')
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {row.riskLevel}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr className="hover:bg-slate-900/40">
                      <td className="py-2.5 px-4 font-semibold text-slate-300">Regional Grievance Cluster Inflow</td>
                      <td className="py-2.5 px-4 text-amber-300 font-bold">47 registered / 30d</td>
                      <td className="py-2.5 px-4 text-slate-400">&lt; 15 norm</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                          Critical Inflow
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="py-2.5 px-4 font-semibold text-slate-300">Mean Time to Remediation (MTTR)</td>
                      <td className="py-2.5 px-4 text-amber-300 font-bold">6.2 Days</td>
                      <td className="py-2.5 px-4 text-slate-400">3.0 Days</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                          Delayed SLA
                        </span>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
