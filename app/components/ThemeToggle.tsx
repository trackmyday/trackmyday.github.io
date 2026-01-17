'use client';

import { useTheme } from '../contexts/ThemeContext';

const SunIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.106a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM17.894 17.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM6.106 17.894a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM3.75 12a.75.75 0 01-.75.75H.75a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM6.106 6.106a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591z" />
    </svg>
);

const MoonIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.981A10.503 10.503 0 0118 18a10.5 10.5 0 01-10.5-10.5c0-1.53.34-3 .92-4.332a.75.75 0 01.819-.162z" clipRule="evenodd" />
    </svg>
);

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center h-8 w-14 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 focus:outline-none"
    >
      <span
        className={`absolute inline-block h-6 w-6 rounded-full bg-white shadow-lg transform transition-transform duration-300 ${
          theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
      <SunIcon className={`h-5 w-5 absolute left-2 text-yellow-500 transition-opacity duration-300 ${theme === 'light' ? 'opacity-100' : 'opacity-0'}`} />
      <MoonIcon className={`h-5 w-5 absolute right-2 text-slate-300 transition-opacity duration-300 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`} />
    </button>
  );
};