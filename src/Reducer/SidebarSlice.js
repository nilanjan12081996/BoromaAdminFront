import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import errorHandler from "../store/ErrorHandler";
import api from "../store/Api";

let isFetchingSidebar = false;

export const getSidebarList = createAsyncThunk(
    'sidebar/getSidebarList',
    async (_, { rejectWithValue }) => {
        try {
            isFetchingSidebar = true;
            const response = await api.get('/sidebar/list');
            isFetchingSidebar = false;
            if (response?.data?.status_code === 200 || response?.data?.statusCode === 200 || response?.data?.status === true) {
                return response?.data;
            } else {
                let errors = errorHandler(response);
                return rejectWithValue(errors);
            }
        } catch (error) {
            isFetchingSidebar = false;
            let errors = errorHandler(error);
            return rejectWithValue(errors);
        }
    },
    {
        condition: (arg, { getState }) => {
            if (arg?.force) return true;
            const { sidebar } = getState();
            if (sidebar?.loading || isFetchingSidebar) {
                return false;
            }
        }
    }
);

export const addSidebar = createAsyncThunk(
    'sidebar/addSidebar',
    async (userInput, { dispatch, rejectWithValue }) => {
        try {
            const response = await api.post('/sidebar/add', userInput);
            if (
                response?.data?.status_code === 201 ||
                response?.data?.statusCode === 201 ||
                response?.data?.status_code === 200 ||
                response?.data?.statusCode === 200 ||
                response?.data?.status === true
            ) {
                dispatch(getSidebarList({ force: true }));
                return response?.data;
            } else {
                let errors = errorHandler(response);
                return rejectWithValue(errors);
            }
        } catch (error) {
            let errors = errorHandler(error);
            return rejectWithValue(errors);
        }
    }
);


let isFetchingSubSidebar = false;

export const getSubSidebarList = createAsyncThunk(
    'sidebar/getSubSidebarList',
    async (_, { rejectWithValue }) => {
        try {
            isFetchingSubSidebar = true;
            const response = await api.get('/sidebar/sub-sidebar/list');
            isFetchingSubSidebar = false;
            if (
                response?.data?.status_code === 200 ||
                response?.data?.statusCode === 200 ||
                response?.data?.status === true ||
                Array.isArray(response?.data)
            ) {
                return response?.data;
            } else {
                let errors = errorHandler(response);
                return rejectWithValue(errors);
            }
        } catch (error) {
            isFetchingSubSidebar = false;
            let errors = errorHandler(error);
            return rejectWithValue(errors);
        }
    },
    {
        condition: (arg, { getState }) => {
            if (arg?.force) return true;
            const { sidebar } = getState();
            if (sidebar?.subSidebarLoading || isFetchingSubSidebar) {
                return false;
            }
        }
    }
);

export const addSubSidebar = createAsyncThunk(
    'sidebar/addSubSidebar',
    async (userInput, { dispatch, rejectWithValue }) => {
        try {
            const response = await api.post('/sidebar/sub-sidebar/add', userInput);
            if (
                response?.data?.status_code === 201 ||
                response?.data?.statusCode === 201 ||
                response?.data?.status_code === 200 ||
                response?.data?.statusCode === 200 ||
                response?.data?.status === true
            ) {
                dispatch(getSubSidebarList({ force: true }));
                dispatch(getSidebarList({ force: true }));
                return response?.data;
            } else {
                let errors = errorHandler(response);
                return rejectWithValue(errors);
            }
        } catch (error) {
            let errors = errorHandler(error);
            return rejectWithValue(errors);
        }
    }
);

const initialState = {
    loading: false,
    addLoading: false,
    subSidebarLoading: false,
    addSubLoading: false,
    error: null,
    addError: null,
    subSidebarError: null,
    addSubError: null,
    sidebarList: [],
    subSidebarList: [],
};

const SidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        clearSidebarList: (state) => {
            state.sidebarList = [];
            state.loading = false;
            state.error = null;
        },
        clearSubSidebarList: (state) => {
            state.subSidebarList = [];
            state.subSidebarLoading = false;
            state.subSidebarError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // getSidebarList
            .addCase(getSidebarList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSidebarList.fulfilled, (state, { payload }) => {
                state.loading = false;
                const items = Array.isArray(payload?.data)
                    ? payload.data
                    : Array.isArray(payload)
                    ? payload
                    : [];
                state.sidebarList = items;
                state.error = null;
            })
            .addCase(getSidebarList.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            // addSidebar
            .addCase(addSidebar.pending, (state) => {
                state.addLoading = true;
                state.addError = null;
            })
            .addCase(addSidebar.fulfilled, (state) => {
                state.addLoading = false;
                state.addError = null;
            })
            .addCase(addSidebar.rejected, (state, { payload }) => {
                state.addLoading = false;
                state.addError = payload;
            })
            // getSubSidebarList
            .addCase(getSubSidebarList.pending, (state) => {
                state.subSidebarLoading = true;
                state.subSidebarError = null;
            })
            .addCase(getSubSidebarList.fulfilled, (state, { payload }) => {
                state.subSidebarLoading = false;
                const items = Array.isArray(payload?.data)
                    ? payload.data
                    : Array.isArray(payload?.subSidebars)
                    ? payload.subSidebars
                    : Array.isArray(payload)
                    ? payload
                    : [];
                state.subSidebarList = items;
                state.subSidebarError = null;
            })
            .addCase(getSubSidebarList.rejected, (state, { payload }) => {
                state.subSidebarLoading = false;
                state.subSidebarError = payload;
            })
            // addSubSidebar
            .addCase(addSubSidebar.pending, (state) => {
                state.addSubLoading = true;
                state.addSubError = null;
            })
            .addCase(addSubSidebar.fulfilled, (state) => {
                state.addSubLoading = false;
                state.addSubError = null;
            })
            .addCase(addSubSidebar.rejected, (state, { payload }) => {
                state.addSubLoading = false;
                state.addSubError = payload;
            });
    }
});

export const { clearSidebarList, clearSubSidebarList } = SidebarSlice.actions;
export default SidebarSlice.reducer;
