import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";



export const getCategory = createAsyncThunk(
    'getCategory',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/admin/category-list`);
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

export const addCategory = createAsyncThunk(
    'addCategory',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/admin/add-category`,user_input);
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
const initialState={
    loading:false,
    error:false,
    categoryList:[],
    categoryData:""
}
const CategorySlice=createSlice(
    {
        name:"category",
        initialState,
        reducers:{},
        extraReducers:(builder)=>{
            builder
            .addCase(getCategory.pending,(state)=>{
                state.loading=true
            })
            .addCase(getCategory.fulfilled,(state,{payload})=>{
                state.loading=false
                state.categoryList=payload
                state.error=false
            })
            .addCase(getCategory.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
            .addCase(addCategory.pending,(state)=>{
                state.loading=true;
            })
            .addCase(addCategory.fulfilled,(state,{payload})=>{
                state.loading=false
                state.categoryData=payload
                state.error=false
            })
            .addCase(addCategory.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
        }
    }
)
export default CategorySlice.reducer;