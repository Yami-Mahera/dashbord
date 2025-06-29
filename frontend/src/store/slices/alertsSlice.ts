import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { alertsAPI } from "../../services/alertsService";
import { Alert } from "../../types";

// Types pour les paramètres - temporaire avec any
interface AlertFilters {
  type?: string;
  priority?: string;
  read?: boolean;
  search?: string;
  [key: string]: any; // Temporaire
}

interface AlertsResponse {
  data: any[]; // Temporaire
  unreadCount: number;
  criticalCount: number;
}

export const fetchAlerts = createAsyncThunk<any, any>(
  "alerts/fetchAlerts",
  async (filters = {}) => {
    const response = await alertsAPI.getAll(filters);
    return response;
  }
);

export const markAsRead = createAsyncThunk<any, any>(
  "alerts/markAsRead",
  async ({ id }) => {
    const response = await alertsAPI.markAsRead(id);
    return response;
  }
);

export const markAllAsRead = createAsyncThunk<void, void>(
  "alerts/markAllAsRead",
  async () => {
    await alertsAPI.markAllAsRead();
  }
);

export const dismissAlert = createAsyncThunk<string, string>(
  "alerts/dismissAlert",
  async (id) => {
    await alertsAPI.dismiss(id);
    return id;
  }
);

interface AlertsState {
  alerts: any[]; // Temporaire
  isLoading: boolean;
  error: string | null;
  unreadCount: number;
  criticalCount: number;
}

const initialState: AlertsState = {
  alerts: [],
  isLoading: false,
  error: null,
  unreadCount: 0,
  criticalCount: 0,
};

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.alerts.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
      if (action.payload.priority === 'critical') {
        state.criticalCount += 1;
      }
    },
    setFilters: (state, action: PayloadAction<Partial<AlertFilters>>) => {
      // Note: Les filtres seront gérés par le composant local
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
        state.error = action.error.message || 'Erreur lors du chargement des alertes';
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