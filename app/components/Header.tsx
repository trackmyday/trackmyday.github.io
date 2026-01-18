'use client'
import Link from 'next/link';
// import { ThemeToggle } from './ThemeToggle';

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
            <Link href="/goals" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400">Goals</Link>
            <Link href="/whiteboard" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400">Whiteboard</Link>
            <Link href="/tetris" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400">Tetris</Link>
          </nav>
          {/* <ThemeToggle /> */}
        </div>
      </div>
    </header>
  );
};
