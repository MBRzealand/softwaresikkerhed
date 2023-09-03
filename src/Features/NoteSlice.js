import {createSlice} from "@reduxjs/toolkit"

const noteSlice = createSlice({
    name: "note",
    initialState: {
        value: {
            noteNum: 1,
            noteTitle: "",
            noteText: "",
        }
    },
    reducers: {
        changeState: (state, action) => {
            state.value = action.payload
        },
    }
})

export const {changeState} = noteSlice.actions

export default noteSlice.reducer
