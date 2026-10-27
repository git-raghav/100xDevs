import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

/* ------------------------------- atom family ------------------------------ */
export const todoIdsAtom = atom([1, 2]);

export const todoFamily = atomFamily((id) => atom({ id, task: '', completed: false }));

/* --------------------------- derived read/write atom family -------------------------- */
export const todoStatusFamily = atomFamily((id) =>
	atom(
		(get) => {
			const todo = get(todoFamily(id));
			return todo.completed ? "Done" : "Pending";
		},
		(get, set, newStatus) => {
			const todo = get(todoFamily(id));
			set(todoFamily(id), {
				...todo,
				completed: newStatus === "Done",
			});
		},
	),
);
