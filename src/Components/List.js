import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import "./List.css"
import {changeNote, selectNote} from "../Features/NoteSlice";


const List = () => {

    const noteState = useSelector(state => state.note.value);
    const dispatch = useDispatch()

    const handleClick = (event) => {
        const selectedNumber = event.target.id
        const selectedNote = noteState.allNotes.find(note => note.number == selectedNumber);

        dispatch(
            selectNote(selectedNote)
        )
    }

    const notes = noteState.allNotes.map(note => <p id={note.number} onClick={handleClick} className={"List-Element"} key={note.number}>http://securenote.dk/note/{note.title}</p>)

    const handleNewNoteClick = () => {
        dispatch(
            changeNote({
                ...noteState,
                number: noteState.newNoteNumber,
                title: "",
                text: "",
            }
        ))
    }

    return (
        <div className={"Scroll-Container"} >
            <div className="Link-Container">
            {notes}
            {noteState.number<noteState.newNoteNumber && <div className={"Add-Button"} onClick={handleNewNoteClick}><img className={"icon"} src={require("../Images/plusIconWhite.png")} alt={"Add Note"}/></div>}
            </div>
        </div>
    );
};

export default List;
