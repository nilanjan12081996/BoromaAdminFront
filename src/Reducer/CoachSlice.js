import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";

export const getCounrtyForCoach = createAsyncThunk(
    'getCounrtyForCoach',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/operation-head/coach/get-country-list`);
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
export const getRMForCoach = createAsyncThunk(
    'getRMForCoach',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/operation-head/coach/get-rm-list`);
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
export const getLevel = createAsyncThunk(
    'getLevel',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/operation-head/coach/get-levels-list`);
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
export const getDays = createAsyncThunk(
    'getDays',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/operation-head/coach/get-days-list`);
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
export const addCoach = createAsyncThunk(
    'addCoach',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/operation-head/coach/add-coach`, user_input);
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
export const geneatePass = createAsyncThunk(
    'geneatePass',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/generate-password`, user_input);
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

export const getCoachList = createAsyncThunk(
    'getCoachList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/admin/coach/get-admin-coach-list`);
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

export const getCoachListOperationalHead = createAsyncThunk(
    'getCoachListOperationalHead',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post(`/operation-head/coach/get-coach-list`);
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

export const checkCoachBreakTimeDiff = createAsyncThunk(
    'checkCoachBreakTimeDiff',
    async (input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/operation-head/coach/check-break-time-difference`, input);
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

export const checkCoachTimes = createAsyncThunk(
    'checkCoachTimes',
    async (input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/operation-head/coach/check-coach-times`, input);
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


const initialState = {
    loading: false,
    error: false,
    coachCountryData: [],
    rmData: [],
    levelData: [],
    daysData: [],
    addCoachData: "",
    allCoach: [],
    genPass: "",
    getCoachOHData: [],
    coachBreakTimeDiff: {},
    coachTimes: {},
}
const CoachSlice = createSlice(
    {
        name: 'coachs',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(getCounrtyForCoach.pending, (state) => {
                    state.loading = true
                })
                .addCase(getCounrtyForCoach.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.coachCountryData = payload
                    state.error = false
                })
                .addCase(getCounrtyForCoach.rejected, (state, { payload }) => {
                    state.loading = false
                    state.coachCountryData = []
                    state.error = payload
                })
                .addCase(getRMForCoach.pending, (state) => {
                    state.loading = true
                })
                .addCase(getRMForCoach.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.rmData = payload
                    state.error = false
                })
                .addCase(getRMForCoach.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(getLevel.pending, (state) => {
                    state.loading = true
                })
                .addCase(getLevel.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.levelData = payload
                    state.error = false
                })
                .addCase(getLevel.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(getDays.pending, (state) => {
                    state.loading = true
                })
                .addCase(getDays.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.daysData = payload
                    state.error = false
                })
                .addCase(getDays.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(addCoach.pending, (state) => {
                    state.loading = true
                })
                .addCase(addCoach.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.addCoachData = payload
                    state.error = false
                })
                .addCase(addCoach.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(getCoachList.pending, (state) => {
                    state.loading = true
                })
                .addCase(getCoachList.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.getCoachOHData = payload
                    state.error = false
                })
                .addCase(getCoachList.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(geneatePass.pending, (state) => {
                    state.loading = true
                })
                .addCase(geneatePass.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.genPass = payload
                    state.error = false
                })
                .addCase(geneatePass.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
                .addCase(getCoachListOperationalHead.pending, (state) => {
                    state.loading = true
                })
                .addCase(getCoachListOperationalHead.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.getCoachOHData = payload
                    state.error = false
                })
                .addCase(getCoachListOperationalHead.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })

                .addCase(checkCoachBreakTimeDiff.pending, (state) => {
                    state.loading = true
                })
                .addCase(checkCoachBreakTimeDiff.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.coachBreakTimeDiff = payload
                    state.error = false
                })
                .addCase(checkCoachBreakTimeDiff.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })

                .addCase(checkCoachTimes.pending, (state) => {
                    state.loading = true
                })
                .addCase(checkCoachTimes.fulfilled, (state, { payload }) => {
                    state.loading = false
                    state.coachTimes = payload
                    state.error = false
                })
                .addCase(checkCoachTimes.rejected, (state, { payload }) => {
                    state.loading = false
                    state.error = payload
                })
        }
    }
)
export default CoachSlice.reducer;