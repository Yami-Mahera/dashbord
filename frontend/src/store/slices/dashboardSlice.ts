import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { dashboardAPI } from "../../services/dashboardService";
import { DashboardData, DashboardState, Activity, DateRange, KPI } from "../../types";

type KPIPeriod = 'month' | 'quarter' | 'year';

export const fetchDashboardData = createAsyncThunk<DashboardData, DateRange>(
  "dashboard/fetchDashboardData",
  async (dateRange = {}) => {
    const response = await dashboardAPI.getDashboardData(dateRange);
    return response;
  }
);

export const fetchKPIs = createAsyncThunk<Partial<KPI>, KPIPeriod>(
  "dashboard/fetchKPIs",
  async (period = 'month') => {
    const response = await dashboardAPI.getKPIs(period);
    return response;
  }
);

const initialState: DashboardState = {
  kpis: {
    totalOrders: 0,
    pendingOrders: 0,
    totalSuppliers: 0,
    lowStockItems: 0,
    averageDeliveryTime: 0,
    serviceLevel: 0,
    costSavings: 0,
    onTimeDelivery: 0,
  },
  charts: {
    ordersTrend: [],
    stockLevels: [],
    supplierPerformance: [],
    costAnalysis: [],
  },
  recentActivities: [],
  criticalAlerts: [],
  topSuppliers: [],
  stockRotation: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addActivity: (state, action: PayloadAction<Activity>) => {
      state.recentActivities.unshift(action.payload);
      if (state.recentActivities.length > 20) {
        state.recentActivities = state.recentActivities.slice(0, 20);
      }
    },
    updateKPI: (state, action: PayloadAction<{ kpi: keyof KPI; value: number }>) => {
      const { kpi, value } = action.payload;
      if (kpi in state.kpis) {
        (state.kpis as any)[kpi] = value;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.kpis = action.payload.kpis;
        state.charts = action.payload.charts;
        state.recentActivities = action.payload.recentActivities;
        state.criticalAlerts = action.payload.criticalAlerts;
        state.topSuppliers = action.payload.topSuppliers;
        state.stockRotation = action.payload.stockRotation || [];
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Erreur lors du chargement du dashboard';
      })
      .addCase(fetchKPIs.fulfilled, (state, action) => {
        state.kpis = { ...state.kpis, ...action.payload };
      });
  },
});

export const { clearError, addActivity, updateKPI } = dashboardSlice.actions;
export default dashboardSlice.reducer;