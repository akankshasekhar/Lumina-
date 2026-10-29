import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateReadingMetrics,
  formatTimer,
  parseBionicWord,
  exportNotesToMarkdown,
  calculateFocusEfficiency,
  toggleBookshelfItem,
  getNextQuoteIndex,
  getPrevQuoteIndex,
  calculateTimerProgress,
} from './reading-helpers';

test('calculateReadingMetrics handles empty and whitespace strings', () => {
  const result = calculateReadingMetrics('   ');
  assert.equal(result.wordCount, 0);
  assert.equal(result.readingMinutes, 0);
  assert.equal(result.charCount, 0);
});

test('calculateReadingMetrics calculates words and estimated reading time', () => {
  const sample = 'Attention is the taking possession by the mind in clear and vivid form of one out of what seem several simultaneously possible objects or trains of thought.';
  const result = calculateReadingMetrics(sample, 20);
  assert.equal(result.wordCount, 27);
  assert.equal(result.readingMinutes, 2); // ceil(27 / 20) = 2
  assert.equal(result.charCount, sample.length);
});

test('formatTimer formats seconds into MM:SS format', () => {
  assert.equal(formatTimer(0), '00:00');
  assert.equal(formatTimer(65), '01:05');
  assert.equal(formatTimer(1500), '25:00');
  assert.equal(formatTimer(-10), '00:00');
});

test('parseBionicWord splits word into anchor bold characters and suffix', () => {
  const single = parseBionicWord('a');
  assert.equal(single.bold, 'a');
  assert.equal(single.regular, '');

  const medium = parseBionicWord('reading');
  assert.equal(medium.bold.length + medium.regular.length, 7);
  assert.equal(medium.bold, 'read');
  assert.equal(medium.regular, 'ing');

  const withPunctuation = parseBionicWord('calm,');
  assert.equal(withPunctuation.bold, 'ca');
  assert.equal(withPunctuation.regular, 'lm,');
});

test('exportNotesToMarkdown formats highlights into valid Markdown structure', () => {
  const md = exportNotesToMarkdown('Meditations', 'Marcus Aurelius', [
    {
      id: 'anno-1',
      bookId: 'meditations',
      chapterIndex: 0,
      highlightedText: 'You have power over your mind - not outside events.',
      note: 'Foundational stoic principle for study focus',
      color: 'amber',
      createdAt: 'Oct 29, 2026',
    },
  ]);

  assert.match(md, /# Study Notes: Meditations/);
  assert.match(md, /> "You have power over your mind - not outside events."/);
  assert.match(md, /Foundational stoic principle for study focus/);
});

test('calculateFocusEfficiency evaluates completion and calm grade', () => {
  const res = calculateFocusEfficiency(1500, 1500, 600);
  assert.equal(res.completionPercentage, 100);
  assert.equal(res.calmGrade, 'Deep Flow');
  assert.equal(res.averageWpm, 24);
});

test('toggleBookshelfItem adds item when not present and removes when present', () => {
  const initial = ['book-1', 'book-2'];
  const added = toggleBookshelfItem(initial, 'book-3');
  assert.deepEqual(added, ['book-1', 'book-2', 'book-3']);

  const removed = toggleBookshelfItem(added, 'book-2');
  assert.deepEqual(removed, ['book-1', 'book-3']);
});

test('getNextQuoteIndex and getPrevQuoteIndex cycle boundaries correctly', () => {
  assert.equal(getNextQuoteIndex(0, 6), 1);
  assert.equal(getNextQuoteIndex(5, 6), 0);
  assert.equal(getPrevQuoteIndex(0, 6), 5);
  assert.equal(getPrevQuoteIndex(3, 6), 2);
});

test('calculateTimerProgress computes percentage accurately', () => {
  assert.equal(calculateTimerProgress(1500, 1500), 0);
  assert.equal(calculateTimerProgress(750, 1500), 50);
  assert.equal(calculateTimerProgress(0, 1500), 100);
});
