import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ordersAPI } from "../../services/ordersService";

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (filters = {}) => {
    const response = await ordersAPI.getAll(filters);
    return response;
  }
);

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData) => {
    const response = await ordersAPI.create(orderData);
    return response;
  }
);

export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async ({ id, data }) => {
    const response = await ordersAPI.update(id, data);
    return response;
  }
);

export const validateOrder = createAsyncThunk(
  "orders/validateOrder",
  async (id) => {
    const response = await ordersAPI.validate(id);
    return response;
  }
);

export const rejectOrder = createAsyncThunk(
  "orders/rejectOrder",
  async ({ id, reason }) => {
    const response = await ordersAPI.reject(id, reason);
    return response;
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
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
  },
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    updateOrderStatus: (state, action) => {
      const { id, status } = action.payload;
      const order = state.orders.find(o => o.id === id);
      if (order) {
        order.status = status;
        order.updatedAt = new Date().toISOString();
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
        state.error = action.error.message;
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