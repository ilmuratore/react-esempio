import TodoItem from "./TodoItem";

function TodoList({ tasks, onToggle, onElimina }) {

  if(tasks.length === 0){
    return <p className="lista-vuota">Nessun Task da mostrare</p>
  }
  return (
    <ul className="todo-lista">
      {tasks.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onElimina={onElimina}
        />
        ))}
    </ul>
  );
}

export default TodoList;
