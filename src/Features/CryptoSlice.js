import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"

const CryptoSlice = createSlice({
    name: "crypto",
    initialState: {
        value: {
            loading: "idle",
            error: "",
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(generateKey.pending, (state) => {
                state.value.loading = 'pending';
            })
            .addCase(generateKey.fulfilled, (state, action) => {
                state.value.loading = 'idle';

                crypto.subtle.exportKey("jwk", action.payload)
                    .then(e=>localStorage.setItem("encryptionKey",JSON.stringify(e)));
            })
            .addCase(generateKey.rejected, (state, action) => {
                state.value.loading = 'idle';
                state.value.error = action.error.message;
            })
    },
})

export const generateKey = createAsyncThunk(
    'crypto/generateKey',
    async () => {
        return await crypto.subtle.generateKey(
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );
    },
);

// export const {getKey, saveKey} = CryptoSlice.actions

export default CryptoSlice.reducer
