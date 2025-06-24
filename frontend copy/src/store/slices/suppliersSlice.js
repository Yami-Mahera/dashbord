import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { suppliersAPI } from "../../services/suppliersService";

export const fetchSuppliers = createAsyncThunk(
  "suppliers/fetchSuppliers",
  async (filters = {}) => {
    const response = await suppliersAPI.getAll(filters);
    return response;
  }
);

export const createSupplier = createAsyncThunk(
  "suppliers/createSupplier",
  async (supplierData) => {
    const response = await suppliersAPI.create(supplierData);
    return response;
  }
);

export const updateSupplier = createAsyncThunk(
  "suppliers/updateSupplier",
  async ({ id, data }) => {
    const response = await suppliersAPI.update(id, data);
    return response;
  }
);

export const deleteSupplier = createAsyncThunk(
  "suppliers/deleteSupplier",
  async (id) => {
    await suppliersAPI.delete(id);
    return id;
  }
);

const suppliersSlice = createSlice({
  name: "suppliers",
  initialState: {
    suppliers: [],
    currentSupplier: null,
    isLoading: false,
    error: null,
    filters: {},
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
    },
  },
  reducers: {
    setCurrentSupplier: (state, action) => {
      state.currentSupplier = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.suppliers = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.suppliers.push(action.payload);
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        const index = state.suppliers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.suppliers = state.suppliers.filter(s => s.id !== action.payload);
      });
  },
});

export const { setCurrentSupplier, setFilters, clearError } = suppliersSlice.actions;
export default suppliersSlice.reducer;