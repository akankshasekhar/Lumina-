import type { ProductArchitectureSpec } from '../types';

export const productBlueprintData: ProductArchitectureSpec = {
  problemStatement: 
    "Modern digital reading platforms and university library portals induce severe cognitive fragmentation through visual clutter, persistent micro-interruptions, fragmented tooling, and algorithmic discovery overwhelm—preventing students from entering and sustaining the deep attentional states required for rigorous academic scholarship.",

  primaryObjectives: [
    {
      title: "1. Cognitive Load Reduction",
      description: "Strip away superfluous visual noise (popups, side advertisements, gamification badges, uncurated feeds) and deliver an ultra-clean, typographic sanctuary designed strictly around reading comfort and ocular ease.",
      metrics: "Sub-50ms visual restfulness, zero third-party telemetry, 100% distraction-free zen mode.",
    },
    {
      title: "2. Integrated Focus Architecture",
      description: "Unify ambient audio entrainment (binaural alpha waves, organic rain), customizable focus sprints (Pomodoro timer), mindful breathing pauses, and bionic fixation guidance directly within the reading viewport so students never need to context-switch.",
      metrics: "Average student continuous reading duration increased from 8 minutes to 35+ minutes without external app toggling.",
    },
    {
      title: "3. Frictionless, Intentional Discovery",
      description: "Replace algorithmic rabbit holes and infinite scroll doom loops with purposeful, curated academic shelves organized by cognitive intent, reading duration, and conceptual discipline.",
      metrics: "Time-to-first-sentence reduced by 70%; zero algorithmic feed clutter.",
    },
    {
      title: "4. Scholar-Centric Retention & Margin Synthesis",
      description: "Empower frictionless highlighting, thoughtful margin marginalia, and one-click export to standard academic Markdown without account friction or locked ecosystems.",
      metrics: "Zero-barrier local data ownership with portable notes export.",
    },
  ],

  coreValueProposition: {
    headline: "A sanctuary for the academic mind: calm, distraction-free scholarship with native focus tools built into the reading experience.",
    pillars: [
      {
        name: "Zero Visual Clutter",
        description: "Pure editorial typography, customizable paper tones (Cream, Sepia, Sage, Charcoal, Midnight), and zero banner ads or engagement bait.",
      },
      {
        name: "Unified Focus Engine",
        description: "Native offline procedural soundscapes, customizable study sprints, and focus line masks embedded directly alongside your text.",
      },
      {
        name: "Curated Intentionality",
        description: "Academic collections categorized by intellectual discipline and time budget, prioritizing deep comprehension over click-through volume.",
      },
      {
        name: "Respect for Student Agency",
        description: "No invasive tracking, no forced social feeds, and immediate export of thoughts and annotations to your personal study system.",
      },
    ],
  },

  bottlenecks: [
    {
      title: "Cluttered & Fragmented Interfaces",
      traditionalIssue: "Crowded university portals with competing navigation menus, banners, system notifications, and rigid PDF viewers that strain student eyes.",
      luminaSolution: "Minimalist single-page canvas with custom typographical sizing, dynamic column widths, eye-relaxing paper tones, and instant Zen Mode hiding all chrome.",
    },
    {
      title: "Distracting UI & Notification Overload",
      traditionalIssue: "Gamified badges, streak alerts, recommendations widgets, and browser tab proliferation that hijack student executive function.",
      luminaSolution: "Strict anti-slop visual discipline: unboxed metadata, zero intrusive popups, serene animations, and quiet focus states.",
    },
    {
      title: "Fragmented Focus Tools (Context Switching)",
      traditionalIssue: "Students must juggle multiple external windows—a timer app on their phone, Spotify/YouTube for ambient noise, an e-reader, and a notes doc—causing cognitive reorientation friction.",
      luminaSolution: "All-in-one embedded Focus Studio: Web Audio binaural beats and rain synthesis, Pomodoro sprint timer with box-breathing transitions, and native margin notes.",
    },
    {
      title: "Overwhelming Discovery & Algorithmic Bloat",
      traditionalIssue: "Traditional library portals present endless query tables with hundreds of irrelevant results or algorithmic engagement feeds causing choice paralysis.",
      luminaSolution: "Thoughtfully curated seminal texts organized by intellectual domain and reading time budgets, with clear 'Why Read This' guidance.",
    },
  ],

  functionalRequirements: [
    {
      id: 'FR-1',
      title: 'Curated 6-Book Academic Grid',
      description: 'Display 6 curated seminal texts spanning foundational disciplines (Cognitive Science, Philosophy, Literature, Environmental Ethics, Computing History, Education). Each card presents title, author, discipline, publication epoch, estimated reading time, and abstract in a classy, minimalist typography without pill badges.',
      acceptanceCriteria: [
        'Exactly 6 featured books rendered in responsive grid layout.',
        'Metadata formatted as clean unboxed text with typographic separators (·).',
        'Direct "Read Text" action opens the distraction-free reading canvas.',
      ],
    },
    {
      id: 'FR-2',
      title: 'Dynamic Hero Section with Cycling "Quote of the Day"',
      description: 'Feature an inspiring, rotating quote on reading, deep attention, or intellectual discipline in the hero section. Quotes cycle automatically using JavaScript timer intervals, with manual next/prev controls and author attribution.',
      acceptanceCriteria: [
        'Smooth JavaScript cycling every 8 seconds, with pause-on-hover.',
        'Displays quote text, author, source work, and discipline.',
        'Manual chevron buttons allow immediate navigation between quotes.',
      ],
    },
    {
      id: 'FR-3',
      title: 'Interactive Bookshelf Counter in Sticky Transparent Navbar',
      description: 'Sticky transparent navbar with backdrop blur displaying a live bookshelf counter badge (e.g. "My Bookshelf (2)"). Counter updates dynamically as items are saved or removed and persists state across browser reloads via localStorage.',
      acceptanceCriteria: [
        'Navbar remains sticky at viewport top with translucent backdrop blur.',
        'Bookshelf counter reflects real-time number of saved books.',
        'Clicking counter opens slide-out Bookshelf drawer displaying saved books with one-click reading access.',
      ],
    },
    {
      id: 'FR-4',
      title: 'Instant "Save to Bookshelf" Action on Book Cards',
      description: 'Each book card includes an accessible "Save to Bookshelf" button with bookmark icon. Clicking immediately toggles saved/saved state, updates navbar counter without page reload, and synchronizes with localStorage.',
      acceptanceCriteria: [
        'Immediate visual state toggle ("Save to Bookshelf" vs "Saved to Bookshelf").',
        'No browser reload or page flicker upon interaction.',
        'Reopening or refreshing the page retains saved items perfectly.',
      ],
    },
    {
      id: 'FR-5',
      title: 'Minimalist 25-Minute Pomodoro Focus Timer Modal',
      description: 'Dedicated focus modal featuring a clean 25-minute Pomodoro sprint countdown. Includes intuitive Start, Pause, and Reset controls, visual countdown display (MM:SS), progress ring, and optional ambient sound synthesis.',
      acceptanceCriteria: [
        'Default countdown preset of 25:00 minutes with 1-second accuracy.',
        'Active timer indicator in header pulses subtly during active focus sessions.',
        'Supports pause, resume, and reset to presets (25m, 50m, 5m rest).',
      ],
    },
  ],

  nonFunctionalRequirements: [
    {
      id: 'NFR-1',
      category: 'Usability & Aesthetics',
      requirement: 'Adhere to zero-pill metadata discipline, anti-slop principles, intentional typography pairings (Newsreader serif + Plus Jakarta sans), and calming earth tones (Cream #FAF7F2, Sepia, Sage).',
      targetMetric: '100% adherence to editorial guidelines; 0 static pill enclosures.',
    },
    {
      id: 'NFR-2',
      category: 'Performance',
      requirement: 'Sub-100ms state updates for saving books to bookshelf, switching chapters, and starting focus sprints without network roundtrips.',
      targetMetric: '< 16ms render frame updates; 0ms server roundtrips.',
    },
    {
      id: 'NFR-3',
      category: 'Data Privacy',
      requirement: 'Zero third-party tracking, zero external ad scripts, and 100% client-side persistence via browser localStorage for student bookshelf items and notes.',
      targetMetric: '0 tracking cookies; 0 external tracking telemetry requests.',
    },
    {
      id: 'NFR-4',
      category: 'Accessibility',
      requirement: 'WCAG 2.1 AA compliant text contrast ratios (minimum 4.5:1), keyboard accessible navigation (Esc for Zen mode), and dyslexia-friendly font geometry option.',
      targetMetric: 'WCAG AA verified; 100% accessible button labels.',
    },
    {
      id: 'NFR-5',
      category: 'Reliability',
      requirement: 'Procedural audio soundscapes generated in-browser via Web Audio API, functioning completely offline without missing asset errors.',
      targetMetric: '100% offline-ready audio synthesis.',
    },
  ],

  dataSchemas: [
    {
      name: 'Book Schema',
      description: 'Primary entity representing an academic text and its chapter contents.',
      storageTarget: 'Memory / State',
      fields: [
        { name: 'id', type: 'string', description: 'Unique slug identifier (e.g., attention-james)', required: true },
        { name: 'title', type: 'string', description: 'Full scholarly title of the work', required: true },
        { name: 'author', type: 'string', description: 'Author name (e.g., William James)', required: true },
        { name: 'year', type: 'string', description: 'Original publication year or epoch', required: true },
        { name: 'discipline', type: 'string', description: 'Academic discipline category', required: true },
        { name: 'estimatedMinutes', type: 'number', description: 'Estimated reading duration in minutes', required: true },
        { name: 'wordCount', type: 'number', description: 'Total word count across all chapters', required: true },
        { name: 'abstract', type: 'string', description: 'Executive scholarly summary', required: true },
        { name: 'whyRead', type: 'string', description: 'Pedagogical rationale for student focus', required: true },
        { name: 'chapters', type: 'Chapter[]', description: 'Array of chapter titles, subtitles, and text blocks', required: true },
      ],
    },
    {
      name: 'Bookshelf Persistence Schema',
      description: 'Array of saved book IDs representing the student\'s personal study shelf.',
      storageTarget: 'localStorage',
      fields: [
        { name: 'lumina_saved_bookshelf', type: 'string[]', description: 'JSON array of book ID strings (e.g. ["attention-james", "meditations-aurelius"])', required: true },
        { name: 'lastUpdated', type: 'string (ISO timestamp)', description: 'Timestamp of latest shelf modification', required: false },
      ],
    },
    {
      name: 'Quote Schema',
      description: 'Curated quotations on reading and cognitive focus cycled in the Dynamic Hero section.',
      storageTarget: 'Memory / State',
      fields: [
        { name: 'id', type: 'string', description: 'Unique quote identifier', required: true },
        { name: 'text', type: 'string', description: 'Quotation body text', required: true },
        { name: 'author', type: 'string', description: 'Author name', required: true },
        { name: 'work', type: 'string', description: 'Source publication or treatise', required: true },
        { name: 'discipline', type: 'string', description: 'Domain classification', required: true },
      ],
    },
    {
      name: 'Focus Session Schema',
      description: 'State representing Pomodoro study sprints and cumulative metrics.',
      storageTarget: 'localStorage',
      fields: [
        { name: 'timerSeconds', type: 'number', description: 'Current remaining countdown seconds (default: 1500 for 25m)', required: true },
        { name: 'isRunning', type: 'boolean', description: 'Active countdown flag', required: true },
        { name: 'completedSprints', type: 'number', description: 'Total 25m Pomodoro cycles completed today', required: true },
        { name: 'totalMinutesFocused', type: 'number', description: 'Accumulated deep focus duration in minutes', required: true },
      ],
    },
  ],
};
