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

  async getBulkActions() {
    await delay(200);
    
    return [
      { id: 'mark_read', label: 'Marquer comme lu', icon: 'check' },
      { id: 'dismiss', label: 'Ignorer', icon: 'x' },
      { id: 'archive', label: 'Archiver', icon: 'archive' },
      { id: 'escalate', label: 'Escalader', icon: 'alert-triangle' }
    ];
  },

  async executeBulkAction(action: string, alertIds: (string | number)[]) {
    await delay(600);
    
    switch (action) {
      case 'mark_read':
        return await this.markMultipleAsRead(alertIds);
      
      case 'dismiss':
        alertsData = alertsData.filter(alert => !alertIds.includes(alert.id));
        return { success: true, dismissed: alertIds.length };
      
      case 'archive':
        alertsData = alertsData.map(alert => ({
          ...alert,
          archived: alertIds.includes(alert.id) ? true : (alert as any).archived
        }));
        return { success: true, archived: alertIds.length };
      
      case 'escalate':
        alertsData = alertsData.map(alert => ({
          ...alert,
          priority: alertIds.includes(alert.id) && alert.priority !== 'critical' 
            ? 'high' as const
            : alert.priority,
          escalated: alertIds.includes(alert.id) ? true : (alert as any).escalated
        }));
        return { success: true, escalated: alertIds.length };
      
      default:
        throw new Error('Unknown bulk action');
    }
  },

  async getRecentActivity(days = 7) {
    await delay(400);
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentAlerts = alertsData.filter(alert => 
      new Date(alert.createdAt) >= cutoffDate
    );
    
    return {
      totalAlerts: recentAlerts.length,
      criticalAlerts: recentAlerts.filter(a => a.priority === 'critical').length,
      resolvedAlerts: recentAlerts.filter(a => a.read).length,
      avgResolutionTime: '2.4 hours', // Mock calculation
      trends: {
        thisWeek: recentAlerts.length,
        lastWeek: Math.floor(recentAlerts.length * 0.85), // Mock comparison
        change: 15 // Mock percentage change
      }
    };
  },

  async updateAlertPreferences(userId: string | number, preferences: any) {
    await delay(400);
    
    // Mock preferences update
    localStorage.setItem(`alertPreferences_${userId}`, JSON.stringify(preferences));
    
    return {
      success: true,
      preferences: {
        emailNotifications: preferences.emailNotifications || false,
        smsNotifications: preferences.smsNotifications || false,
        desktopNotifications: preferences.desktopNotifications || true,
        criticalOnly: preferences.criticalOnly || false,
        quietHours: preferences.quietHours || { start: '22:00', end: '08:00' },
        categories: preferences.categories || ['all']
      }
    };
  },

  async getAlertMetrics(period = '30days') {
    await delay(500);
    
    return {
      period,
      totalGenerated: alertsData.length,
      totalResolved: alertsData.filter(a => a.read).length,
      averageResolutionTime: '3.2 hours',
      resolutionRate: 78,
      byCategory: alertsData.reduce((acc: Record<string, number>, alert) => {
        acc[alert.type] = (acc[alert.type] || 0) + 1;
        return acc;
      }, {}),
      timeline: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        generated: Math.floor(Math.random() * 10) + 1,
        resolved: Math.floor(Math.random() * 8) + 1
      })).reverse()
    };
  },

  async getAlertPreferences(userId: string | number) {
    await delay(300);
    
    const saved = localStorage.getItem(`alertPreferences_${userId}`);
    
    return saved ? JSON.parse(saved) : {
      emailNotifications: false,
      smsNotifications: false,
      desktopNotifications: true,
      criticalOnly: false,
      quietHours: { start: '22:00', end: '08:00' },
      categories: ['all']
    };
  }
};