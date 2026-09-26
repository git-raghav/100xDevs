export function Todos({ todos, onComplete }) {
	return (
		<div>
            <h2 className="todos-title">Your Todos</h2>
			<div className="todos-list">
			    {todos.map((todo) => (
    				<div className="todo-card" key={todo._id}>
    					<div className="todo-info">
    					    <h3>{todo.title}</h3>
        					<p>{todo.description}</p>
    					</div>
                        {todo.completed ? <span className="completed-label">Completed</span> : <button className="complete-button" onClick={() => onComplete(todo._id)}>Complete</button>}
    				</div>
    			))}
			</div>
		</div>
	);
}
