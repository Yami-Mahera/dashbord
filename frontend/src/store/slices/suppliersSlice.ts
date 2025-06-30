import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { suppliersAPI } from "../../services/suppliersService";
import {
  Supplier,
  CreateSupplierData,
  UpdateSupplierData,
  SupplierState,
  SupplierFilters,
  SuppliersApiResponse,
  SupplierApiResponse,
  Pagination,
  ThunkConfig,
} from "../../types/supplier.types";

// ✅ Initial state typé
const initialState: SupplierState = {
  suppliers: [],
  currentSupplier: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
};

// ✅ fetchSuppliers avec typage correct
export const fetchSuppliers = createAsyncThunk<
  SuppliersApiResponse,
  SupplierFilters | undefined,
  ThunkConfig
>("suppliers/fetchSuppliers", async (filters = {}, { rejectWithValue }) => {
  try {
    const response = await suppliersAPI.getAll(filters);
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Erreur lors de la récupération des fournisseurs"
    );
  }
});

// ✅ createSupplier avec typage correct
export const createSupplier = createAsyncThunk<
  Supplier,
  CreateSupplierData,
  ThunkConfig
>("suppliers/createSupplier", async (supplierData, { rejectWithValue }) => {
  try {
    const response = await suppliersAPI.create(supplierData);

    // Si l'API retourne { data: Supplier }, extraire data
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as unknown as SupplierApiResponse).data;
    }
    return response as unknown as Supplier;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Erreur lors de la création du fournisseur"
    );
  }
});

// ✅ updateSupplier avec typage correct
export const updateSupplier = createAsyncThunk<
  Supplier,
  { id: number; data: UpdateSupplierData },
  ThunkConfig
>("suppliers/updateSupplier", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await suppliersAPI.update(id, data);

    // Si l'API retourne { data: Supplier }, extraire data
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as SupplierApiResponse).data;
    }
    return response as Supplier;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Erreur lors de la mise à jour du fournisseur"
    );
  }
});

// ✅ deleteSupplier avec typage correct
export const deleteSupplier = createAsyncThunk<number, number, ThunkConfig>(
  "suppliers/deleteSupplier",
  async (id, { rejectWithValue }) => {
    try {
      await suppliersAPI.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de la suppression du fournisseur"
      );
    }
  }
);

// ✅ fetchSupplierById pour récupérer un fournisseur spécifique
export const fetchSupplierById = createAsyncThunk<
  Supplier,
  number,
  ThunkConfig
>("suppliers/fetchSupplierById", async (id, { rejectWithValue }) => {
  try {
    const response = await suppliersAPI.getById(id);
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as SupplierApiResponse).data;
    }
    return response as Supplier;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Erreur lors de la récupération du fournisseur"
    );
  }
});

// ✅ Slice avec typage correct
const suppliersSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {
    setCurrentSupplier(state, action: PayloadAction<Supplier | null>) {
      state.currentSupplier = action.payload;
    },

    setFilters(state, action: PayloadAction<SupplierFilters>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters(state) {
      state.filters = {};
    },
    clearError(state) {
      state.error = null;
    },
    clearCurrentSupplier(state) {
      state.currentSupplier = null;
    },
    resetState(state) {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch suppliers
      .addCase(fetchSuppliers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.suppliers = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.isLoading = false;

        state.error = action.payload || "Erreur inconnue";
      })

      // Fetch supplier by ID
      .addCase(fetchSupplierById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSupplierById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSupplier = action.payload;
        state.error = null;
      })
      .addCase(fetchSupplierById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || "Erreur lors de la récupération";
      })

      // Create supplier
      .addCase(createSupplier.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.isCreating = false;
        state.suppliers.push(action.payload);
        state.pagination.total += 1;
        state.error = null;
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.isCreating = false;

        state.error = action.payload as string || "Erreur lors de la création";
      })

      // Update supplier
      .addCase(updateSupplier.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.suppliers.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
        // Update current supplier if it's the same one
        if (state.currentSupplier?.id === action.payload.id) {
          state.currentSupplier = action.payload;
        }
        state.error = null;
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.isUpdating = false;

        state.error = action.payload as string || "Erreur lors de la mise à jour";
      })

      // Delete supplier
      .addCase(deleteSupplier.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.suppliers = state.suppliers.filter(
          (s) => s.id !== action.payload
        );
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        // Clear current supplier if it was deleted
        if (state.currentSupplier?.id === action.payload) {
          state.currentSupplier = null;
        }
        state.error = null;
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.isDeleting = false;

        state.error = action.payload || "Erreur lors de la suppression";
      });
  },
});

export const {
  setCurrentSupplier,
  setFilters,
  clearFilters,
  clearError,
  clearCurrentSupplier,
  resetState,
} = suppliersSlice.actions;

export default suppliersSlice.reducer;

// Selectors typés
export const selectSuppliers = (state: { suppliers: SupplierState }) =>
  state.suppliers.suppliers;
export const selectCurrentSupplier = (state: { suppliers: SupplierState }) =>
  state.suppliers.currentSupplier;
export const selectSuppliersLoading = (state: { suppliers: SupplierState }) =>
  state.suppliers.isLoading;
export const selectSuppliersCreating = (state: { suppliers: SupplierState }) =>
  state.suppliers.isCreating;
export const selectSuppliersUpdating = (state: { suppliers: SupplierState }) =>
  state.suppliers.isUpdating;
export const selectSuppliersDeleting = (state: { suppliers: SupplierState }) =>
  state.suppliers.isDeleting;
export const selectSuppliersError = (state: { suppliers: SupplierState }) =>
  state.suppliers.error;
export const selectSuppliersPagination = (state: {
  suppliers: SupplierState;
}) => state.suppliers.pagination;
export const selectSuppliersFilters = (state: { suppliers: SupplierState }) =>
  state.suppliers.filters;

// Selectors composés
export const selectSupplierById =
  (id: number) => (state: { suppliers: SupplierState }) =>
    state.suppliers.suppliers.find((supplier) => supplier.id === id);

export const selectSuppliersByCategory =
  (category: string) => (state: { suppliers: SupplierState }) =>
    state.suppliers.suppliers.filter(
      (supplier) => supplier.category === category
    );

export const selectActiveSuppliers = (state: { suppliers: SupplierState }) =>
  state.suppliers.suppliers.filter((supplier) => supplier.status === "active");
