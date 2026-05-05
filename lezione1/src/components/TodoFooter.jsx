function TodoFooter({rimanenti, onEliminaCompletati}){
    

    return(
        <>
        <div className="todo-footer">
        <span>{rimanenti} {rimanenti === 1 ? 'task rimanente' : 'task rimanenti'}</span>
        <button onClick={onEliminaCompletati}>Elimina Completati</button>
        </div>
        </>
    )
}

export default TodoFooter