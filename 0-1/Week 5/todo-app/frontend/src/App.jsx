import "./App.css";
import { useState, useEffect } from "react";
import { CreateTodo } from "./components/CreateTodo";
import { Todos } from "./components/Todos";
import axios from "axios";

function App() {
	const [todos, setTodos] = useState([]);

	const fetchTodos = async () => {
		const res = await axios.get("http://localhost:3000/todos");
		setTodos(res.data);
	};

	useEffect(() => {
		fetchTodos();
	}, []);

	const handleComplete = async (id) => {
		const res = await axios.put("http://localhost:3000/completed", {
			_id: id,
		});

		setTodos((prevTodos) => prevTodos.map((todo) => (todo._id === id ? res.data : todo)));
	};

	return (
		<div className="app">
			<div className="container">
			    <CreateTodo onAdd={(newTodo) => setTodos((prevTodos) => [...prevTodos, newTodo])} />
    			<hr className="divider" />
    			<Todos todos={todos} onComplete={handleComplete} />
			</div>
		</div>
	);
}

export default App;
