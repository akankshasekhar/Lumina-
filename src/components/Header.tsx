import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Headphones, 
  Volume2, 
  Clock, 
  Maximize2, 
  Minimize2, 
  Layers, 
  Compass, 
  Bookmark 
} from 'lucide-react';
import type { SoundscapeType } from '../types';
import { formatTimer } from '../utils/reading-helpers';

interface HeaderProps {
  currentView: 'library' | 'reader';
  activeBookTitle?: string;
  onNavigate: (view: 'library' | 'reader') => void;
  onOpenFocusStudio: () => void;
  onOpenBlueprint: () => void;
  onOpenBookshelf: () => void;
  savedBooksCount: number;
  isZenMode: boolean;
  onToggleZenMode: () => void;
  soundscapeType: SoundscapeType;
  soundscapeVolume: number;
  onToggleSoundscape: () => void;
  onChangeVolume: (vol: number) => void;
  timerSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  activeBookTitle,
  onNavigate,
  onOpenFocusStudio,
  onOpenBlueprint,
  onOpenBookshelf,
  savedBooksCount,
  isZenMode,
  onToggleZenMode,
  soundscapeType,
  soundscapeVolume,
  onToggleSoundscape,
  onChangeVolume,
  timerSeconds,
  isTimerRunning,
  onToggleTimer,
}) => {
  if (isZenMode) {
    return (
      <header className="fixed top-3 right-4 z-50 transition-opacity opacity-40 hover:opacity-100">
        <button
          onClick={onToggleZenMode}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full bg-[#2C221E]/80 text-white backdrop-blur shadow-sm hover:bg-[#2C221E] transition-colors"
          title="Exit Zen Mode (Esc)"
          aria-label="Exit Zen Mode"
        >
          <Minimize2 className="w-3.5 h-3.5" />
          <span>Exit Zen</span>
        </button>
      </header>
    );
  }

  const soundLabel = 
    soundscapeType === 'rain' ? 'Rain' :
    soundscapeType === 'binaural' ? 'Alpha 10Hz' :
    soundscapeType === 'wind' ? 'Breeze' :
    soundscapeType === 'library' ? 'Library' : 'Ambience';

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8E0D5] bg-[#FAF7F2]/80 backdrop-blur-md transition-colors text-[#2C221E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Brand & Editorial Title */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('library')}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
            aria-label="Lumina Home"
          >
            {/* Deep Espresso Badge with Merriweather Serif 'L' */}
            <div className="w-8 h-8 rounded-lg bg-[#2C221E] text-[#FAF7F2] flex items-center justify-center font-serif font-bold text-base shadow-xs group-hover:bg-[#43352F] transition-colors">
              L
            </div>
            <div>
              <div className="font-serif text-lg tracking-tight font-bold text-[#2C221E] leading-none">
                Lumina
              </div>
              <div className="text-[11px] text-[#7A6E67] tracking-wider uppercase font-sans mt-0.5 font-medium">
                Digital Library
              </div>
            </div>
          </button>

          {/* Breadcrumb if in reader */}
          {currentView === 'reader' && activeBookTitle && (
            <div className="hidden lg:flex items-center gap-2 text-xs text-[#7A6E67] pl-3 border-l border-[#E2D8CC]">
              <span className="truncate max-w-[220px] font-serif italic text-[#3F332C]">
                {activeBookTitle}
              </span>
            </div>
          )}
        </div>

        {/* Center Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-1.5 font-sans">
          <button
            onClick={() => onNavigate('library')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              currentView === 'library'
                ? 'bg-[#EFE8DE] text-[#2C221E] shadow-2xs'
                : 'text-[#665A53] hover:text-[#2C221E] hover:bg-[#F4ECE0]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Catalog</span>
          </button>

          {activeBookTitle && (
            <button
              onClick={() => onNavigate('reader')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                currentView === 'reader'
                  ? 'bg-[#EFE8DE] text-[#2C221E] shadow-2xs'
                  : 'text-[#665A53] hover:text-[#2C221E] hover:bg-[#F4ECE0]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Reader</span>
            </button>
          )}

          {/* Specs / Architecture button */}
          <button
            onClick={onOpenBlueprint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-[#554942] hover:text-[#2C221E] hover:bg-[#F4ECE0] transition-colors border border-[#DDD4C9]"
            title="View Specifications & Architecture"
          >
            <Layers className="w-3.5 h-3.5 text-[#5C7C65]" />
            <span className="hidden md:inline">Architecture & UI Specs</span>
            <span className="md:hidden">Specs</span>
          </button>
        </nav>

        {/* Right Tools: Interactive Bookshelf Counter, Focus Timer & Ambience */}
        <div className="flex items-center gap-2">
          
          {/* Feature 3: Interactive Bookshelf Counter in sticky navbar with Muted Sage accent */}
          <button
            onClick={onOpenBookshelf}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              savedBooksCount > 0
                ? 'bg-[#EEF4F0] border-[#BCD4C3] text-[#24422B] shadow-2xs'
                : 'bg-white/80 border-[#E4DDD2] text-[#695D56] hover:bg-white hover:text-[#2C221E]'
            }`}
            title="View saved bookshelf"
            aria-label={`My Bookshelf: ${savedBooksCount} saved`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${savedBooksCount > 0 ? 'text-[#5C7C65] fill-[#5C7C65]/35' : 'text-[#8A8177]'}`} />
            <span className="hidden sm:inline">Bookshelf</span>
            <span className={`px-1.5 py-0.2 rounded-full font-mono text-[11px] font-semibold ${
              savedBooksCount > 0 
                ? 'bg-[#5C7C65] text-white' 
                : 'bg-[#EAE2D7] text-[#554942]'
            }`}>
              {savedBooksCount}
            </span>
          </button>

          {/* Feature 5: Minimalist 25m Focus Timer Trigger with Muted Sage pulse */}
          <button
            onClick={onOpenFocusStudio}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              isTimerRunning
                ? 'bg-[#EEF4F0] border-[#A8CCA7] text-[#24422B]'
                : 'bg-white/80 border-[#E4DDD2] text-[#554942] hover:bg-white'
            }`}
            title="Open 25m Pomodoro Focus Timer"
            aria-label="Focus timer and studio"
          >
            <Clock className={`w-3.5 h-3.5 ${isTimerRunning ? 'animate-pulse text-[#366840]' : 'text-[#7D766E]'}`} />
            <span className="font-mono text-xs">{formatTimer(timerSeconds)}</span>
          </button>

          {/* Ambient Soundscape Controller */}
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg bg-[#F0EAE0]/70 border border-[#E4DDD2]">
            <button
              onClick={onToggleSoundscape}
              className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded-md font-sans transition-colors ${
                soundscapeType !== 'none'
                  ? 'bg-[#5C7C65] text-white shadow-xs font-medium'
                  : 'text-[#5C504A] hover:text-[#2C221E]'
              }`}
              title={soundscapeType !== 'none' ? `Playing: ${soundLabel}` : 'Turn on ambient sound'}
              aria-label="Toggle ambient soundscape"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">{soundLabel}</span>
            </button>

            {soundscapeType !== 'none' && (
              <div className="flex items-center gap-1 px-1">
                <Volume2 className="w-3 h-3 text-[#7A6E67]" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={soundscapeVolume}
                  onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                  className="w-12 h-1 accent-[#5C7C65] cursor-pointer"
                  aria-label="Sound volume"
                />
              </div>
            )}
          </div>

          {/* Zen Mode trigger if in reader */}
          {currentView === 'reader' && (
            <button
              onClick={onToggleZenMode}
              className="p-1.5 rounded-lg text-[#554942] hover:text-[#2C221E] hover:bg-[#EAE2D7] transition-colors"
              title="Enter Distraction-Free Zen Mode"
              aria-label="Enter Zen Mode"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
