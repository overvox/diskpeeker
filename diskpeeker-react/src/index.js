import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App';
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_DISKPEEKER_API_BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
// TODO: axios.defaults.headers.common['Authorization'] = 'AUTH TOKEN';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
