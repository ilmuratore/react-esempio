// ============================================================
// TodoInput.jsx — Campo di testo + pulsante "Aggiungi"
// ============================================================
// Questo componente gestisce l'inserimento di nuove task.
// Ha il suo stato locale (`testo`) per tenere traccia di
// cosa sta scrivendo l'utente, ma non sa nulla delle altre
// task: quando l'utente clicca "Aggiungi", chiama la funzione
// `onAggiungi` passata da App.jsx (prop), che si occuperà
// di aggiornare l'array globale delle task.
// ============================================================

// Importiamo useState per gestire il valore dell'input
import { useState } from 'react';

// Props ricevute da App.jsx:
//   onAggiungi(testo) → funzione da chiamare per aggiungere la task
function TodoInput({ onAggiungi }) {

  // Stato locale: il testo correntemente scritto nel campo input.
  // Inizialmente è una stringa vuota.
  const [testo, setTesto] = useState('');

  // Funzione chiamata quando l'utente clicca "Aggiungi"
  function handleSubmit() {
    // trim() rimuove gli spazi bianchi all'inizio e alla fine.
    // Es. "  ciao  " → "ciao"
    const testoPulito = testo.trim();

    // Se il testo è vuoto (o solo spazi), non facciamo nulla.
    // return esce subito dalla funzione senza proseguire.
    if (testoPulito === '') return;

    // Chiamiamo la funzione del genitore (App.jsx) passando
    // il testo pulito: è lei che aggiungerà la task all'array.
    onAggiungi(testoPulito);

    // Svuotiamo il campo di input per permettere l'inserimento
    // di una nuova task subito dopo.
    setTesto('');
  }

  return (
    <div className="todo-input">
      <input
        type="text"
        value={testo}                         // Il campo mostra sempre il valore dello stato
        onChange={e => setTesto(e.target.value)} // Ad ogni tasto, aggiorniamo lo stato
        placeholder="Cosa devi fare?"
      />
      {/* Al click chiamiamo handleSubmit che valida e invia il testo */}
      <button onClick={handleSubmit}>Aggiungi</button>
    </div>
  );
}

export default TodoInput;
