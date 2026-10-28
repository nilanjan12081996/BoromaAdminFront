import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import nodeApi from "../store/nodeApi";

/**
 * =========================================================================
 * COMPANY API THUNKS (Connected to Node Backend: /api/company)
 * Endpoints:
 * - router.post("/create", companyController.createCompany);
 * - router.get("/get-all", companyController.getAllCompany);
 * - router.get("/get-by-id/:id", companyController.getCompanyById);
 * - router.put("/update/:id", companyController.updateCompany);
 * - router.delete("/delete/:id", companyController.deleteCompany);
 * - router.put("/toggle-status/:id", companyController.toggleCompanyStatus);
 * =========================================================================
 */

// 1. GET ALL COMPANIES
export const getAllCompany = createAsyncThunk(
  "company/getAllCompany",
  async (_, { rejectWithValue }) => {
    try {
      const response = await nodeApi.get("/company/get-all");
      if (response?.status === 200 || response?.data?.success) {
        return response?.data;
      } else {
        return rejectWithValue(response?.data);
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: error?.message || "Failed to fetch companies" }
      );
    }
  },
  {
    condition: (args, { getState }) => {
      if (args?.force) {
        return true;
      }
      const { company } = getState();
      if (company?.loading) {
        return false;
      }
    },
  }
);
export const getCompanyList = getAllCompany;

// 2. CREATE COMPANY
export const createCompany = createAsyncThunk(
  "company/createCompany",
  async (userInput, { rejectWithValue }) => {
    try {
      const response = await nodeApi.post("/company/create", userInput);
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
      return rejectWithValue(
        error?.response?.data || { message: error?.message || "Failed to create company" }
      );
    }
  }
);
export const addCompany = createCompany;

// 3. GET COMPANY BY ID
export const getCompanyById = createAsyncThunk(
  "company/getCompanyById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await nodeApi.get(`/company/get-by-id/${id}`);
      if (response?.status === 200 || response?.data?.success) {
        return response?.data;
      } else {
        return rejectWithValue(response?.data);
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: error?.message || "Failed to fetch company details" }
      );
    }
  }
);

// 4. UPDATE COMPANY
export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async (userInput, { rejectWithValue }) => {
    try {
      const id = userInput?.id || userInput?.company_id;
      const response = await nodeApi.put(`/company/update/${id}`, {
        company_name: userInput?.company_name,
        company_email: userInput?.company_email,
      });
      if (response?.status === 200 || response?.data?.success) {
        return response?.data;
      } else {
        return rejectWithValue(response?.data);
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: error?.message || "Failed to update company" }
      );
    }
  }
);

// 5. DELETE COMPANY
export const deleteCompany = createAsyncThunk(
  "company/deleteCompany",
  async (userInput, { rejectWithValue }) => {
    try {
      const id = typeof userInput === "object" ? (userInput?.id || userInput?.company_id) : userInput;
      const response = await nodeApi.delete(`/company/delete/${id}`);
      if (response?.status === 200 || response?.data?.success) {
        return response?.data;
      } else {
        return rejectWithValue(response?.data);
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: error?.message || "Failed to delete company" }
      );
    }
  }
);

// 6. TOGGLE COMPANY STATUS
export const toggleCompanyStatus = createAsyncThunk(
  "company/toggleCompanyStatus",
  async (userInput, { rejectWithValue }) => {
    try {
      const id = typeof userInput === "object" ? (userInput?.id || userInput?.company_id) : userInput;
      const response = await nodeApi.put(`/company/toggle-status/${id}`);
      if (response?.status === 200 || response?.data?.success) {
        return response?.data;
      } else {
        return rejectWithValue(response?.data);
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: error?.message || "Failed to toggle company status" }
      );
    }
  }
);

const initialState = {
  loading: false,
  actionLoading: false,
  error: null,
  companyList: [],
  companySingle: null,
  companyData: null,
  updateCompanyData: null,
  deleteCompanyData: null,
};

const CompanySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    clearCompanyState: (state) => {
      state.error = null;
      state.companyData = null;
      state.updateCompanyData = null;
      state.deleteCompanyData = null;
    },
  },
  extraReducers: (builder) => {
    // GET ALL
    builder
      .addCase(getAllCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companyList = action.payload;
      })
      .addCase(getAllCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // CREATE
    builder
      .addCase(createCompany.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.companyData = action.payload;
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });

    // GET BY ID
    builder
      .addCase(getCompanyById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.companySingle = action.payload;
      })
      .addCase(getCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // UPDATE
    builder
      .addCase(updateCompany.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.updateCompanyData = action.payload;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });

    // DELETE
    builder
      .addCase(deleteCompany.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.deleteCompanyData = action.payload;
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });

    // TOGGLE STATUS
    builder
      .addCase(toggleCompanyStatus.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(toggleCompanyStatus.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(toggleCompanyStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCompanyState } = CompanySlice.actions;
export default CompanySlice.reducer;
