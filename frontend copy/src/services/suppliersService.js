import { mockSuppliers } from "./mockData";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let suppliersData = [...mockSuppliers];
let nextId = Math.max(...suppliersData.map(s => s.id)) + 1;

export const suppliersAPI = {
  async getAll(filters = {}) {
    await delay(800);
    
    let filteredSuppliers = [...suppliersData];
    
    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredSuppliers = filteredSuppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm) ||
        supplier.code.toLowerCase().includes(searchTerm) ||
        supplier.category.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.category && filters.category !== 'all') {
      filteredSuppliers = filteredSuppliers.filter(supplier =>
        supplier.category === filters.category
      );
    }
    
    if (filters.isActive !== undefined) {
      filteredSuppliers = filteredSuppliers.filter(supplier =>
        supplier.isActive === filters.isActive
      );
    }
    
    if (filters.rating) {
      filteredSuppliers = filteredSuppliers.filter(supplier =>
        supplier.rating >= filters.rating
      );
    }

    // Sorting
    if (filters.sortBy) {
      filteredSuppliers.sort((a, b) => {
        const aVal = a[filters.sortBy];
        const bVal = b[filters.sortBy];
        
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
    
    const paginatedSuppliers = filteredSuppliers.slice(startIndex, endIndex);
    
    return {
      data: paginatedSuppliers,
      pagination: {
        page,
        limit,
        total: filteredSuppliers.length,
        totalPages: Math.ceil(filteredSuppliers.length / limit)
      },
      categories: [...new Set(suppliersData.map(s => s.category))],
      stats: {
        total: suppliersData.length,
        active: suppliersData.filter(s => s.isActive).length,
        averageRating: suppliersData.reduce((sum, s) => sum + s.rating, 0) / suppliersData.length
      }
    };
  },

  async getById(id) {
    await delay(500);
    
    const supplier = suppliersData.find(s => s.id === parseInt(id));
    if (!supplier) {
      throw new Error("Fournisseur non trouvé");
    }
    
    return supplier;
  },

  async create(supplierData) {
    await delay(1000);
    
    // Validate required fields
    if (!supplierData.name || !supplierData.code) {
      throw new Error("Nom et code fournisseur sont obligatoires");
    }
    
    // Check if code already exists
    if (suppliersData.some(s => s.code === supplierData.code)) {
      throw new Error("Ce code fournisseur existe déjà");
    }
    
    const newSupplier = {
      id: nextId++,
      ...supplierData,
      createdAt: new Date().toISOString(),
      totalOrders: 0,
      totalAmount: 0,
      averageDeliveryTime: 0,
      onTimeDeliveryRate: 0,
      qualityRating: 0,
      isActive: true,
      rating: 0,
      documents: supplierData.documents || []
    };
    
    suppliersData.push(newSupplier);
    return newSupplier;
  },

  async update(id, supplierData) {
    await delay(800);
    
    const index = suppliersData.findIndex(s => s.id === parseInt(id));
    if (index === -1) {
      throw new Error("Fournisseur non trouvé");
    }
    
    // Check if code already exists (excluding current supplier)
    if (supplierData.code && suppliersData.some(s => s.code === supplierData.code && s.id !== parseInt(id))) {
      throw new Error("Ce code fournisseur existe déjà");
    }
    
    const updatedSupplier = {
      ...suppliersData[index],
      ...supplierData,
      updatedAt: new Date().toISOString()
    };
    
    suppliersData[index] = updatedSupplier;
    return updatedSupplier;
  },

  async delete(id) {
    await delay(600);
    
    const index = suppliersData.findIndex(s => s.id === parseInt(id));
    if (index === -1) {
      throw new Error("Fournisseur non trouvé");
    }
    
    // Check if supplier has active orders
    // In a real application, you would check against the orders
    const hasActiveOrders = false; // Mock check
    
    if (hasActiveOrders) {
      throw new Error("Impossible de supprimer un fournisseur avec des commandes actives");
    }
    
    suppliersData.splice(index, 1);
    return { success: true };
  },

  async getPerformanceMetrics(id, period = '3months') {
    await delay(600);
    
    const supplier = suppliersData.find(s => s.id === parseInt(id));
    if (!supplier) {
      throw new Error("Fournisseur non trouvé");
    }
    
    // Mock performance data
    return {
      supplierId: id,
      period,
      metrics: {
        totalOrders: supplier.totalOrders,
        totalAmount: supplier.totalAmount,
        averageOrderValue: supplier.totalAmount / (supplier.totalOrders || 1),
        onTimeDeliveryRate: supplier.onTimeDeliveryRate,
        averageDeliveryTime: supplier.averageDeliveryTime,
        qualityRating: supplier.qualityRating,
        defectRate: Math.random() * 5, // Mock defect rate 0-5%
        responseTime: Math.random() * 24 + 1 // Mock response time 1-24 hours
      },
      trends: {
        orders: [
          { month: 'Jan', count: 12, amount: 45000 },
          { month: 'Fév', count: 15, amount: 52000 },
          { month: 'Mar', count: 8, amount: 28000 }
        ],
        performance: [
          { month: 'Jan', onTime: 95, quality: 4.2 },
          { month: 'Fév', onTime: 92, quality: 4.5 },
          { month: 'Mar', onTime: 89, quality: 4.1 }
        ]
      }
    };
  }
};