import React, { useState, useEffect } from 'react';
import type { 
  Book, 
  ReadingSettings, 
  Annotation, 
  SoundscapeType, 
  FocusSessionStats 
} from './types';
import { initialBooks } from './data/library';
import { soundscapes } from './utils/soundscapes';
import { toggleBookshelfItem } from './utils/reading-helpers';
import { Header } from './components/Header';
import { LibraryView } from './components/LibraryView';
import { ReaderView } from './components/ReaderView';
import { BookshelfDrawer } from './components/BookshelfDrawer';
import { FocusStudioModal } from './components/FocusStudioModal';
import { ProductBlueprintModal } from './components/ProductBlueprintModal';
import { ReaderSettingsDrawer } from './components/ReaderSettingsDrawer';

const DEFAULT_SETTINGS: ReadingSettings = {
  theme: 'paper',
  font: 'serif',
  fontSize: 19,
  lineHeight: 1.8,
  columnWidth: 'medium',
  focusLineMask: false,
  bionicReading: false,
  rulerGuide: false,
};

export default function App() {
  const [currentView, setCurrentView] = useState<'library' | 'reader'>('library');
  const [selectedBook, setSelectedBook] = useState<Book>(initialBooks[0]);
  
  // Settings
  const [settings, setSettings] = useState<ReadingSettings>(() => {
    try {
      const saved = localStorage.getItem('lumina_reading_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Modal and drawer visibility
  const [isZenMode, setIsZenMode] = useState(false);
  const [isFocusStudioOpen, setIsFocusStudioOpen] = useState(false);
  const [isBlueprintOpen, setIsBlueprintOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBookshelfOpen, setIsBookshelfOpen] = useState(false);

  // Soundscape state
  const [soundscapeType, setSoundscapeType] = useState<SoundscapeType>('none');
  const [soundscapeVolume, setSoundscapeVolume] = useState<number>(0.5);

  // Sprint Timer state (Default 25m Pomodoro = 1500 seconds)
  const [timerSeconds, setTimerSeconds] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Feature 3: Interactive Bookshelf state persisted via localStorage
  const [savedBookIds, setSavedBookIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_saved_bookshelf');
      if (saved) return JSON.parse(saved);
      // Pre-seed 2 books for immediate visual validation
      return ['attention-james', 'meditations-aurelius'];
    } catch {
      return ['attention-james', 'meditations-aurelius'];
    }
  });

  // Annotations
  const [annotations, setAnnotations] = useState<Annotation[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_annotations');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'starter-1',
          bookId: 'attention-james',
          chapterIndex: 0,
          highlightedText: 'Everyone knows what attention is. It is the taking possession by the mind, in clear and vivid form, of one out of what seem several simultaneously possible objects or trains of thought.',
          note: 'The fundamental definition of cognitive selection in university scholarship.',
          color: 'amber',
          createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        },
      ];
    } catch {
      return [];
    }
  });

  // Read books
  const [readBookIds, setReadBookIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_read_books');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Session Stats
  const [sessionStats, setSessionStats] = useState<FocusSessionStats>(() => {
    try {
      const saved = localStorage.getItem('lumina_stats');
      return saved ? JSON.parse(saved) : {
        totalMinutesFocused: 45,
        completedSprints: 2,
        wordsRead: 1850,
        calmCheckins: 3,
      };
    } catch {
      return {
        totalMinutesFocused: 45,
        completedSprints: 2,
        wordsRead: 1850,
        calmCheckins: 3,
      };
    }
  });

  // Persist bookshelf to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lumina_saved_bookshelf', JSON.stringify(savedBookIds));
    } catch {
      // Ignored
    }
  }, [savedBookIds]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem('lumina_reading_settings', JSON.stringify(settings));
    } catch {
      // Ignored
    }
  }, [settings]);

  // Persist annotations
  useEffect(() => {
    try {
      localStorage.setItem('lumina_annotations', JSON.stringify(annotations));
    } catch {
      // Ignored
    }
  }, [annotations]);

  // Persist read status
  useEffect(() => {
    try {
      localStorage.setItem('lumina_read_books', JSON.stringify(readBookIds));
    } catch {
      // Ignored
    }
  }, [readBookIds]);

  // Persist session stats
  useEffect(() => {
    try {
      localStorage.setItem('lumina_stats', JSON.stringify(sessionStats));
    } catch {
      // Ignored
    }
  }, [sessionStats]);

  // Feature 4: Toggle Save to Bookshelf without page reloads
  const handleToggleBookshelf = (bookId: string) => {
    setSavedBookIds((prev) => toggleBookshelfItem(prev, bookId));
  };

  const handleClearBookshelf = () => {
    setSavedBookIds([]);
  };

  // Focus Timer countdown effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setSessionStats((curr) => ({
              ...curr,
              completedSprints: curr.completedSprints + 1,
              totalMinutesFocused: curr.totalMinutesFocused + 25,
            }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  // Soundscape management
  const handleSelectSoundscape = (type: SoundscapeType) => {
    setSoundscapeType(type);
    soundscapes.play(type);
  };

  const handleToggleSoundscape = () => {
    if (soundscapeType === 'none') {
      handleSelectSoundscape('rain');
    } else {
      handleSelectSoundscape('none');
    }
  };

  const handleChangeVolume = (vol: number) => {
    setSoundscapeVolume(vol);
    soundscapes.setVolume(vol);
  };

  // Timer controls
  const handleStartTimer = () => setIsTimerRunning(true);
  const handlePauseTimer = () => setIsTimerRunning(false);
  const handleResetTimer = (seconds: number) => {
    setIsTimerRunning(false);
    setTimerSeconds(seconds);
  };

  // Annotations
  const handleAddAnnotation = (annoData: Omit<Annotation, 'id' | 'createdAt'>) => {
    const newAnno: Annotation = {
      ...annoData,
      id: `anno-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setAnnotations((prev) => [newAnno, ...prev]);
  };

  const handleDeleteAnnotation = (id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  };

  // Completion
  const handleFinishReading = (bookId: string, wordsCount: number) => {
    if (!readBookIds.includes(bookId)) {
      setReadBookIds((prev) => [...prev, bookId]);
    }
    setSessionStats((curr) => ({
      ...curr,
      wordsRead: curr.wordsRead + wordsCount,
    }));
    setCurrentView('library');
  };

  const savedBooks = initialBooks.filter(b => savedBookIds.includes(b.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2C2825]">
      
      {/* Feature 3: Sticky Transparent Navbar with Interactive Bookshelf Counter */}
      <Header
        currentView={currentView}
        activeBookTitle={selectedBook.title}
        onNavigate={(view) => {
          setIsZenMode(false);
          setCurrentView(view);
        }}
        onOpenFocusStudio={() => setIsFocusStudioOpen(true)}
        onOpenBlueprint={() => setIsBlueprintOpen(true)}
        onOpenBookshelf={() => setIsBookshelfOpen(true)}
        savedBooksCount={savedBookIds.length}
        isZenMode={isZenMode}
        onToggleZenMode={() => setIsZenMode(!isZenMode)}
        soundscapeType={soundscapeType}
        soundscapeVolume={soundscapeVolume}
        onToggleSoundscape={handleToggleSoundscape}
        onChangeVolume={handleChangeVolume}
        timerSeconds={timerSeconds}
        isTimerRunning={isTimerRunning}
        onToggleTimer={() => setIsTimerRunning(!isTimerRunning)}
      />

      {/* Main View Area */}
      <div className="flex-1">
        {currentView === 'library' ? (
          <LibraryView
            books={initialBooks}
            onSelectBook={(book) => {
              setSelectedBook(book);
              setCurrentView('reader');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            onOpenBlueprint={() => setIsBlueprintOpen(true)}
            onOpenFocusStudio={() => setIsFocusStudioOpen(true)}
            readBookIds={readBookIds}
            savedBookIds={savedBookIds}
            onToggleBookshelf={handleToggleBookshelf}
          />
        ) : (
          <ReaderView
            book={selectedBook}
            onBackToLibrary={() => {
              setIsZenMode(false);
              setCurrentView('library');
            }}
            settings={settings}
            onOpenSettings={() => setIsSettingsOpen(true)}
            isZenMode={isZenMode}
            onToggleZenMode={() => setIsZenMode(!isZenMode)}
            annotations={annotations}
            onAddAnnotation={handleAddAnnotation}
            onDeleteAnnotation={handleDeleteAnnotation}
            onFinishReading={handleFinishReading}
          />
        )}
      </div>

      {/* Bookshelf Slide-out Drawer */}
      <BookshelfDrawer
        isOpen={isBookshelfOpen}
        onClose={() => setIsBookshelfOpen(false)}
        savedBooks={savedBooks}
        onSelectBook={(book) => {
          setSelectedBook(book);
          setCurrentView('reader');
          setIsBookshelfOpen(false);
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
        onRemoveFromBookshelf={handleToggleBookshelf}
        onClearBookshelf={handleClearBookshelf}
      />

      {/* Feature 5: Minimalist 25m Focus Timer Modal */}
      <FocusStudioModal
        isOpen={isFocusStudioOpen}
        onClose={() => setIsFocusStudioOpen(false)}
        timerSeconds={timerSeconds}
        isTimerRunning={isTimerRunning}
        onStartTimer={handleStartTimer}
        onPauseTimer={handlePauseTimer}
        onResetTimer={handleResetTimer}
        soundscapeType={soundscapeType}
        soundscapeVolume={soundscapeVolume}
        onSelectSoundscape={handleSelectSoundscape}
        onChangeVolume={handleChangeVolume}
        stats={sessionStats}
      />

      {/* EdTech Product Architecture & Requirements Blueprint Modal */}
      <ProductBlueprintModal
        isOpen={isBlueprintOpen}
        onClose={() => setIsBlueprintOpen(false)}
      />

      {/* Typographic & Tone Settings Drawer */}
      <ReaderSettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onChangeSettings={(newSettings) => setSettings((prev) => ({ ...prev, ...newSettings }))}
        onResetDefaults={() => setSettings(DEFAULT_SETTINGS)}
      />

    </div>
  );
}
