import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// import { BrowserRouter } from 'react-router-dom'; // <-- Remove this if it exists
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <BrowserRouter> Remove this outer Router */}
      <App />
    {/* </BrowserRouter> */}
  </React.StrictMode>
);