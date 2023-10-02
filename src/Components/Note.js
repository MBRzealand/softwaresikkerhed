import React, {useEffect} from 'react';
import './Note.css';
import {useDispatch, useSelector} from "react-redux";
import {changeNote, saveNote, deleteNote, fetchNotes, updateNote, decryptText} from "../Features/NoteSlice";

const Note = () => {

    const noteState = useSelector(state => state.note.value);
    const dispatch = useDispatch()

    useEffect(() => {
        if(noteState.refresh) {
            dispatch(fetchNotes())
        }
    },[dispatch, noteState.refresh]);

    const handleChange = (event) => {
        const {name,value} = event.target
        dispatch(
            changeNote({
                ...noteState,
                [name]: value
            }
        ))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const note = {number: noteState.number, title: noteState.title, text : noteState.text }

        if (noteState.allNotes.some(element => element.number === noteState.number)) {
            dispatch(
                updateNote(note)
            )
        } else {
            dispatch(
                saveNote(note)
            )
        }
    }

    const handleDelete = () => {
        dispatch(
            deleteNote(noteState.number)
        )
    }

    const handleDecrypt = () => {

        let note = noteState.allNotes.filter(obj => {
            return obj.number === noteState.number
        })

        note = note[0]

        dispatch(
            decryptText({number: noteState.number, note: note})
        )
    }

    return (
        <div className="Note-Container">
            <div className="Note-Header">
                <h1 className="Title">Note {noteState.number} -</h1>

                <input className="Title-Input"
                    type="text"
                    name="title"
                    value={noteState.title}
                    onChange={handleChange}
                />
            </div>
            <div className="Note-Input-Container">
                <textarea className="Note-Input"
                    name="text"
                    value={noteState.text}
                    onChange={handleChange}
                />
            </div>
            <div className="Button-Container">
                <div className="Left-Button-Container">
                    <button className="Custom-Button-1" onClick={handleSubmit}>Gem</button>
                    <button onClick={handleDelete} className="Custom-Button-1">Slet</button>
                </div>
                <button onClick={handleDecrypt} className="Custom-Button-2">Dekrypter</button>
            </div>
        </div>
    );
};

export default Note;
