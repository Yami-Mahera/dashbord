import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authAPI } from "../../services/authService";
import { User, AuthState } from "../../types";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: any; // Temporaire
  token: string;
}

export const loginUser = createAsyncThunk<any, any>(
  "auth/loginUser",
  async ({ email, password }) => {
    const response = await authAPI.login(email, password);
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    return response;
  }
);

export const logoutUser = createAsyncThunk<void, void>(
  "auth/logoutUser",
  async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
);

// Fonction helper pour parser localStorage de manière sécurisée
const parseStoredUser = (): User | null => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: parseStoredUser(),
  token: localStorage.getItem("token") || null,
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initializeAuth: (state) => {
      const token = localStorage.getItem("token");
      const user = parseStoredUser();
      if (token && user) {
        state.isAuthenticated = true;
        state.user = user;
        state.token = token;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Erreur de connexion';
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { initializeAuth, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;