import TodoList from "./TodoList";
import Riepilogo from "./Riepilogo";
import './App.css'

const tasks = [
  { id: 1, testo: "Imparare Javascript", completato: true },
  { id: 2, testo: "Imparare React", completato: false },
  { id: 3, testo: "Imparare Express.js", completato: false },
  { id: 4, testo: "Imparare Docker", completato: true },
  { id: 5, testo: "Imparare SQL", completato: false },
  
];

function App() {

  const totale = tasks.length;
  const completati = tasks.filter(t => t.completato).length;

  return (
    <>
    <div className="app">
      <h1>TODO LIST</h1>
      <Riepilogo totale={totale} completati={completati}/>
      <TodoList tasks={tasks}/>
    </div>
    </>
  )
}

export default App;
