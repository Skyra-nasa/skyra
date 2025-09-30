import React from 'react';
import './index.css'
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './shared/context/ThemeProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ThemeProvider defaultTheme="system" storageKey="weather-app-theme">
      <App />
    </ThemeProvider>
  </BrowserRouter>
);