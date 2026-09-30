import React, { useState, useEffect, useRef } from 'react';
import { GrievancePreset } from '../types';
import { TN_PRESETS } from '../data/presets';
import { 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  MapPin, 
  FileText, 
  RotateCcw, 
  Check, 
  AlertCircle, 
  Clock, 
  Layers, 
  Info,
  Radio,
  Languages,
  X,
  Lightbulb,
  CornerDownLeft
} from 'lucide-react';

interface GrievanceInputFormProps {
  onSubmit: (text: string, context: string, state: string, district: string) => Promise<void>;
  isLoading: boolean;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
}

// Curated civic suggestions for common Tamil Nadu grievances
const CIVIC_SUGGESTIONS = [
  {
    label: '💧 Drinking Water Contamination',
    district: 'Madurai',
    text: 'Drinking water pipeline ruptured in Ward 24, sewage water mixing into potable domestic taps. Immediate TWAD board inspection and emergency drinking tankers requested.',
  },
  {
    label: '🚧 Road Cave-in & Pothole Hazard',
    district: 'Chennai',
    text: 'Severe 4-foot deep crater and road cave-in on Velachery Main Road near Vijay Nagar junction. Two-wheeler accidents reported, immediate asphalt patching and warning barricades required.',
  },
  {
    label: '⚡ Industrial Feeder Power Fluctuations',
    district: 'Coimbatore',
    text: 'High voltage surges dropping to 140V and spiking above 290V on 11kV Singanallur feeder. Industrial CNC lathe equipment damaged and frequent unscheduled power tripping.',
  },
  {
    label: '🏥 Rural PHC Medicine & Antivenom Shortage',
    district: 'Nilgiris',
    text: 'Primary Health Centre (PHC) at Valparai plantation belt out of anti-snake venom vials and pediatric oxygen cylinders for 3 weeks. 108 emergency ambulance out of order.',
  },
  {
    label: '🏫 Government School Ceiling Structural Risk',
    district: 'Ariyalur',
    text: 'Government Higher Secondary School classroom concrete roof plaster peeling off with exposed rebar. Non-functional girls washroom facilities requiring emergency civil renovation.',
  },
  {
    label: '🚌 Rural Feeder Bus Service Cancellation',
    district: 'Tenkasi',
    text: 'TNSTC cancelled morning Route 34A connecting 5 agricultural hamlets to the town college and vegetable market, forcing students to walk 7km along canal bunds.',
  },
];

export const GrievanceInputForm: React.FC<GrievanceInputFormProps> = ({
  onSubmit,
  isLoading,
  selectedDistrict,
  onDistrictChange,
}) => {
  const [inputText, setInputText] = useState<string>(
    'Drinking water pipeline ruptured near Melur Main Road in Ward 24, Madurai. For the past 6 days, raw municipal sewage has infiltrated the drinking line. Over 400 families have zero clean water and 14 cases of acute gastroenteritis have been admitted to the Government Rajaji Hospital. Private tanker operators are charging ₹1,800 per 1,000 liters.'
  );
  const [contextNotes, setContextNotes] = useState<string>(
    'Urban fringe, vulnerable low-income density ward, monsoon transition period.'
  );
  const [stateName, setStateName] = useState<string>('Tamil Nadu');
  const [activePresetId, setActivePresetId] = useState<string>('preset-water-madurai');

  // Web Speech API states
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechLanguage, setSpeechLanguage] = useState<'en-IN' | 'ta-IN'>('en-IN');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API in GrievanceInputForm
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Web Speech API is not supported in this browser. Please use Chrome/Edge or type your grievance.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = speechLanguage;

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechError(null);
    };

    recognition.onresult = (event: any) => {
      let finalChunk = '';
      let interimChunk = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalChunk += transcript + ' ';
        } else {
          interimChunk += transcript;
        }
      }

      if (finalChunk) {
        setInputText((prev) => (prev ? prev + ' ' + finalChunk : finalChunk).trim());
        setActivePresetId('');
      }
      setInterimTranscript(interimChunk);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition event:', event.error);
      if (event.error === 'not-allowed') {
        setSpeechError('Microphone permission denied. Please allow microphone access in your browser settings.');
        setIsListening(false);
      } else if (event.error !== 'no-speech') {
        setSpeechError(`Speech recognition: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [speechLanguage]);

  // Toggle Microphone Dictation
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      setSpeechError(null);
      setInterimTranscript('');
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = speechLanguage;
          recognitionRef.current.start();
        }
      } catch (err) {
        console.warn('Recognition start exception:', err);
      }
    }
  };

  const handlePresetSelect = (preset: GrievancePreset) => {
    setActivePresetId(preset.id);
    setInputText(preset.fullText);
    setContextNotes(preset.context);
    setStateName(preset.state);
    onDistrictChange(preset.district);
  };

  const handleSuggestionSelect = (suggestion: typeof CIVIC_SUGGESTIONS[0]) => {
    setInputText(suggestion.text);
    onDistrictChange(suggestion.district);
    setContextNotes(`State: Tamil Nadu, District: ${suggestion.district}, Sector: Priority Civic Intervention`);
    setActivePresetId('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
    onSubmit(inputText, contextNotes, stateName, selectedDistrict);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl mb-8">
      {/* Dark Header Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/40 shadow-sm">
            <FileText className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Citizen Grievance Ingestion & Voice Dictation
              <span className="text-[11px] font-mono-code font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Web Speech Live
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Speak or paste citizen concerns to generate the complete 3-page policy development report
            </p>
          </div>
        </div>

        {/* State Badge in Dark Palette */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono-code">Jurisdiction:</span>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold font-mono-code flex items-center gap-1.5 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            {stateName}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Suggestion Prompts Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 font-mono-code uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Suggested Grievance Topics (Click to Load):
            </span>
            <span className="text-[11px] text-slate-500 font-mono-code">Tamil Nadu District Scenarios</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {CIVIC_SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionSelect(item)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-950/80 hover:bg-emerald-950/50 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-600/50 transition-all text-left shadow-sm flex items-center gap-1.5"
              >
                <span>{item.label}</span>
                <span className="text-[10px] text-slate-500 font-mono-code">({item.district})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Preset Grievance Quick Scenarios (Dark Palette) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 font-mono-code uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              Real-World Administrative Presets:
            </span>
            <span className="text-[11px] text-slate-500 font-mono-code">Select scenario preset</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {TN_PRESETS.map((p) => {
              const isSelected = activePresetId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePresetSelect(p)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between shadow-sm ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500/60 text-amber-200 ring-1 ring-amber-500/40'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-amber-400">
                      {p.category}
                    </span>
                    <span className="text-[10px] font-mono-code text-slate-400 font-medium">
                      {p.district}
                    </span>
                  </div>
                  <span className="text-xs font-medium line-clamp-2 leading-snug">
                    {p.title.split(':')[1] || p.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Grievance Input Form with Integrated Web Speech Microphone Button */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            {/* Input Header with Mic Button and Language Selector */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <label htmlFor="citizen-input" className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono-code flex items-center gap-1.5">
                <span>Citizen Request: &#34;&#123;user_input&#125;&#34;</span>
              </label>

              {/* Dictation Controls */}
              <div className="flex items-center gap-2">
                {/* Language Selector */}
                <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono-code">
                  <Languages className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
                  <button
                    type="button"
                    onClick={() => setSpeechLanguage('en-IN')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                      speechLanguage === 'en-IN'
                        ? 'bg-slate-800 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpeechLanguage('ta-IN')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                      speechLanguage === 'ta-IN'
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    தமிழ் (Tamil)
                  </button>
                </div>

                {/* Primary Web Speech Microphone Dictation Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono-code transition-all flex items-center gap-2 shadow-sm ${
                    isListening
                      ? 'bg-rose-600 hover:bg-rose-500 text-white ring-2 ring-rose-400 animate-pulse'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                  }`}
                  title={isListening ? 'Click to Stop Dictation' : 'Click to Speak via Web Speech API'}
                >
                  {isListening ? (
                    <>
                      <Radio className="w-4 h-4 animate-spin text-white" />
                      <span>Listening... (Stop)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 text-emerald-400" />
                      <span>Dictate Grievance</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Live Dictation Active Waveform Banner */}
            {isListening && (
              <div className="mb-2 p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-center justify-between text-xs font-mono-code text-rose-300 animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping"></span>
                  <span className="font-semibold">
                    Microphone Active ({speechLanguage === 'ta-IN' ? 'தமிழ் குரல் பதிவு' : 'English Dictation'}). Speak clearly:
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[12, 24, 16, 28, 36, 20, 32, 14, 26, 18, 30].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-rose-500 rounded-full animate-pulse"
                      style={{
                        height: `${h}px`,
                        animationDelay: `${(i % 4) * 0.15}s`,
                        animationDuration: '0.7s',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Error Notification */}
            {speechError && (
              <div className="mb-2 p-2.5 bg-amber-950/40 border border-amber-800/60 rounded-lg text-xs text-amber-300 font-mono-code flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>{speechError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSpeechError(null)}
                  className="text-amber-400 hover:text-amber-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Main Textarea in Dark Mode */}
            <div className="relative">
              <textarea
                id="citizen-input"
                rows={4}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setActivePresetId('');
                }}
                placeholder="Click 'Dictate Grievance' to speak with your microphone, or paste/type the citizen grievance text here (e.g. broken water pipeline in Madurai, pothole hazards in Chennai, transformer failure in Coimbatore)..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/50 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 transition-all font-sans leading-relaxed shadow-inner"
                required
              />

              {/* Interim Real-time Transcript Indicator */}
              {interimTranscript && (
                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/95 backdrop-blur-xs p-2 rounded-lg border border-emerald-500/50 text-xs text-emerald-300 italic shadow-sm">
                  <span className="font-semibold text-emerald-200 font-mono-code not-italic mr-1.5">[Live Voice Inflow]:</span>
                  "{interimTranscript}"
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono-code mt-1 px-1">
              <span>Supports speech-to-text dictation in English and Tamil</span>
              <span>{inputText.length} characters</span>
            </div>
          </div>

          {/* Context & District Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono-code block mb-1">
                Additional Context / Ward / Sector Notes:
              </label>
              <input
                type="text"
                value={contextNotes}
                onChange={(e) => setContextNotes(e.target.value)}
                placeholder="e.g. State: Tamil Nadu, District: Madurai, Ward 24, high density low-income ward"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/70 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-600 transition-colors font-sans"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono-code block mb-1">
                District (Extracted / Inferred):
              </label>
              <input
                type="text"
                value={selectedDistrict}
                onChange={(e) => onDistrictChange(e.target.value)}
                placeholder="e.g. Madurai, Chennai, Coimbatore..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/70 rounded-lg px-3 py-2 text-xs text-emerald-400 font-bold font-mono-code placeholder-slate-600 transition-colors"
              />
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono-code">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>Generates the complete 3-page development report across all 3 layers</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-950/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 hover:scale-[1.01]"
            >
              {isLoading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Synthesizing 3-Page Report...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Process Grievance & Generate Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
