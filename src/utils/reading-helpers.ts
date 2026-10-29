import type { Annotation } from '../types';

/**
 * Calculates word count, estimated reading time, and character count
 */
export function calculateReadingMetrics(text: string, wordsPerMinute = 220) {
  if (!text || text.trim().length === 0) {
    return {
      wordCount: 0,
      readingMinutes: 0,
      charCount: 0,
    };
  }

  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  const charCount = text.length;

  return {
    wordCount,
    readingMinutes,
    charCount,
  };
}

/**
 * Formats a duration in seconds to MM:SS
 */
export function formatTimer(totalSeconds: number): string {
  if (totalSeconds < 0) totalSeconds = 0;
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Generates Bionic Reading formatting tokens:
 * Highlights the initial fixation anchors (45%-55%) of each word
 */
export interface BionicWordPart {
  bold: string;
  regular: string;
}

export function parseBionicWord(word: string): BionicWordPart {
  const match = word.match(/^([a-zA-Z0-9]+)(.*)$/);
  if (!match) {
    return { bold: word, regular: '' };
  }

  const [, letters, punctuation] = match;
  const len = letters.length;
  let boldCount = 1;

  if (len <= 1) boldCount = 1;
  else if (len <= 3) boldCount = 1;
  else if (len <= 5) boldCount = 2;
  else if (len <= 8) boldCount = Math.ceil(len * 0.5);
  else boldCount = Math.ceil(len * 0.42);

  const bold = letters.slice(0, boldCount);
  const regular = letters.slice(boldCount) + punctuation;

  return { bold, regular };
}

/**
 * Exports highlights & annotations to clean academic Markdown
 */
export function exportNotesToMarkdown(
  bookTitle: string,
  author: string,
  annotations: Annotation[]
): string {
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const lines = [
    `# Study Notes: ${bookTitle}`,
    `**Author**: ${author}`,
    `**Exported from Lumina Digital Library**: ${dateStr}`,
    `**Total Highlights & Margin Thoughts**: ${annotations.length}`,
    '',
    '---',
    '',
  ];

  if (annotations.length === 0) {
    lines.push('_No annotations saved for this text yet._');
    return lines.join('\n');
  }

  annotations.forEach((anno, idx) => {
    lines.push(`### Highlight #${idx + 1} (Chapter ${anno.chapterIndex + 1})`);
    lines.push(`> "${anno.highlightedText}"`);
    lines.push('');
    if (anno.note && anno.note.trim().length > 0) {
      lines.push(`**Thought**: ${anno.note.trim()}`);
      lines.push('');
    }
    lines.push(`_Saved on ${anno.createdAt} · Tag: ${anno.color}_`);
    lines.push('');
  });

  return lines.join('\n');
}

/**
 * Computes deep reading session summary statistics
 */
export function calculateFocusEfficiency(
  targetSeconds: number,
  elapsedSeconds: number,
  wordsRead: number
): {
  completionPercentage: number;
  averageWpm: number;
  calmGrade: 'Deep Flow' | 'Sustained' | 'Gentle Stride';
} {
  const completionPercentage = targetSeconds > 0 
    ? Math.min(100, Math.round((elapsedSeconds / targetSeconds) * 100))
    : 100;

  const minutes = Math.max(0.1, elapsedSeconds / 60);
  const averageWpm = Math.round(wordsRead / minutes);

  let calmGrade: 'Deep Flow' | 'Sustained' | 'Gentle Stride' = 'Gentle Stride';
  if (elapsedSeconds >= 1200) {
    calmGrade = 'Deep Flow';
  } else if (elapsedSeconds >= 600) {
    calmGrade = 'Sustained';
  }

  return {
    completionPercentage,
    averageWpm,
    calmGrade,
  };
}

/**
 * Pure helper to toggle item presence in bookshelf
 */
export function toggleBookshelfItem(savedIds: string[], id: string): string[] {
  if (savedIds.includes(id)) {
    return savedIds.filter(item => item !== id);
  }
  return [...savedIds, id];
}

/**
 * Pure helper to toggle item presence in reading history (finished books)
 */
export function toggleReadBook(readIds: string[], id: string): string[] {
  if (readIds.includes(id)) {
    return readIds.filter(item => item !== id);
  }
  return [...readIds, id];
}

/**
 * Computes reading history completion summary
 */
export function calculateHistorySummary(
  readIds: string[],
  totalBooksCount = 6
): {
  completedCount: number;
  totalCount: number;
  completionRatePercent: number;
} {
  const completedCount = Array.from(new Set(readIds)).length;
  const completionRatePercent = totalBooksCount > 0
    ? Math.round((completedCount / totalBooksCount) * 100)
    : 0;
  return {
    completedCount,
    totalCount: totalBooksCount,
    completionRatePercent,
  };
}

/**
 * Calculates next cyclic index for dynamic quote rotation
 */
export function getNextQuoteIndex(current: number, total: number): number {
  if (total <= 0) return 0;
  return (current + 1) % total;
}

/**
 * Calculates previous cyclic index for dynamic quote rotation
 */
export function getPrevQuoteIndex(current: number, total: number): number {
  if (total <= 0) return 0;
  return (current - 1 + total) % total;
}

/**
 * Calculates remaining progress percentage for Pomodoro timer
 */
export function calculateTimerProgress(remainingSeconds: number, totalSeconds = 1500): number {
  if (totalSeconds <= 0) return 100;
  const elapsed = Math.max(0, totalSeconds - Math.max(0, remainingSeconds));
  return Math.min(100, Math.round((elapsed / totalSeconds) * 100));
}

