import React, { useState, useEffect } from 'react';
import { 
  Quote as QuoteIcon, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Pause, 
  Play, 
  ArrowRight,
  BookOpen,
  Clock
} from 'lucide-react';
import { quotesData } from '../data/quotes';
import { getNextQuoteIndex, getPrevQuoteIndex } from '../utils/reading-helpers';

interface HeroSectionProps {
  onStartReading: () => void;
  onOpenFocusTimer: () => void;
  onOpenBlueprint: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartReading,
  onOpenFocusTimer,
  onOpenBlueprint,
}) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isAutoCycling, setIsAutoCycling] = useState(true);

  // JavaScript cycle: rotates quotes every 8 seconds
  useEffect(() => {
    if (!isAutoCycling) return;

    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => getNextQuoteIndex(prev, quotesData.length));
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoCycling]);

  const currentQuote = quotesData[currentQuoteIndex];

  return (
    <section 
      className="relative py-14 sm:py-18 lg:py-22 border-b border-[#E8E0D5]"
      onMouseEnter={() => setIsAutoCycling(false)}
      onMouseLeave={() => setIsAutoCycling(true)}
      aria-label="Dynamic Hero and Quote of the Day"
    >
      <div className="max-w-4xl space-y-7">
        
        {/* Kicker Tagline (Unboxed Metadata) */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#5C7C65] font-sans font-semibold">
          <span>University Reading Sanctuary</span>
          <span aria-hidden="true">·</span>
          <span>Single-Page Prototype</span>
          <span aria-hidden="true">·</span>
          <span>Distraction-Free Focus</span>
        </div>

        {/* Main Headline with Merriweather Serif */}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2C221E] leading-[1.2]">
          Where deep scholarship happens without noise, notifications, or rush.
        </h1>

        {/* Body Text with Inter Sans-Serif */}
        <p className="text-sm sm:text-base text-[#5C504A] leading-relaxed font-sans max-w-2xl">
          Lumina provides an intentional digital sanctuary for university scholars. 
          Immerse yourself in our 6 curated seminal texts, build a personal reading list 
          with instant bookshelf persistence, and cultivate sustained concentration via 
          our 25-minute Pomodoro focus timer.
        </p>

        {/* Dynamic "Quote of the Day" Showcase Card */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E4DBD0] shadow-2xs relative overflow-hidden transition-all">
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#F0EAE0]">
            <div className="flex items-center gap-2 text-xs font-medium text-[#5C7C65]">
              <QuoteIcon className="w-4 h-4 fill-[#5C7C65]/20" />
              <span className="uppercase tracking-wider text-[11px] font-semibold">Quote of the Day</span>
              <span aria-hidden="true" className="text-[#C8BEB3]">·</span>
              <span className="text-[#7A6E67] text-[11px] font-sans">{currentQuote.discipline}</span>
            </div>

            {/* Cycling Controls */}
            <div className="flex items-center gap-1.5 font-sans">
              <span className="text-[11px] font-mono text-[#7A6E67] mr-1">
                {currentQuoteIndex + 1} / {quotesData.length}
              </span>

              <button
                onClick={() => setCurrentQuoteIndex((prev) => getPrevQuoteIndex(prev, quotesData.length))}
                className="p-1.5 rounded-md text-[#7A6E67] hover:text-[#2C221E] hover:bg-[#F2ECE3] transition-colors"
                title="Previous Quote"
                aria-label="Previous quote"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsAutoCycling(!isAutoCycling)}
                className="p-1.5 rounded-md text-[#7A6E67] hover:text-[#2C221E] hover:bg-[#F2ECE3] transition-colors"
                title={isAutoCycling ? 'Pause automated cycling' : 'Resume automated cycling'}
                aria-label={isAutoCycling ? 'Pause quote cycle' : 'Resume quote cycle'}
              >
                {isAutoCycling ? (
                  <Pause className="w-3.5 h-3.5 text-[#5C7C65]" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-[#5C7C65] fill-current" />
                )}
              </button>

              <button
                onClick={() => setCurrentQuoteIndex((prev) => getNextQuoteIndex(prev, quotesData.length))}
                className="p-1.5 rounded-md text-[#7A6E67] hover:text-[#2C221E] hover:bg-[#F2ECE3] transition-colors"
                title="Next Quote"
                aria-label="Next quote"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quote Body with Merriweather Serif */}
          <blockquote className="font-serif text-base sm:text-lg text-[#2C221E] leading-relaxed italic transition-all duration-300">
            "{currentQuote.text}"
          </blockquote>

          <div className="mt-4 flex items-center justify-between text-xs text-[#6B5E57] font-sans">
            <div>
              — <span className="font-semibold text-[#2C221E]">{currentQuote.author}</span>,{' '}
              <span className="italic text-[#756860]">{currentQuote.work}</span>
            </div>

            {/* Indicator Dots */}
            <div className="flex items-center gap-1.5">
              {quotesData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuoteIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentQuoteIndex 
                      ? 'w-5 bg-[#5C7C65]' 
                      : 'w-1.5 bg-[#DDD4C9] hover:bg-[#B0A598]'
                  }`}
                  aria-label={`Jump to quote ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Primary Action Buttons: Muted Sage Primary */}
        <div className="flex flex-wrap items-center gap-3 pt-1 font-sans">
          <button
            onClick={onStartReading}
            className="px-5 py-2.5 text-xs font-semibold rounded-lg bg-[#5C7C65] text-white hover:bg-[#4E6A56] active:bg-[#435B4A] transition-colors shadow-2xs flex items-center gap-2"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Begin Reading First Text</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenFocusTimer}
            className="px-4 py-2.5 text-xs font-medium rounded-lg bg-white border border-[#DDD4C9] text-[#423630] hover:bg-[#F5EFE6] transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-[#5C7C65]" />
            <span>25m Pomodoro Timer</span>
          </button>

          <button
            onClick={onOpenBlueprint}
            className="px-4 py-2.5 text-xs font-medium rounded-lg text-[#554942] hover:bg-[#F2ECE3] transition-colors border border-[#E0D6C8]"
          >
            View UI/UX Architecture Specs →
          </button>
        </div>

      </div>
    </section>
  );
};
