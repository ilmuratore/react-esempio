// ============================================================
// App.jsx — Componente principale dell'applicazione
// ============================================================
// Questo è il "cervello" dell'app: contiene lo stato globale
// (le task e il filtro attivo) e tutte le funzioni che lo
// modificano. Le passa poi ai componenti figli tramite le props.
//
// Rispetto alla lezione 1, qui le task NON sono più salvate
// solo in memoria: ogni azione (aggiungi, toggle, elimina)
// chiama il backend, che le persiste nel database PostgreSQL.
// ============================================================

// Importiamo i componenti figli che compongono l'interfaccia
import TodoList   from "./components/TodoList";
import TodoInput  from "./components/TodoInput";
import TodoFiltri from "./components/TodoFiltri";
import TodoFooter from "./components/TodoFooter";

// Importiamo le funzioni che parlano con il backend (src/api/todos.js).
// Ogni funzione corrisponde a una chiamata HTTP verso l'API.
import { getTodos, updateTodo, createTodo, deleteTodo } from "./api/todos";

// ListaUtenti è un componente di esempio che mostra come
// useEffect può essere usato per caricare dati da una API esterna.
// È commentato perché non fa parte della funzionalità principale.
// import ListaUtenti from "./components/ListaUtenti";

// useState  → stato reattivo (come nella lezione 1)
// useEffect → esegue codice "a effetto collaterale" (es. fetch)
//             dopo che il componente viene montato nel DOM
import { useState, useEffect } from 'react';

import './App.css';


// ── Componente App ───────────────────────────────────────────
function App() {

  // ----- STATO -----------------------------------------------

  // Lista delle task. Inizialmente vuota: verranno caricate
  // dal database tramite useEffect (vedi sotto).
  const [tasks, setTasks] = useState([]);

  // Filtro attivo per mostrare un sottoinsieme delle task.
  // Valori possibili: 'tutti' | 'Incompleti' | 'Completati'
  const [filtro, setFiltro] = useState('tutti');

  // Indica se i dati sono ancora in caricamento dal backend.
  // Usato per mostrare un messaggio "⏳ Caricamento..." nell'UI.
  const [loading, setLoading] = useState(true);

  // Contiene il messaggio d'errore se la fetch fallisce.
  // Usato per mostrare un messaggio "❌ ..." nell'UI.
  const [errore, setErrore] = useState(null);


  // ----- CARICAMENTO INIZIALE DEI DATI ----------------------
  // useEffect con array di dipendenze vuoto [] viene eseguito
  // UNA SOLA VOLTA, subito dopo che il componente appare nel DOM.
  // È il posto giusto per caricare dati dal server all'avvio.
  useEffect(() => {
    getTodos()
      .then(data => {
        setTasks(data);      // Salviamo le task nello stato
        setLoading(false);   // Nascondiamo lo spinner
      })
      .catch(err => {
        setErrore(err.message); // Mostriamo il messaggio d'errore
        setLoading(false);
      });
  }, []); // [] = dipendenze vuote → eseguito solo al mount


  // ----- FUNZIONI DI MODIFICA STATO --------------------------
  // Tutte le funzioni sono ora `async`: aspettano che la chiamata
  // al backend sia completata prima di aggiornare lo stato locale.
  // Questo mantiene DB e UI sempre sincronizzati.

  // Crea una nuova task nel DB, poi aggiunge quella restituita
  // (completa di id e created_at) all'array locale.
  async function aggiungiTask(testo) {
    const nuovo = await createTodo(testo);
    setTasks(prev => [...prev, nuovo]);
  }

  // Inverte completato/incompleto di una task.
  // Prima cerca la task corrente per sapere il valore attuale,
  // poi invia al backend il valore opposto (!task.completato).
  async function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    const aggiornato = await updateTodo(id, !task.completato);
    // Sostituiamo la task vecchia con quella aggiornata dal DB
    setTasks(prev => prev.map(t => t.id === id ? aggiornato : t));
  }

  // Elimina una task dal DB, poi la rimuove dall'array locale.
  async function eliminaTask(id) {
    await deleteTodo(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  // Elimina dal DB tutte le task completate in parallelo.
  // Promise.all() avvia tutte le DELETE contemporaneamente
  // e aspetta che siano tutte finite prima di aggiornare lo stato.
  // È molto più veloce che eseguirle in sequenza una per volta.
  async function eliminaCompletati() {
    const completati = tasks.filter(t => t.completato);
    await Promise.all(completati.map(t => deleteTodo(t.id)));
    setTasks(prev => prev.filter(t => !t.completato));
  }

  // Segna tutte le task non ancora completate come completate.
  // Anche qui usiamo Promise.all per le chiamate in parallelo.
  async function allComplete() {
    const daCompletare = tasks.filter(t => !t.completato);
    await Promise.all(daCompletare.map(t => updateTodo(t.id, true)));
    setTasks(prev => prev.map(t => ({ ...t, completato: true })));
  }

  // Riporta tutte le task completate a "non completato".
  async function notComplete() {
    const daResettare = tasks.filter(t => t.completato);
    await Promise.all(daResettare.map(t => updateTodo(t.id, false)));
    setTasks(prev => prev.map(t => ({ ...t, completato: false })));
  }


  // ----- DATI DERIVATI (calcolati dallo stato) ---------------

  // Array filtrato da mostrare nella lista.
  // Viene ricalcolato automaticamente ogni volta che cambia
  // `tasks` o `filtro` (non è salvato nello stato).
  const taskFiltrati = tasks.filter(task => {
    if (filtro === 'Incompleti') return !task.completato;
    if (filtro === 'Completati') return task.completato;
    return true; // 'tutti' → mostra tutto
  });

  // Conta le task ancora da completare per il footer.
  const taskRimanenti = tasks.filter(t => !t.completato).length;


  // ----- RENDER CONDIZIONALE ─────────────────────────────────
  // Mostriamo messaggi alternativi mentre i dati non sono pronti.
  // Questi return anticipati evitano di renderizzare l'app
  // con dati incompleti o in stato di errore.
  if (loading) return <div className="app"><p>⏳ Caricamento ...</p></div>;
  if (errore)  return <div className="app"><p>❌ {errore}</p></div>;


  // ----- RENDER PRINCIPALE ───────────────────────────────────
  return (
    <>
      <div className="app">
        <h1>TODO LIST</h1>

        {/* Input per aggiungere nuove task.
            onAggiungi: callback chiamata con il testo inserito */}
        <TodoInput onAggiungi={aggiungiTask} />

        {/* Barra dei filtri e pulsanti globali.
            filtroAttivo: filtro selezionato correntemente
            onCambiaFiltro: cambia il filtro
            onAllComplete / onNotComplete: completano/resettano tutto */}
        <TodoFiltri
          filtroAttivo={filtro}
          onCambiaFiltro={setFiltro}
          onAllComplete={allComplete}
          onNotComplete={notComplete}
        />

        {/* Lista delle task (solo quelle filtrate).
            onToggle: segna/deseleziona una task
            onElimina: cancella una task */}
        <TodoList
          tasks={taskFiltrati}
          onToggle={toggleTask}
          onElimina={eliminaTask}
        />

        {/* Footer con contatore e pulsante "Elimina completati" */}
        <TodoFooter
          rimanenti={taskRimanenti}
          onEliminaCompletati={eliminaCompletati}
        />
      </div>
    </>
  );
}

export default App;
