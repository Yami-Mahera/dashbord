import { mockArticles } from "./mockData";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let articlesData = [...mockArticles];
let nextId = Math.max(...articlesData.map(a => a.id)) + 1;

export const articlesAPI = {
  async getAll(filters = {}) {
    await delay(800);
    
    let filteredArticles = [...articlesData];
    
    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredArticles = filteredArticles.filter(article =>
        article.name.toLowerCase().includes(searchTerm) ||
        article.reference.toLowerCase().includes(searchTerm) ||
        article.description.toLowerCase().includes(searchTerm) ||
        article.category.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.category && filters.category !== 'all') {
      filteredArticles = filteredArticles.filter(article =>
        article.category === filters.category
      );
    }
    
    if (filters.supplier && filters.supplier !== 'all') {
      filteredArticles = filteredArticles.filter(article =>
        article.supplier.id === parseInt(filters.supplier)
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
        article.isActive === filters.isActive
      );
    }

    // Sorting
    if (filters.sortBy) {
      filteredArticles.sort((a, b) => {
        let aVal = a[filters.sortBy];
        let bVal = b[filters.sortBy];
        
        // Handle nested properties
        if (filters.sortBy === 'supplier.name') {
          aVal = a.supplier.name;
          bVal = b.supplier.name;
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
    const categories = [...new Set(articlesData.map(a => a.category))];
    const lowStockAlerts = articlesData.filter(a => a.currentStock <= a.minStock);
    
    return {
      data: paginatedArticles,
      pagination: {
        page,
        limit,
        total: filteredArticles.length,
        totalPages: Math.ceil(filteredArticles.length / limit)
      },
      categories,
      lowStockAlerts,
      stats: {
        total: articlesData.length,
        active: articlesData.filter(a => a.isActive).length,
        lowStock: lowStockAlerts.length,
        reorderNeeded: articlesData.filter(a => a.currentStock <= a.reorderPoint).length,
        totalStockValue: articlesData.reduce((sum, a) => sum + a.stockValue, 0)
      }
    };
  },

  async getById(id) {
    await delay(500);
    
    const article = articlesData.find(a => a.id === parseInt(id));
    if (!article) {
      throw new Error("Article non trouvé");
    }
    
    return article;
  },

  async create(articleData) {
    await delay(1000);
    
    // Validate required fields
    if (!articleData.reference || !articleData.name || !articleData.category) {
      throw new Error("Référence, nom et catégorie sont obligatoires");
    }
    
    // Check if reference already exists
    if (articlesData.some(a => a.reference === articleData.reference)) {
      throw new Error("Cette référence existe déjà");
    }
    
    const newArticle = {
      id: nextId++,
      ...articleData,
      currentStock: articleData.currentStock || 0,
      stockValue: (articleData.currentStock || 0) * (articleData.price || 0),
      averageConsumption: 0,
      stockRotation: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      variants: articleData.variants || [],
      documents: articleData.documents || []
    };
    
    articlesData.push(newArticle);
    return newArticle;
  },

  async update(id, articleData) {
    await delay(800);
    
    const index = articlesData.findIndex(a => a.id === parseInt(id));
    if (index === -1) {
      throw new Error("Article non trouvé");
    }
    
    // Check if reference already exists (excluding current article)
    if (articleData.reference && articlesData.some(a => a.reference === articleData.reference && a.id !== parseInt(id))) {
      throw new Error("Cette référence existe déjà");
    }
    
    const updatedArticle = {
      ...articlesData[index],
      ...articleData,
      stockValue: (articleData.currentStock || articlesData[index].currentStock) * (articleData.price || articlesData[index].price),
      lastUpdated: new Date().toISOString()
    };
    
    articlesData[index] = updatedArticle;
    return updatedArticle;
  },

  async delete(id) {
    await delay(600);
    
    const index = articlesData.findIndex(a => a.id === parseInt(id));
    if (index === -1) {
      throw new Error("Article non trouvé");
    }
    
    // Check if article has pending orders
    const hasPendingOrders = false; // Mock check
    
    if (hasPendingOrders) {
      throw new Error("Impossible de supprimer un article avec des commandes en cours");
    }
    
    articlesData.splice(index, 1);
    return { success: true };
  },

  async updateStock(id, newStock, reason = '') {
    await delay(500);
    
    const index = articlesData.findIndex(a => a.id === parseInt(id));
    if (index === -1) {
      throw new Error("Article non trouvé");
    }
    
    const article = articlesData[index];
    const previousStock = article.currentStock;
    
    articlesData[index] = {
      ...article,
      currentStock: newStock,
      stockValue: newStock * article.price,
      lastUpdated: new Date().toISOString()
    };
    
    // Log stock movement (in a real app, this would be stored in a movements table)
    const stockMovement = {
      id: Date.now(),
      articleId: id,
      previousStock,
      newStock,
      movement: newStock - previousStock,
      reason,
      timestamp: new Date().toISOString()
    };
    
    return {
      article: articlesData[index],
      movement: stockMovement
    };
  },

  async getStockMovements(articleId, period = '1month') {
    await delay(600);
    
    // Mock stock movements
    const movements = [
      {
        id: 1,
        date: '2024-01-18T10:00:00Z',
        type: 'purchase',
        quantity: 10,
        reference: 'PO-2024-001',
        reason: 'Réception commande'
      },
      {
        id: 2,
        date: '2024-01-15T14:30:00Z',
        type: 'consumption',
        quantity: -5,
        reference: 'CONS-2024-005',
        reason: 'Consommation production'
      },
      {
        id: 3,
        date: '2024-01-12T09:15:00Z',
        type: 'adjustment',
        quantity: -2,
        reference: 'ADJ-2024-003',
        reason: 'Ajustement inventaire'
      }
    ];
    
    return {
      articleId: parseInt(articleId),
      period,
      movements,
      summary: {
        totalIn: movements.filter(m => m.quantity > 0).reduce((sum, m) => sum + m.quantity, 0),
        totalOut: Math.abs(movements.filter(m => m.quantity < 0).reduce((sum, m) => sum + m.quantity, 0)),
        netMovement: movements.reduce((sum, m) => sum + m.quantity, 0)
      }
    };
  },

  async getForecast(articleId, period = '3months') {
    await delay(700);
    
    const article = articlesData.find(a => a.id === parseInt(articleId));
    if (!article) {
      throw new Error("Article non trouvé");
    }
    
    // Mock forecast data
    const forecast = {
      articleId: parseInt(articleId),
      period,
      currentStock: article.currentStock,
      averageConsumption: article.averageConsumption,
      forecastedConsumption: [
        { month: 'Fév', consumption: article.averageConsumption * 1.1 },
        { month: 'Mar', consumption: article.averageConsumption * 0.95 },
        { month: 'Avr', consumption: article.averageConsumption * 1.05 }
      ],
      recommendedOrders: [
        {
          suggestedDate: '2024-02-01',
          quantity: Math.max(article.maxStock - article.currentStock, article.minOrderQuantity),
          reason: 'Réapprovisionnement préventif'
        }
      ],
      stockOutRisk: article.currentStock <= article.reorderPoint ? 'high' : 'low',
      optimalOrderQuantity: Math.max(article.maxStock - article.currentStock, article.minOrderQuantity)
    };
    
    return forecast;
  }
};