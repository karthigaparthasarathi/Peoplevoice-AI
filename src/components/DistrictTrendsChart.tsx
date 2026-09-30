import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine 
} from 'recharts';
import { 
  generateDistrict12MonthTrends, 
  MonthlyTrendData 
} from '../data/districtTrends';
import { 
  TrendingUp, 
  Calendar, 
  Filter, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart2, 
  ArrowUpRight,
  Layers
} from 'lucide-react';

interface DistrictTrendsChartProps {
  district: string;
  category?: string;
}

export const DistrictTrendsChart: React.FC<DistrictTrendsChartProps> = ({
  district,
  category,
}) => {
  const [viewMode, setViewMode] = useState<'overview' | 'sectors' | 'sla'>('overview');

  // Memoize 12-month data for selected district
  const data: MonthlyTrendData[] = useMemo(() => {
    return generateDistrict12MonthTrends(district);
  }, [district]);

  // Aggregate statistics for 12 months
  const totalVolume12m = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.totalGrievances, 0);
  }, [data]);

  const totalResolved12m = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.resolved, 0);
  }, [data]);

  const avgResolutionRate = useMemo(() => {
    return Math.round((totalResolved12m / (totalVolume12m || 1)) * 100);
  }, [totalVolume12m, totalResolved12m]);

  const peakMonth = useMemo(() => {
    return [...data].sort((a, b) => b.totalGrievances - a.totalGrievances)[0];
  }, [data]);

  // Dark Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const pointData: MonthlyTrendData = payload[0].payload;
      return (
        <div className="p-3.5 rounded-xl shadow-2xl border border-slate-800 bg-slate-950 text-slate-100 text-xs font-mono-code z-50 min-w-[220px]">
          <div className="flex items-center justify-between border-b pb-2 mb-2 border-slate-800">
            <span className="font-bold text-sm text-white">{pointData.fullMonth}</span>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
              {pointData.resolutionRate}% Resolved
            </span>
          </div>

          <div className="space-y-1 mb-2 font-sans text-xs">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 font-medium" style={{ color: entry.color }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                  {entry.name}:
                </span>
                <span className="font-bold font-mono-code text-white">{entry.value}</span>
              </div>
            ))}
          </div>

          {pointData.seasonalNote && (
            <div className="pt-2 border-t border-slate-800 text-[10px] text-amber-300/80 font-sans italic">
              📌 {pointData.seasonalNote}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-xl text-slate-100">
      {/* Header Bar (Theme selector removed) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 mb-5 border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
              12-Month Grievance Volume Telemetry & Trend Analysis
            </h4>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono-code font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {district} District
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Historical monthly intake, resolution velocity, and seasonal cluster patterns (Oct 2025 – Sep 2026)
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono-code">
          <button
            onClick={() => setViewMode('overview')}
            className={`px-3 py-1 rounded-lg transition-colors font-medium ${
              viewMode === 'overview'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview Trend
          </button>
          <button
            onClick={() => setViewMode('sectors')}
            className={`px-3 py-1 rounded-lg transition-colors font-medium ${
              viewMode === 'sectors'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sector Breakdown
          </button>
          <button
            onClick={() => setViewMode('sla')}
            className={`px-3 py-1 rounded-lg transition-colors font-medium ${
              viewMode === 'sla'
                ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Resolution %
          </button>
        </div>
      </div>

      {/* 4 Quick 12-Month Metric Tiles in Dark Theme */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 font-mono-code">
        <div className="bg-slate-950/80 border border-slate-800/90 p-3 rounded-xl shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">12-Month Intake Total</span>
          <span className="text-lg font-bold text-white">{totalVolume12m} Cases</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Average: {Math.round(totalVolume12m / 12)}/mo</span>
        </div>
        <div className="bg-slate-950/80 border border-slate-800/90 p-3 rounded-xl shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Resolved Cases</span>
          <span className="text-lg font-bold text-emerald-400">{totalResolved12m} Cases</span>
          <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">{avgResolutionRate}% Redressed</span>
        </div>
        <div className="bg-slate-950/80 border border-slate-800/90 p-3 rounded-xl shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Peak Cluster Anomaly</span>
          <span className="text-lg font-bold text-rose-400">{peakMonth.month}</span>
          <span className="text-[10px] text-rose-400/80 font-medium block mt-0.5">{peakMonth.totalGrievances} cases (Monsoon)</span>
        </div>
        <div className="bg-slate-950/80 border border-slate-800/90 p-3 rounded-xl shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">12-Month Net Trend</span>
          <span className="text-lg font-bold text-teal-400">-14.2%</span>
          <span className="text-[10px] text-teal-400 font-medium block mt-0.5">CapEx Reform Impact</span>
        </div>
      </div>

      {/* Main Recharts Line Chart Container in Dark Theme */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#1e293b" 
              vertical={false} 
            />
            <XAxis 
              dataKey="month" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              dy={6}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false}
              domain={viewMode === 'sla' ? [50, 100] : ['auto', 'auto']}
              unit={viewMode === 'sla' ? '%' : ''}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '12px', fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8' }} 
            />

            {/* Dynamic Lines based on View Mode */}
            {viewMode === 'overview' && (
              <>
                <Line
                  type="monotone"
                  dataKey="totalGrievances"
                  name="Total Grievance Inflow"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#0f172a' }}
                  activeDot={{ r: 6, stroke: '#38bdf8', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  name="Resolved Cases"
                  stroke="#34d399"
                  strokeWidth={2.5}
                  strokeDasharray="4 2"
                  dot={{ r: 3, fill: '#34d399' }}
                />
                <Line
                  type="monotone"
                  dataKey="backlog"
                  name="Unresolved / Backlog"
                  stroke="#fb7185"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </>
            )}

            {viewMode === 'sectors' && (
              <>
                <Line
                  type="monotone"
                  dataKey="water"
                  name="Water & Sanitation"
                  stroke="#60a5fa"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="roads"
                  name="Roads & Bridges"
                  stroke="#fb923c"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="electricity"
                  name="Electricity & Power"
                  stroke="#fbbf24"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="healthcare"
                  name="Healthcare (PHC)"
                  stroke="#f472b6"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={{ r: 2 }}
                />
              </>
            )}

            {viewMode === 'sla' && (
              <>
                <ReferenceLine 
                  y={85} 
                  stroke="#34d399" 
                  strokeDasharray="3 3" 
                  label={{ value: 'Target SLA (85%)', fill: '#34d399', fontSize: 10, position: 'top' }} 
                />
                <Line
                  type="monotone"
                  dataKey="resolutionRate"
                  name="SLA Resolution Compliance (%)"
                  stroke="#34d399"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#34d399' }}
                  activeDot={{ r: 6 }}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Analytical Footnote */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code text-slate-400">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span>Seasonal Anomaly: Winter monsoon months (Nov-Dec) generate 42% higher road & drainage grievances in {district}.</span>
        </div>
        <span className="text-[11px] text-slate-500">Data Source: TN CM Helpline & Geospatial Telemetry</span>
      </div>
    </div>
  );
};
