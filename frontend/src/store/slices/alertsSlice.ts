import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { alertsAPI } from "../../services/alertsService";

export const fetchAlerts = createAsyncThunk(
  "alerts/fetchAlerts",
  async (filters = {}) => {
    const response = await alertsAPI.getAll(filters);
    return response;
  }
);

export const markAsRead = createAsyncThunk(
  "alerts/markAsRead",
  async (alertId) => {
    const response = await alertsAPI.markAsRead(alertId);
    return response;
  }
);

export const markAllAsRead = createAsyncThunk(
  "alerts/markAllAsRead",
  async () => {
    const response = await alertsAPI.markAllAsRead();
    return response;
  }
);

export const dismissAlert = createAsyncThunk(
  "alerts/dismissAlert",
  async (alertId) => {
    await alertsAPI.dismiss(alertId);
    return alertId;
  }
);

const alertsSlice = createSlice({
  name: "alerts",
  initialState: {
    alerts: [],
    unreadCount: 0,
    criticalCount: 0,
    isLoading: false,
    error: null,
    filters: {
      type: 'all',
      priority: 'all',
      read: 'all',
    },
  },
  reducers: {
    addAlert: (state, action) => {
      state.alerts.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
      if (action.payload.priority === 'critical') {
        state.criticalCount += 1;
      }
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
      .addCase(fetchAlerts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.alerts = action.payload.data;
        state.unreadCount = action.payload.unreadCount;
        state.criticalCount = action.payload.criticalCount;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const alert = state.alerts.find(a => a.id === action.payload.id);
        if (alert && !alert.read) {
          alert.read = true;
          state.unreadCount -= 1;
        }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.alerts.forEach(alert => {
          alert.read = true;
        });
        state.unreadCount = 0;
      })
      .addCase(dismissAlert.fulfilled, (state, action) => {
        const index = state.alerts.findIndex(a => a.id === action.payload);
        if (index !== -1) {
          const alert = state.alerts[index];
          if (!alert.read) {
            state.unreadCount -= 1;
          }
          if (alert.priority === 'critical') {
            state.criticalCount -= 1;
          }
          state.alerts.splice(index, 1);
        }
      });
  },
});

export const { addAlert, setFilters, clearError } = alertsSlice.actions;
export default alertsSlice.reducer;