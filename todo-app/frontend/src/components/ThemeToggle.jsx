import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="group relative inline-flex items-center p-3 rounded-xl theme-bg-primary shadow-lg theme-border border hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105"
      aria-label="Toggle theme"
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
      
      {/* Icon container with smooth transition */}
      <div className="relative w-6 h-6 overflow-hidden">
        {/* Sun Icon */}
        <div className={`absolute inset-0 transition-all duration-500 ease-in-out ${isDark ? 'transform rotate-90 scale-0 opacity-0' : 'transform rotate-0 scale-100 opacity-100'}`}>
          <svg 
            className="w-6 h-6 text-yellow-500 group-hover:text-yellow-400 transition-colors duration-200" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>
        </div>
        
        {/* Moon Icon */}
        <div className={`absolute inset-0 transition-all duration-500 ease-in-out ${isDark ? 'transform rotate-0 scale-100 opacity-100' : 'transform -rotate-90 scale-0 opacity-0'}`}>
          <svg 
            className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-200" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {/* Optional label (hidden on mobile) */}
      <span className="ml-2 text-sm font-medium theme-text-secondary hidden sm:inline-block group-hover:theme-text-primary transition-colors duration-200">
        {isDark ? 'Light Mode' : 'Dark Mode'}
      </span>
      
      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-xl theme-accent-bg opacity-0 scale-0 group-active:opacity-20 group-active:scale-100 transition-all duration-150"></div>
    </button>
  );
};

export default ThemeToggle;