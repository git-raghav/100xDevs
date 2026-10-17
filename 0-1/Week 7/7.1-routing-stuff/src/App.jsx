import { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
// import Dashboard from "./components/Dashboard";
// import Landing from "./components/Landing";
const Landing = lazy(() => import("./components/Landing"));
const Dashboard = lazy(() => import("./components/Dashboard"));
import "./App.css";

function App() {
	return (
		<>
			<BrowserRouter>
                <Appbar/>
				<Routes>
					<Route path="/dashboard" element={<Suspense fallback={<div>Loading...</div>}><Dashboard /></Suspense>} />
					<Route path="/" element={<Landing />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

function Appbar() {
	const navigate = useNavigate();
	return (
		<div>
			<button
				onClick={() => {
					navigate("/");
				}}
			>
				Landing Page
			</button>
			<button
				onClick={() => {
					navigate("/dashboard");
				}}
			>
				Dashboard Page
			</button>
		</div>
	);
}
export default App;
