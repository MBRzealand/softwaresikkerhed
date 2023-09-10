import './App.css';
import Note from "./Components/Note";
import React from "react";
import List from "./Components/List";

function App() {
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
