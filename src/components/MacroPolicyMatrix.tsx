import React from 'react';
import { DistrictTrendsChart } from './DistrictTrendsChart';
import { 
  ShieldCheck, 
  Workflow, 
  Scale, 
  TrendingUp, 
  FileText, 
  Building2, 
  CheckCircle, 
  Coins, 
  Layers
} from 'lucide-react';

interface MacroPolicyProps {
  currentCategory: string;
  currentDistrict: string;
}

export const MacroPolicyMatrix: React.FC<MacroPolicyProps> = ({
  currentCategory,
  currentDistrict,
}) => {
  const policyPillars = [
    {
      title: 'Pillar I: Single-Window Sub-Surface Utility Governance',
      statute: 'Proposed: Tamil Nadu Civic Infrastructure Coordination & Excavation Warrant Act',
      description: 'Mandate all telecom, electricity (TANGEDCO), gas, and water (TWAD/CMWSSB) agencies to register multi-year digging plans on a synchronized digital GIS portal. Require pre-construction bank guarantees for road restoration.',
      leadAgency: 'Municipal Administration & Water Supply (MAWS) + Highways Dept',
      outlay: '₹120 Cr Statewide Digital GIS Platform',
      timeline: '6 Months Enactment',
    },
    {
      title: 'Pillar II: Decentralized Rapid-Response Contingency Grants',
      statute: 'Special Order: G.O. Ms. No. 44 - District Infrastructure Emergency Liquidity Fund',
      description: 'Grant District Collectors discretionary executive spending limits up to ₹50 Lakhs per incident to remediate pipeline bursts, transformer failures, and road craters within 24 hours without prolonged tendering bottlenecks.',
      leadAgency: 'Finance Department & District Collectorates',
      outlay: '₹38 Cr (₹1 Cr per District revolving buffer)',
      timeline: 'Immediate Operationalization',
    },
    {
      title: 'Pillar III: Climate-Resilient Material Standards & Audits',
      statute: 'Directive: Tamil Nadu Sustainable Pavement & Substation Specifications (TNSPSS)',
      description: 'Upgrade asphalt bitumen mixes to modified polymer grades resistant to waterlogging and heat waves. Enforce elevated plinth levels for distribution transformers to eliminate monsoon flooding outages.',
      leadAgency: 'Highways Research Station & TANGEDCO Central Engineering',
      outlay: '₹280 Cr (Integrated into annual CapEx cycle)',
      timeline: 'Phased over 18 Months',
    },
    {
      title: 'Pillar IV: Citizen Grievance Redressal SLA with Statutory Penalties',
      statute: 'Framework: Tamil Nadu Right to Civic Services & Time-Bound Redressal Bill',
      description: 'Establish binding SLA timelines (24h for High, 72h for Medium) with automatic financial compensations paid to affected citizens from the defaulting contractor or department division if breached.',
      leadAgency: 'Personnel & Administrative Reforms Department',
      outlay: 'Self-sustaining penalty escrow pool',
      timeline: 'Next Legislative Assembly Session',
    },
  ];

  const departmentMatrix = [
    { dept: 'Highways & Minor Ports', jurisdiction: 'State Highways & Arterial Corridors', sla: '24-48 Hours', auditFrequency: 'Weekly Road Safety Cell' },
    { dept: 'TWAD Board / CMWSSB', jurisdiction: 'Potable Water, Sewage & Drainage', sla: '12-24 Hours', auditFrequency: 'Daily Water Purity Telemetry' },
    { dept: 'TANGEDCO', jurisdiction: 'HT/LT Feeder Lines & Distribution Transformers', sla: '4-8 Hours', auditFrequency: 'Monthly Load & Harmonic Scans' },
    { dept: 'Health & Family Welfare', jurisdiction: 'PHC Medical Supplies, Oxygen, Antivenom', sla: 'Immediate (Zero Stockout Policy)', auditFrequency: 'Fortnightly Drug Warehouse Audits' },
    { dept: 'School Education Department', jurisdiction: 'Structural Safety & Washrooms in Govt Schools', sla: '72 Hours', auditFrequency: 'Pre-Monsoon Structural Fitness Cert' },
  ];

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner in Dark Palette */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div>
            <span className="text-xs font-mono-code uppercase tracking-wider text-indigo-400 font-bold">
              State Planning Commission Briefing
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 mt-1">
              <Scale className="w-5 h-5 text-indigo-400" />
              Strategic Macro-Policy & Legislative Reform Matrix
            </h3>
          </div>
          <div className="bg-indigo-950/40 text-indigo-300 border border-indigo-900/50 px-3 py-1.5 rounded-xl text-xs font-mono-code font-bold">
            Active Focal Region: <span className="text-amber-300">{currentDistrict || 'Tamil Nadu Statewide'}</span>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed max-w-4xl font-sans">
          Addressing systemic grievances in Tamil Nadu requires transitioning from reactionary patch-ups to statutory multi-agency coordination, guaranteed maintenance reserves, and institutional SLAs under the State Development Goals framework.
        </p>
      </div>

      {/* 12-Month Grievance Volume Telemetry Line Chart */}
      <DistrictTrendsChart 
        district={currentDistrict} 
        category={currentCategory} 
      />

      {/* 4 Strategic Macro Pillars in Dark Mode */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {policyPillars.map((pillar, idx) => (
          <div 
            key={idx}
            className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all rounded-2xl p-5 flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold font-mono-code text-indigo-300 uppercase">
                  {pillar.title}
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono-code font-semibold">
                  {pillar.timeline}
                </span>
              </div>
              <h4 className="text-sm font-bold text-amber-300 mb-2 font-mono-code">
                {pillar.statute}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4 font-sans">
                {pillar.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono-code">
              <div>
                <span className="text-slate-500 block font-medium">Lead Authority</span>
                <span className="text-slate-200 font-semibold">{pillar.leadAgency}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Fiscal Outlay</span>
                <span className="text-emerald-400 font-bold">{pillar.outlay}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inter-Departmental SLA Accountability Matrix in Dark Theme */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <Workflow className="w-4 h-4 text-emerald-400" />
          Inter-Departmental SLA & Inspection Governance Framework
        </h4>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs font-mono-code">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-bold">
              <tr>
                <th className="py-3 px-4">Department / Public Undertaking</th>
                <th className="py-3 px-4">Asset Responsibility</th>
                <th className="py-3 px-4">Statutory Redressal SLA</th>
                <th className="py-3 px-4">Preventative Audit Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
              {departmentMatrix.map((item, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-slate-200">{item.dept}</td>
                  <td className="py-2.5 px-4 text-slate-400">{item.jurisdiction}</td>
                  <td className="py-2.5 px-4 text-amber-300 font-bold">{item.sla}</td>
                  <td className="py-2.5 px-4 text-emerald-400 font-semibold">{item.auditFrequency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
