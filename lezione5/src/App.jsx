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
import {Routes, Route} from 'react-router-dom';
import Layout from './components/Layout';
import TodoPage from './pages/TodoPage';
import DettaglioTask from './pages/DettaglioTask';
import NotFound from './pages/NotFound';
import StatsPage from './pages/StatsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';


// ── Componente App ───────────────────────────────────────────
function App() {

  return(
    <>
    <Routes>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>

      <Route path='/' element={<ProtectedRoute> <Layout/> </ProtectedRoute>}>
        <Route index element={<TodoPage/>}/>
        <Route path='task/:id' element={<DettaglioTask/>}/>
        <Route path='stats' element={<StatsPage/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Route>
    </Routes>
    </>

  )
}

export default App;
