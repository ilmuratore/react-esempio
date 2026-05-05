// ============================================================
// TodoFooter.jsx — Piede della lista: contatore + pulizia
// ============================================================
// Componente semplice senza stato proprio. Mostra:
//   • quante task rimangono da completare (contatore)
//   • un pulsante per eliminare in blocco tutte le task completate
// ============================================================

// Props ricevute da App.jsx:
//   rimanenti          → numero intero di task non ancora completate
//   onEliminaCompletati→ funzione per cancellare le task completate
function TodoFooter({ rimanenti, onEliminaCompletati }) {

  return (
    <>
      <div className="todo-footer">

        {/* Contatore task rimanenti con gestione del singolare/plurale.
            Se rimanenti === 1 → "1 task rimanente"
            Altrimenti         → "N task rimanenti"
            Questo evita il classico errore "1 task rimanenti". */}
        <span>
          {rimanenti} {rimanenti === 1 ? 'task rimanente' : 'task rimanenti'}
        </span>

        {/* Pulsante che chiama la funzione in App.jsx.
            App.jsx filtrerà via tutte le task con completato === true. */}
        <button onClick={onEliminaCompletati}>Elimina Completati</button>

      </div>
    </>
  );
}

export default TodoFooter;
