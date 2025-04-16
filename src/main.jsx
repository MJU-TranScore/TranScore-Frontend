import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


//리다이렉션 main.jsx
/*import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Oauth from './Oauth.jsx'; // 새로 추가
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/oauth" element={<Oauth />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);*/

