import React, { useState, useRef, useEffect } from 'react';
import { DevelopmentReport } from '../types';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Radio, 
  Sparkles, 
  FastForward, 
  RotateCcw,
  Headphones,
  Check
} from 'lucide-react';

interface AudioBriefingPlayerProps {
  report: DevelopmentReport;
}

export const AudioBriefingPlayer: React.FC<AudioBriefingPlayerProps> = ({
  report,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<'all' | 'p1' | 'p2' | 'p3'>('all');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [audioSource, setAudioSource] = useState<'gemini-tts' | 'browser-speech' | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  // Construct text script for speech
  const getSectionText = (sec: 'all' | 'p1' | 'p2' | 'p3') => {
    const p1Text = `Operational Layer One: Citizen Input Analysis. Category: ${report.page1.category}. Priority: ${report.page1.priorityLevel}. One-line summary: ${report.page1.oneLineSummary}. Impact assessment: ${report.page1.impactAssessment}. Suggested Government Action: ${report.page1.suggestedGovernmentAction}.`;
    const p2Text = `Operational Layer Two: Hotspot Dashboard Metrics. State: ${report.page2.state}. District: ${report.page2.district}. Cluster count: ${report.page2.clusterCount || 47} registered complaints. Severity: ${report.page2.hotspotSeverity}. Status Note: ${report.page2.statusNote}.`;
    const p3Text = `Operational Layer Three: Government Insights and Policy Recommendations. Top systemic issue: ${report.page3.topIssuesIdentified}. Affected regions: ${report.page3.affectedRegions}. Strategic policy recommendations: ${report.page3.policyRecommendations.join('. ')}. Preventative governance: ${report.page3.preventativeFramework || 'Establish automated telemetry monitoring.'}.`;

    if (sec === 'p1') return p1Text;
    if (sec === 'p2') return p2Text;
    if (sec === 'p3') return p3Text;
    return `Official Government Development Report. Docket Reference: ${report.id}. Location: ${report.page2.district}, ${report.page2.state}. ${p1Text} ${p2Text} ${p3Text}`;
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const handlePlayAudio = async (section = currentSection) => {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    const textToSpeak = getSectionText(section);
    setIsLoadingAudio(true);

    try {
      const response = await fetch('/api/synthesize-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak,
          voiceName: 'Kore',
        }),
      });

      const resData = await response.json();

      if (resData.audioBase64) {
        const binary = atob(resData.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: resData.mimeType || 'audio/wav' });

        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
        }
        const newUrl = URL.createObjectURL(blob);
        audioUrlRef.current = newUrl;

        const audio = new Audio(newUrl);
        audio.playbackRate = playbackSpeed;
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => {
          fallbackBrowserSpeech(textToSpeak);
        };
        audioRef.current = audio;
        await audio.play();
        setAudioSource('gemini-tts');
        setIsPlaying(true);
      } else {
        fallbackBrowserSpeech(textToSpeak);
      }
    } catch (err) {
      console.warn('Backend TTS failed, using browser speech:', err);
      fallbackBrowserSpeech(textToSpeak);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const fallbackBrowserSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported by your browser.');
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = playbackSpeed;
    utterance.pitch = 1.0;
    utterance.lang = 'en-IN';

    utterance.onstart = () => {
      setIsPlaying(true);
      setAudioSource('browser-speech');
    };
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  useEffect(() => {
    return () => {
      stopPlayback();
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, [report.id]);

  return (
    <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/60 border border-indigo-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden no-print text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Title and Voice Persona */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-md">
            <Headphones className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono-code flex items-center gap-1.5">
                Executive Audio Briefing
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {audioSource === 'gemini-tts' ? 'Gemini 3.8 Neural Voice' : 'Civic Audio Dispatch'}
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Listen to the complete 3-page development report read aloud for executive review
            </p>
          </div>
        </div>

        {/* Section Jump Chips */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-mono-code">
          <button
            onClick={() => {
              setCurrentSection('all');
              if (isPlaying) {
                stopPlayback();
                setTimeout(() => handlePlayAudio('all'), 200);
              }
            }}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              currentSection === 'all'
                ? 'bg-indigo-500/30 text-indigo-200 font-bold border border-indigo-500/50 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Full Dossier
          </button>
          <button
            onClick={() => {
              setCurrentSection('p1');
              if (isPlaying) {
                stopPlayback();
                setTimeout(() => handlePlayAudio('p1'), 200);
              }
            }}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              currentSection === 'p1'
                ? 'bg-amber-500/30 text-amber-200 font-bold border border-amber-500/50 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Page 1: Citizen
          </button>
          <button
            onClick={() => {
              setCurrentSection('p2');
              if (isPlaying) {
                stopPlayback();
                setTimeout(() => handlePlayAudio('p2'), 200);
              }
            }}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              currentSection === 'p2'
                ? 'bg-emerald-500/30 text-emerald-200 font-bold border border-emerald-500/50 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Page 2: Hotspots
          </button>
          <button
            onClick={() => {
              setCurrentSection('p3');
              if (isPlaying) {
                stopPlayback();
                setTimeout(() => handlePlayAudio('p3'), 200);
              }
            }}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              currentSection === 'p3'
                ? 'bg-rose-500/30 text-rose-200 font-bold border border-rose-500/50 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Page 3: Policy
          </button>
        </div>

        {/* Controls: Play/Pause, Stop, Speed */}
        <div className="flex items-center gap-2">
          {/* Speed Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono-code text-slate-300">
            {[1, 1.25, 1.5].map((spd) => (
              <button
                key={spd}
                onClick={() => handleSpeedChange(spd)}
                className={`px-1.5 py-0.5 rounded ${
                  playbackSpeed === spd
                    ? 'bg-indigo-600/40 text-indigo-200 font-bold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Main Play / Pause Button */}
          <button
            onClick={() => handlePlayAudio(currentSection)}
            disabled={isLoadingAudio}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs shadow-lg shadow-indigo-950/60 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isLoadingAudio ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin text-white" />
                <span>Generating Voice...</span>
              </>
            ) : isPlaying ? (
              <>
                <Pause className="w-4 h-4 text-white fill-white" />
                <span>Pause Audio</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-white fill-white" />
                <span>Listen to Briefing</span>
              </>
            )}
          </button>

          {/* Stop Button */}
          {isPlaying && (
            <button
              onClick={stopPlayback}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors border border-slate-700 shadow-sm"
              title="Stop Playback"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Animated Equalizer wave when playing */}
      {isPlaying && (
        <div className="mt-3 pt-3 border-t border-indigo-900/40 flex items-center justify-between text-xs font-mono-code text-indigo-300">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Broadcasting Official Policy Memo Audio • {report.page2.district} Corridor</span>
          </div>

          <div className="flex items-center gap-1">
            {[14, 28, 42, 20, 36, 12, 40, 24, 18, 32, 10, 26, 38, 16].map((h, i) => (
              <div
                key={i}
                className="w-1 bg-indigo-400 rounded-full animate-pulse"
                style={{
                  height: `${h}px`,
                  animationDelay: `${(i % 4) * 0.12}s`,
                  animationDuration: '0.7s',
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
