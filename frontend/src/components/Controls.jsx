import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from './Sidebar';

export function Controls({ currentPage, totalPages, onPageChange }) {
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 rounded-b-2xl sm:rounded-none">
      <div className="flex items-center space-x-4 mb-4 sm:mb-0 w-full sm:w-auto">
        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
          Page {currentPage} of {totalPages || '?'}
        </span>
        <input
          type="range"
          min={1}
          max={totalPages || 1}
          value={currentPage}
          onChange={(e) => onPageChange(Number(e.target.value))}
          disabled={!totalPages}
          className="w-full sm:w-48 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
        />
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 transition-all",
            isFirstPage
              ? "opacity-50 cursor-not-allowed text-zinc-400 dark:text-zinc-600"
              : "hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:scale-105 active:scale-95 shadow-sm"
          )}
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 transition-all",
            isLastPage
              ? "opacity-50 cursor-not-allowed text-zinc-400 dark:text-zinc-600"
              : "hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:scale-105 active:scale-95 shadow-sm"
          )}
          aria-label="Next Page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
