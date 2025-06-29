import { mockArticles } from "./mockData";
import { Article } from "../types";

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

interface ArticleFilters {
  search?: string;
  category?: string;
  supplier?: string;
  lowStock?: boolean;
  reorderNeeded?: boolean;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface ArticleData extends Article {
  [key: string]: any;
}

let articlesData: ArticleData[] = [...mockArticles as ArticleData[]];
let nextId = Math.max(...articlesData.map(a => Number(a.id))) + 1;

export const articlesAPI = {
  async getAll(filters: ArticleFilters = {}) {
    await delay(800);
    
    let filteredArticles = [...articlesData];
    
    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredArticles = filteredArticles.filter(article =>
        article.name.toLowerCase().includes(searchTerm) ||
        (article as any).reference?.toLowerCase().includes(searchTerm) ||
        article.category.toLowerCase().includes(searchTerm) ||
        (article as any).description?.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.category && filters.category !== 'all') {
      filteredArticles = filteredArticles.filter(article =>
        article.category === filters.category
      );
    }
    
    if (filters.supplier && filters.supplier !== 'all') {
      filteredArticles = filteredArticles.filter(article =>
        (article as any).supplier?.id === parseInt(filters.supplier!)
      );
    }
    
    if (filters.lowStock) {
      filteredArticles = filteredArticles.filter(article =>
        article.currentStock <= article.minStock
      );
    }
    
    if (filters.reorderNeeded) {
      filteredArticles = filteredArticles.filter(article =>
        article.currentStock <= article.reorderPoint
      );
    }
    
    if (filters.isActive !== undefined) {
      filteredArticles = filteredArticles.filter(article =>
        (article as any).isActive === filters.isActive
      );
    }

    // Sorting
    if (filters.sortBy) {
      filteredArticles.sort((a, b) => {
        let aVal = (a as any)[filters.sortBy!];
        let bVal = (b as any)[filters.sortBy!];
        
        // Handle nested properties
        if (filters.sortBy === 'supplier.name') {
          aVal = (a as any).supplier?.name;
          bVal = (b as any).supplier?.name;
        }
        
        if (filters.sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
    
    // Get categories and low stock alerts
    const categories = Array.from(new Set(articlesData.map(a => a.category)));
    const lowStockAlerts = articlesData.filter(a => a.currentStock <= a.minStock);
    
    return {
      articles: paginatedArticles,
      total: filteredArticles.length,
      page,
      limit,
      totalPages: Math.ceil(filteredArticles.length / limit),
      categories,
      lowStockCount: lowStockAlerts.length,
      reorderCount: articlesData.filter(a => a.currentStock <= a.reorderPoint).length,
      totalStockValue: articlesData.reduce((sum, a) => sum + a.stockValue, 0),
      avgStockRotation: articlesData.reduce((sum, a) => sum + a.stockRotation, 0) / articlesData.length,
      statistics: {
        byCategory: categories.reduce((acc: Record<string, number>, cat) => {
          acc[cat] = articlesData.filter(a => a.category === cat).length;
          return acc;
        }, {}),
        stockStatus: {
          normal: articlesData.filter(a => a.currentStock > a.reorderPoint).length,
          lowStock: lowStockAlerts.length,
          reorderNeeded: articlesData.filter(a => a.currentStock <= a.reorderPoint).length
        }
      }
    };
  },

  async getById(id: string | number) {
    await delay(500);
    
    const article = articlesData.find(a => a.id === Number(id));
    if (!article) {
      throw new Error('Article not found');
    }
    
    return article;
  },

  async create(articleData: Partial<ArticleData>) {
    await delay(1000);
    
    // Validate required fields
    if (!articleData.name || !articleData.category) {
      throw new Error('Name and category are required');
    }
    
    const newArticle: ArticleData = {
      id: nextId++,
      name: articleData.name,
      category: articleData.category,
      currentStock: articleData.currentStock || 0,
      minStock: articleData.minStock || 10,
      maxStock: articleData.maxStock || 100,
      reorderPoint: articleData.reorderPoint || 20,
      stockRotation: articleData.stockRotation || 0,
      stockValue: articleData.stockValue || 0,
      averageConsumption: articleData.averageConsumption || 1,
      ...articleData
    };
    
    articlesData.unshift(newArticle);
    
    return newArticle;
  },

  async update(id: string | number, articleData: Partial<ArticleData>) {
    await delay(800);
    
    const index = articlesData.findIndex(a => a.id === Number(id));
    if (index === -1) {
      throw new Error('Article not found');
    }
    
    // Validate required fields
    if (articleData.name === '' || articleData.category === '') {
      throw new Error('Name and category cannot be empty');
    }
    
    articlesData[index] = {
      ...articlesData[index],
      ...articleData,
      id: Number(id) // Preserve ID
    };
    
    return articlesData[index];
  },

  async delete(id: string | number) {
    await delay(600);
    
    const index = articlesData.findIndex(a => a.id === Number(id));
    if (index === -1) {
      throw new Error('Article not found');
    }
    
    // Check if article has dependencies (orders, etc.)
    const hasOrders = Math.random() > 0.7; // Mock dependency check
    if (hasOrders) {
      throw new Error('Cannot delete article with existing orders');
    }
    
    const deletedArticle = articlesData.splice(index, 1)[0];
    
    return { success: true, article: deletedArticle };
  },

  async updateStock(id: string | number, newStock: number, reason = '') {
    await delay(500);
    
    const index = articlesData.findIndex(a => a.id === Number(id));
    if (index === -1) {
      throw new Error('Article not found');
    }
    
    if (newStock < 0) {
      throw new Error('Stock cannot be negative');
    }
    
    const oldStock = articlesData[index].currentStock;
    articlesData[index].currentStock = newStock;
    
    // Create stock movement record (mock)
    const movement = {
      id: Date.now(),
      articleId: id,
      type: newStock > oldStock ? 'in' : 'out',
      quantity: Math.abs(newStock - oldStock),
      reason: reason || 'Manual adjustment',
      timestamp: new Date().toISOString(),
      user: 'Current User' // Mock user
    };
    
    return {
      article: articlesData[index],
      movement,
      alert: newStock <= articlesData[index].minStock ? 'Low stock alert' : null
    };
  },

  async getStockMovements(articleId: string | number, period = '1month') {
    await delay(600);
    
    // Mock stock movements
    const movements = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      articleId,
      type: Math.random() > 0.5 ? 'in' : 'out',
      quantity: Math.floor(Math.random() * 50) + 1,
      reason: ['Purchase order', 'Sale', 'Adjustment', 'Transfer', 'Return'][Math.floor(Math.random() * 5)],
      timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      user: ['John Doe', 'Jane Smith', 'Bob Johnson'][Math.floor(Math.random() * 3)],
      reference: `REF-${1000 + i}`
    }));
    
    return {
      movements,
      period,
      summary: {
        totalIn: movements.filter(m => m.type === 'in').reduce((sum, m) => sum + m.quantity, 0),
        totalOut: movements.filter(m => m.type === 'out').reduce((sum, m) => sum + m.quantity, 0),
        netChange: movements.reduce((sum, m) => sum + (m.type === 'in' ? m.quantity : -m.quantity), 0)
      }
    };
  },

  async getForecast(articleId: string | number, period = '3months') {
    await delay(700);
    
    const article = articlesData.find(a => a.id === Number(articleId));
    if (!article) {
      throw new Error('Article not found');
    }
    
    // Mock forecasting data
    const dailyConsumption = article.averageConsumption || 1;
    const daysInPeriod = period === '1month' ? 30 : period === '3months' ? 90 : 365;
    
    const forecast = Array.from({ length: Math.min(daysInPeriod, 30) }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const baseConsumption = dailyConsumption;
      const seasonalVariation = Math.sin((i / 30) * Math.PI) * 0.3; // Mock seasonality
      const randomVariation = (Math.random() - 0.5) * 0.4;
      
      const expectedConsumption = Math.max(0, baseConsumption * (1 + seasonalVariation + randomVariation));
      const projectedStock = Math.max(0, article.currentStock - (expectedConsumption * (i + 1)));
      
      return {
        date: date.toISOString().split('T')[0],
        expectedConsumption: Math.round(expectedConsumption * 100) / 100,
        projectedStock: Math.round(projectedStock),
        reorderAlert: projectedStock <= article.reorderPoint,
        stockoutRisk: projectedStock <= 0
      };
    });
    
    return {
      articleId,
      period,
      forecast,
      recommendations: {
        nextReorderDate: forecast.find(f => f.reorderAlert)?.date || null,
        suggestedOrderQuantity: Math.max(article.maxStock - article.currentStock, 0),
        stockoutRisk: forecast.some(f => f.stockoutRisk) ? 'high' : 'low',
        averageDailyConsumption: dailyConsumption
      }
    };
  }
};