import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Languages, 
  Sparkles, 
  Check, 
  X, 
  AlertCircle,
  Radio
} from 'lucide-react';

interface VoiceGrievanceDictationProps {
  onTranscriptReady: (transcript: string, mode: 'replace' | 'append') => void;
  isProcessing: boolean;
}

export const VoiceGrievanceDictation: React.FC<VoiceGrievanceDictationProps> = ({
  onTranscriptReady,
  isProcessing,
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [interimText, setInterimText] = useState<string>('');
  const [finalText, setFinalText] = useState<string>('');
  const [language, setLanguage] = useState<'en-IN' | 'ta-IN'>('en-IN');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMsg('Voice recognition not natively supported in this browser. Please use Chrome/Edge or type your grievance.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      setErrorMsg(null);
    };

    recognition.onresult = (event: any) => {
      let currentInterim = '';
      let currentFinal = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptChunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          currentFinal += transcriptChunk + ' ';
        } else {
          currentInterim += transcriptChunk;
        }
      }

      if (currentFinal) {
        setFinalText((prev) => (prev ? prev + ' ' + currentFinal : currentFinal).trim());
      }
      setInterimText(currentInterim);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition event:', event.error);
      if (event.error === 'not-allowed') {
        setErrorMsg('Microphone access was denied. Please allow microphone permissions in your browser.');
        setIsListening(false);
      } else if (event.error !== 'no-speech') {
        setErrorMsg(`Speech notice: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      setErrorMsg(null);
      setInterimText('');
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = language;
          recognitionRef.current.start();
        }
      } catch (err) {
        console.warn('Recognition start caught:', err);
      }
    }
  };

  const handleApply = (mode: 'replace' | 'append') => {
    const combined = (finalText + ' ' + interimText).trim();
    if (combined) {
      onTranscriptReady(combined, mode);
      setFinalText('');
      setInterimText('');
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  };

  const handleClear = () => {
    setFinalText('');
    setInterimText('');
  };

  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 rounded-xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute -right-10 -top-10 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <button
              type="button"
              onClick={toggleListening}
              disabled={isProcessing}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50 scale-105 animate-pulse'
                  : 'bg-gradient-to-tr from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 shadow-amber-950/60'
              }`}
              title={isListening ? 'Click to Stop Listening' : 'Click to Speak Grievance'}
            >
              {isListening ? (
                <Radio className="w-5 h-5 animate-spin" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
            {isListening && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono-code flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                Citizen Voice Intake (குரல் பதிவு)
              </span>
              {isListening && (
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-mono-code font-bold animate-pulse">
                  LIVE RECORDING
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Speak in English or Tamil to dictate citizen grievances automatically
            </p>
          </div>
        </div>

        {/* Language Selection */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono-code">
          <Languages className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          <button
            type="button"
            onClick={() => setLanguage('en-IN')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              language === 'en-IN'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            English (India)
          </button>
          <button
            type="button"
            onClick={() => setLanguage('ta-IN')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              language === 'ta-IN'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            தமிழ் (Tamil)
          </button>
        </div>
      </div>

      {/* Visual Audio Frequency Waveform when Recording */}
      {isListening && (
        <div className="py-2 mb-2 flex items-center justify-center gap-1.5 bg-slate-950/80 rounded-lg border border-rose-900/40 px-4">
          <span className="text-[11px] font-mono-code text-rose-300 mr-2 flex items-center gap-1">
            <Radio className="w-3 h-3 text-rose-400 animate-pulse" />
            Listening for Tamil Nadu citizen request...
          </span>
          {[24, 40, 16, 32, 48, 20, 36, 12, 44, 28, 16, 42, 30, 20].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-rose-500 rounded-full animate-pulse"
              style={{
                height: `${h}px`,
                animationDelay: `${(i % 5) * 0.15}s`,
                animationDuration: '0.8s',
              }}
            />
          ))}
        </div>
      )}

      {/* Error or Hint message */}
      {errorMsg && (
        <div className="bg-rose-950/30 border border-rose-800/40 text-rose-300 text-xs p-2.5 rounded-lg mb-2 flex items-center gap-2 font-mono-code">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Live Transcript Preview Box */}
      {(finalText || interimText) && (
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 mt-2 text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-400">
            <span className="text-amber-400 font-bold">Recorded Citizen Voice Transcript:</span>
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          </div>
          <p className="text-slate-100 italic leading-relaxed font-sans">
            "{finalText} <span className="text-amber-300 font-medium">{interimText}</span>"
          </p>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-slate-900">
            <button
              type="button"
              onClick={() => handleApply('append')}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-code transition-colors flex items-center gap-1"
            >
              Append to Request
            </button>
            <button
              type="button"
              onClick={() => handleApply('replace')}
              className="px-3 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-200 text-xs font-mono-code font-bold transition-colors flex items-center gap-1"
            >
              <Check className="w-3 h-3 text-amber-400" />
              Use as Grievance Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
