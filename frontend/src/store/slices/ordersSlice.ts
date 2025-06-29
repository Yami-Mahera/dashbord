import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ordersAPI } from "../../services/ordersService";
import { OrderFilters, OrderCreateData, OrderUpdateData, OrderData, OrdersResponse, OrderStats, OrderPagination } from "../../types/order.types";

// Async thunks avec types appropriés
export const fetchOrders = createAsyncThunk<OrdersResponse, OrderFilters>(
  "orders/fetchOrders",
  async (filters = {}) => {
    const response = await ordersAPI.getAll(filters);
    return response;
  }
);

export const createOrder = createAsyncThunk<OrderData, OrderCreateData>(
  "orders/createOrder",
  async (orderData) => {
    const response = await ordersAPI.create(orderData);
    return response;
  }
);

export const updateOrder = createAsyncThunk<OrderData, { id: string | number; data: OrderUpdateData }>(
  "orders/updateOrder",
  async ({ id, data }) => {
    const response = await ordersAPI.update(id, data);
    return response;
  }
);

export const validateOrder = createAsyncThunk<OrderData, { id: string | number; validatedBy: any }>(
  "orders/validateOrder",
  async ({ id, validatedBy }) => {
    const response = await ordersAPI.validate(id, validatedBy);
    return response;
  }
);

export const rejectOrder = createAsyncThunk<OrderData, { id: string | number; reason: string; rejectedBy: any }>(
  "orders/rejectOrder",
  async ({ id, reason, rejectedBy }) => {
    const response = await ordersAPI.reject(id, reason, rejectedBy);
    return response;
  }
);

// Interface pour l'état
interface OrdersState {
  orders: OrderData[];
  currentOrder: OrderData | null;
  pendingOrders: OrderData[];
  urgentOrders: OrderData[];
  isLoading: boolean;
  error: string | null;
  filters: OrderFilters;
  orderStats: OrderStats;
  pagination: OrderPagination;
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  pendingOrders: [],
  urgentOrders: [],
  isLoading: false,
  error: null,
  filters: {},
  orderStats: {
    total: 0,
    pending: 0,
    validated: 0,
    delivered: 0,
    delayed: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setCurrentOrder: (state, action: PayloadAction<OrderData | null>) => {
      state.currentOrder = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<OrderFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    updateOrderStatus: (state, action: PayloadAction<{ id: number; status: string }>) => {
      const { id, status } = action.payload;
      const order = state.orders.find(o => o.id === id);
      if (order) {
        order.status = status;
        // Ajouter updatedAt si c'est dans le type OrderData
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.data;
        state.pendingOrders = action.payload.pendingOrders;
        state.urgentOrders = action.payload.urgentOrders;
        state.orderStats = action.payload.stats;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Erreur lors du chargement des commandes';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
        state.orderStats.total += 1;
        state.orderStats.pending += 1;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(validateOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
          state.orderStats.pending -= 1;
          state.orderStats.validated += 1;
        }
      })
      .addCase(rejectOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
          state.orderStats.pending -= 1;
        }
      });
  },
});

export const { setCurrentOrder, setFilters, clearError, updateOrderStatus } = ordersSlice.actions;
export default ordersSlice.reducer;