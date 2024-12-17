import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Optionally include your global styles

// Assuming your root element in the HTML file has the id "root"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
