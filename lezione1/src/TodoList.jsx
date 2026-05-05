import TodoItem from "./TodoItem";

function TodoList({ tasks }) {
  return (
    <ul className="todo-lista">
      {tasks.map((task) => (
        <TodoItem
          key={task.id}
          testo={task.testo}
          completato={task.completato}
        />
        ))}
    </ul>
  );
}

export default TodoList;
