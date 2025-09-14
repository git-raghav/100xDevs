import "./App.css";
import { useState, useEffect } from "react";
import { CreateTodo } from "./components/CreateTodo";
import { Todos } from "./components/Todos";
import axios from "axios";

function App() {
	let [todos, setTodos] = useState([]);

	const fetchTodos = async () => {
		let res = await axios.get("http://localhost:3000/todos");
		setTodos(res.data);
	};

	useEffect(() => {
		fetchTodos();
	}, []);

	return (
		<>
			<CreateTodo onAdd={(newTodo) => setTodos([...todos, newTodo])} />
			<hr />
			<Todos todos={todos} />
		</>
	);
}

export default App;
