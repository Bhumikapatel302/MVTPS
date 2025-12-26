// client/src/components/DarkModeToggle.jsx

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize from localStorage or system preference
    try {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        return JSON.parse(savedMode);
      }
      // Check system preference
      return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches || false;
    } catch (error) {
      console.error('Error reading dark mode preference:', error);
      return false;
    }
  });

  // Apply dark mode whenever it changes
  useEffect(() => {
    try {
      const html = document.documentElement;

      if (isDarkMode) {
        html.classList.add('dark');
        document.body.style.backgroundColor = '#0f172a'; // slate-950
      } else {
        html.classList.remove('dark');
        document.body.style.backgroundColor = '#ffffff'; // white
      }

      // Save to localStorage
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    } catch (error) {
      console.error('Error applying dark mode:', error);
    }
  }, [isDarkMode]);

  const handleToggle = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        relative inline-flex items-center justify-center
        w-10 h-10 rounded-full
        transition-all duration-300 ease-in-out
        hover:scale-110 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isDarkMode
          ? 'text-yellow-400 hover:text-yellow-300 focus:ring-yellow-500'
          : 'text-slate-700 hover:text-slate-900 focus:ring-slate-500'
        }
      `}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDarkMode}
    >
      {isDarkMode ? (
        <Sun
          size={20}
          className="transition-transform duration-300 rotate-0 hover:rotate-180"
          aria-hidden="true"
        />
      ) : (
        <Moon
          size={20}
          className="transition-transform duration-300 rotate-0 hover:rotate-180"
          aria-hidden="true"
        />
      )}
    </button>
  );
};

export default DarkModeToggle;