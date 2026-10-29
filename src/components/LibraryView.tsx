import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  Layers,
  CheckCircle,
  Filter,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import type { Book } from '../types';
import { HeroSection } from './HeroSection';

interface LibraryViewProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onOpenBlueprint: () => void;
  onOpenFocusStudio: () => void;
  readBookIds: string[];
  savedBookIds: string[];
  onToggleBookshelf: (bookId: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  books,
  onSelectBook,
  onOpenBlueprint,
  onOpenFocusStudio,
  readBookIds,
  savedBookIds,
  onToggleBookshelf,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<'all' | 'short' | 'deep'>('all');

  const disciplines = [
    { id: 'all', label: 'All Shelves' },
    { id: 'Cognitive Science', label: 'Cognitive Science' },
    { id: 'Philosophy', label: 'Philosophy & Ethics' },
    { id: 'Literature', label: 'Literature & Craft' },
    { id: 'Environmental', label: 'Environmental' },
    { id: 'Computing History', label: 'Computing History' },
    { id: 'Education', label: 'Education Theory' },
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.discipline.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDiscipline = 
      selectedDiscipline === 'all' || book.category === selectedDiscipline;

    const matchesDuration = 
      selectedDuration === 'all' || 
      (selectedDuration === 'short' && book.estimatedMinutes < 18) ||
      (selectedDuration === 'deep' && book.estimatedMinutes >= 18);

    return matchesSearch && matchesDiscipline && matchesDuration;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      
      {/* Feature 2: Dynamic Hero Section with Quote of the Day */}
      <HeroSection
        onStartReading={() => onSelectBook(books[0])}
        onOpenFocusTimer={onOpenFocusStudio}
        onOpenBlueprint={onOpenBlueprint}
      />

      {/* Discovery Controls: Search & Discipline Filters */}
      <section className="space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Minimalist Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8A8177] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, author, concept, or discipline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-[#DDD5C7] text-[#2C2825] placeholder-[#948D83] focus:outline-none focus:ring-1 focus:ring-[#2C2825] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A8177] hover:text-[#2C2825]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Reading Sprint Duration Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-[#EFE9DF] rounded-xl self-start">
            <span className="text-[11px] text-[#70685F] px-2 font-medium">Sprint:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'short', label: '< 18m' },
              { id: 'deep', label: '18m+' },
            ].map((dur) => (
              <button
                key={dur.id}
                onClick={() => setSelectedDuration(dur.id as 'all' | 'short' | 'deep')}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors font-medium ${
                  selectedDuration === dur.id
                    ? 'bg-white text-[#2C2825] shadow-2xs'
                    : 'text-[#696157] hover:text-[#2C2825]'
                }`}
              >
                {dur.label}
              </button>
            ))}
          </div>
        </div>

        {/* Shelf Category Tabs (Interactive buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {disciplines.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDiscipline(d.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedDiscipline === d.id
                  ? 'bg-[#2C2825] text-white shadow-2xs'
                  : 'bg-white/70 border border-[#E5DED3] text-[#554E48] hover:bg-white hover:text-[#1A1816]'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

      </section>

      {/* Feature 1: Curated Book Grid (6 Featured Academic Works) */}
      <section className="space-y-4" aria-labelledby="featured-books-heading">
        <div className="flex items-center justify-between text-xs text-[#78716A]">
          <h2 id="featured-books-heading" className="font-sans font-medium text-[#2C2825] text-sm">
            Curated Academic Bookshelf ({filteredBooks.length} of 6 featured texts)
          </h2>
          <span>Zero algorithmic ads · Classy, minimalist UI</span>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#EAE4D9] space-y-3">
            <p className="font-serif text-lg text-[#3E3833]">No texts found matching your filter.</p>
            <p className="text-xs text-[#78716A]">Try clearing your search query or selecting "All Shelves".</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedDiscipline('all'); setSelectedDuration('all'); }}
              className="px-3.5 py-1.5 text-xs rounded-lg bg-[#2C2825] text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredBooks.map((book) => {
              const isRead = readBookIds.includes(book.id);
              const isSaved = savedBookIds.includes(book.id);
              
              return (
                <article
                  key={book.id}
                  className="group relative p-6 rounded-2xl bg-white border border-[#E6E0D5] hover:border-[#CFBFA8] shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    
                    {/* Unboxed Metadata (NO PILLS) with typographic separator */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#78716A]">
                      <span className="font-medium text-[#524B45]">{book.discipline}</span>
                      <span aria-hidden="true">·</span>
                      <span>{book.year}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 text-[#61584F]">
                        <Clock className="w-3 h-3 text-[#8A7458]" />
                        {book.estimatedMinutes} min read
                      </span>
                      {isRead && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Read
                          </span>
                        </>
                      )}
                    </div>

                    {/* Book Title & Author */}
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#221E1B] group-hover:text-[#614A2E] transition-colors leading-snug">
                        {book.title}
                      </h3>
                      <div className="text-xs text-[#524B45] mt-1 font-sans">
                        By <span className="font-medium text-[#2A2623]">{book.author}</span>
                      </div>
                    </div>

                    {/* Abstract */}
                    <p className="text-xs text-[#554E48] leading-relaxed line-clamp-3">
                      {book.abstract}
                    </p>

                    {/* Why Read This quote box */}
                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#ECE5DA] text-xs text-[#635B53] italic">
                      "{book.whyRead}"
                    </div>

                  </div>

                  {/* Feature 4: Save to Bookshelf + Read Text Action */}
                  <div className="pt-5 mt-4 border-t border-[#F2ECE1] flex items-center justify-between gap-2">
                    
                    {/* Instant Save to Bookshelf button without page reload */}
                    <button
                      onClick={() => onToggleBookshelf(book.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        isSaved
                          ? 'bg-[#EFE4D2] border-[#D6C4AD] text-[#2C2825] shadow-2xs font-semibold'
                          : 'bg-white border-[#E2DBD0] text-[#554E48] hover:bg-[#F8F4EE] hover:text-[#1A1816]'
                      }`}
                      title={isSaved ? 'Remove from personal bookshelf' : 'Save to personal bookshelf'}
                      aria-label={isSaved ? `Saved ${book.title} to bookshelf` : `Save ${book.title} to bookshelf`}
                    >
                      {isSaved ? (
                        <>
                          <BookmarkCheck className="w-3.5 h-3.5 text-[#8A7458] fill-[#8A7458]/40" />
                          <span>Saved to Bookshelf</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5 text-[#78716A]" />
                          <span>Save to Bookshelf</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onSelectBook(book)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[#2C2825] text-white hover:bg-[#433D39] transition-all shadow-2xs"
                    >
                      <span>Read Text</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Strategic Callout Card */}
      <section className="p-6 rounded-2xl bg-[#F3EDE2] border border-[#E5DCCF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-wider text-[#8A7458] font-semibold">
            Lumina Prototype Specification
          </div>
          <h3 className="font-serif text-lg font-medium text-[#2C2825]">
            Explore Functional Requirements, Non-Functional Requirements & Data Schemas
          </h3>
          <p className="text-xs text-[#615A52] max-w-xl">
            Detailed specifications for the 6-book curated grid, dynamic hero quote, 
            interactive bookshelf counter persistence, instant save actions, and 25m Pomodoro focus timer.
          </p>
        </div>

        <button
          onClick={onOpenBlueprint}
          className="shrink-0 px-4 py-2 rounded-xl bg-[#2C2825] text-white hover:bg-[#433D39] text-xs font-medium transition-colors shadow-xs"
        >
          View Full Specifications
        </button>
      </section>

    </div>
  );
};
