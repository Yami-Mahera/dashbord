import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { articlesAPI } from "../../services/articlesService";
import { Article } from "../../types";

// Types pour les paramètres - temporaire avec any
interface ArticleFilters {
  search?: string;
  category?: string;
  status?: string;
  supplier?: string;
  stockLevel?: string;
  [key: string]: any; // Temporaire
}

interface ArticlesResponse {
  data: any[]; // Temporaire
  categories: string[];
  lowStockAlerts: any[]; // Temporaire
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const fetchArticles = createAsyncThunk<any, any>(
  "articles/fetchArticles",
  async (filters = {}) => {
    const response = await articlesAPI.getAll(filters);
    return response;
  }
);

export const createArticle = createAsyncThunk<any, any>(
  "articles/createArticle",
  async (articleData) => {
    const response = await articlesAPI.create(articleData);
    return response;
  }
);

export const updateArticle = createAsyncThunk<any, any>(
  "articles/updateArticle",
  async ({ id, data }) => {
    const response = await articlesAPI.update(id, data);
    return response;
  }
);

export const deleteArticle = createAsyncThunk<any, any>(
  "articles/deleteArticle",
  async (id) => {
    await articlesAPI.delete(id);
    return id;
  }
);

interface ArticlesState {
  articles: any[]; // Temporaire
  categories: string[];
  lowStockAlerts: any[]; // Temporaire
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: ArticlesState = {
  articles: [],
  categories: [],
  lowStockAlerts: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
};

const articlesSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    updateStock: (state, action: PayloadAction<{ id: string | number; stock: number }>) => {
      const { id, stock } = action.payload;
      const article = state.articles.find(a => a.id === id);
      if (article) {
        article.currentStock = stock;
      }
    },
    setFilters: (state, action: PayloadAction<Partial<ArticleFilters>>) => {
      // Note: Les filtres seront gérés par le composant local
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.articles = action.payload.data;
        state.categories = action.payload.categories;
        state.lowStockAlerts = action.payload.lowStockAlerts;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Erreur lors du chargement des articles';
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.articles.push(action.payload);
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        const index = state.articles.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.articles[index] = action.payload;
        }
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.articles = state.articles.filter(a => a.id !== action.payload);
      });
  },
});

export const { updateStock, setFilters, clearError } = articlesSlice.actions;
export default articlesSlice.reducer;