import { Suspense } from 'react';
import { useAtomValue, useSetAtom, useAtom } from 'jotai'
import "./App.css";
import { countAtom, evenDerivedAtom, notificationAtom, fetchNotificationAtom2 } from "./store/atoms/count";
function App() {
	return (
		<div>
            <Count />
            {/* demonstration of async atom */}
            <Suspense fallback={<p>Loading notification...</p>}><Noti /></Suspense>
            <Suspense fallback={<p>Loading notification2...</p>}><Noti2 /></Suspense>
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

//async read atom demo
function Noti() {
    const noti = useAtomValue(notificationAtom);
    return <h2>{noti.notifications}</h2>;
}

//async write atom demo
function Noti2() {
    const [noti, fetchNoti] = useAtom(fetchNotificationAtom2);

    return (
        <div>
            <button onClick={() => fetchNoti()}>
                Load Notification
            </button>

            <h2>{noti?.notifications ?? "No notifications loaded yet"}</h2>
        </div>
    );
}

export default App;

//usestate vs atom
//usetate should be used when u know variable is going to be used inside only that component or 1-2 childs, in short small usage and not shared between multiple components. when u need to share variable between multiple components, use atom. local/global req
