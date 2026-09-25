import { useState } from "react";
import "./App.css";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<CustomButton count={count} setCount={setCount} />
		</>
	);
}

const CustomButton = ({ count, setCount }) => {
	return (
		<>
			<div className="card">
				<button onClick={() => setCount((curr) => curr + 1)}>count is {count}</button>
			</div>
		</>
	);
}

export default App;
