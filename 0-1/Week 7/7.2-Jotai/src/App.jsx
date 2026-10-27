import { Suspense } from "react";
import "./App.css";
import Count from "./components/Count";
import { Noti, Noti2 } from "./components/Notification";
import TodoList from "./components/Todo";

function App() {
	return (
		<div>
			{/* demonstration of normal and derived atom */}
			<Count /><br />
			{/* demonstration of async atom */}
			<Suspense fallback={<p>Loading notification...</p>}><Noti /></Suspense><br />
			<Suspense fallback={<p>Loading notification2...</p>}><Noti2 /></Suspense><br />
			{/* demonstration of atom family */}
            <TodoList /><br />
		</div>
	);
}
export default App;
