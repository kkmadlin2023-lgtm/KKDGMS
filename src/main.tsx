import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Initialize Theme from localStorage or system preference
const savedTheme = localStorage.getItem('kkdgms-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
document.documentElement.classList.toggle('dark', isDark);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
