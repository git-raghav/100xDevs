import { useAtomValue, useSetAtom, useAtom } from "jotai";
import { todoFamily, todoIdsAtom } from "../store/atoms/todo";

//atom family
export default function TodoList() {
    const ids = useAtomValue(todoIdsAtom);
    return (
        <div>
            {ids.map((id) => (
                <Todo key={id} id={id} />
            ))}
        </div>
    );
}

function Todo({ id }) {
	const [todo, setTodo] = useAtom(todoFamily(id));
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
					setTodo((prev) => ({
						...prev,
						completed: !prev.completed,
					}))
				}
			>
				{todo.task}: {todo.completed ? "Done" : "Pending"}
			</button>
		</div>
	);
}
