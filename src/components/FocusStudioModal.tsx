import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Headphones, 
  Volume2, 
  Wind, 
  CheckCircle2, 
  Activity, 
  Sparkles,
  Coffee,
  Brain,
  Clock,
  Timer
} from 'lucide-react';
import type { SoundscapeType, FocusSessionStats } from '../types';
import { formatTimer, calculateTimerProgress } from '../utils/reading-helpers';

interface FocusStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  timerSeconds: number;
  isTimerRunning: boolean;
  onStartTimer: () => void;
  onPauseTimer: () => void;
  onResetTimer: (newSeconds: number) => void;
  soundscapeType: SoundscapeType;
  soundscapeVolume: number;
  onSelectSoundscape: (type: SoundscapeType) => void;
  onChangeVolume: (vol: number) => void;
  stats: FocusSessionStats;
}

export const FocusStudioModal: React.FC<FocusStudioModalProps> = ({
  isOpen,
  onClose,
  timerSeconds,
  isTimerRunning,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  soundscapeType,
  soundscapeVolume,
  onSelectSoundscape,
  onChangeVolume,
  stats,
}) => {
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathCount, setBreathCount] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [totalSprintLength, setTotalSprintLength] = useState(25 * 60);

  // Box Breathing cycle (4s each)
  useEffect(() => {
    if (!isOpen || !isBreathingActive) return;

    const interval = setInterval(() => {
      setBreathCount((prev) => {
        if (prev > 1) return prev - 1;

        // Transition phase
        setBreathingPhase((curr) => {
          if (curr === 'Inhale') return 'Hold';
          if (curr === 'Hold') return 'Exhale';
          if (curr === 'Exhale') return 'Rest';
          return 'Inhale';
        });

        return 4;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isBreathingActive]);

  if (!isOpen) return null;

  const progressPercent = calculateTimerProgress(timerSeconds, totalSprintLength);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="focus-studio-title"
    >
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#E4DDD2] overflow-hidden text-[#2C2825]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E2D9] flex items-center justify-between bg-[#F4EFE6]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2C2825] text-white flex items-center justify-center shadow-xs">
              <Timer className="w-4 h-4 text-[#EADBC8]" />
            </div>
            <div>
              <h2 id="focus-studio-title" className="font-serif text-lg font-medium text-[#24201D] leading-tight">
                25-Minute Pomodoro Focus Timer
              </h2>
              <p className="text-xs text-[#78716A]">
                Distraction-free reading countdown with procedural ambient soundscapes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#78716A] hover:text-[#1F1B18] hover:bg-[#EAE4D9] transition-colors"
            aria-label="Close Focus Studio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Main Pomodoro Countdown Card */}
          <div className="p-6 rounded-2xl bg-white border border-[#EAE4D9] text-center shadow-2xs relative">
            <div className="flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-wider text-[#8A7458] mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{isTimerRunning ? 'Active Focus Sprint in Progress' : 'Pomodoro Study Session'}</span>
            </div>
            
            {/* Countdown Digits */}
            <div className="font-mono text-5xl sm:text-6xl font-light tracking-tight text-[#221F1C] my-3">
              {formatTimer(timerSeconds)}
            </div>

            {/* Linear Progress Bar */}
            <div className="w-full max-w-xs mx-auto h-1.5 bg-[#EFE9DF] rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-[#2C2825] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Presets */}
            <div className="flex justify-center items-center gap-2 mb-4">
              <button
                onClick={() => {
                  setTotalSprintLength(25 * 60);
                  onResetTimer(25 * 60);
                }}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  totalSprintLength === 25 * 60
                    ? 'bg-[#2C2825] text-white shadow-2xs'
                    : 'bg-[#F5EFE6] text-[#423C36] hover:bg-[#ECE3D5]'
                }`}
              >
                25m Pomodoro (Standard)
              </button>
              <button
                onClick={() => {
                  setTotalSprintLength(50 * 60);
                  onResetTimer(50 * 60);
                }}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  totalSprintLength === 50 * 60
                    ? 'bg-[#2C2825] text-white shadow-2xs'
                    : 'bg-[#F5EFE6] text-[#423C36] hover:bg-[#ECE3D5]'
                }`}
              >
                50m Deep Flow
              </button>
              <button
                onClick={() => {
                  setTotalSprintLength(5 * 60);
                  onResetTimer(5 * 60);
                }}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  totalSprintLength === 5 * 60
                    ? 'bg-[#2C2825] text-white shadow-2xs'
                    : 'bg-[#F5EFE6] text-[#423C36] hover:bg-[#ECE3D5]'
                }`}
              >
                5m Rest Break
              </button>
            </div>

            {/* Play/Pause/Reset controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={isTimerRunning ? onPauseTimer : onStartTimer}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2C2825] text-white hover:bg-[#433D39] transition-all font-medium text-xs shadow-xs"
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause Sprint</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start 25m Focus Sprint</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onResetTimer(totalSprintLength)}
                className="p-2.5 rounded-xl border border-[#DDD5C7] text-[#554E48] hover:bg-[#F2ECE1] transition-colors"
                title="Reset timer"
                aria-label="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Soundscapes Selector */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-semibold text-[#2C2825] flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5 text-[#8A7458]" />
                <span>Procedural Focus Soundscapes (Offline Synthesis)</span>
              </label>

              {soundscapeType !== 'none' && (
                <div className="flex items-center gap-1 text-xs text-[#78716A]">
                  <Volume2 className="w-3.5 h-3.5" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={soundscapeVolume}
                    onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                    className="w-16 h-1 accent-[#2C2825] cursor-pointer"
                    aria-label="Volume slider"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'none', label: 'Silence' },
                { id: 'rain', label: 'Raindrops' },
                { id: 'binaural', label: 'Alpha 10Hz' },
                { id: 'wind', label: 'Soft Breeze' },
                { id: 'library', label: 'Library Hum' },
              ].map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => onSelectSoundscape(sound.id as SoundscapeType)}
                  className={`px-3 py-2 text-xs rounded-xl border text-center transition-all ${
                    soundscapeType === sound.id
                      ? 'bg-[#2C2825] text-white border-[#2C2825] shadow-2xs font-medium'
                      : 'bg-white border-[#E4DDD2] text-[#524B45] hover:bg-[#F7F2EB]'
                  }`}
                >
                  {sound.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mindful Box Breathing Exercise */}
          <div className="p-4 rounded-xl bg-white border border-[#EAE4D9]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-semibold text-[#2C2825] flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-[#5F8D6E]" />
                  <span>Box Breathing Transition (4-4-4-4)</span>
                </h3>
                <p className="text-[11px] text-[#78716A] mt-0.5">
                  Calms neural arousal before beginning intense reading sessions
                </p>
              </div>

              <button
                onClick={() => setIsBreathingActive(!isBreathingActive)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                  isBreathingActive 
                    ? 'bg-[#DDEEE1] text-[#1E4D2B]' 
                    : 'bg-[#F2ECE1] text-[#4F4841] hover:bg-[#EAE2D4]'
                }`}
              >
                {isBreathingActive ? 'Stop Breath' : 'Begin Exercise'}
              </button>
            </div>

            {isBreathingActive ? (
              <div className="flex flex-col items-center justify-center py-4 bg-[#FAF7F2] rounded-lg border border-[#EDE7DD]">
                <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all duration-1000 ${
                  breathingPhase === 'Inhale' 
                    ? 'scale-125 bg-[#DCEEE0] text-[#184E25]' 
                    : breathingPhase === 'Hold' 
                    ? 'scale-120 bg-[#E8E2D6] text-[#423C36]' 
                    : breathingPhase === 'Exhale' 
                    ? 'scale-90 bg-[#F4E8D7] text-[#69431E]' 
                    : 'scale-90 bg-[#F0EAE0] text-[#554E48]'
                }`}>
                  <span className="text-xs font-medium tracking-wide">{breathingPhase}</span>
                  <span className="font-mono text-base font-bold">{breathCount}</span>
                </div>
                <div className="text-[11px] text-[#78716A] mt-3">
                  Slow, measured breathing rhythm for ocular and cognitive release
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#78716A] italic bg-[#FAF7F2] p-3 rounded-lg border border-[#EDE7DD] text-center">
                Click "Begin Exercise" anytime your thoughts feel scattered or fatigued.
              </div>
            )}
          </div>

          {/* Session Cumulative Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-white border border-[#EAE4D9]">
              <div className="text-lg font-mono font-medium text-[#2C2825]">
                {stats.totalMinutesFocused}m
              </div>
              <div className="text-[11px] text-[#78716A] mt-0.5">Total Focused</div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#EAE4D9]">
              <div className="text-lg font-mono font-medium text-[#2C2825]">
                {stats.completedSprints}
              </div>
              <div className="text-[11px] text-[#78716A] mt-0.5">Pomodoros Done</div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#EAE4D9]">
              <div className="text-lg font-mono font-medium text-[#2C2825]">
                {stats.wordsRead}
              </div>
              <div className="text-[11px] text-[#78716A] mt-0.5">Words Synthesized</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#E8E2D9] bg-[#F4EFE6]/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-lg bg-[#2C2825] text-white hover:bg-[#433D39] transition-colors"
          >
            Return to Study
          </button>
        </div>

      </div>
    </div>
  );
};
