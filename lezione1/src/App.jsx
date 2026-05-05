import TodoList from "./components/TodoList";
import TodoInput from "./components/TodoInput";
import TodoFiltri from "./components/TodoFiltri";
import TodoFooter from "./components/TodoFooter";
import { useState} from 'react';
import './App.css'

const taskIniziali = [
  { id: 1, testo: "Imparare Javascript", completato: false },
  { id: 2, testo: "Imparare React", completato: false },
  { id: 3, testo: "Imparare Express.js", completato: false },
  { id: 4, testo: "Imparare Docker", completato: false },
  { id: 5, testo: "Imparare SQL", completato: false },
];

function App() {

  const [tasks, setTasks] = useState(taskIniziali);
  
  const [filtro, setFiltro] = useState('tutti');

  function aggiungiTask(testo){
    const nuovoTask = {
      id: Date.now(),
      testo: testo,
      completato: false,
    }
    setTasks(prev => [...prev, nuovoTask])
  }

  function toggleTask(id) {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completato: !task.completato }
          : task
      )
    )
  }

  function eliminaTask(id){
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  function eliminaCompletati(){
    setTasks(prev => prev.filter(task => !task.completato))
  }

  function allComplete(){
    setTasks(prev => prev.map(task => ({...task, completato: true})))
  }

  function notComplete(){
    setTasks(prev => prev.map(task => ({...task, completato: false })))
  }


  const taskFiltrati = tasks.filter(task => {
    if(filtro === 'Incompleti') return !task.completato;
    if(filtro === 'Completati') return task.completato
    return true
  })

  const taskRimanenti = tasks.filter(t => !t.completati).length

  return (
    <>
    <div className="app">
      <h1>TODO LIST</h1>

      <TodoInput onAggiungi={aggiungiTask}/>
      
      <TodoFiltri filtroAttivo={filtro} onCambiaFiltro={setFiltro} onAllComplete={allComplete} onNotComplete={notComplete}/>
      <TodoList tasks={taskFiltrati} onToggle={toggleTask} onElimina={eliminaTask}/>
      <TodoFooter rimanenti={taskRimanenti} onEliminaCompletati={eliminaCompletati}/>
    </div>


    </>
  )
}

export default App;
