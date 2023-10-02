import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"

const noteSlice = createSlice({
    name: "note",
    initialState: {
        value: {
            loading: "idle",
            number: 1,
            title: "",
            text: "",
            iv: [],
            allNotes: [],
            newNoteNumber: 1,
            refresh: true,
        }
    },
    reducers: {
        changeNote: (state, action) => {
            state.value = action.payload
        },
        selectNote: (state, action) => {
            state.value.number = action.payload.number
            state.value.title = action.payload.title
            state.value.text = action.payload.text
        },

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
                state.value.newNoteNumber = state.value.number
                state.value.refresh = false
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
                
                state.value.number = state.value.number +1;
                state.value.title = "";
                state.value.text = "";
                state.value.refresh = true;
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
                state.value.refresh = true;
            })
            .addCase(deleteNote.rejected, (state, action) => {
                state.value.loading = 'idle';
                state.value.error = action.error.message; // Save the error message to the state
            })


            
            .addCase(updateNote.pending, (state) => {
                state.value.loading = 'pending';
            })
            .addCase(updateNote.fulfilled, (state, action) => {
                state.value.loading = 'idle';
                state.value.refresh = true;

                state.value.text = ""
                state.value.title = ""

            })
            .addCase(updateNote.rejected, (state, action) => {
                state.value.loading = 'idle';
                state.value.error = action.error.message; // Save the error message to the state
            })



            .addCase(decryptText.pending, (state) => {
                state.value.loading = 'pending';
            })
            .addCase(decryptText.fulfilled, (state, action) => {
                state.value.loading = 'idle';
                state.value.text = action.payload
            })
            .addCase(decryptText.rejected, (state, action) => {
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

        let request = requestData
        const textBuffer = new TextEncoder().encode(requestData.text);

        const key = JSON.parse(localStorage.getItem("encryptionKey"))
        const importedKey = await crypto.subtle.importKey('jwk', key, { name: 'AES-GCM' }, true, ['encrypt', 'decrypt']);

        const iv = window.crypto.getRandomValues(new Uint8Array(12))

        const encryptedBuffer = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            importedKey,
            textBuffer
        );

        const encryptedText = Array.from(new Uint8Array(encryptedBuffer))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');

        request.text = encryptedText

        request.iv = JSON.stringify(iv)

        return await fetch(
            'http://localhost:5444/save-note', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: (JSON.stringify(request)),
            }
        ).then(result => result.json());
    },
);

export const deleteNote = createAsyncThunk(
    'notes/deleteNote',
    async (number, thunkAPI) => {
        console.log(`http://localhost:5444/delete-note/${number}`)
        return await fetch(
            `http://localhost:5444/delete-note/${number}`, {
                method: 'DELETE',
            }
        ).then(result => result.json());
    },
);

export const updateNote = createAsyncThunk(
    'notes/updateNote',
    async (note, thunkAPI) => {

        let request = note
        const textBuffer = new TextEncoder().encode(request.text);

        const key = JSON.parse(localStorage.getItem("encryptionKey"))
        const importedKey = await crypto.subtle.importKey('jwk', key, { name: 'AES-GCM' }, true, ['encrypt', 'decrypt']);

        const iv = window.crypto.getRandomValues(new Uint8Array(12))

        const encryptedBuffer = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            importedKey,
            textBuffer
        );

        const encryptedText = Array.from(new Uint8Array(encryptedBuffer))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');

        request.text = encryptedText

        request.iv = JSON.stringify(iv)


        try {
            const response = await fetch(`http://localhost:5444/update-note/${request.number}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                throw new Error('Update failed');
            }

        } catch (error) {
            throw error;
        }
    }
);


export const decryptText = createAsyncThunk(
    'notes/decrypt',
    async ({number, note}, thunkAPI) => {

        const key = JSON.parse(localStorage.getItem("encryptionKey"))
        const importedKey = await crypto.subtle.importKey('jwk', key, { name: 'AES-GCM' }, true, ['encrypt', 'decrypt']);

        // convert stored object Uint8Array
        let iv = JSON.parse(note.iv)
        iv = Object.values(iv)
        iv = new Uint8Array(iv)


        // convert stored hex string to Uint8Array
        const bytes = [];
        for (let i = 0; i < note.text.length; i += 2) {
            bytes.push(parseInt(note.text.substr(i, 2), 16));
        }
        const text = new Uint8Array(bytes);

        // decrypt
        const algorithm = { name: 'AES-GCM', iv: iv};

        return await window.crypto.subtle.decrypt(algorithm, importedKey, text).then(response => new TextDecoder().decode(response))
    },
);



export const {changeNote, selectNote} = noteSlice.actions

export default noteSlice.reducer