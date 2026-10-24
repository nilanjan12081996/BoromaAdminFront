import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import nodeApi from "../store/nodeApi";

/**
 * =========================================================================
 * CATEGORY API THUNKS (Connected to Node Backend: /api/category)
 * Endpoints:
 * - router.post("/save", categoryController.createCategory);
 * - router.get("/get", categoryController.getAllCategory);
 * - router.get("/get/:id", categoryController.getCategoryById);
 * - router.put("/update/:id", categoryController.updateCategory);
 * - router.delete("/delete/:id", categoryController.deleteCategory);
 * - router.patch("/:id/toggle-status", categoryController.toggleCategory);
 * =========================================================================
 */

// 1. GET ALL CATEGORIES
export const getCategory = createAsyncThunk(
  "category/getCategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await nodeApi.get("/category/get");
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
      const { category } = getState();
      if (category?.loading) {
        return false;
      }
    },
  }
);

// 2. CREATE CATEGORY
export const addCategory = createAsyncThunk(
  "category/addCategory",
  async (userInput, { rejectWithValue }) => {
    try {
      const response = await nodeApi.post("/category/save", userInput);
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

// 3. GET CATEGORY BY ID
export const getCategoryById = createAsyncThunk(
  "category/getCategoryById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await nodeApi.get(`/category/get/${id}`);
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
export const editCategory = getCategoryById;

// 4. UPDATE CATEGORY
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async (userInput, { rejectWithValue }) => {
    try {
      const id = userInput?.id || userInput?.category_id;
      const response = await nodeApi.put(`/category/update/${id}`, userInput);
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

// 5. DELETE CATEGORY
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (userInput, { rejectWithValue }) => {
    try {
      const id = userInput?.id || userInput?.category_id;
      const response = await nodeApi.delete(`/category/delete/${id}`);
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

// 6. TOGGLE CATEGORY STATUS
export const changeStatus = createAsyncThunk(
  "category/changeStatus",
  async (userInput, { rejectWithValue }) => {
    try {
      const id = userInput?.id || userInput?.category_id;
      const response = await nodeApi.patch(`/category/${id}/toggle-status`, {
        status: userInput?.status,
      });
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

const initialState = {
  loading: false,
  error: null,
  categoryList: [],
  categorySingle: null,
  categoryData: null,
  updateCateData: null,
  deleteCateData: null,
};

const CategorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategoryState: (state) => {
      state.error = null;
      state.categoryData = null;
      state.updateCateData = null;
      state.deleteCateData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET CATEGORIES
      .addCase(getCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategory.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.categoryList = payload;
        state.error = null;
      })
      .addCase(getCategory.rejected, (state, { payload, meta }) => {
        if (meta?.condition) {
          return;
        }
        state.loading = false;
        state.error = payload;
      })

      // ADD CATEGORY
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.categoryData = payload;
        state.error = null;
      })
      .addCase(addCategory.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // GET CATEGORY BY ID
      .addCase(getCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategoryById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.categorySingle = payload;
        state.error = null;
      })
      .addCase(getCategoryById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // UPDATE CATEGORY
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.updateCateData = payload;
        state.error = null;
      })
      .addCase(updateCategory.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // DELETE CATEGORY
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.deleteCateData = payload;
        state.error = null;
      })
      .addCase(deleteCategory.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // TOGGLE STATUS
      .addCase(changeStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(changeStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changeStatus.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { clearCategoryState } = CategorySlice.actions;
export default CategorySlice.reducer;