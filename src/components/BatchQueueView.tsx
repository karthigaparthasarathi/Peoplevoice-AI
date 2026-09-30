import React from 'react';
import { GrievancePreset } from '../types';
import { TN_PRESETS } from '../data/presets';
import { 
  Layers, 
  Clock, 
  MapPin, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles,
  Search
} from 'lucide-react';

interface BatchQueueProps {
  onSelectGrievance: (preset: GrievancePreset) => void;
  activeId?: string;
}

export const BatchQueueView: React.FC<BatchQueueProps> = ({
  onSelectGrievance,
  activeId,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-slate-100">
      {/* Header bar in Dark Cyan */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono-code uppercase tracking-wider text-cyan-400 font-bold">
            Real-time Citizen Voice Pipeline
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            Tamil Nadu Citizen Grievance Intake Stream
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono-code text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Live Ingestion: 6 Active Pipeline Cases</span>
        </div>
      </div>

      <div className="p-6">
        <p className="text-xs text-slate-400 mb-4 font-mono-code">
          Select any citizen grievance from the intake stream to process into the 3-page official development report:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TN_PRESETS.map((item, idx) => {
            const isCurrent = activeId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onSelectGrievance(item)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between shadow-xs ${
                  isCurrent
                    ? 'bg-cyan-950/20 border-cyan-500/60 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/40'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-amber-300">
                      Case #{idx + 1042}
                    </span>
                    <span className={`text-[10px] font-mono-code font-bold uppercase px-2 py-0.5 rounded-md border ${
                      item.urgency === 'High' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                      item.urgency === 'Medium' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {item.urgency} Priority
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 mb-1">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono-code mb-2">
                    <span className="text-emerald-400 font-bold">{item.district}</span>
                    <span>•</span>
                    <span className="text-amber-400 font-semibold">{item.category}</span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3 font-sans">
                    "{item.snippet}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono-code text-cyan-400 font-bold">
                  <span>Process 3-Page Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
