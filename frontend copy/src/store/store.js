import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import suppliersSlice from "./slices/suppliersSlice";
import articlesSlice from "./slices/articlesSlice";
import ordersSlice from "./slices/ordersSlice";
import dashboardSlice from "./slices/dashboardSlice";
import alertsSlice from "./slices/alertsSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    suppliers: suppliersSlice,
    articles: articlesSlice,
    orders: ordersSlice,
    dashboard: dashboardSlice,
    alerts: alertsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;