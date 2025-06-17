import React from 'react';

const DarkModeToggle = ({ darkMode, setDarkMode }) => (
  <button
    onClick={() => setDarkMode(!darkMode)}
    className={`absolute top-6 right-8 px-4 py-2 rounded-lg font-semibold transition ${
      darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
    }`}
    style={{ zIndex: 100 }}
  >
    {darkMode ? '🌙 Dark' : '☀️ Light'}
  </button>
);

export default DarkModeToggle;