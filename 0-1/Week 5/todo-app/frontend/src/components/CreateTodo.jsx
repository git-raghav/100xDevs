import { useState } from "react";
import axios from "axios";

export function CreateTodo({ onAdd }) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	async function handleSubmit() {
		const res = await axios.post("http://localhost:3000/todo", {
			title,
			description,
		});
		onAdd(res.data); // update parent state immediately
		setTitle(""); // clear form
		setDescription("");
	}

	return (
		<div className="create-todo">
			<h1>Create Todo</h1>
			<input className="todo-input" type="text" placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} />
			<input className="todo-input" type="text" placeholder="description" value={description} onChange={(e) => setDescription(e.target.value)} />
			<button className="create-button" onClick={handleSubmit}>Submit</button>
		</div>
	);
}
