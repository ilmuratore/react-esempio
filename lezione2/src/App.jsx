// ============================================================
// App.jsx — Componente principale dell'applicazione
// ============================================================
// Questo è il "cervello" dell'app: contiene lo stato globale
// (le task e il filtro attivo) e tutte le funzioni che lo
// modificano. Le passa poi ai componenti figli tramite le props.
// ============================================================

// Importiamo i componenti figli che compongono l'interfaccia
import TodoList    from "./components/TodoList";
import TodoInput   from "./components/TodoInput";
import TodoFiltri  from "./components/TodoFiltri";
import TodoFooter  from "./components/TodoFooter";


//importiamo il componente che gestisce le api con il backend
import { getTodos, updateTodo, createTodo, deleteTodo } from "./api/todos";

// import ListaUtenti from "./components/ListaUtenti"; // esempio di useEffect e di una fetch 
// useState è l'hook di React che ci permette di creare
// variabili "reattive": ogni volta che cambiano,
// React aggiorna automaticamente l'interfaccia.
import { useState, useEffect } from 'react';

import './App.css'; // Stili globali dell'app


// ── Componente App ───────────────────────────────────────────
function App() {

  // ----- STATO -----------------------------------------------
  // `tasks` contiene l'array delle task correnti.
  // `setTasks` è la funzione per aggiornarlo.
  const [tasks, setTasks] = useState([]);

  // `filtro` indica quale sottoinsieme di task mostrare.
  // Valori possibili: 'tutti' | 'Incompleti' | 'Completati'
  const [filtro, setFiltro] = useState('tutti');


  const [loading, setLoading] = useState(true)

  const [errore, setErrore] = useState(null)

  // ----- FUNZIONI DI MODIFICA STATO --------------------------

  // Aggiunge una nuova task all'array.
  // `testo` arriva da TodoInput quando l'utente clicca "Aggiungi".
  async function aggiungiTask(testo) {
    const nuovo = await createTodo(testo)
    setTasks(prev => [...prev, nuovo])
  }

  // Inverte lo stato completato/incompleto di una singola task.
  // `id` è l'identificatore della task da modificare.
  async function toggleTask(id) {
   const task = tasks.find(t => t.id === id)
   const aggiornato = await updateTodo(id, !task.completato);
    setTasks(prev => prev.map(t => t.id === id ? aggiornato : t ))
  }

  // Rimuove definitivamente una task dall'array.
  // filter() tiene solo le task il cui id è diverso da quello passato.
  async function eliminaTask(id) {
    await deleteTodo(id)
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  // Rimuove tutte le task che sono già state completate.
  async function eliminaCompletati() {
    const completati = tasks.filter(t => t.completato);
    await Promise.all(completati.map(t => deleteTodo(t.id)))
    setTasks(prev => prev.filter(t => !t.completato))
  }


  // Segna TUTTE le task come completate in un colpo solo.
  async function allComplete() {
    const tuttiTask = tasks.filter(t => !t.completato)
    await Promise.all(tuttiTask.map(t => updateTodo(t.id, true)))
    setTasks(prev => prev.map(t => ({...t, completato: true})))
  }

  // Riporta TUTTE le task allo stato "non completato".
  async function notComplete() {
    const tuttiTask = tasks.filter(t => t.completato)
    await Promise.all(tuttiTask.map(t => updateTodo(t.id, false)))
    setTasks(prev => prev.map(t => ({...t, completato: false})))
  }

  // ----- CARICAMENTO DEI DATI  ---------------
  useEffect( () => {
    getTodos()
      .then(data => { setTasks(data); setLoading(false)})
      .catch(err => { setErrore(err.message); setLoading(false)})
  }, [])



  // ----- DATI DERIVATI (calcolati dallo stato) ---------------

  // Filtriamo le task da mostrare in base al filtro selezionato.
  // Questo array NON viene salvato nello stato: viene ricalcolato
  // ogni volta che cambia `tasks` o `filtro`.
  const taskFiltrati = tasks.filter(task => {
    if (filtro === 'Incompleti') return !task.completato;
    if (filtro === 'Completati') return task.completato;
    return true; // 'tutti' → mostra tutto
  });

  // Conta le task ancora da completare per il footer.
  const taskRimanenti = tasks.filter(t => !t.completato).length;

  // ----- RENDER CONDIZIONALE (cosa appare a schermo) ----------------------
  if(loading) return <div className="app"><p> ⏳ Caricamento ...</p></div>
  if(errore) return <div className="app"><p>❌ {errore}</p></div>



  // ----- RENDER (cosa appare a schermo) ----------------------
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

// Esportiamo il componente così gli altri file possono importarlo
export default App;
