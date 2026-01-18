'use client';
import Link from 'next/link';

export const Header = () => {
  return (
    <header className="container mx-auto px-4 py-6 border-b bg-transparent">
      <div className="flex items-center justify-between">
        <Link href="/">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-cyan-400 dark:to-pink-400 bg-clip-text text-transparent">
            Track My Day
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4">
            <div className="relative group">
              <span className="text-slate-600 dark:text-slate-300 cursor-pointer">Utils</span>
              <div className="absolute hidden group-hover:block bg-white dark:bg-slate-800 shadow-lg rounded-md mt-2 py-2 w-48">
                <Link href="/utils/goals" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400">Goals</Link>
                <Link href="/utils/whiteboard" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400">Whiteboard</Link>
              </div>
            </div>
            <div className="relative group">
              <span className="text-slate-600 dark:text-slate-300 cursor-pointer">Games</span>
              <div className="absolute hidden group-hover:block bg-white dark:bg-slate-800 shadow-lg rounded-md mt-2 py-2 w-48">
                <Link href="/games/tetris" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400">Tetris</Link>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
