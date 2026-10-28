import { useEffect, useState } from "react";
import axios from "axios";
import './App.css'

function useTodos(n) {
	const [todos, setTodos] = useState([]);
	const [loading, setLoading] = useState(true);

    function getData() {
        axios.get("https://sum-server.100xdevs.com/todos").then((res) => {
			setTodos(res.data.todos);
			setLoading(false);
		});
    }

	useEffect(() => {
		const value = setInterval(() => {
            getData()
		}, n * 1000);

        getData();

		return () => {
			clearInterval(value);
		};
	}, [n]);

	return { todos, loading };
}

function App() {
	const { todos, loading } = useTodos(10);

	if (loading) {
		return <div>loading...</div>;
	}

	return (
		<>
			{todos.map((todo) => (
				<Track key={todo.id || todo.title} todo={todo} />
			))}
		</>
	);
}

function Track({ todo }) {
	return (
		<div>
			{todo.title}
			<br />
			{todo.description}
		</div>
	);
}

export default App;
