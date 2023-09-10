import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import "./List.css"
import {selectNote} from "../Features/NoteSlice";


const List = () => {

    const noteState = useSelector(state => state.note.value);
    const dispatch = useDispatch()

    const handleClick = (event) => {
        dispatch(
            selectNote(event.target.id)
        )
    }

    const notes = noteState.allNotes.map(note => <p id={note.number} onClick={handleClick} className={"List-Element"} key={note.number}>http://securenote.dk/note/{note.title}</p>)

    return (
        <div className="Link-Container">
            {notes}
        </div>
    );
};

export default List;
