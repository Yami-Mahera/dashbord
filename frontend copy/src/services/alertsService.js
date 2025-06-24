import { mockAlerts } from "./mockData";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let alertsData = [...mockAlerts];
let nextId = Math.max(...alertsData.map(a => a.id)) + 1;

export const alertsAPI = {
  async getAll(filters = {}) {
    await delay(600);
    
    let filteredAlerts = [...alertsData];
    
    // Apply filters
    if (filters.type && filters.type !== 'all') {
      filteredAlerts = filteredAlerts.filter(alert =>
        alert.type === filters.type
      );
    }
    
    if (filters.priority && filters.priority !== 'all') {
      filteredAlerts = filteredAlerts.filter(alert =>
        alert.priority === filters.priority
      );
    }
    
    if (filters.read && filters.read !== 'all') {
      const isRead = filters.read === 'read';
      filteredAlerts = filteredAlerts.filter(alert =>
        alert.read === isRead
      );
    }
    
    if (filters.actionRequired !== undefined) {
      filteredAlerts = filteredAlerts.filter(alert =>
        alert.actionRequired === filters.actionRequired
      );
    }

    // Sorting - most recent first, then by priority
    filteredAlerts.sort((a, b) => {
      // Priority order: critical > high > medium > low
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      
      if (a.priority !== b.priority) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedAlerts = filteredAlerts.slice(startIndex, endIndex);
    
    // Calculate counts
    const unreadCount = alertsData.filter(a => !a.read).length;
    const criticalCount = alertsData.filter(a => a.priority === 'critical' && !a.read).length;
    
    return {
      data: paginatedAlerts,
      pagination: {
        page,
        limit,
        total: filteredAlerts.length,
        totalPages: Math.ceil(filteredAlerts.length / limit)
      },
      unreadCount,
      criticalCount,
      summary: {
        total: alertsData.length,
        byPriority: {
          critical: alertsData.filter(a => a.priority === 'critical').length,
          high: alertsData.filter(a => a.priority === 'high').length,
          medium: alertsData.filter(a => a.priority === 'medium').length,
          low: alertsData.filter(a => a.priority === 'low').length
        },
        byType: {
          stock_low: alertsData.filter(a => a.type === 'stock_low').length,
          order_delay: alertsData.filter(a => a.type === 'order_delay').length,
          approval_pending: alertsData.filter(a => a.type === 'approval_pending').length,
          supplier_performance: alertsData.filter(a => a.type === 'supplier_performance').length
        },
        actionRequired: alertsData.filter(a => a.actionRequired).length
      }
    };
  },

  async getById(id) {
    await delay(300);
    
    const alert = alertsData.find(a => a.id === parseInt(id));
    if (!alert) {
      throw new Error("Alerte non trouvée");
    }
    
    return alert;
  },

  async markAsRead(alertId) {
    await delay(400);
    
    const index = alertsData.findIndex(a => a.id === parseInt(alertId));
    if (index === -1) {
      throw new Error("Alerte non trouvée");
    }
    
    alertsData[index] = {
      ...alertsData[index],
      read: true,
      readAt: new Date().toISOString()
    };
    
    return alertsData[index];
  },

  async markAllAsRead() {
    await delay(600);
    
    const unreadAlerts = alertsData.filter(a => !a.read);
    const readAt = new Date().toISOString();
    
    alertsData = alertsData.map(alert => ({
      ...alert,
      read: true,
      readAt: alert.read ? alert.readAt : readAt
    }));
    
    return {
      success: true,
      markedCount: unreadAlerts.length
    };
  },

  async dismiss(alertId) {
    await delay(400);
    
    const index = alertsData.findIndex(a => a.id === parseInt(alertId));
    if (index === -1) {
      throw new Error("Alerte non trouvée");
    }
    
    alertsData.splice(index, 1);
    return { success: true };
  },

  async create(alertData) {
    await delay(500);
    
    const newAlert = {
      id: nextId++,
      type: alertData.type,
      priority: alertData.priority,
      title: alertData.title,
      message: alertData.message,
      read: false,
      actionRequired: alertData.actionRequired || false,
      createdAt: new Date().toISOString(),
      ...alertData.data // Additional contextual data
    };
    
    alertsData.unshift(newAlert);
    return newAlert;
  },

  async getAlertTypes() {
    await delay(200);
    
    return [
      {
        type: 'stock_low',
        label: 'Stock faible',
        description: 'Articles avec un stock inférieur au seuil minimum',
        icon: 'package',
        color: 'red'
      },
      {
        type: 'order_delay',
        label: 'Retard commande',
        description: 'Commandes risquant d\'être en retard',
        icon: 'clock',
        color: 'orange'
      },
      {
        type: 'approval_pending',
        label: 'Approbation en attente',
        description: 'Commandes en attente de validation',
        icon: 'check-circle',
        color: 'blue'
      },
      {
        type: 'supplier_performance',
        label: 'Performance fournisseur',
        description: 'Alertes liées à la performance des fournisseurs',
        icon: 'trending-down',
        color: 'yellow'
      },
      {
        type: 'budget_alert',
        label: 'Alerte budget',
        description: 'Dépassements ou approche des seuils budgétaires',
        icon: 'dollar-sign',
        color: 'purple'
      },
      {
        type: 'quality_issue',
        label: 'Problème qualité',
        description: 'Problèmes de qualité détectés',
        icon: 'alert-triangle',
        color: 'red'
      },
      {
        type: 'contract_expiry',
        label: 'Expiration contrat',
        description: 'Contrats fournisseurs arrivant à expiration',
        icon: 'file-text',
        color: 'gray'
      }
    ];
  },

  async updateAlertPreferences(userId, preferences) {
    await delay(400);
    
    // Mock preferences update
    const defaultPreferences = {
      emailNotifications: true,
      pushNotifications: true,
      priorities: {
        critical: { email: true, push: true, sound: true },
        high: { email: true, push: true, sound: false },
        medium: { email: false, push: true, sound: false },
        low: { email: false, push: false, sound: false }
      },
      types: {
        stock_low: { enabled: true, threshold: 5 },
        order_delay: { enabled: true, threshold: 24 },
        approval_pending: { enabled: true, threshold: 48 },
        supplier_performance: { enabled: true, threshold: 80 },
        budget_alert: { enabled: true, threshold: 90 },
        quality_issue: { enabled: true, threshold: 0 },
        contract_expiry: { enabled: true, threshold: 30 }
      }
    };
    
    const updatedPreferences = { ...defaultPreferences, ...preferences };
    
    // In a real app, this would be saved to the database
    localStorage.setItem(`alertPreferences_${userId}`, JSON.stringify(updatedPreferences));
    
    return updatedPreferences;
  },

  async getAlertPreferences(userId) {
    await delay(300);
    
    const saved = localStorage.getItem(`alertPreferences_${userId}`);
    
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Return default preferences
    return {
      emailNotifications: true,
      pushNotifications: true,
      priorities: {
        critical: { email: true, push: true, sound: true },
        high: { email: true, push: true, sound: false },
        medium: { email: false, push: true, sound: false },
        low: { email: false, push: false, sound: false }
      },
      types: {
        stock_low: { enabled: true, threshold: 5 },
        order_delay: { enabled: true, threshold: 24 },
        approval_pending: { enabled: true, threshold: 48 },
        supplier_performance: { enabled: true, threshold: 80 },
        budget_alert: { enabled: true, threshold: 90 },
        quality_issue: { enabled: true, threshold: 0 },
        contract_expiry: { enabled: true, threshold: 30 }
      }
    };
  }
};