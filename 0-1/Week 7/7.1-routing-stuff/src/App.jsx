import { useState, lazy, Suspense, useContext } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
// import Dashboard from "./components/Dashboard";
// import Landing from "./components/Landing";
const Landing = lazy(() => import("./components/Landing"));
const Dashboard = lazy(() => import("./components/Dashboard"));
import "./App.css";
import {CountContext} from "./context";

/* --------------------------------- Routing -------------------------------- */
// function App() {
// 	return (
// 		<>
// 			<BrowserRouter>
//                 <Appbar/>
// 				<Routes>
// 					<Route path="/dashboard" element={<Suspense fallback={<div>Loading...</div>}><Dashboard /></Suspense>} />
// 					<Route path="/" element={<Landing />} />
// 				</Routes>
// 			</BrowserRouter>
// 		</>
// 	);
// }

// function Appbar() {
// 	const navigate = useNavigate();
// 	return (
// 		<div>
// 			<button
// 				onClick={() => {
// 					navigate("/");
// 				}}
// 			>
// 				Landing Page
// 			</button>
// 			<button
// 				onClick={() => {
// 					navigate("/dashboard");
// 				}}
// 			>
// 				Dashboard Page
// 			</button>
// 		</div>
// 	);
// }

/* ------------------------------- Context API ------------------------------ */
function App() {
    const [count, setCount] = useState(0);
	return (
		<div>
            <CountContext.Provider value={{count, setCount}}>
                <Count />
            </CountContext.Provider>
		</div>
	);
}

function Count() {
    return (
        <div>
            <CountRenderer />
            <Buttons />
        </div>
    )
}

function CountRenderer() {
    const {count} = useContext(CountContext);
    return (
        <div>
            Count: {count}
        </div>
    )
}

function Buttons() {
    const {count, setCount} = useContext(CountContext);
    return (
        <div>
            <button onClick={() => setCount(c => c+1)}>Increase</button>
            <button onClick={() => setCount(c => c-1)}>Decrease</button>
        </div>
    )
}
export default App;
