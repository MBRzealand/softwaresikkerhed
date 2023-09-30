import './App.css';
import Note from "./Components/Note";
import React, {useEffect} from "react";
import List from "./Components/List";
import {useDispatch, useSelector} from "react-redux";
import {generateKey, getKey, saveKey} from "./Features/CryptoSlice";

function App() {

    const cryptoState = useSelector(state => state.crypto.value);
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
