import { useParams, useNavigate} from 'react-router-dom'
import { useState, useEffect} from 'react'
import { getTodos, updateTodo, deleteTodo } from '../api/todos'

function DettaglioTask(){

    const { id } = useParams() // Restituisce una stringa
    const [task, setTask] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect( ()=> {
        getTodos()
        .then(data => {
            const task = data.find(t => t.id === Number(id))
            setTask(task || null)
            setLoading(false)
        })
        .catch(err => {setError(err.message); setLoading(false)});    
    }, [id])

    async function handleToogle(){
        const aggiornato = await updateTodo(task.id, !task.completato)
        setTask(aggiornato)
    }

    async function handleElimina(){
        await deleteTodo(task.id)
        navigate('/')
    }

    if(loading) return <p>Caricamento ...</p>
    if(error) return  <p>Errore: {error}</p>

    if(!task) return (
        <>
        <div>
            <p> Task non trovato</p>
            <button onClick={() => navigate('/')} className='btn-back'>Torna alla lista</button>
        </div>
        </>
    )
    

    return (
        <>
        
        <div className='detail-card'>
            <button onClick={() => navigate(- 1)} className='btn-back'>Indietro</button>
            <h2>Dettaglio Task</h2>

            <div className='detail-row'>
                <span className='label'>Testo</span>
                <span>{task.testo}</span>
            </div>

            <div className='detail-row'>
                <span className='label'>Stato</span>
                <span>{task.completato ? '✅ Completato' : '📌 Da fare'}</span>
            </div>

            <div className='detail-row'>
                <span className='label'>Creato il</span>
                <span>{new Date(task.created_at).toLocaleString('it-IT')}</span>
            </div>

            <div className='detail-action'>
                <button onClick={handleToogle}>{task.completato ? 'Segna come da fare' : 'Segna come completato'}</button>
                <button onClick={handleElimina} className='btn-danger'>Elimina Task</button>
            </div>
        </div>

        </>
    )
}

export default DettaglioTask;