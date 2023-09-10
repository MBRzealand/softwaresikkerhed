import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"

const noteSlice = createSlice({
    name: "note",
    initialState: {
        value: {
            loading: "idle",
            number: 1,
            title: "",
            text: "",
            allNotes: [],
        }
    },
    reducers: {
        changeNote: (state, action) => {
            state.value = action.payload
        },
        selectNote: (state, action) => {
            // state.value.selectedNote = action.payload
            // state.value.number = action.payload
            // state.value.title = state.value.allNotes[state.value.selectedNote-1].title
            // state.value.text = state.value.allNotes[state.value.selectedNote-1].text
        },
        // deleteNote: (state) => {
        //     state.value.allNotes.splice(state.value.noteNum - 1,1)
        //     state.value.title = ""
        //     state.value.text = ""
        // }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotes.pending, (state) => {
                state.value.loading = 'pending';
            })
            .addCase(fetchNotes.fulfilled, (state, action) => {
                state.value.loading = 'idle';
                state.value.allNotes = action.payload.notes
                state.value.number = state.value.allNotes[state.value.allNotes.length-1]?.number +1 || 1
            })
            .addCase(fetchNotes.rejected, (state, action) => {
                state.value.loading = 'idle';
                state.value.error = action.error.message; // Save the error message to the state
            })


            .addCase(saveNote.pending, (state) => {
                state.value.loading = 'pending';
            })
            .addCase(saveNote.fulfilled, (state, action) => {
                state.value.loading = 'idle';
                state.value.allNotes.push({
                    number: state.value.number,
                    title: state.value.title,
                    text: state.value.text,
                });
                state.value.number = state.value.number +1;
                state.value.title = "";
                state.value.text = "";
            })
            .addCase(saveNote.rejected, (state, action) => {
                state.value.loading = 'idle';
                state.value.error = action.error.message; // Save the error message to the state
            })


            .addCase(deleteNote.pending, (state) => {
                state.value.loading = 'pending';
            })
            .addCase(deleteNote.fulfilled, (state, action) => {
                state.value.loading = 'idle';
                state.value.allNotes.splice(state.value.number)
            })
            .addCase(deleteNote.rejected, (state, action) => {
                state.value.loading = 'idle';
                state.value.error = action.error.message; // Save the error message to the state
            })

    },
})

export const fetchNotes = createAsyncThunk(
    'notes/fetchNotes',
    async () => {
        return await fetch(
            'http://localhost:5444/get-notes',
        ).then(result => result.json());
    },
);

export const saveNote = createAsyncThunk(
    'notes/saveNote',
    async (requestData, thunkAPI) => {
        return await fetch(
            'http://localhost:5444/save-note', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            }
        ).then(result => result.json());
    },
);

export const deleteNote = createAsyncThunk(
    'notes/deleteNote',
    async (number, thunkAPI) => {
        return await fetch(
            `http://localhost:5444/delete-note/${number}`, {
                method: 'DELETE',
            }
        ).then(result => result.json());
    },
);

export const {changeNote, selectNote} = noteSlice.actions

export default noteSlice.reducer
