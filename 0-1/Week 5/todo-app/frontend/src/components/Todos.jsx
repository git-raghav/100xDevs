export function Todos({ todos }) {
	return (
		<>
			{todos.map((todo) => (
				<div>
					<h3>{todo.title}</h3>
					<p>{todo.description}</p>
                    {todo.completed ? null : <button>Complete</button>}
				</div>
			))}
		</>
	);
}
