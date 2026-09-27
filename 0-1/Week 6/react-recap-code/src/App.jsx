import { useState, useEffect, useMemo, useCallback, useRef, memo, useActionState } from "react";
import "./App.css";

function App() {
    //useState hook for state variables that react will track
	const [exchangeData1, setExchangeData1] = useState({});
	const [exchangeData2, setExchangeData2] = useState({});
	const [bankData, setBankData] = useState({});
    const todos = useTodos();//custom hook

    //useEffect hook runs only on initial render, or when dependencies array content changes
    //useEffect dosen't return a value
    useEffect(() => {
        setExchangeData1({
            returns: 100,
        });
    }, []);

    useEffect(() => {
        setExchangeData2({
            returns: 100,
        });
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setBankData({
                returns: 100,
            });
        }, 5000);
    }, []);

    const divRef = useRef();
    useEffect(() => {
        setTimeout(() => {
            divRef.current.innerHTML = "100000";
        }, 7000);
    }, []);

    //useMemo hook saves the expensive calculation
    const cryptoGains = useMemo(() => {
        console.log("cryptoGains called");
        return exchangeData1.returns + exchangeData2.returns;
    }, [exchangeData1, exchangeData2]);

    const tax = (cryptoGains + bankData.returns) * 0.3;

    //useCallback hook to cache entire function instead of just a value like useMemo, pair it with memo()/React.memo()
    // const cryptoGains = useCallback(() => {
    //     console.log("cryptoGains called");
    //     return exchangeData1.returns + exchangeData2.returns;
    // }, [exchangeData1, exchangeData2]);

    // const tax = (cryptoGains() + bankData.returns) * 0.3;

	return (
		<>
			<section id="center">
				<button type="button" className="counter" ref={divRef}>
					Tax is ${tax}
				</button>
                {/* <CryptoGainsCalc cryptoGains={cryptoGains}></CryptoGainsCalc> */}
			</section>
		</>
	);
}

//custom hooks, should start with use
function useTodos() {
    const [todos, setTodos] = useState([]);
    //fetch logic
    return todos;
}

const CryptoGainsCalc = memo(({ cryptoGains }) => {
    console.log("cryptoChild re-rendered");
    return (
        <div>
            Your crypto returns are {cryptoGains()}
        </div>
    );
});

export default App;
