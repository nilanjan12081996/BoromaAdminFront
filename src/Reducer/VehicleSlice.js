import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../store/Api";



export const getVehiclesInfo = createAsyncThunk(
    'getVehiclesInfo',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/admin/get-vehicle-info`);
            if (response?.data?.status_code === 200) {
                console.log("response",response);
                
                return response?.data;
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

export const addVehicle = createAsyncThunk(
    'addVehicle',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/admin/add-vehicle-info`,user_input);
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
export const changeStatusVehicle = createAsyncThunk(
    'changeStatusVehicle',
    async (user_input, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/admin/change-vehicle-info-status`,user_input);
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

export const getCategoryVeh = createAsyncThunk(
    'getCategoryVeh',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/admin/get-categories`);
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
    vehicleList:[],
    addVehicleData:"",
    subCategorySingle:{},
    updateSubCateData:{},
    categ:[]
    
}
const VehicleSlice=createSlice(
    {
        name:"vehicles",
        initialState,
        reducers:{},
        extraReducers:(builder)=>{
            builder
            .addCase(getVehiclesInfo.pending,(state)=>{
                state.loading=true
            })
            .addCase(getVehiclesInfo.fulfilled,(state,{payload})=>{
                state.loading=false
                state.vehicleList=payload
                console.log("res",payload);
                
                state.error=false
            })
            .addCase(getVehiclesInfo.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
            .addCase(addVehicle.pending,(state)=>{
                state.loading=true;
            })
            .addCase(addVehicle.fulfilled,(state,{payload})=>{
                state.loading=false
                state.addVehicleData=payload
                state.error=false
            })
            .addCase(addVehicle.rejected,(state,{payload})=>{
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
              .addCase(getCategoryVeh.pending,(state)=>{
                state.loading=true;
            })
            .addCase(getCategoryVeh.fulfilled,(state,{payload})=>{
                state.loading=false
                state.categ=payload
                state.error=false
            })
            .addCase(getCategoryVeh.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
            })
        }
    }
)
export default VehicleSlice.reducer;