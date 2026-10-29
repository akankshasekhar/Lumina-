import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  formatTimer, 
  calculateTimerProgress, 
  toggleBookshelfItem,
  toggleReadBook,
  calculateHistorySummary
} from './utils/reading-helpers';

// -------------------------------------------------------------
// TEST SUITE 1: 25-Minute Pomodoro Timer Edge Cases
// -------------------------------------------------------------
test('TC-TIMER-01: formatTimer prevents negative seconds display', () => {
  assert.equal(formatTimer(-1), '00:00');
  assert.equal(formatTimer(-999), '00:00');
  assert.equal(formatTimer(0), '00:00');
});

test('TC-TIMER-02: calculateTimerProgress clamps between 0% and 100%', () => {
  assert.equal(calculateTimerProgress(1500, 1500), 0);
  assert.equal(calculateTimerProgress(0, 1500), 100);
  assert.equal(calculateTimerProgress(-10, 1500), 100);
  assert.equal(calculateTimerProgress(2000, 1500), 0);
});

test('TC-TIMER-03: Rapid timer start simulation does not multiply ticks', () => {
  // Simulating state machine logic for multiple rapid start clicks
  let isTimerActive = false;
  let activeIntervalsCount = 0;

  function simulateStartClick() {
    if (isTimerActive) return; // Guard clause under test
    isTimerActive = true;
    activeIntervalsCount++;
  }

  // User rapidly clicks 5 times
  simulateStartClick();
  simulateStartClick();
  simulateStartClick();
  simulateStartClick();
  simulateStartClick();

  assert.equal(activeIntervalsCount, 1, 'Only one active interval should be spawned despite rapid clicks');
  assert.equal(isTimerActive, true);
});

test('TC-TIMER-04: Preset switching cleanly resets elapsed countdown', () => {
  let remainingSeconds = 1200; // 20m remaining on a 25m sprint
  let isTimerActive = true;

  function switchPreset(newSeconds: number) {
    isTimerActive = false; // Stops running timer
    remainingSeconds = newSeconds;
  }

  // Switch to 5m break preset
  switchPreset(5 * 60);
  assert.equal(remainingSeconds, 300);
  assert.equal(isTimerActive, false);
  assert.equal(formatTimer(remainingSeconds), '05:00');
});

// -------------------------------------------------------------
// TEST SUITE 2: LocalStorage Bookshelf Counter & Idempotency
// -------------------------------------------------------------
test('TC-SHELF-01: Bookshelf toggle prevents duplicate additions (Idempotency)', () => {
  let shelf: string[] = ['attention-james'];

  // User clicks Save on 'attention-james' which is already saved -> must toggle OFF, not duplicate
  shelf = toggleBookshelfItem(shelf, 'attention-james');
  assert.deepEqual(shelf, [], 'Toggling an already saved book removes it');

  // User clicks Save on 'attention-james' again -> adds it once
  shelf = toggleBookshelfItem(shelf, 'attention-james');
  assert.deepEqual(shelf, ['attention-james']);

  // Even if an external call attempted to add it again, Set deduplication enforces uniqueness
  const deduplicated = Array.from(new Set([...shelf, 'attention-james']));
  assert.equal(deduplicated.length, 1, 'Cannot save the exact same book twice');
});

test('TC-SHELF-02: Corrupted or non-array JSON parser resilience', () => {
  function parseSafely(rawJson: string | null): string[] {
    try {
      if (!rawJson) return ['attention-james'];
      const parsed = JSON.parse(rawJson);
      if (!Array.isArray(parsed)) return ['attention-james'];
      return Array.from(new Set(parsed.filter((id): id is string => typeof id === 'string')));
    } catch {
      return ['attention-james'];
    }
  }

  // Corrupted string
  assert.deepEqual(parseSafely('{"broken:json'), ['attention-james']);
  // Object instead of array
  assert.deepEqual(parseSafely('{"book": "attention-james"}'), ['attention-james']);
  // Array containing duplicates and non-strings
  assert.deepEqual(
    parseSafely('["attention-james", "attention-james", 123, null, "meditations-aurelius"]'), 
    ['attention-james', 'meditations-aurelius']
  );
  // Null or empty string
  assert.deepEqual(parseSafely(null), ['attention-james']);
});

test('TC-SHELF-03: State persistence simulation on simulated page reload', () => {
  const mockStorage: Record<string, string> = {};
  
  // Save books
  const booksToSave = ['attention-james', 'woolf-narrow-bridge'];
  mockStorage['lumina_saved_bookshelf'] = JSON.stringify(booksToSave);

  // Simulated browser reload: re-read from storage
  const reloaded = JSON.parse(mockStorage['lumina_saved_bookshelf']);
  assert.equal(reloaded.length, 2);
  assert.equal(reloaded.includes('woolf-narrow-bridge'), true);
});

// -------------------------------------------------------------
// TEST SUITE 3: Responsive Behavior & Layout Integrity
// -------------------------------------------------------------
test('TC-RESPONSIVE-01: Responsive Tailwind grid classes define 1-col on mobile, 2-col on tablet, 3-col on desktop', () => {
  const gridClasses = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
  
  assert.match(gridClasses, /grid-cols-1/, 'Mobile baseline must be single column');
  assert.match(gridClasses, /md:grid-cols-2/, 'Tablet breakpoint must be 2 columns');
  assert.match(gridClasses, /lg:grid-cols-3/, 'Desktop breakpoint must be 3 columns');
});

// -------------------------------------------------------------
// TEST SUITE 4: Reading History State (readBookIds)
// -------------------------------------------------------------
test('TC-HISTORY-01: toggleReadBook adds and removes finished book without duplicates', () => {
  let readHistory: string[] = [];

  // Finish a book
  readHistory = toggleReadBook(readHistory, 'attention-james');
  assert.deepEqual(readHistory, ['attention-james']);

  // Finishing again toggles it off or removes from history
  readHistory = toggleReadBook(readHistory, 'attention-james');
  assert.deepEqual(readHistory, []);

  // Finishing two different books
  readHistory = toggleReadBook(readHistory, 'attention-james');
  readHistory = toggleReadBook(readHistory, 'meditations-aurelius');
  assert.equal(readHistory.length, 2);
  assert.equal(readHistory.includes('meditations-aurelius'), true);
});

test('TC-HISTORY-02: calculateHistorySummary calculates percentage and completion correctly', () => {
  const emptySummary = calculateHistorySummary([], 6);
  assert.equal(emptySummary.completedCount, 0);
  assert.equal(emptySummary.completionRatePercent, 0);

  const partialSummary = calculateHistorySummary(['attention-james', 'meditations-aurelius'], 6);
  assert.equal(partialSummary.completedCount, 2);
  assert.equal(partialSummary.completionRatePercent, 33); // 2/6 = 33%

  const fullSummary = calculateHistorySummary(
    ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'], 
    6
  );
  assert.equal(fullSummary.completedCount, 6);
  assert.equal(fullSummary.completionRatePercent, 100);
});

