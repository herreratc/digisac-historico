import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ClientNetworkPage from './ClientNetworkPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {window.location.pathname.includes('rede-clientes') ? <ClientNetworkPage /> : <App />}
  </React.StrictMode>
);
