import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";


export const getLevels = createAsyncThunk(
    'getLevels',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/admin/level/get-level`, user_input);
            if (response?.data?.status_code === 200) {
                return response?.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

export const addLevels = createAsyncThunk(
    'addLevels',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`admin/level/add-level`, user_input);
            if (response?.data?.status_code === 201) {
                return response?.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

const initialState = {
    loading: false,
    allLevels: [],
    error: false,
    addLevelData: ""
}
const LevelSlice = createSlice(
    {
        'name': 'levelsData',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(getLevels.pending, (state) => {
                    state.loading = true
                })
                .addCase(getLevels.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.allLevels = payload
                    state.error = false
                })
                .addCase(getLevels.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(addLevels.pending, (state) => {
                    state.loading = true
                })
                .addCase(addLevels.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.addLevelData = payload
                    state.error = false
                })
                .addCase(addLevels.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
        }
    }

)
export default LevelSlice.reducer;