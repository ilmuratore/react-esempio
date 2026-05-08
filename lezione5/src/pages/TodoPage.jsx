import TodoList   from "../components/TodoList";
import TodoInput  from "../components/TodoInput";
import TodoFiltri from "../components/TodoFiltri";
import TodoFooter from "../components/TodoFooter";

import { getTodos, updateTodo, createTodo, deleteTodo } from "../api/todos";
import {useNavigate} from 'react-router-dom'
import { useState, useEffect } from 'react';

function TodoPage() {

  const [tasks, setTasks] = useState([]);
  const [filtro, setFiltro] = useState('tutti');
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getTodos()
      .then(data => {
        setTasks(data);     
        setLoading(false);  
      })
      .catch(err => {
        setErrore(err.message); 
        setLoading(false);
      });
  }, []); 


  async function aggiungiTask(testo) {
    const nuovo = await createTodo(testo);
    setTasks(prev => [...prev, nuovo]);
  }


  async function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    const aggiornato = await updateTodo(id, !task.completato);
    setTasks(prev => prev.map(t => t.id === id ? aggiornato : t));
  }

  async function eliminaTask(id) {
    await deleteTodo(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  async function eliminaCompletati() {
    const completati = tasks.filter(t => t.completato);
    await Promise.all(completati.map(t => deleteTodo(t.id)));
    setTasks(prev => prev.filter(t => !t.completato));
  }

  async function allComplete() {
    const daCompletare = tasks.filter(t => !t.completato);
    await Promise.all(daCompletare.map(t => updateTodo(t.id, true)));
    setTasks(prev => prev.map(t => ({ ...t, completato: true })));
  }

  async function notComplete() {
    const daResettare = tasks.filter(t => t.completato);
    await Promise.all(daResettare.map(t => updateTodo(t.id, false)));
    setTasks(prev => prev.map(t => ({ ...t, completato: false })));
  }

  const taskFiltrati = tasks.filter(task => {
    if (filtro === 'Incompleti') return !task.completato;
    if (filtro === 'Completati') return task.completato;
    return true; 
  });

  const taskRimanenti = tasks.filter(t => !t.completato).length;

  if (loading) return <div className="app"><p>⏳ Caricamento ...</p></div>;
  if (errore)  return <div className="app"><p>❌ {errore}</p></div>;


  return (
    <>
      <div className="app">
        <h1>TODO LIST</h1>

        <TodoInput onAggiungi={aggiungiTask} />

        <TodoFiltri
          filtroAttivo={filtro}
          onCambiaFiltro={setFiltro}
          onAllComplete={allComplete}
          onNotComplete={notComplete}
        />

        <TodoList
          tasks={taskFiltrati}
          onToggle={toggleTask}
          onElimina={eliminaTask}
          onDettaglio={id => navigate(`/task/${id}`)}
        />

        <TodoFooter
          rimanenti={taskRimanenti}
          onEliminaCompletati={eliminaCompletati}
        />
      </div>
    </>
  );
}

export default TodoPage;
