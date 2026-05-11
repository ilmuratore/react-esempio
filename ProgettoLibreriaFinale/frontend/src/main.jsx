// ============================================================
// main.jsx — Punto di ingresso dell'applicazione React
// ============================================================
// NOTA su React.StrictMode e il 429 Too Many Requests:
// StrictMode in sviluppo monta ogni componente DUE VOLTE di
// proposito per rilevare effetti collaterali non puri.
// ============================================================

import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
)