import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import App from './App';
import RegisterAnalysePage from './pages/register-analyse/RegisterAnalysePage';

function RootRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register-analyse" element={<RegisterAnalysePage />} />
        {/* Simple fallback to link back */}
        <Route
          path="*"
          element={
            <div style={{ padding: 24 }}>
              <p>Not Found</p>
              <Link to="/">Go Home</Link>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RootRouter />
  </React.StrictMode>
);
