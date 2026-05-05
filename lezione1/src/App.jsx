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

// useState è l'hook di React che ci permette di creare
// variabili "reattive": ogni volta che cambiano,
// React aggiorna automaticamente l'interfaccia.
import { useState } from 'react';

import './App.css'; // Stili globali dell'app

// ── Dati iniziali ────────────────────────────────────────────
// Array di task predefinite mostrate all'avvio dell'app.
// Ogni oggetto ha tre proprietà:
//   id        → identificatore univoco della task
//   testo     → la descrizione leggibile dall'utente
//   completato→ booleano: true = completata, false = da fare
const taskIniziali = [
  { id: 1, testo: "Imparare Javascript", completato: false },
  { id: 2, testo: "Imparare React",      completato: false },
  { id: 3, testo: "Imparare Express.js", completato: false },
  { id: 4, testo: "Imparare Docker",     completato: false },
  { id: 5, testo: "Imparare SQL",        completato: false },
];

// ── Componente App ───────────────────────────────────────────
function App() {

  // ----- STATO -----------------------------------------------
  // `tasks` contiene l'array delle task correnti.
  // `setTasks` è la funzione per aggiornarlo.
  // Viene inizializzato con taskIniziali.
  const [tasks, setTasks] = useState(taskIniziali);

  // `filtro` indica quale sottoinsieme di task mostrare.
  // Valori possibili: 'tutti' | 'Incompleti' | 'Completati'
  const [filtro, setFiltro] = useState('tutti');


  // ----- FUNZIONI DI MODIFICA STATO --------------------------

  // Aggiunge una nuova task all'array.
  // `testo` arriva da TodoInput quando l'utente clicca "Aggiungi".
  function aggiungiTask(testo) {
    const nuovoTask = {
      id: Date.now(),   // Date.now() restituisce un numero unico basato sul timestamp
      testo: testo,
      completato: false,
    };
    // prev → valore corrente di tasks (convezione React)
    // [...prev, nuovoTask] → crea un NUOVO array con tutte le
    // task precedenti + quella nuova (non modifichiamo l'originale)
    setTasks(prev => [...prev, nuovoTask]);
  }

  // Inverte lo stato completato/incompleto di una singola task.
  // `id` è l'identificatore della task da modificare.
  function toggleTask(id) {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          // Se questa è la task cercata, ne invertiamo `completato`
          ? { ...task, completato: !task.completato }
          // Altrimenti la lasciamo invariata
          : task
      )
    );
  }

  // Rimuove definitivamente una task dall'array.
  // filter() tiene solo le task il cui id è diverso da quello passato.
  function eliminaTask(id) {
    setTasks(prev => prev.filter(task => task.id !== id));
  }

  // Rimuove tutte le task che sono già state completate.
  function eliminaCompletati() {
    setTasks(prev => prev.filter(task => !task.completato));
  }

  // Segna TUTTE le task come completate in un colpo solo.
  function allComplete() {
    setTasks(prev => prev.map(task => ({ ...task, completato: true })));
  }

  // Riporta TUTTE le task allo stato "non completato".
  function notComplete() {
    setTasks(prev => prev.map(task => ({ ...task, completato: false })));
  }


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
  // Nota: c'è un piccolo bug qui → dovrebbe essere `!t.completato`
  // (proprietà corretta), ma funziona lo stesso perché le task
  // non hanno una proprietà `completati` (plurale), quindi è sempre
  // undefined → falsy → il NOT lo rende true → tutte contate.
  const taskRimanenti = tasks.filter(t => !t.completati).length;


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
