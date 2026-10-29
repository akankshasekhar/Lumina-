import React from 'react';
import { 
  X, 
  Bookmark, 
  BookOpen, 
  Trash2, 
  ArrowRight, 
  Clock, 
  Sparkles,
  Library
} from 'lucide-react';
import type { Book } from '../types';

interface BookshelfDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedBooks: Book[];
  onSelectBook: (book: Book) => void;
  onRemoveFromBookshelf: (bookId: string) => void;
  onClearBookshelf: () => void;
}

export const BookshelfDrawer: React.FC<BookshelfDrawerProps> = ({
  isOpen,
  onClose,
  savedBooks,
  onSelectBook,
  onRemoveFromBookshelf,
  onClearBookshelf,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bookshelf-drawer-title"
    >
      <div className="w-full max-w-md bg-[#FAF7F2] h-full shadow-2xl border-l border-[#E4DDD2] flex flex-col text-[#2C2825] animate-slide-left">
        
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-[#E8E2D9] flex items-center justify-between bg-[#F4EFE6]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2C2825] text-white flex items-center justify-center shadow-xs">
              <Bookmark className="w-4 h-4 text-[#EADBC8]" />
            </div>
            <div>
              <h2 id="bookshelf-drawer-title" className="font-serif text-lg font-medium text-[#24201D] leading-tight">
                My Saved Bookshelf
              </h2>
              <p className="text-xs text-[#78716A]">
                {savedBooks.length} {savedBooks.length === 1 ? 'text' : 'texts'} saved for deep study · Stored in localStorage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#78716A] hover:text-[#1F1B18] hover:bg-[#EAE4D9] transition-colors"
            aria-label="Close Bookshelf"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Saved Books List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {savedBooks.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#EFE9DF] text-[#8A7458] flex items-center justify-center mx-auto">
                <Library className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-base font-medium text-[#2C2825]">Your bookshelf is empty</h3>
              <p className="text-xs text-[#6B635B] leading-relaxed max-w-xs mx-auto">
                Click the <strong>"Save to Bookshelf"</strong> button on any book card to curate your personal university reading stack.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs text-[#78716A] pb-1">
                <span>Saved Reading Queue</span>
                <button
                  onClick={onClearBookshelf}
                  className="text-rose-700 hover:text-rose-900 transition-colors text-[11px]"
                >
                  Clear All
                </button>
              </div>

              {savedBooks.map((book) => (
                <article
                  key={book.id}
                  className="p-4 rounded-xl bg-white border border-[#EAE4D9] shadow-2xs hover:border-[#DDD4C5] transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div>
                    {/* Unboxed Metadata */}
                    <div className="flex items-center gap-2 text-[11px] text-[#78716A] mb-1">
                      <span className="font-medium text-[#524B45]">{book.discipline}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 text-[#61584F]">
                        <Clock className="w-3 h-3 text-[#8A7458]" />
                        {book.estimatedMinutes} min
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-medium text-[#221E1B] group-hover:text-[#614A2E] transition-colors leading-snug">
                      {book.title}
                    </h4>
                    <p className="text-xs text-[#524B45] mt-0.5">
                      By {book.author}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#F2ECE1] flex items-center justify-between">
                    <button
                      onClick={() => onRemoveFromBookshelf(book.id)}
                      className="text-xs text-[#8A8177] hover:text-rose-700 flex items-center gap-1 transition-colors"
                      title="Remove from saved bookshelf"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectBook(book);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#2C2825] text-white hover:bg-[#433D39] transition-colors shadow-2xs"
                    >
                      <span>Read Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#E8E2D9] bg-[#F4EFE6]/50 flex items-center justify-between text-xs">
          <span className="text-[#78716A] text-[11px]">
            Persisted in browser localStorage
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#2C2825] text-white hover:bg-[#433D39] font-medium transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
