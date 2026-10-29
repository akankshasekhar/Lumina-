import React from 'react';
import { 
  X, 
  Type, 
  Palette, 
  AlignLeft, 
  Sliders, 
  Eye, 
  Columns, 
  Sparkles,
  Bookmark
} from 'lucide-react';
import type { ReadingSettings, ReadingTheme, ReadingFont, ColumnWidth } from '../types';

interface ReaderSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReadingSettings;
  onChangeSettings: (newSettings: Partial<ReadingSettings>) => void;
  onResetDefaults: () => void;
}

export const ReaderSettingsDrawer: React.FC<ReaderSettingsDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  onChangeSettings,
  onResetDefaults,
}) => {
  if (!isOpen) return null;

  const themes: { id: ReadingTheme; label: string; bg: string; text: string; border: string }[] = [
    { id: 'paper', label: 'Paper Cream', bg: '#FAF7F2', text: '#2C2825', border: '#E4DDD2' },
    { id: 'sepia', label: 'Warm Sepia', bg: '#F4EBD9', text: '#3A2E25', border: '#DDCFB7' },
    { id: 'sage', label: 'Serene Sage', bg: '#EDF3EE', text: '#233227', border: '#D0DDD2' },
    { id: 'charcoal', label: 'Muted Slate', bg: '#25282A', text: '#E2E4E6', border: '#3E4246' },
    { id: 'midnight', label: 'Midnight', bg: '#121213', text: '#DCDCDC', border: '#2B2B2D' },
  ];

  const fonts: { id: ReadingFont; label: string; desc: string }[] = [
    { id: 'serif', label: 'Newsreader (Serif)', desc: 'Optimal for sustained classical reading' },
    { id: 'sans', label: 'Jakarta (Sans)', desc: 'Clean modern rhythm and clarity' },
    { id: 'mono', label: 'JetBrains (Mono)', desc: 'Fixed width for analytical scrutiny' },
    { id: 'dyslexic', label: 'Dyslexic-Friendly', desc: 'Weighted stems for ocular comfort' },
  ];

  return (
    <div 
      className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-[#FAF7F2] shadow-2xl border-l border-[#E2DBD1] flex flex-col text-[#2C2825] animate-slide-left"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reader-settings-title"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#E8E2D9] flex items-center justify-between bg-[#F4EFE6]/70">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#8A7458]" />
          <h2 id="reader-settings-title" className="font-serif text-base font-medium text-[#24201D]">
            Typographic Sanctuary
          </h2>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#78716A] hover:text-[#1F1B18] hover:bg-[#EAE4D9] transition-colors"
          aria-label="Close settings"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Settings List */}
      <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
        
        {/* Color Palette / Theme */}
        <div>
          <label className="font-medium text-[#24201D] mb-2 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-[#8A7458]" />
            <span>Reading Atmosphere & Tone</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => onChangeSettings({ theme: t.id })}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                  settings.theme === t.id
                    ? 'ring-2 ring-[#2C2825] shadow-xs'
                    : 'opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: t.bg, borderColor: t.border, color: t.text }}
              >
                <div 
                  className="w-4 h-4 rounded-full border border-black/10 shrink-0" 
                  style={{ backgroundColor: t.text }} 
                />
                <span className="font-medium truncate">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Font Family */}
        <div>
          <label className="font-medium text-[#24201D] mb-2 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-[#8A7458]" />
            <span>Typeface Geometry</span>
          </label>
          <div className="space-y-1.5">
            {fonts.map((f) => (
              <button
                key={f.id}
                onClick={() => onChangeSettings({ font: f.id })}
                className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                  settings.font === f.id
                    ? 'bg-white border-[#2C2825] shadow-2xs font-medium text-[#1A1816]'
                    : 'bg-white/60 border-[#E8E2D9] text-[#554E48] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs">{f.label}</span>
                  {settings.font === f.id && <span className="text-[10px] text-[#7A6C58]">Selected</span>}
                </div>
                <div className="text-[11px] text-[#78716A] mt-0.5">{f.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Font Size Slider */}
        <div className="p-3.5 rounded-xl bg-white border border-[#EAE4D9]">
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium text-[#24201D]">Font Scale</label>
            <span className="font-mono text-xs text-[#78716A]">{settings.fontSize}px</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#78716A]">A</span>
            <input
              type="range"
              min="16"
              max="26"
              step="1"
              value={settings.fontSize}
              onChange={(e) => onChangeSettings({ fontSize: parseInt(e.target.value) })}
              className="w-full h-1.5 accent-[#2C2825] cursor-pointer"
            />
            <span className="text-sm font-serif font-bold text-[#2C2825]">A</span>
          </div>
        </div>

        {/* Line Height Slider */}
        <div className="p-3.5 rounded-xl bg-white border border-[#EAE4D9]">
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium text-[#24201D]">Line Spacing (Leading)</label>
            <span className="font-mono text-xs text-[#78716A]">{settings.lineHeight.toFixed(1)}x</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#78716A]">Compact</span>
            <input
              type="range"
              min="1.5"
              max="2.3"
              step="0.1"
              value={settings.lineHeight}
              onChange={(e) => onChangeSettings({ lineHeight: parseFloat(e.target.value) })}
              className="w-full h-1.5 accent-[#2C2825] cursor-pointer"
            />
            <span className="text-[11px] text-[#78716A]">Airy</span>
          </div>
        </div>

        {/* Column Width */}
        <div>
          <label className="font-medium text-[#24201D] mb-2 flex items-center gap-1.5">
            <Columns className="w-3.5 h-3.5 text-[#8A7458]" />
            <span>Optimal Line Measure (Column Width)</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['narrow', 'medium', 'wide'] as ColumnWidth[]).map((col) => (
              <button
                key={col}
                onClick={() => onChangeSettings({ columnWidth: col })}
                className={`py-2 px-1 text-center capitalize rounded-lg border transition-colors ${
                  settings.columnWidth === col
                    ? 'bg-[#2C2825] text-white border-[#2C2825]'
                    : 'bg-white border-[#E4DDD2] text-[#554E48] hover:bg-[#F7F2EB]'
                }`}
              >
                {col === 'narrow' ? 'Narrow (60ch)' : col === 'medium' ? 'Standard (75ch)' : 'Wide (90ch)'}
              </button>
            ))}
          </div>
        </div>

        {/* Ocular Focus Tools */}
        <div className="p-3.5 rounded-xl bg-white border border-[#EAE4D9] space-y-3">
          <label className="font-medium text-[#24201D] block">Ocular Focus Enhancements</label>

          {/* Bionic Reading Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-xs text-[#2A2623]">Bionic Fixation Anchors</div>
              <div className="text-[11px] text-[#78716A]">Bolds initial word stems to guide saccadic eye movements</div>
            </div>
            <button
              onClick={() => onChangeSettings({ bionicReading: !settings.bionicReading })}
              className={`w-9 h-5 rounded-full transition-colors relative ${
                settings.bionicReading ? 'bg-[#2C2825]' : 'bg-[#DDD6CB]'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  settings.bionicReading ? 'translate-x-4.5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Focus Line Mask */}
          <div className="flex items-center justify-between pt-2 border-t border-[#F0EAE0]">
            <div>
              <div className="font-medium text-xs text-[#2A2623]">Focus Paragraph Mask</div>
              <div className="text-[11px] text-[#78716A]">Dims neighboring paragraphs to isolate current thought</div>
            </div>
            <button
              onClick={() => onChangeSettings({ focusLineMask: !settings.focusLineMask })}
              className={`w-9 h-5 rounded-full transition-colors relative ${
                settings.focusLineMask ? 'bg-[#2C2825]' : 'bg-[#DDD6CB]'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  settings.focusLineMask ? 'translate-x-4.5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Reading Ruler */}
          <div className="flex items-center justify-between pt-2 border-t border-[#F0EAE0]">
            <div>
              <div className="font-medium text-xs text-[#2A2623]">Reading Horizon Guideline</div>
              <div className="text-[11px] text-[#78716A]">Displays a subtle warm marker following your cursor</div>
            </div>
            <button
              onClick={() => onChangeSettings({ rulerGuide: !settings.rulerGuide })}
              className={`w-9 h-5 rounded-full transition-colors relative ${
                settings.rulerGuide ? 'bg-[#2C2825]' : 'bg-[#DDD6CB]'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  settings.rulerGuide ? 'translate-x-4.5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

        </div>

      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#E8E2D9] bg-[#F4EFE6]/50 flex items-center justify-between">
        <button
          onClick={onResetDefaults}
          className="text-xs text-[#78716A] hover:text-[#2C2825] underline transition-colors"
        >
          Reset to Defaults
        </button>
        <button
          onClick={onClose}
          className="px-4 py-1.5 text-xs font-medium rounded-lg bg-[#2C2825] text-white hover:bg-[#433D39] transition-colors"
        >
          Done
        </button>
      </div>

    </div>
  );
};
