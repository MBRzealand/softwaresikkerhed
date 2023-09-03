import React from 'react';
import './Note.css';
import {useDispatch, useSelector} from "react-redux";
import {changeState} from "../Features/NoteSlice";

const Note = () => {

    const noteState = useSelector(state => state.note.value);
    const dispatch = useDispatch()



    const handleChange = (event) => {
        const {value} = event.target
        dispatch(
            changeState({
                ...noteState,
                noteTitle: value
            }
        ))
    }

    const handleTextChange = (event) => {
        const {value} = event.target
        dispatch(
            changeState({
                    ...noteState,
                    noteText: value
                }
            ))

        console.log(noteState)
    }

    return (
        <div className="Note-Container">
            <div className="Note-Header">
                <h1 className="Title">Note {noteState.noteNum} -</h1>

                <input className="Title-Input"
                    type="text"
                    name="noteTitle"
                    value={noteState.noteTitle}
                    onChange={handleChange}
                />
            </div>
            <div className="Note-Input-Container">
                <textarea className="Note-Input"
                    name="noteText"
                    value={noteState.noteText}
                    onChange={handleTextChange}
                />
            </div>
            <div className="Button-Container">
                <button className="Custom-Button">Gem</button>
                <button className="Custom-Button">Slet</button>
            </div>
        </div>
    );
};

export default Note;
