import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'

// Inject our React component tree into the HTML <div id="root"></div>
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);