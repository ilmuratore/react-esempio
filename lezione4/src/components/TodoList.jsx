// ============================================================
// TodoList.jsx — Contenitore della lista di task
// ============================================================
// Questo componente riceve l'array di task (già filtrato da
// App.jsx) e le visualizza una per una usando TodoItem.
// Non sa come filtrare né come modificare le task: delega
// tutto ai componenti genitore e figlio.
// ============================================================

// Importiamo TodoItem: è il componente che rappresenta
// una singola riga della lista
import TodoItem from "./TodoItem";

// Props ricevute da App.jsx:
//   tasks     → array di oggetti task da visualizzare
//   onToggle  → funzione per completare/decompletare una task
//   onElimina → funzione per eliminare una task
function TodoList({ tasks, onToggle, onElimina, onDettaglio }) {

  // Caso speciale: se non ci sono task da mostrare
  // (array vuoto), mostriamo un messaggio invece della lista.
  // Questo può succedere quando il filtro non ha risultati
  // o quando tutte le task sono state eliminate.
  if (tasks.length === 0) {
    return <p className="lista-vuota">Nessun Task da mostrare</p>;
  }

  return (
    // <ul> è la lista non ordinata che contiene gli elementi.
    // Lo stile `todo-lista` in App.css la trasforma
    // in una colonna con spazio tra i vari item.
    <ul className="todo-lista">
      {/* Per ogni task nell'array creiamo un componente TodoItem.
          key={task.id} → React lo usa internamente per sapere
          quale elemento è cambiato quando la lista si aggiorna.
          Deve essere univoco tra i fratelli. */}
      {tasks.map((task) => (
        <TodoItem
          key={task.id}
          task={task}           // Passiamo l'intero oggetto task
          onToggle={onToggle}   // Callback per toggle completato
          onElimina={onElimina} // Callback per eliminazione
          onDettaglio={onDettaglio} 
        />
      ))}
    </ul>
  );
}

export default TodoList;
