//Create a hook that returns you the current mouse pointer position.
import { useEffect, useState } from "react";
import './App.css'

const useMousePointer = () => {
	const [position, setPosition] = useState({ x: 0, y: 0 });

	function handleMouseMove(e) {
		setPosition({ x: e.clientX, y: e.clientY });
	};

	useEffect(() => {
		window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousemove", (e) => {
            console.log(e);
        });

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	return position;
};

function App() {
	const mousePointer = useMousePointer();
	return (
		<>
			Your mouse position is {mousePointer.x} {mousePointer.y}
		</>
	);
}
export default App;
