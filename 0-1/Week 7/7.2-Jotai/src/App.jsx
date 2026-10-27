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

//usestate vs atom
//usetate should be used when u know variable is going to be used inside only that component or 1-2 childs, in short small usage and not shared between multiple components. when u need to share variable between multiple components, use atom. local/global req
