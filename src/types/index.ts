export type ReadingTheme = 'paper' | 'sepia' | 'sage' | 'charcoal' | 'midnight';
export type ReadingFont = 'serif' | 'sans' | 'mono' | 'dyslexic';
export type ColumnWidth = 'narrow' | 'medium' | 'wide';

export interface Chapter {
  id: string;
  title: string;
  subtitle?: string;
  content: string[];
  wordCount: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  year: string;
  discipline: string;
  category: 'Cognitive Science' | 'Philosophy' | 'Literature' | 'Environmental' | 'Computing History' | 'Education';
  estimatedMinutes: number;
  wordCount: number;
  abstract: string;
  whyRead: string;
  coverTone: string;
  chapters: Chapter[];
  focusPrompt: string;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  work: string;
  discipline: string;
}

export interface ReadingSettings {
  theme: ReadingTheme;
  font: ReadingFont;
  fontSize: number; // 16 to 28
  lineHeight: number; // 1.5 to 2.2
  columnWidth: ColumnWidth;
  focusLineMask: boolean;
  bionicReading: boolean;
  rulerGuide: boolean;
}

export interface Annotation {
  id: string;
  bookId: string;
  chapterIndex: number;
  highlightedText: string;
  note?: string;
  color: 'amber' | 'emerald' | 'rose' | 'indigo';
  createdAt: string;
}

export type SoundscapeType = 'none' | 'rain' | 'binaural' | 'wind' | 'library';

export interface FocusSessionStats {
  totalMinutesFocused: number;
  completedSprints: number;
  wordsRead: number;
  calmCheckins: number;
}

export interface FunctionalRequirement {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
}

export interface NonFunctionalRequirement {
  id: string;
  category: 'Performance' | 'Accessibility' | 'Usability & Aesthetics' | 'Data Privacy' | 'Reliability';
  requirement: string;
  targetMetric: string;
}

export interface DataFieldSpec {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

export interface SchemaSpec {
  name: string;
  description: string;
  storageTarget: 'Memory / State' | 'localStorage' | 'Web Audio API';
  fields: DataFieldSpec[];
}

export interface ProductArchitectureSpec {
  problemStatement: string;
  primaryObjectives: {
    title: string;
    description: string;
    metrics: string;
  }[];
  coreValueProposition: {
    headline: string;
    pillars: {
      name: string;
      description: string;
    }[];
  };
  bottlenecks: {
    title: string;
    traditionalIssue: string;
    luminaSolution: string;
  }[];
  functionalRequirements: FunctionalRequirement[];
  nonFunctionalRequirements: NonFunctionalRequirement[];
  dataSchemas: SchemaSpec[];
}
