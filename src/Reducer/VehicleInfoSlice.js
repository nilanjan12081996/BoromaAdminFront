import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import nodeApi from "../store/nodeApi";

/**
 * =========================================================================
 * VEHICLE INFO API THUNKS (Connected to Node Backend: /api/vehicle-info)
 * Model fields:
 *  - id (BIGINT)
 *  - vehicle_no (STRING)
 *  - no_of_seat (INTEGER)
 *  - status (TINYINT: 1=active, 0=inactive)
 * Endpoints:
 *  - GET    /api/vehicle-info/get
 *  - POST   /api/vehicle-info/save
 *  - PUT    /api/vehicle-info/update/:id
 *  - DELETE /api/vehicle-info/delete/:id
 *  - PATCH  /api/vehicle-info/:id/toggle-status
 * =========================================================================
 */

// 1. GET ALL VEHICLE INFO
export const getAllVehicleInfo = createAsyncThunk(
  "vehicleInfo/getAllVehicleInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await nodeApi.get("/vehicle-info/get");
      if (response?.status === 200 || response?.data?.success) {
        return response?.data;
      } else {
        return rejectWithValue(response?.data);
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data || error?.message);
    }
  },
  {
    condition: (args, { getState }) => {
      if (args?.force) {
        return true;
      }
      const { vehicleInfo } = getState();
      if (vehicleInfo?.loading) {
        // Prevent duplicate concurrent requests
        return false;
      }
    },
  }
);

// 2. CREATE VEHICLE INFO
export const createVehicleInfo = createAsyncThunk(
  "vehicleInfo/createVehicleInfo",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await nodeApi.post("/vehicle-info/save", payload);
      if (
        response?.status === 200 ||
        response?.status === 201 ||
        response?.data?.success
      ) {
        return response?.data;
      } else {
        return rejectWithValue(response?.data);
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

// 3. UPDATE VEHICLE INFO
export const updateVehicleInfo = createAsyncThunk(
  "vehicleInfo/updateVehicleInfo",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const response = await nodeApi.put(`/vehicle-info/update/${id}`, payload);
      if (response?.status === 200 || response?.data?.success) {
        return response?.data;
      } else {
        return rejectWithValue(response?.data);
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

// 4. DELETE VEHICLE INFO
export const deleteVehicleInfo = createAsyncThunk(
  "vehicleInfo/deleteVehicleInfo",
  async (id, { rejectWithValue }) => {
    try {
      const response = await nodeApi.delete(`/vehicle-info/delete/${id}`);
      if (response?.status === 200 || response?.data?.success) {
        return { id, ...(response?.data || {}) };
      } else {
        return rejectWithValue(response?.data);
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

// 5. TOGGLE VEHICLE INFO STATUS
export const toggleVehicleInfoStatus = createAsyncThunk(
  "vehicleInfo/toggleVehicleInfoStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await nodeApi.patch(`/vehicle-info/${id}/toggle-status`, {
        status,
      });
      if (response?.status === 200 || response?.data?.success) {
        return { id, status, ...(response?.data || {}) };
      } else {
        return rejectWithValue(response?.data);
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  vehicleInfoList: [],
  selectedVehicle: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
};

const VehicleInfoSlice = createSlice({
  name: "vehicleInfo",
  initialState,
  reducers: {
    clearVehicleInfoState: (state) => {
      state.error = null;
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
      state.selectedVehicle = null;
    },
    setSelectedVehicle: (state, action) => {
      state.selectedVehicle = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(getAllVehicleInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllVehicleInfo.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.vehicleInfoList = payload;
        state.error = null;
      })
      .addCase(getAllVehicleInfo.rejected, (state, { payload, meta }) => {
        if (meta?.condition) return;
        state.loading = false;
        state.error = payload;
      })

      // CREATE
      .addCase(createVehicleInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createVehicleInfo.fulfilled, (state) => {
        state.loading = false;
        state.createSuccess = true;
        state.error = null;
      })
      .addCase(createVehicleInfo.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.createSuccess = false;
      })

      // UPDATE
      .addCase(updateVehicleInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateVehicleInfo.fulfilled, (state) => {
        state.loading = false;
        state.updateSuccess = true;
        state.error = null;
      })
      .addCase(updateVehicleInfo.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.updateSuccess = false;
      })

      // DELETE
      .addCase(deleteVehicleInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteVehicleInfo.fulfilled, (state) => {
        state.loading = false;
        state.deleteSuccess = true;
        state.error = null;
      })
      .addCase(deleteVehicleInfo.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.deleteSuccess = false;
      })

      // TOGGLE STATUS
      .addCase(toggleVehicleInfoStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleVehicleInfoStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(toggleVehicleInfoStatus.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { clearVehicleInfoState, setSelectedVehicle } =
  VehicleInfoSlice.actions;
export default VehicleInfoSlice.reducer;
