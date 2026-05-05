// ============================================================
// main.jsx — Punto di ingresso dell'applicazione React
// ============================================================
// Questo è il primo file che viene eseguito quando il browser
// carica l'app. Il suo unico compito è "montare" React
// sull'elemento HTML con id="root" definito in index.html.
// ============================================================

// StrictMode è un wrapper speciale di React che, solo in
// sviluppo, attiva controlli extra e avvisi utili.
// Non aggiunge nulla all'interfaccia visibile.
import { StrictMode } from 'react';

// createRoot è la funzione moderna (React 18+) per inizializzare
// l'app React all'interno di un nodo del DOM.
import { createRoot } from 'react-dom/client';

// Stili di base applicati all'intera pagina
import './index.css';

// Il componente principale che contiene tutta l'app
import App from './App.jsx';

// Trova l'elemento <div id="root"> in index.html,
// lo "trasforma" in un root React e ci renderizza <App />.
// StrictMode fa da involucro: in produzione è trasparente,
// in sviluppo aggiunge controlli aggiuntivi.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
