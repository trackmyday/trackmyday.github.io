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
        {/* <ThemeToggle /> */}
      </div>
    </header>
  );
};
