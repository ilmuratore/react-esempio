// ============================================================
// TodoItem.jsx — Una singola riga della lista todo
// ============================================================
// È il componente più "piccolo" e specifico dell'app.
// Visualizza una task con:
//   • un'icona cliccabile che indica lo stato
//   • il testo della task (cliccabile per togglare)
//   • un pulsante per eliminarla
//
// Non ha stato proprio: tutto viene gestito tramite props.
// ============================================================

// Props ricevute da TodoList:
//   task      → l'oggetto { id, testo, completato }
//   onToggle  → funzione per invertire completato/incompleto
//   onElimina → funzione per rimuovere la task dalla lista
function TodoItem({ task, onToggle, onElimina, onDettaglio }) {
  return (
    // La classe CSS cambia dinamicamente:
    // - se task.completato è true  → 'todo-item completato'
    // - se task.completato è false → 'todo-item'
    // In App.css, la classe 'completato' aggiunge il testo barrato.
    <li className={`todo-item ${task.completato ? 'completato' : ''}`}>

      {/* Icona a sinistra: mostra lo stato della task.
           ✅ = completata  |  📌 = da fare
          Al click chiama onToggle passando l'id della task,
          così App.jsx sa quale task deve essere modificata. */}
      <span className="icona" onClick={() => onToggle(task.id)}>
        {task.completato ? '✅' : '📌'}
      </span>

      {/* Testo della task. Anche questo è cliccabile per
          permettere all'utente di visualizzare la pagina di dettaglio */}
      <span className="testo" onClick={() => onDettaglio(task.id)} 
        title="Clicca per vedere il dettaglio">
        {task.testo}
      </span>

      {/* Pulsante per eliminare la task.
          onClick chiama onElimina con l'id: App.jsx filtrerà
          fuori questa task dall'array. */}
      <button className="elimina" onClick={() => onElimina(task.id)}>
        X
      </button>

    </li>
  );
}

export default TodoItem;
