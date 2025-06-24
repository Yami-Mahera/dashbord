import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { articlesAPI } from "../../services/articlesService";

export const fetchArticles = createAsyncThunk(
  "articles/fetchArticles",
  async (filters = {}) => {
    const response = await articlesAPI.getAll(filters);
    return response;
  }
);

export const createArticle = createAsyncThunk(
  "articles/createArticle",
  async (articleData) => {
    const response = await articlesAPI.create(articleData);
    return response;
  }
);

export const updateArticle = createAsyncThunk(
  "articles/updateArticle",
  async ({ id, data }) => {
    const response = await articlesAPI.update(id, data);
    return response;
  }
);

export const deleteArticle = createAsyncThunk(
  "articles/deleteArticle",
  async (id) => {
    await articlesAPI.delete(id);
    return id;
  }
);

const articlesSlice = createSlice({
  name: "articles",
  initialState: {
    articles: [],
    currentArticle: null,
    isLoading: false,
    error: null,
    filters: {},
    categories: [],
    lowStockAlerts: [],
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
    },
  },
  reducers: {
    setCurrentArticle: (state, action) => {
      state.currentArticle = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    updateStock: (state, action) => {
      const { id, stock } = action.payload;
      const article = state.articles.find(a => a.id === id);
      if (article) {
        article.currentStock = stock;
      }
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
        state.error = action.error.message;
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

export const { setCurrentArticle, setFilters, clearError, updateStock } = articlesSlice.actions;
export default articlesSlice.reducer;