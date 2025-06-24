import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { store } from "./store/store";
import { useSelector, useDispatch } from "react-redux";
import { initializeAuth } from "./store/slices/authSlice";
import { Toaster } from "./components/ui/toaster";
import "./App.css";

// Components
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Suppliers from "./pages/Suppliers";
import Articles from "./pages/Articles";
import Orders from "./pages/Orders";
import Alerts from "./pages/Alerts";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Auth Route component (redirect to dashboard if already authenticated)
const AuthRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="suppliers/*" element={<Suppliers />} />
            <Route path="articles/*" element={<Articles />} />
            <Route path="orders/*" element={<Orders />} />
            <Route path="alerts" element={<Alerts />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;