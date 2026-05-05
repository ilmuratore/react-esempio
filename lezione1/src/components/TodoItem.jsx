function TodoItem({ task, onToggle, onElimina}){
    return (
        
        <li className={`todo-item ${task.completato ? 'completato' : ''}`}>
            <span className="icona" onClick={() => onToggle(task.id)}>{task.completato ? '👌' : '⛔'}</span>
            <span className="testo" onClick={() => onToggle(task.id)}>{task.testo}</span>
            <button className='elimina' onClick={() => onElimina(task.id)}>X</button>
        </li>
  
    )
}

export default TodoItem