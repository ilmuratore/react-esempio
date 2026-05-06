// ============================================================
// TodoFiltri.jsx — Barra dei filtri e azioni globali
// ============================================================
// Questo componente mostra:
//   • 3 pulsanti filtro (Tutti / Incompleti / Completati)
//   • 2 pulsanti azione globale (segna tutti / resetta tutti)
//
// Non gestisce nessuno stato: riceve tutto tramite props
// e comunica con App.jsx chiamando le funzioni passate.
// ============================================================

// Props ricevute da App.jsx:
//   filtroAttivo    → quale filtro è selezionato ora (stringa)
//   onCambiaFiltro  → funzione per cambiare il filtro
//   onAllComplete   → funzione per completare tutte le task
//   onNotComplete   → funzione per resettare tutte le task
function TodoFiltri({ filtroAttivo, onCambiaFiltro, onAllComplete, onNotComplete }) {

  // Array dei tre filtri disponibili.
  // Lo usiamo per generare i pulsanti dinamicamente con .map()
  // invece di scrivere tre <button> separati a mano.
  const filtri = ['Tutti', 'Incompleti', 'Completati'];

  return (
    <>
      <div className="todo-filtri">

        {/* Per ogni filtro nell'array creiamo un pulsante.
            key={filtro} è richiesto da React per identificare
            univocamente ogni elemento in una lista generata con map(). */}
        {filtri.map(filtro => (
          <button
            key={filtro}
            // Al click aggiorniamo il filtro attivo in App.jsx
            onClick={() => onCambiaFiltro(filtro)}
            // Se questo filtro è quello attivo, aggiungiamo la
            // classe CSS 'Incompleti' per evidenziarlo visivamente.
            // (Il nome della classe potrebbe essere più generico
            //  tipo 'attivo', ma funziona lo stesso.)
            className={filtroAttivo === filtro ? 'Incompleti' : ''}
          >
            {filtro}
          </button>
        ))}

        {/* Pulsante: segna TUTTE le task come completate */}
        <button onClick={onAllComplete}>Tutti completati</button>

        {/* Pulsante: riporta TUTTE le task a "non completato" */}
        <button onClick={onNotComplete}>Reset task</button>

      </div>
    </>
  );
}

export default TodoFiltri;
