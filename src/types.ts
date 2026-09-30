export type GrievanceCategory = 'Roads' | 'Water' | 'Electricity' | 'Healthcare' | 'Education' | 'Other';
export type PriorityLevel = 'High' | 'Medium' | 'Low';
export type HotspotSeverity = 'Critical' | 'Severe' | 'Moderate' | 'Watchlist';

export interface TabularMetric {
  metric: string;
  value: string;
  benchmark: string;
  riskLevel: string;
}

export interface Page1Analysis {
  category: GrievanceCategory | string;
  priorityLevel: PriorityLevel;
  impactAssessment: string;
  suggestedGovernmentAction: string;
  oneLineSummary: string;
  department?: string;
  slaResponseDays?: number;
  affectedDemographics?: string;
}

export interface Page2Hotspot {
  state: string;
  district: string;
  category: GrievanceCategory | string;
  statusNote: string;
  clusterCount?: number;
  recurrenceRate?: string;
  hotspotSeverity?: HotspotSeverity;
  vulnerabilityIndex?: number;
  tabularMetrics?: TabularMetric[];
}

export interface Page3Policy {
  topIssuesIdentified: string;
  affectedRegions: string;
  policyRecommendations: string[];
  preventativeFramework?: string;
  estimatedBudgetCapEx?: string;
}

export interface DevelopmentReport {
  id: string;
  timestamp: string;
  citizenInput: string;
  additionalContext?: string;
  page1: Page1Analysis;
  page2: Page2Hotspot;
  page3: Page3Policy;
  source?: string;
}

export interface DistrictMetric {
  id: string;
  name: string;
  zone: 'Northern' | 'Western' | 'Central' | 'Southern' | 'Delta';
  activeGrievances: number;
  topCategory: GrievanceCategory;
  hotspotSeverity: HotspotSeverity;
  vulnerabilityScore: number; // 0-100
  resolvedRate: number; // percentage
  coordinates: { x: number; y: number }; // Relative SVG positions
}

export interface GrievancePreset {
  id: string;
  title: string;
  category: GrievanceCategory;
  state: string;
  district: string;
  urgency: PriorityLevel;
  snippet: string;
  fullText: string;
  context: string;
}
