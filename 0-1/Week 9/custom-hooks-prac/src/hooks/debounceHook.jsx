import { useState, useEffect } from "react";

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timerId);
    }, [value, delay]);

    return debouncedValue;
};

const App = () => {
    const [inputValue, setInputValue] = useState("");
    const debouncedValue = useDebounce(inputValue, 100);

    return (
        <>
            Debounced Value is {debouncedValue}
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
        </>
    );
};

export default App;
