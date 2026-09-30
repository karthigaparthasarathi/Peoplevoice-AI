export interface MonthlyTrendData {
  month: string;
  fullMonth: string;
  totalGrievances: number;
  resolved: number;
  backlog: number;
  water: number;
  roads: number;
  electricity: number;
  healthcare: number;
  education: number;
  resolutionRate: number; // percentage
  seasonalNote?: string;
}

export interface ChartThemeConfig {
  id: string;
  name: string;
  badge: string;
  totalLineColor: string;
  resolvedLineColor: string;
  backlogLineColor: string;
  waterColor: string;
  roadsColor: string;
  electricityColor: string;
  gridColor: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
  cardBg: string;
  cardBorder: string;
}

export const CHART_THEMES: Record<string, ChartThemeConfig> = {
  pastel: {
    id: 'pastel',
    name: 'Pastel Mint & Peach',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    totalLineColor: '#0d9488', // teal-600
    resolvedLineColor: '#10b981', // emerald-500
    backlogLineColor: '#f43f5e', // rose-500
    waterColor: '#0284c7', // sky-600
    roadsColor: '#f97316', // orange-500
    electricityColor: '#eab308', // yellow-500
    gridColor: '#e2e8f0',
    tooltipBg: '#ffffff',
    tooltipBorder: '#cbd5e1',
    tooltipText: '#1e293b',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200',
  },
  navy: {
    id: 'navy',
    name: 'Executive Navy & Gold',
    badge: 'bg-slate-900 text-amber-300 border-amber-600/40',
    totalLineColor: '#38bdf8', // sky-400
    resolvedLineColor: '#34d399', // emerald-400
    backlogLineColor: '#fb7185', // rose-400
    waterColor: '#60a5fa', // blue-400
    roadsColor: '#fb923c', // orange-400
    electricityColor: '#fbbf24', // amber-400
    gridColor: '#334155',
    tooltipBg: '#0f172a',
    tooltipBorder: '#334155',
    tooltipText: '#f8fafc',
    cardBg: 'bg-slate-900 text-white',
    cardBorder: 'border-slate-800',
  },
  terracotta: {
    id: 'terracotta',
    name: 'Heritage Terracotta & Earth',
    badge: 'bg-amber-100 text-amber-900 border-amber-300',
    totalLineColor: '#c2410c', // orange-700
    resolvedLineColor: '#059669', // emerald-600
    backlogLineColor: '#be123c', // rose-700
    waterColor: '#0369a1', // sky-700
    roadsColor: '#b45309', // amber-700
    electricityColor: '#d97706', // amber-600
    gridColor: '#fed7aa',
    tooltipBg: '#fff7ed',
    tooltipBorder: '#fdba74',
    tooltipText: '#431407',
    cardBg: 'bg-orange-50/50',
    cardBorder: 'border-orange-200',
  },
  sage: {
    id: 'sage',
    name: 'Nordic Forest Sage',
    badge: 'bg-stone-100 text-stone-800 border-stone-300',
    totalLineColor: '#4d7c0f', // lime-700
    resolvedLineColor: '#15803d', // green-700
    backlogLineColor: '#e11d48', // rose-600
    waterColor: '#0f766e', // teal-700
    roadsColor: '#c2410c', // orange-700
    electricityColor: '#a16207', // yellow-700
    gridColor: '#e7e5e4',
    tooltipBg: '#fafaf9',
    tooltipBorder: '#d6d3d1',
    tooltipText: '#1c1917',
    cardBg: 'bg-stone-50/60',
    cardBorder: 'border-stone-200',
  },
};

// Generate realistic 12-month data based on district climate & infrastructure patterns
export function generateDistrict12MonthTrends(districtName: string): MonthlyTrendData[] {
  const dName = (districtName || 'Madurai').toLowerCase();

  // Baseline seasonal factors in Tamil Nadu:
  // Oct - Dec: NE Monsoon (Peak rain, Road cave-ins, Drainage inundation, Water line infiltration)
  // Jan - Feb: Post-monsoon settling, road rehabilitation
  // Mar - May: Summer heat (Power transformer overloads, Borewell drying, Water deficit)
  // Jun - Sep: SW monsoon fringe, pre-monsoon utility trenching

  const months = [
    { short: 'Oct 25', full: 'October 2025', season: 'NE Monsoon Onset: Road & Drainage Infiltration' },
    { short: 'Nov 25', full: 'November 2025', season: 'Peak Monsoon: Severe Pothole & Waterlogging Inflow' },
    { short: 'Dec 25', full: 'December 2025', season: 'Cyclonic Transition: High Emergency Containment' },
    { short: 'Jan 26', full: 'January 2026', season: 'Post-Monsoon Road Reconstruction Push' },
    { short: 'Feb 26', full: 'February 2026', season: 'Stable Weather: Standard SLA Redressal' },
    { short: 'Mar 26', full: 'March 2026', season: 'Pre-Summer: Voltage Fluctuation Onset' },
    { short: 'Apr 26', full: 'April 2026', season: 'Peak Summer: Ground Water Deficit Surge' },
    { short: 'May 26', full: 'May 2026', season: 'Extreme Heat: Transformer Tripping Incidents' },
    { short: 'Jun 26', full: 'June 2026', season: 'School Reopening: Classroom & Transport Requests' },
    { short: 'Jul 26', full: 'July 2026', season: 'Pre-Monsoon Desilting & Utility Trenching' },
    { short: 'Aug 26', full: 'August 2026', season: 'Public Health Vector & Fever Surge' },
    { short: 'Sep 26', full: 'September 2026', season: 'Current Cycle: Targeted CapEx Commissioning' },
  ];

  // Specific district multipliers
  let baseVolume = 85;
  if (dName.includes('chennai')) baseVolume = 145;
  else if (dName.includes('coimbatore')) baseVolume = 110;
  else if (dName.includes('madurai')) baseVolume = 100;
  else if (dName.includes('salem')) baseVolume = 75;
  else if (dName.includes('tiruchirappalli') || dName.includes('trichy')) baseVolume = 80;
  else if (dName.includes('nilgiris')) baseVolume = 55;

  return months.map((m, idx) => {
    let seasonalMultiplier = 1.0;
    let waterShare = 0.28;
    let roadsShare = 0.26;
    let powerShare = 0.22;
    let healthShare = 0.14;
    let eduShare = 0.10;

    // Seasonal weighting
    if (idx === 0 || idx === 1 || idx === 2) {
      // Monsoon months
      seasonalMultiplier = 1.45;
      roadsShare = 0.40;
      waterShare = 0.32;
      powerShare = 0.14;
    } else if (idx === 6 || idx === 7) {
      // Peak summer
      seasonalMultiplier = 1.30;
      waterShare = 0.42;
      powerShare = 0.35;
      roadsShare = 0.11;
    } else if (idx === 8) {
      // School reopening
      eduShare = 0.24;
      roadsShare = 0.26;
    } else if (idx === 10) {
      // Monsoon transition / dengue season
      healthShare = 0.26;
    }

    const total = Math.round(baseVolume * seasonalMultiplier + (idx % 3) * 4 - (idx > 8 ? 8 : 0));
    // Resolution improves over 12 months as policy reforms kick in
    const resolutionPct = Math.min(94, Math.round(72 + idx * 1.8 + ((idx * 3) % 4)));
    const resolved = Math.round((total * resolutionPct) / 100);
    const backlog = Math.max(0, total - resolved);

    return {
      month: m.short,
      fullMonth: m.full,
      totalGrievances: total,
      resolved,
      backlog,
      water: Math.round(total * waterShare),
      roads: Math.round(total * roadsShare),
      electricity: Math.round(total * powerShare),
      healthcare: Math.round(total * healthShare),
      education: Math.round(total * eduShare),
      resolutionRate: resolutionPct,
      seasonalNote: m.season,
    };
  });
}
