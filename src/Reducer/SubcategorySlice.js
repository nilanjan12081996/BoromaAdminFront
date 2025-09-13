import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";



export const getSubCategory = createAsyncThunk(
    'getSubCategory',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/admin/sub-category-list`);
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

export const addSubCategory = createAsyncThunk(
    'addSubCategory',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/admin/add-sub-category`,user_input);
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
export const changeStatusSub = createAsyncThunk(
    'changeStatusSub',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/admin/change-sub-category-status`,user_input);
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

export const editSubCategory = createAsyncThunk(
    'editSubCategory',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/admin/edit-sub-category`,user_input);
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

export const updateSubCategory = createAsyncThunk(
    'updateSubCategory',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/admin/update-sub-category`,user_input);
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
const initialState={
    loading:false,
    error:false,
    subCategoryList:[],
    subCategoryData:"",
    subCategorySingle:{},
    updateSubCateData:{}
    
}
const SubcategorySlice=createSlice(
    {
        name:"subCategory",
        initialState,
        reducers:{},
        extraReducers:(builder)=>{
            builder
            .addCase(getSubCategory.pending,(state)=>{
                state.loading=true
            })
            .addCase(getSubCategory.fulfilled,(state,{payload})=>{
                state.loading=false
                state.subCategoryList=payload
                state.error=false
            })
            .addCase(getSubCategory.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
            .addCase(addSubCategory.pending,(state)=>{
                state.loading=true;
            })
            .addCase(addSubCategory.fulfilled,(state,{payload})=>{
                state.loading=false
                state.subCategoryData=payload
                state.error=false
            })
            .addCase(addSubCategory.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
            .addCase(editSubCategory.pending,(state)=>{
                state.loading=true;
            })
            .addCase(editSubCategory.fulfilled,(state,{payload})=>{
                state.loading=false
                state.subCategorySingle=payload
                state.error=false
            })
            .addCase(editSubCategory.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
            .addCase(updateSubCategory.pending,(state)=>{
                state.loading=true;
            })
            .addCase(updateSubCategory.fulfilled,(state,{payload})=>{
                state.loading=false
                state.updateSubCateData=payload
                state.error=false
            })
            .addCase(updateSubCategory.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
        }
    }
)
export default SubcategorySlice.reducer;