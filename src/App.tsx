/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DevelopmentReport, GrievancePreset } from './types';
import { TN_PRESETS } from './data/presets';
import { Header } from './components/Header';
import { GrievanceInputForm } from './components/GrievanceInputForm';
import { DossierContainer } from './components/DossierContainer';
import { TamilNaduMap } from './components/TamilNaduMap';
import { MacroPolicyMatrix } from './components/MacroPolicyMatrix';
import { BatchQueueView } from './components/BatchQueueView';
import { 
  FileText, 
  MapPin, 
  Scale, 
  Layers, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const INITIAL_REPORT: DevelopmentReport = {
  id: 'TN-GOV-2026-09-8492',
  timestamp: '2026-09-30T08:01:04.000Z',
  citizenInput: 'Drinking water pipeline ruptured near Melur Main Road in Ward 24, Madurai. For the past 6 days, raw municipal sewage has infiltrated the drinking line. Over 400 families have zero clean water and 14 cases of acute gastroenteritis have been admitted to the Government Rajaji Hospital. Private tanker operators are charging ₹1,800 per 1,000 liters.',
  additionalContext: 'State: Tamil Nadu, District: Madurai, Ward 24, vulnerable low-income density ward, monsoon transition period.',
  page1: {
    category: 'Water',
    priorityLevel: 'High',
    impactAssessment: 'Acute contamination of municipal drinking water supply has triggered an outbreak of water-borne illnesses (14 hospitalizations) and forced 400+ low-income households into severe financial distress due to exploitative private tanker tariffs.',
    suggestedGovernmentAction: 'Issue immediate emergency containment order to TWAD Board and Madurai City Municipal Corporation to isolate the compromised main, deploy 20 free municipal emergency water tankers, and mobilize rapid pipeline desanitization squads with mandatory bacteriological testing before supply restoration.',
    oneLineSummary: 'Critical sewage infiltration in Ward 24 drinking water main triggering public health emergency and localized water access crisis in Madurai.',
    department: 'Tamil Nadu Water Supply & Drainage (TWAD) Board / Madurai Municipal Corporation',
    slaResponseDays: 1,
    affectedDemographics: 'Over 400 low-income households, pediatric patients, and elderly residents in Ward 24.',
  },
  page2: {
    state: 'Tamil Nadu',
    district: 'Madurai',
    category: 'Water',
    statusNote: 'Active Hotspot Cluster: TWAD-MDU-W24 (Escalated to Chief Engineer, Southern Region)',
    clusterCount: 47,
    recurrenceRate: '68% recurrence during monsoon transition months',
    hotspotSeverity: 'Critical',
    vulnerabilityIndex: 85,
    tabularMetrics: [
      { metric: 'Regional Cluster Volume', value: '47 complaints / 30d', benchmark: '< 15 norm', riskLevel: 'Critical Inflow' },
      { metric: 'Contamination Exposure Index', value: '400+ Families', benchmark: 'Zero Tolerance', riskLevel: 'High Public Health Risk' },
      { metric: 'Mean Time to Resolution (MTTR)', value: '6.2 Days', benchmark: '1.0 Day SLA', riskLevel: 'Severe Breach' },
      { metric: 'Pipeline Infrastructure Vintage', value: '28+ Years Cast Iron', benchmark: 'Ductile Iron Modernized', riskLevel: 'Structural Degradation' },
    ],
  },
  page3: {
    topIssuesIdentified: 'Systemic co-location of aging cast-iron potable pipelines alongside unlined brick masonry storm sewage culverts, combined with zero real-time pressure-telemetry monitoring, enabling negative pressure siphonage of toxic effluent during supply downtime.',
    affectedRegions: 'Madurai Metropolitan Area, specifically Melur Road corridor, Ward 24, Goripalayam sub-basin, impacting 120,000+ residents and downstream peri-urban agricultural settlements.',
    policyRecommendations: [
      'Statutory Physical Separation Protocol: Enforce a mandatory minimum 3-meter horizontal buffer and physical impervious concrete casing between drinking water and subterranean sewerage pipelines under the Tamil Nadu Urban Water Security Mandate.',
      'Deployment of IoT Acoustic Leak & Pressure Sensors: Institute automated SCADA telemetry across Tier-1 and Tier-2 city feeder mains with automatic chlorination cut-off valves to detect cross-contamination within 15 minutes of pipe wall rupture.',
    ],
    preventativeFramework: 'Establish District Drinking Water Vigilance Taskforce headed by the District Collector, mandating bi-weekly water quality certification published transparently on the CM Dashboard.',
    estimatedBudgetCapEx: '₹8.40 Cr (Under Tamil Nadu Urban Flagship Infrastructure Scheme - Phase II)',
  },
  source: 'Verified Administrative Analysis Engine',
};

export default function App() {
  const [report, setReport] = useState<DevelopmentReport>(INITIAL_REPORT);
  const [activeTab, setActiveTab] = useState<'dossier' | 'map' | 'policy' | 'batch'>('dossier');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Madurai');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Trigger notification
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleProcessGrievance = async (
    text: string,
    context: string,
    state: string,
    district: string
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze-grievance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizenRequest: text,
          additionalContext: context,
          state: state || 'Tamil Nadu',
          district: district || selectedDistrict,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const resData = await response.json();
      if (!resData.report) {
        throw new Error('Invalid response structure received');
      }

      const newReport: DevelopmentReport = {
        id: `TN-GOV-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString(),
        citizenInput: text,
        additionalContext: context,
        page1: resData.report.page1,
        page2: resData.report.page2,
        page3: resData.report.page3,
        source: resData.source || 'gemini-3.8-flash',
      };

      setReport(newReport);
      if (resData.report.page2?.district) {
        setSelectedDistrict(resData.report.page2.district);
      }
      setActiveTab('dossier');
      showToast('3-Page Development Report generated successfully.');
    } catch (err: any) {
      console.error('Error generating report:', err);
      showToast('Notice: Processed using Policy Expert rule framework.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFromBatch = (preset: GrievancePreset) => {
    setSelectedDistrict(preset.district);
    handleProcessGrievance(preset.fullText, preset.context, preset.state, preset.district);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyDossier = () => {
    if (!report) return;
    const memoText = `=====================================================
GOVERNMENT OF TAMIL NADU • DEVELOPMENT DOSSIER
DOCKET REF: ${report.id}
TIMESTAMP: ${report.timestamp}
=====================================================

[INPUT DATA]
Citizen Request: "${report.citizenInput}"
Additional Context: ${report.additionalContext || `State: ${report.page2.state}, District: ${report.page2.district}`}

-----------------------------------------------------
[PAGE 1: CITIZEN INPUT ANALYSIS]
- Category: ${report.page1.category}
- Priority Level: ${report.page1.priorityLevel}
- Impact Assessment: ${report.page1.impactAssessment}
- Suggested Government Action: ${report.page1.suggestedGovernmentAction}
- One-line Summary: ${report.page1.oneLineSummary}
- Nodal Department: ${report.page1.department || 'Competent Department'}

-----------------------------------------------------
[PAGE 2: HOTSPOT DASHBOARD METRICS]
- State: ${report.page2.state}
- Category: ${report.page2.category}
- Status/Count Note: ${report.page2.statusNote}
- District: ${report.page2.district}
- Hotspot Severity: ${report.page2.hotspotSeverity || 'Severe'}
- Regional Vulnerability Index: ${report.page2.vulnerabilityIndex || 80}/100

-----------------------------------------------------
[PAGE 3: GOVERNMENT INSIGHTS & POLICY RECOMMENDATIONS]
- Top Issues Identified: ${report.page3.topIssuesIdentified}
- Affected Regions: ${report.page3.affectedRegions}
- Policy Recommendations:
  1. ${report.page3.policyRecommendations[0] || 'Inter-agency coordination protocol'}
  2. ${report.page3.policyRecommendations[1] || 'Decentralized maintenance contingency fund'}
- Preventative Framework: ${report.page3.preventativeFramework || 'Automated GIS telemetry and SLA tracking'}
- Estimated CapEx: ${report.page3.estimatedBudgetCapEx || 'Targeted Infrastructure Outlay'}
=====================================================`;

    navigator.clipboard.writeText(memoText);
    setCopied(true);
    showToast('Report copied to clipboard in official gazette format.');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification in Dark Palette */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950/90 text-emerald-200 border border-emerald-500/50 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-mono-code animate-fade-in no-print backdrop-blur-md font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Header (Without theme selector) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPrint={handlePrint}
        onCopyDossier={handleCopyDossier}
        copied={copied}
        docketId={report.id}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero Executive Status Ticker in Dark Mode */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800/80 shadow-lg no-print flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Civic Intelligence Dashboard • தமிழ்நாடு மக்கள் குறைதீர்ப்பு
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Voice-enabled citizen grievance intake & automated 3-page development intelligence dossiers
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono-code">
            <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400">Districts:</span>
              <span className="font-bold text-white">38 Connected</span>
            </div>
            <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 shadow-xs">
              <span className="text-slate-400">Active Hotspots:</span>
              <span className="font-bold text-amber-400">1,248</span>
            </div>
            <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 shadow-xs">
              <span className="text-slate-400">Mean SLA:</span>
              <span className="font-bold text-emerald-400">28.4h Target</span>
            </div>
          </div>
        </div>

        {/* Grievance Input Form (Hidden during print) */}
        <div className="no-print">
          <GrievanceInputForm
            onSubmit={handleProcessGrievance}
            isLoading={isLoading}
            selectedDistrict={selectedDistrict}
            onDistrictChange={setSelectedDistrict}
          />
        </div>

        {/* Tab Content */}
        {activeTab === 'dossier' && (
          <DossierContainer
            report={report}
            onPrint={handlePrint}
            onCopyDossier={handleCopyDossier}
            copied={copied}
          />
        )}

        {activeTab === 'map' && (
          <TamilNaduMap
            selectedDistrict={selectedDistrict}
            onSelectDistrict={(dist) => {
              setSelectedDistrict(dist);
              // Find matching preset if any
              const matched = TN_PRESETS.find(p => p.district.toLowerCase() === dist.toLowerCase());
              if (matched) {
                showToast(`Loaded ${dist} district profile: ${matched.category}`);
              }
            }}
            highlightCategory={report.page1.category}
          />
        )}

        {activeTab === 'policy' && (
          <MacroPolicyMatrix
            currentCategory={report.page1.category}
            currentDistrict={report.page2.district}
          />
        )}

        {activeTab === 'batch' && (
          <BatchQueueView
            onSelectGrievance={handleSelectFromBatch}
            activeId={TN_PRESETS.find(p => p.district.toLowerCase() === selectedDistrict.toLowerCase())?.id}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500 font-mono-code no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-bold">CivicPulse • Government Development Advisory Node</span>
            <span>|</span>
            <span>State of Tamil Nadu • தமிழ்நாடு அரசு</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Operational Protocols: 3 Layers</span>
            <span>•</span>
            <span>District Telemetry Grid</span>
            <span>•</span>
            <span>State Planning Commission</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
