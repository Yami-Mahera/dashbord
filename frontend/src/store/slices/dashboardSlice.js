import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dashboardAPI } from "../../services/dashboardService";

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (dateRange = {}) => {
    const response = await dashboardAPI.getDashboardData(dateRange);
    return response;
  }
);

export const fetchKPIs = createAsyncThunk(
  "dashboard/fetchKPIs",
  async (period = 'month') => {
    const response = await dashboardAPI.getKPIs(period);
    return response;
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
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
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addActivity: (state, action) => {
      state.recentActivities.unshift(action.payload);
      if (state.recentActivities.length > 20) {
        state.recentActivities = state.recentActivities.slice(0, 20);
      }
    },
    updateKPI: (state, action) => {
      const { kpi, value } = action.payload;
      if (state.kpis.hasOwnProperty(kpi)) {
        state.kpis[kpi] = value;
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
        state.stockRotation = action.payload.stockRotation;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchKPIs.fulfilled, (state, action) => {
        state.kpis = { ...state.kpis, ...action.payload };
      });
  },
});

export const { clearError, addActivity, updateKPI } = dashboardSlice.actions;
export default dashboardSlice.reducer;