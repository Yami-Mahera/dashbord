import { mockAlerts } from "./mockData";
import { Alert } from "../types";

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

interface AlertFilters {
  type?: string;
  priority?: string;
  read?: string;
  actionRequired?: boolean;
  page?: number;
  limit?: number;
}

interface AlertData {
  id: string | number;
  type: string;
  title: string;
  message: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  read: boolean;
  createdAt: string;
  readAt?: string;
  [key: string]: any;
}

let alertsData: AlertData[] = [...mockAlerts as AlertData[]];
let nextId = Math.max(...alertsData.map(a => Number(a.id))) + 1;

export const alertsAPI = {
  async getAll(filters: AlertFilters = {}) {
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
        (alert as any).actionRequired === filters.actionRequired
      );
    }

    // Sort by priority and date
    const priorityOrder: Record<string, number> = { critical: 3, high: 2, medium: 1, low: 0 };
    filteredAlerts.sort((a, b) => {
      
      if (a.priority !== b.priority) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedAlerts = filteredAlerts.slice(startIndex, endIndex);
    
    return {
      alerts: paginatedAlerts,
      total: filteredAlerts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredAlerts.length / limit),
      unreadCount: alertsData.filter(a => !a.read).length,
      criticalCount: alertsData.filter(a => a.priority === 'critical').length,
      priorities: ['critical', 'high', 'medium', 'low'],
      types: [...new Set(alertsData.map(a => a.type))],
      statistics: {
        byPriority: {
          critical: alertsData.filter(a => a.priority === 'critical').length,
          high: alertsData.filter(a => a.priority === 'high').length,
          medium: alertsData.filter(a => a.priority === 'medium').length,
          low: alertsData.filter(a => a.priority === 'low').length
        },
        byType: alertsData.reduce((acc: Record<string, number>, alert) => {
          acc[alert.type] = (acc[alert.type] || 0) + 1;
          return acc;
        }, {}),
        readStatus: {
          read: alertsData.filter(a => a.read).length,
          unread: alertsData.filter(a => !a.read).length
        }
      }
    };
  },

  async getById(id: string | number) {
    await delay(300);
    
    const alert = alertsData.find(a => a.id === Number(id));
    if (!alert) {
      throw new Error('Alert not found');
    }
    
    return alert;
  },

  async markAsRead(alertId: string | number) {
    await delay(400);
    
    const index = alertsData.findIndex(a => a.id === Number(alertId));
    if (index === -1) {
      throw new Error('Alert not found');
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
    
    const readAt = new Date().toISOString();
    const unreadAlerts = alertsData.filter(a => !a.read);
    
    alertsData = alertsData.map(alert => ({
      ...alert,
      read: true,
      readAt: !alert.read ? readAt : (alert as any).readAt
    }));
    
    return {
      updated: unreadAlerts.length,
      alerts: alertsData
    };
  },

  async markMultipleAsRead(alertIds: (string | number)[]) {
    await delay(500);
    
    const readAt = new Date().toISOString();
    alertsData = alertsData.map(alert => ({
      ...alert,
      read: alertIds.includes(alert.id) ? true : alert.read,
      readAt: alertIds.includes(alert.id) && !alert.read ? readAt : (alert as any).readAt
    }));
    
    return {
      updated: alertIds.length,
      alerts: alertsData.filter(a => alertIds.includes(a.id))
    };
  },

  async dismiss(alertId: string | number) {
    await delay(400);
    
    const index = alertsData.findIndex(a => a.id === Number(alertId));
    if (index === -1) {
      throw new Error('Alert not found');
    }
    
    alertsData.splice(index, 1);
    
    return { success: true, id: alertId };
  },

  async create(alertData: Partial<AlertData>) {
    await delay(500);
    
    const newAlert: AlertData = {
      id: nextId++,
      type: alertData.type || 'general',
      title: alertData.title || '',
      message: alertData.message || '',
      priority: alertData.priority || 'medium',
      read: false,
      createdAt: new Date().toISOString(),
      ...alertData
    };
    
    alertsData.unshift(newAlert);
    
    return newAlert;
  },

}
};