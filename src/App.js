import './App.css';
import Note from "./Components/Note";
import React, {useEffect} from "react";
import List from "./Components/List";
import {useDispatch} from "react-redux";
import {generateKey} from "./Features/CryptoSlice";

function App() {
    const dispatch = useDispatch()

    useEffect(() => {
        if(localStorage.getItem("encryptionKey") === null) {
                dispatch(generateKey())
        }
    }, []);


    return (
    <div className="App">
        <div className="App-Container">
            <Note/>
            <List/>
        </div>
    </div>
  );
}

export default App;
