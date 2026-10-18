import { useAtomValue, useSetAtom, useAtom } from 'jotai'
import "./App.css";
import { countAtom, evenDerivedAtom } from "./store/atoms/count";
function App() {
	return (
		<div>
            <Count />
		</div>
	);
}

function Count() {
    return (
        <div>
            <CountRenderer />
            <Buttons />
            <Even />
        </div>
    )
}
//jotai
function CountRenderer() {
    const count = useAtomValue(countAtom);
    return (
        <div>
            Count: {count}
        </div>
    )
}

function Buttons() {
    const setCount = useSetAtom(countAtom);
    return (
        <div>
            <button onClick={() => setCount(c => c+1)}>Increase</button>
            <button onClick={() => setCount(c => c-1)}>Decrease</button>
        </div>
    )
}

function Even() {
    const isEven = useAtomValue(evenDerivedAtom);
    return (
        <div>
            {isEven ? "It is even" : "It is odd"}
        </div>
    )
}
export default App;
