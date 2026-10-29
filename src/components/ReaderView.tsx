import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sliders, 
  Bookmark, 
  BookmarkCheck, 
  Maximize2, 
  Minimize2, 
  Share2, 
  Download, 
  Check, 
  Plus, 
  Trash2, 
  Highlighter, 
  MessageSquare, 
  Eye, 
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import type { Book, ReadingSettings, Annotation, ReadingTheme } from '../types';
import { 
  parseBionicWord, 
  exportNotesToMarkdown, 
  calculateReadingMetrics 
} from '../utils/reading-helpers';

interface ReaderViewProps {
  book: Book;
  onBackToLibrary: () => void;
  settings: ReadingSettings;
  onOpenSettings: () => void;
  isZenMode: boolean;
  onToggleZenMode: () => void;
  annotations: Annotation[];
  onAddAnnotation: (annotation: Omit<Annotation, 'id' | 'createdAt'>) => void;
  onDeleteAnnotation: (id: string) => void;
  onFinishReading: (bookId: string, wordsCount: number) => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  book,
  onBackToLibrary,
  settings,
  onOpenSettings,
  isZenMode,
  onToggleZenMode,
  annotations,
  onAddAnnotation,
  onDeleteAnnotation,
  onFinishReading,
}) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [selectedText, setSelectedText] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [highlightColor, setHighlightColor] = useState<'amber' | 'emerald' | 'rose' | 'indigo'>('amber');
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [copiedNotes, setCopiedNotes] = useState(false);
  const [activeHoverParagraph, setActiveHoverParagraph] = useState<number | null>(null);
  const [cursorY, setCursorY] = useState<number>(0);
  const [reflectionAnswer, setReflectionAnswer] = useState('');
  const [savedReflection, setSavedReflection] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const currentChapter = book.chapters[currentChapterIndex] || book.chapters[0];

  // Mouse move for reading ruler
  const handleMouseMove = (e: React.MouseEvent) => {
    if (settings.rulerGuide) {
      setCursorY(e.clientY);
    }
  };

  // Keyboard shortcut: ESC to exit zen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZenMode) {
        onToggleZenMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZenMode, onToggleZenMode]);

  // Handle text selection for notes/highlights
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 3) {
      setSelectedText(selection.toString().trim());
    }
  };

  const saveSelectedHighlight = () => {
    if (!selectedText) return;
    onAddAnnotation({
      bookId: book.id,
      chapterIndex: currentChapterIndex,
      highlightedText: selectedText,
      note: noteInput.trim() || undefined,
      color: highlightColor,
    });
    setSelectedText('');
    setNoteInput('');
  };

  const handleExportMarkdown = () => {
    const bookAnnotations = annotations.filter(a => a.bookId === book.id);
    const md = exportNotesToMarkdown(book.title, book.author, bookAnnotations);
    
    // Download as .md file
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${book.id}-lumina-notes.md`;
    link.click();
    URL.revokeObjectURL(url);

    setCopiedNotes(true);
    setTimeout(() => setCopiedNotes(false), 2000);
  };

  // Theme styles
  const getThemeStyles = (theme: ReadingTheme) => {
    switch (theme) {
      case 'sepia':
        return {
          bg: 'bg-[#F4EBD9]',
          text: 'text-[#362C24]',
          secondaryText: 'text-[#6B5C50]',
          border: 'border-[#DFCDB7]',
          cardBg: 'bg-[#EFE5D1]',
          highlightBg: 'bg-[#E3D3B8]',
        };
      case 'sage':
        return {
          bg: 'bg-[#ECF3ED]',
          text: 'text-[#202E24]',
          secondaryText: 'text-[#546A5B]',
          border: 'border-[#D1DDD3]',
          cardBg: 'bg-[#E3EDE5]',
          highlightBg: 'bg-[#CFE2D4]',
        };
      case 'charcoal':
        return {
          bg: 'bg-[#222527]',
          text: 'text-[#E0E2E5]',
          secondaryText: 'text-[#969BA1]',
          border: 'border-[#383D42]',
          cardBg: 'bg-[#2B2F33]',
          highlightBg: 'bg-[#3A4046]',
        };
      case 'midnight':
        return {
          bg: 'bg-[#0E0F10]',
          text: 'text-[#DCDCDC]',
          secondaryText: 'text-[#888A8E]',
          border: 'border-[#26282B]',
          cardBg: 'bg-[#18191B]',
          highlightBg: 'bg-[#292B30]',
        };
      case 'paper':
      default:
        return {
          bg: 'bg-[#FAF7F2]',
          text: 'text-[#2C2825]',
          secondaryText: 'text-[#736C64]',
          border: 'border-[#E6E0D5]',
          cardBg: 'bg-[#F4EFE6]',
          highlightBg: 'bg-[#EDE4D6]',
        };
    }
  };

  const themeStyles = getThemeStyles(settings.theme);

  // Font family styles
  const getFontFamilyClass = () => {
    switch (settings.font) {
      case 'sans':
        return 'font-reader-sans font-normal';
      case 'mono':
        return 'font-reader-mono';
      case 'dyslexic':
        return 'font-reader-dyslexic';
      case 'serif':
      default:
        return 'font-reader-serif';
    }
  };

  // Column width container
  const getColumnMaxWidth = () => {
    switch (settings.columnWidth) {
      case 'narrow':
        return 'max-w-2xl'; // ~65ch
      case 'wide':
        return 'max-w-4xl'; // ~90ch
      case 'medium':
      default:
        return 'max-w-3xl'; // ~75ch
    }
  };

  const bookAnnotations = annotations.filter(a => a.bookId === book.id);
  const chapterProgress = Math.round(((currentChapterIndex + 1) / book.chapters.length) * 100);

  return (
    <div 
      className={`min-h-screen ${themeStyles.bg} ${themeStyles.text} transition-colors duration-200 relative`}
      onMouseMove={handleMouseMove}
    >
      
      {/* Optional reading ruler cursor tracker */}
      {settings.rulerGuide && !isZenMode && (
        <div 
          className="fixed left-0 right-0 h-0.5 bg-[#8A7458]/35 pointer-events-none z-30 transition-all duration-75"
          style={{ top: `${cursorY}px` }}
        />
      )}

      {/* Top Thin Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-black/5 z-50">
        <div 
          className="h-full bg-[#8A7458] transition-all duration-300"
          style={{ width: `${chapterProgress}%` }}
        />
      </div>

      {/* Reader Navigation Header (Hidden in Zen Mode) */}
      {!isZenMode && (
        <nav className={`sticky top-0 z-40 border-b ${themeStyles.border} ${themeStyles.bg}/90 backdrop-blur-md px-4 sm:px-6 py-3 transition-colors`}>
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            
            <button
              onClick={onBackToLibrary}
              className={`flex items-center gap-1.5 text-xs font-medium ${themeStyles.secondaryText} hover:${themeStyles.text} transition-colors`}
              aria-label="Back to library shelves"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Library Shelves</span>
            </button>

            {/* Chapter Indicator */}
            <div className="text-center truncate max-w-md">
              <span className="text-[11px] uppercase tracking-wider block font-sans opacity-70">
                Chapter {currentChapterIndex + 1} of {book.chapters.length} · {chapterProgress}%
              </span>
              <span className="font-serif font-medium text-xs sm:text-sm truncate block">
                {currentChapter.title}
              </span>
            </div>

            {/* Controls: Settings, Notes, Zen */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsNotesOpen(!isNotesOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border ${themeStyles.border} ${
                  isNotesOpen ? themeStyles.cardBg : 'bg-transparent'
                } transition-colors`}
                title="Open Margin Notes & Highlights"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Notes ({bookAnnotations.length})</span>
              </button>

              <button
                onClick={onOpenSettings}
                className={`p-1.5 rounded-lg border ${themeStyles.border} ${themeStyles.secondaryText} hover:${themeStyles.text} transition-colors`}
                title="Typography & Reading Tone Settings"
                aria-label="Typography settings"
              >
                <Sliders className="w-4 h-4" />
              </button>

              <button
                onClick={onToggleZenMode}
                className={`p-1.5 rounded-lg border ${themeStyles.border} ${themeStyles.secondaryText} hover:${themeStyles.text} transition-colors`}
                title="Enter Distraction-Free Zen View (Esc)"
                aria-label="Enter Zen Mode"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        </nav>
      )}

      {/* Main Reading Container */}
      <main 
        ref={contentRef}
        onMouseUp={handleTextSelection}
        className={`mx-auto ${getColumnMaxWidth()} px-6 sm:px-8 py-12 md:py-16 transition-all`}
      >
        
        {/* Book & Chapter Header */}
        <header className="mb-10 text-center space-y-2 border-b pb-8 border-current/10">
          <div className="text-xs uppercase tracking-widest font-sans opacity-60">
            {book.discipline} · {book.year}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight leading-tight">
            {book.title}
          </h1>
          <div className="text-sm font-sans opacity-80 pt-1">
            By <span className="font-medium">{book.author}</span>
          </div>

          <div className="pt-4 text-xs italic opacity-75">
            {currentChapter.title} {currentChapter.subtitle ? `— ${currentChapter.subtitle}` : ''}
          </div>
        </header>

        {/* Floating Quick Highlight Prompt when text is selected */}
        {selectedText && (
          <div className="sticky top-16 z-30 p-3 mb-6 rounded-xl bg-white shadow-xl border border-[#DDD5C7] text-[#2C2825] animate-fade-in flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#8A7458] flex items-center gap-1">
                <Highlighter className="w-3.5 h-3.5" />
                <span>Save Selected Thought</span>
              </span>
              <button 
                onClick={() => setSelectedText('')}
                className="text-[#888] hover:text-[#222]"
              >
                Cancel
              </button>
            </div>

            <div className="text-xs italic bg-[#FAF7F2] p-2 rounded border border-[#EDE7DD] max-h-16 overflow-y-auto line-clamp-2">
              "{selectedText}"
            </div>

            <input
              type="text"
              placeholder="Add personal margin note (optional)..."
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-[#DDD5C7] focus:outline-none focus:ring-1 focus:ring-[#2C2825]"
            />

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                {(['amber', 'emerald', 'rose', 'indigo'] as const).map((color) => (
                  <button
                    key={color}
                    onClick={() => setHighlightColor(color)}
                    className={`w-5 h-5 rounded-full border transition-all ${
                      highlightColor === color ? 'ring-2 ring-black scale-110' : 'opacity-70'
                    } ${
                      color === 'amber' ? 'bg-[#FBE4A8]' :
                      color === 'emerald' ? 'bg-[#C2E8CE]' :
                      color === 'rose' ? 'bg-[#F9CECE]' : 'bg-[#D0DAF9]'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={saveSelectedHighlight}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-[#2C2825] text-white hover:bg-[#433D39] transition-colors"
              >
                Save to Notes
              </button>
            </div>
          </div>
        )}

        {/* Reading Text Content */}
        <article 
          className={`space-y-6 ${getFontFamilyClass()}`}
          style={{ 
            fontSize: `${settings.fontSize}px`, 
            lineHeight: settings.lineHeight 
          }}
        >
          {currentChapter.content.map((paragraph, pIndex) => {
            const isHovered = activeHoverParagraph === pIndex;
            const isMaskActive = settings.focusLineMask;
            
            // Render Bionic words if active, otherwise pure text
            let renderedContent: React.ReactNode = paragraph;
            if (settings.bionicReading) {
              const words = paragraph.split(' ');
              renderedContent = words.map((w, wIdx) => {
                const { bold, regular } = parseBionicWord(w);
                return (
                  <span key={wIdx}>
                    <strong className="font-semibold opacity-100">{bold}</strong>
                    <span>{regular}</span>{' '}
                  </span>
                );
              });
            }

            return (
              <p
                key={pIndex}
                onMouseEnter={() => setActiveHoverParagraph(pIndex)}
                onMouseLeave={() => setActiveHoverParagraph(null)}
                className={`transition-opacity duration-200 select-text cursor-text ${
                  isMaskActive && activeHoverParagraph !== null && !isHovered
                    ? 'opacity-25'
                    : 'opacity-100'
                }`}
              >
                {renderedContent}
              </p>
            );
          })}
        </article>

        {/* Chapter Reflection & Pacing Prompts */}
        <section className={`mt-14 p-6 rounded-2xl ${themeStyles.cardBg} border ${themeStyles.border} space-y-4`}>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold opacity-75">
            <Sparkles className="w-3.5 h-3.5 text-[#8A7458]" />
            <span>Scholar Reflection Prompt</span>
          </div>

          <p className="font-serif italic text-base">
            "{book.focusPrompt}"
          </p>

          <div className="space-y-2">
            <textarea
              rows={3}
              value={reflectionAnswer}
              onChange={(e) => setReflectionAnswer(e.target.value)}
              placeholder="Record your reflection on this passage before turning the page..."
              className={`w-full p-3 text-xs rounded-xl border ${themeStyles.border} bg-white/70 focus:outline-none focus:ring-1 focus:ring-current`}
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] opacity-60">
                Saved locally to your study journal
              </span>
              <button
                onClick={() => {
                  if (reflectionAnswer.trim()) {
                    onAddAnnotation({
                      bookId: book.id,
                      chapterIndex: currentChapterIndex,
                      highlightedText: `Reflection on Chapter ${currentChapterIndex + 1}: ${book.focusPrompt}`,
                      note: reflectionAnswer.trim(),
                      color: 'indigo',
                    });
                    setSavedReflection(true);
                    setTimeout(() => setSavedReflection(false), 2000);
                  }
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#2C2825] text-white hover:bg-[#433D39] transition-colors"
              >
                {savedReflection ? 'Reflection Saved!' : 'Record Thought'}
              </button>
            </div>
          </div>
        </section>

        {/* Chapter Pagination Footer */}
        <footer className="mt-12 pt-6 border-t border-current/10 flex items-center justify-between">
          <button
            onClick={() => {
              if (currentChapterIndex > 0) {
                setCurrentChapterIndex(currentChapterIndex - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            disabled={currentChapterIndex === 0}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border ${themeStyles.border} disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Chapter</span>
          </button>

          <span className="text-xs opacity-60 font-mono">
            {currentChapter.wordCount.toLocaleString()} words in this chapter
          </span>

          {currentChapterIndex < book.chapters.length - 1 ? (
            <button
              onClick={() => {
                setCurrentChapterIndex(currentChapterIndex + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[#2C2825] text-white hover:bg-[#433D39] transition-colors"
            >
              <span>Next Chapter</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onFinishReading(book.id, book.wordCount)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[#285A34] text-white hover:bg-[#1E4527] transition-colors shadow-2xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Complete Text</span>
            </button>
          )}
        </footer>

      </main>

      {/* Slide-out Marginalia / Notes Drawer */}
      {isNotesOpen && !isZenMode && (
        <aside 
          className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm ${themeStyles.bg} shadow-2xl border-l ${themeStyles.border} flex flex-col animate-slide-left`}
        >
          <div className="p-4 border-b border-current/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#8A7458]" />
              <h3 className="font-serif text-sm font-medium">Marginalia & Highlights</h3>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleExportMarkdown}
                className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-white border border-[#DDD5C7] text-[#333] hover:bg-[#F2ECE1] transition-colors"
                title="Export annotations to Markdown (.md)"
              >
                <Download className="w-3 h-3" />
                <span>{copiedNotes ? 'Exported!' : 'Export .md'}</span>
              </button>

              <button
                onClick={() => setIsNotesOpen(false)}
                className="p-1 rounded-md opacity-70 hover:opacity-100"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
            {bookAnnotations.length === 0 ? (
              <div className="text-center py-10 opacity-60 space-y-2">
                <BookmarkCheck className="w-8 h-8 mx-auto stroke-1" />
                <p>No highlights yet.</p>
                <p className="text-[11px]">Select any sentence on the page to save a thought or highlight.</p>
              </div>
            ) : (
              bookAnnotations.map((anno) => (
                <div 
                  key={anno.id}
                  className={`p-3 rounded-xl border ${themeStyles.border} ${themeStyles.cardBg} space-y-2 relative group`}
                >
                  <div className="flex items-center justify-between text-[11px] opacity-60">
                    <span>Chapter {anno.chapterIndex + 1}</span>
                    <button
                      onClick={() => onDeleteAnnotation(anno.id)}
                      className="opacity-0 group-hover:opacity-100 text-rose-600 transition-opacity"
                      title="Delete highlight"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <blockquote className="border-l-2 pl-2 border-current/30 italic text-xs leading-relaxed">
                    "{anno.highlightedText}"
                  </blockquote>

                  {anno.note && (
                    <div className="text-xs font-sans pt-1 font-medium text-[#2C2825]">
                      Thought: {anno.note}
                    </div>
                  )}

                  <div className="text-[10px] opacity-50 pt-1">
                    {anno.createdAt}
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      )}

    </div>
  );
};
