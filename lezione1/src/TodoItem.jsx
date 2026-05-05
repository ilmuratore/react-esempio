function TodoItem({ testo, completato}){
    return (
        <>
        <li className={`todo-item ${completato ? 'completato' : ''}`}>
            <span className="icona">{completato ? '👌' : '⛔'}</span>
            <span className="testo">{testo}</span>
        </li>
        </>
    )
}

export default TodoItem