function TodoFiltri({ filtroAttivo, onCambiaFiltro, onAllComplete, onNotComplete}){
    const filtri = ['Tutti', 'Incompleti', 'Completati'];

    return(
        <>
        <div className="todo-filtri">
            {filtri.map(filtro => (
                <button
                key={filtro}
                onClick={() => onCambiaFiltro(filtro)}
                className={filtroAttivo === filtro ? 'Incompleti' : ''}
                >
                    {filtro}
                
                </button>
            ))}
            <button onClick={onAllComplete}>Tutti completati</button>
            <button onClick={onNotComplete}>Reset task</button>
        </div>
        </>
    )
}

export default TodoFiltri