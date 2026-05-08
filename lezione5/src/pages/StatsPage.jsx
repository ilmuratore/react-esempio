import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { getTodos } from "../api/todos";

function StatsPage(){
    const [tasks, setTask] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errore, setErrore] = useState(null)
    const navigate = useNavigate()


    useEffect( () => {
        getTodos().then(data => {setTask(data); setLoading(false)})
        .catch(err => {setErrore(err.message); setLoading(false)});
    }, [])

    if(loading) return <p>Caricamento...</p>
    if(errore) return  <p>Errore: {errore}</p>


    const totale = tasks.length; //0
    const completati = tasks.filter(t => t.completato).length; 
    const daFare = totale - completati; 
    const percentuale = totale === 0 ? 0 : Math.round((completati / totale) * 100 )

    return(
        <>
        <h1 style={{ color: 'white', marginBottom: 24}}>Statistiche</h1>

        <div className="stats-grid">
            <div className="stats-card">
                <span className="stats-numero">{totale}</span>
                <span className="stat-label">Totali</span>
            </div>

            <div className="stats-card">
                <span className="stats-numero">{completati}</span>
                <span className="stat-label">Completati</span>
            </div>

            <div className="stats-card">
                <span className="stats-numero">{daFare}</span>
                <span className="stat-label">Da Fare</span>
            </div>

            <div className="stats-card">
                <span className="stats-numero">{percentuale}%</span>
                <span className="stat-label">Completamento</span>
            </div>
        </div>
        
        <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{width: `${percentuale}%`}}/>
            <p style={{ textAlign: 'center', marginTop: 8, color: '#646161'}}>{percentuale} % completato</p>
        </div>

        <button style={{ marginTop: 24}} onClick={() => navigate('/')} className="btn-back">Indietro</button>
        </>
    )
}

export default StatsPage