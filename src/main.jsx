// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// اطمینان از اعمال فونت
document.documentElement.style.fontFamily = "'Dana-FaNum', 'Vazirmatn', 'Tahoma', sans-serif";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
