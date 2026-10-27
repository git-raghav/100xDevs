import { useAtomValue, useSetAtom, useAtom } from "jotai";
import { todoFamily, todoIdsAtom, todoStatusFamily } from "../store/atoms/todo";

//atom family
export default function TodoList() {
    const ids = useAtomValue(todoIdsAtom);
    return (
        <div>
            <AddTodo />
            {ids.map((id) => (
                <Todo key={id} id={id} />
            ))}
        </div>
    );
}

function AddTodo() {
    const setTodoIds = useSetAtom(todoIdsAtom);
    return (
        <button
            onClick={() => {
                setTodoIds((prev) => [...prev, Date.now()]);
            }}
        >
            Add todo
        </button>
    );
}

function Todo({ id }) {
	const [todo, setTodo] = useAtom(todoFamily(id));
    const setTodoIds = useSetAtom(todoIdsAtom);
    const [status, setStatus] = useAtom(todoStatusFamily(id));
	return (
		<div>
			<input
				type="text"
				value={todo.task}
				onChange={(e) => {
					setTodo((prev) => ({
						...prev,
						task: e.target.value,
					}));
				}}
			/>
			<button
				onClick={() =>
					setStatus(status === "Done" ? "Pending" : "Done")
				}
			>
				{todo.task}: {status}
			</button>
			<button
				onClick={() => {
					setTodoIds((prev) => prev.filter((c) => c !== todo.id));
					todoFamily.remove(todo.id);
				}}
			>
				Delete
			</button>
		</div>
	);
}
