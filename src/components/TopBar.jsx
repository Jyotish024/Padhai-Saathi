import { Menu, Moon, Sun } from 'lucide-react';

export function TopBar({ onMenuClick, isDarkMode, onToggleDarkMode, chapterTitle }) {
  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shrink-0 transition-colors duration-200">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 mr-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="font-medium text-zinc-800 dark:text-zinc-200 truncate">
          {chapterTitle}
        </h2>
      </div>

      <button
        onClick={onToggleDarkMode}
        className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </header>
  );
}
