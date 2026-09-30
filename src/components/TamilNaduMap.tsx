import React, { useState } from 'react';
import { DistrictMetric, GrievanceCategory } from '../types';
import { TN_DISTRICT_METRICS } from '../data/presets';
import { 
  MapPin, 
  Layers, 
  Activity, 
  AlertTriangle, 
  Filter, 
  ArrowUpRight,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';

interface TamilNaduMapProps {
  selectedDistrict: string;
  onSelectDistrict: (districtName: string) => void;
  highlightCategory?: string;
}

export const TamilNaduMap: React.FC<TamilNaduMapProps> = ({
  selectedDistrict,
  onSelectDistrict,
  highlightCategory,
}) => {
  const [zoneFilter, setZoneFilter] = useState<string>('All');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  const filteredDistricts = TN_DISTRICT_METRICS.filter(d => {
    if (zoneFilter !== 'All' && d.zone !== zoneFilter) return false;
    if (activeCategoryFilter !== 'All' && d.topCategory !== activeCategoryFilter) return false;
    return true;
  });

  const selectedData = TN_DISTRICT_METRICS.find(
    d => d.name.toLowerCase() === (selectedDistrict || '').toLowerCase()
  ) || TN_DISTRICT_METRICS[0];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return '#f43f5e'; // rose-500
      case 'severe':
        return '#f97316'; // orange-500
      case 'moderate':
        return '#eab308'; // yellow-500
      default:
        return '#3b82f6'; // blue-500
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-slate-100">
      {/* Title & Filter Bar in Dark Palette */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono-code uppercase tracking-wider text-emerald-400 font-bold">
            Geospatial Telemetry Hub
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Tamil Nadu District Grievance Hotspots
          </h3>
        </div>

        {/* Zone Selector */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-mono-code text-[11px] font-medium">Zone:</span>
          {['All', 'Northern', 'Western', 'Central', 'Delta', 'Southern'].map((zone) => (
            <button
              key={zone}
              onClick={() => setZoneFilter(zone)}
              className={`px-2.5 py-1 rounded-lg font-mono-code transition-colors ${
                zoneFilter === zone
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-xs'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* Interactive District Map Visualization (SVG in Dark Mode) */}
        <div className="lg:col-span-7 bg-slate-950/80 rounded-2xl border border-slate-800/90 p-4 flex flex-col items-center relative overflow-hidden shadow-inner">
          {/* Legend */}
          <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2 font-mono-code">
            <span className="text-slate-300 font-bold">Tamil Nadu State Boundary Grid</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                Critical
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span>
                Severe
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                Moderate
              </span>
            </div>
          </div>

          {/* SVG Map Container */}
          <div className="w-full relative aspect-[4/5] max-w-[420px] flex items-center justify-center py-2">
            <svg
              viewBox="0 0 420 500"
              className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
            >
              <defs>
                <linearGradient id="tnGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="50%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f2b26" />
                </linearGradient>
              </defs>

              {/* State Silhouette */}
              <path
                d="M 230 40 
                   Q 330 35, 360 65 
                   Q 380 90, 360 120 
                   Q 320 150, 310 180 
                   Q 300 230, 270 260 
                   Q 280 320, 260 360 
                   Q 230 400, 180 430 
                   Q 150 470, 140 460 
                   Q 130 430, 140 390 
                   Q 110 350, 80 300 
                   Q 70 230, 70 190 
                   Q 60 160, 100 130 
                   Q 150 110, 190 70 
                   Z"
                fill="url(#tnGradient)"
                stroke="#334155"
                strokeWidth="2"
                strokeDasharray="4 2"
                className="opacity-75"
              />

              {/* Bay of Bengal & Arabian Sea subtle indicator labels */}
              <text x="310" y="320" fill="#475569" fontSize="10" fontFamily="sans-serif" letterSpacing="2" fontWeight="600">
                BAY OF BENGAL
              </text>
              <text x="30" y="440" fill="#475569" fontSize="10" fontFamily="sans-serif" letterSpacing="1" fontWeight="600">
                INDIAN OCEAN
              </text>

              {/* Render clickable district nodes */}
              {TN_DISTRICT_METRICS.map((district) => {
                const isSelected = selectedDistrict?.toLowerCase() === district.name.toLowerCase();
                const isFiltered = filteredDistricts.some(d => d.id === district.id);
                const color = getSeverityColor(district.hotspotSeverity);

                return (
                  <g
                    key={district.id}
                    onClick={() => onSelectDistrict(district.name)}
                    className="cursor-pointer transition-all duration-300 group"
                    style={{ opacity: isFiltered ? 1 : 0.2 }}
                  >
                    {/* Pulsing ring for critical or selected */}
                    {(isSelected || district.hotspotSeverity === 'Critical') && (
                      <circle
                        cx={district.coordinates.x}
                        cy={district.coordinates.y}
                        r={isSelected ? 18 : 12}
                        fill="none"
                        stroke={color}
                        strokeWidth="1.5"
                        className="animate-ping opacity-40"
                      />
                    )}

                    {/* Main Node */}
                    <circle
                      cx={district.coordinates.x}
                      cy={district.coordinates.y}
                      r={isSelected ? 10 : 7}
                      fill={color}
                      stroke="#0f172a"
                      strokeWidth={isSelected ? 3 : 2}
                      className="group-hover:scale-125 transition-transform"
                    />

                    {/* District Name Label */}
                    <text
                      x={district.coordinates.x + 10}
                      y={district.coordinates.y + 4}
                      fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                      fontSize={isSelected ? '12' : '10'}
                      fontWeight={isSelected ? '700' : '500'}
                      className="select-none pointer-events-none drop-shadow"
                    >
                      {district.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="w-full text-center text-xs text-slate-400 font-mono-code pt-2 border-t border-slate-800/80">
            Click any district node to inspect regional grievance telemetry and vulnerability score.
          </div>
        </div>

        {/* Selected District Deep-Dive Panel in Dark Mode */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-[11px] font-mono-code text-slate-400 uppercase font-semibold">
                  {selectedData.zone} Development Zone
                </span>
                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  {selectedData.name} District
                </h4>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono-code uppercase border ${
                selectedData.hotspotSeverity === 'Critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                selectedData.hotspotSeverity === 'Severe' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' :
                'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {selectedData.hotspotSeverity} Hotspot
              </span>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block uppercase font-mono-code font-semibold">Active Inflow</span>
                <span className="text-xl font-bold text-white font-mono-code">
                  {selectedData.activeGrievances} Cases
                </span>
                <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                  Resolution: {selectedData.resolvedRate}%
                </span>
              </div>
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block uppercase font-mono-code font-semibold">Dominant Sector</span>
                <span className="text-xl font-bold text-amber-300 font-mono-code">
                  {selectedData.topCategory}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  District Lead Agency
                </span>
              </div>
            </div>

            {/* Regional Vulnerability Progress */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs font-mono-code">
                <span className="text-slate-400 font-medium">Vulnerability Severity Index:</span>
                <span className="font-bold text-rose-400">{selectedData.vulnerabilityScore}/100</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 h-full rounded-full"
                  style={{ width: `${selectedData.vulnerabilityScore}%` }}
                />
              </div>
            </div>

            {/* Action Directives for this District */}
            <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-3.5 text-xs text-slate-300 font-sans">
              <span className="font-bold text-emerald-300 block mb-1 font-mono-code">
                District Collectorate Directive:
              </span>
              Priority mobilization for {selectedData.topCategory} field inspections across {selectedData.name}. Bi-weekly review mandated under District Disaster & Civic Resilience Committee.
            </div>
          </div>

          {/* Quick Filter Buttons by Category */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xs">
            <span className="text-xs font-bold text-slate-400 block mb-2 font-mono-code uppercase">
              Filter Statewide Hotspots by Sector:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Roads', 'Water', 'Electricity', 'Healthcare', 'Education'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono-code transition-colors ${
                    activeCategoryFilter === cat
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-xs'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
