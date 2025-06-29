import { 
  DashboardData, 
  DateRange, 
  KPI,
  ChartsData,
  Activity,
  Alert,
  Supplier,
  StockRotationData,
  Article,
  Order
} from "../types";
import { mockDashboardData, mockOrders, mockSuppliers, mockArticles, mockAlerts } from "./mockData";

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

interface ProcurementInsights {
  period: string;
  totalSpend: number;
  orderFrequency: number;
  topCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  costSavingsOpportunities: Array<{
    opportunity: string;
    potentialSaving: number;
    feasibility: 'high' | 'medium' | 'low';
  }>;
  riskAssessment: {
    supplierDependency: 'high' | 'medium' | 'low';
    stockRisk: 'high' | 'medium' | 'low';
    deliveryRisk: 'high' | 'medium' | 'low';
    priceVolatility: 'high' | 'medium' | 'low';
  };
  recommendations: string[];
}

export const dashboardAPI = {
  async getDashboardData(dateRange: DateRange = {}): Promise<DashboardData> {
    await delay(1000);
    
    // In a real application, you would filter data based on dateRange
    const { startDate, endDate } = dateRange;
    
    // Calculate real-time KPIs
    const kpis = {
      totalOrders: mockOrders.length,
      pendingOrders: mockOrders.filter(o => o.status === 'en_attente').length,
      totalSuppliers: mockSuppliers.length,
      lowStockItems: mockArticles.filter(a => a.currentStock <= a.minStock).length,
      averageDeliveryTime: 4.2,
      serviceLevel: 91.8,
      costSavings: 149559,
      onTimeDelivery: 90.1
    };
    
    const charts = {
      ordersTrend: [
        { month: "Jan", orders: 45, amount: 125000, budget: 140000 },
        { month: "Fév", orders: 52, amount: 142000, budget: 150000 },
        { month: "Mar", orders: 38, amount: 98000, budget: 120000 },
        { month: "Avr", orders: 61, amount: 178000, budget: 160000 },
        { month: "Mai", orders: 55, amount: 156000, budget: 170000 },
        { month: "Jui", orders: 48, amount: 132000, budget: 140000 }
      ],
      stockLevels: mockArticles.map(article => ({
        name: article.name,
        category: article.category,
        current: article.currentStock,
        min: article.minStock,
        max: article.maxStock,
        optimal: Math.floor((article.maxStock + article.minStock) / 2),
        status: (article.currentStock <= article.minStock ? 'critical' : 
                article.currentStock <= article.reorderPoint ? 'warning' : 'good') as 'critical' | 'warning' | 'good'
      })),
      supplierPerformance: mockSuppliers.map(supplier => ({
        name: supplier.name,
        onTimeDelivery: supplier.onTimeDeliveryRate,
        qualityScore: supplier.qualityRating * 20, // Convert to percentage
        costEfficiency: Math.random() * 20 + 80, // Mock cost efficiency 80-100%
        totalOrders: supplier.totalOrders,
        reliability: (supplier.onTimeDeliveryRate > 95 ? 'excellent' : 
                    supplier.onTimeDeliveryRate > 85 ? 'good' : 'needs_improvement') as 'excellent' | 'good' | 'needs_improvement'
      })),
      costAnalysis: [
        { category: "Informatique", budget: 500000, spent: 425000, forecast: 480000 },
        { category: "Matériaux", budget: 300000, spent: 280000, forecast: 320000 },
        { category: "Logistique", budget: 200000, spent: 165000, forecast: 190000 },
        { category: "Services", budget: 150000, spent: 135000, forecast: 145000 }
      ]
    };
    
    // Recent activities
    const recentActivities: Activity[] = [
      {
        id: 1,
        type: "order_created",
        title: "Nouvelle commande",
        message: "Commande PO-2024-001 créée par Pierre Bernard",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        priority: 'medium',
        user: { name: "Pierre Bernard", avatar: "/api/avatars/pierre.jpg" }
      },
      {
        id: 2,
        type: "stock_alert",
        title: "Stock critique",
        message: "Palette Europe EPAL - Stock critique (2 unités)",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        priority: 'high',
        user: { name: "Système", avatar: null }
      },
      {
        id: 3,
        type: "order_approved",
        title: "Commande approuvée",
        message: "Commande PO-2024-002 approuvée par Marie Martin",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        priority: 'low',
        user: { name: "Marie Martin", avatar: "/api/avatars/marie.jpg" }
      },
      {
        id: 4,
        type: "delivery_completed",
        title: "Livraison terminée",
        message: "Commande PO-2024-003 livrée avec 1 jour d'avance",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        priority: 'low',
        user: { name: "Global Logistics", avatar: "/api/avatars/global.jpg" }
      },
      {
        id: 5,
        type: "supplier_update",
        title: "Mise à jour fournisseur",
        message: "TechnoFrance SAS a mis à jour ses conditions tarifaires",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        priority: 'medium',
        user: { name: "TechnoFrance SAS", avatar: "/api/avatars/technofrance.jpg" }
      }
    ];
    
    // Critical alerts
    const criticalAlerts = mockAlerts.filter(alert => 
      alert.priority === 'critical' && !alert.read
    ) as Alert[];
    
    // Top suppliers with additional metrics
    const topSuppliers = mockSuppliers
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5)
      .map(supplier => ({
        ...supplier,
        performanceScore: Math.round((supplier.onTimeDeliveryRate + supplier.qualityRating * 20) / 2),
        trend: (Math.random() > 0.5 ? 'up' : 'down') as 'up' | 'down',
        lastOrder: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      }));
    
    // Stock rotation analysis
    const stockRotation = mockArticles.map(article => ({
      id: article.id,
      name: article.name,
      category: article.category,
      rotationRate: article.stockRotation,
      daysOfStock: Math.ceil(article.currentStock / (article.averageConsumption || 1)),
      stockValue: article.stockValue,
      status: (article.stockRotation > 12 ? 'fast' : 
              article.stockRotation > 6 ? 'normal' : 'slow') as 'fast' | 'normal' | 'slow'
    }));
    
    return {
      kpis,
      charts,
      recentActivities,
      criticalAlerts,
      topSuppliers,
      stockRotation,
      lastUpdated: new Date().toISOString()
    };
  },

  async getKPIs(period: 'month' | 'quarter' | 'year' = 'month'): Promise<KPI> {
    await delay(500);
    
    // Mock KPI calculations based on period
    const multiplier = period === 'year' ? 12 : period === 'quarter' ? 3 : 1;
    
    return {
      totalOrders: mockOrders.length * multiplier,
      pendingOrders: mockOrders.filter(o => o.status === 'en_attente').length,
      totalSuppliers: mockSuppliers.length,
      lowStockItems: mockArticles.filter(a => a.currentStock <= a.minStock).length,
      averageDeliveryTime: 4.2,
      serviceLevel: 91.8,
      costSavings: mockOrders.reduce((sum, o) => sum + o.totalAmount, 0) * 0.125,
      onTimeDelivery: 91.8
    };
  },

  async getAlertsSummary() {
    await delay(300);
    
    return {
      total: mockAlerts.length,
      unread: mockAlerts.filter(a => !a.read).length,
      critical: mockAlerts.filter(a => a.priority === 'critical').length,
      high: mockAlerts.filter(a => a.priority === 'high').length
    };
  },

  async getSupplierInsights() {
    await delay(600);
    
    return {
      total: mockSuppliers.length,
      active: mockSuppliers.filter(s => s.isActive).length,
      topPerformers: mockSuppliers
        .filter(s => s.onTimeDeliveryRate > 95)
        .sort((a, b) => b.onTimeDeliveryRate - a.onTimeDeliveryRate)
        .slice(0, 3),
      needsAttention: mockSuppliers
        .filter(s => s.onTimeDeliveryRate < 85 || s.qualityRating < 3.5)
        .sort((a, b) => a.onTimeDeliveryRate - b.onTimeDeliveryRate),
      categoryDistribution: mockSuppliers.reduce((acc: Record<string, number>, supplier) => {
        acc[supplier.category] = (acc[supplier.category] || 0) + 1;
        return acc;
      }, {}),
      averageMetrics: {
        deliveryTime: mockSuppliers.reduce((sum, s) => sum + s.averageDeliveryTime, 0) / mockSuppliers.length,
        onTimeRate: mockSuppliers.reduce((sum, s) => sum + s.onTimeDeliveryRate, 0) / mockSuppliers.length,
        qualityRating: mockSuppliers.reduce((sum, s) => sum + s.qualityRating, 0) / mockSuppliers.length
      }
    };
  },

  async getProcurementInsights(period: '3months' | '6months' | '1year' = '3months'): Promise<ProcurementInsights> {
    await delay(700);
    
    // Mock procurement insights
    return {
      period,
      totalSpend: mockOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      orderFrequency: mockOrders.length / 30, // Orders per day
      topCategories: [
        { category: "Informatique", amount: 850000, percentage: 45 },
        { category: "Matériaux", amount: 420000, percentage: 22 },
        { category: "Logistique", amount: 380000, percentage: 20 },
        { category: "Services", amount: 250000, percentage: 13 }
      ],
      costSavingsOpportunities: [
        { opportunity: "Négociation volume avec TechnoFrance", potentialSaving: 45000, feasibility: 'high' },
        { opportunity: "Optimisation logistique", potentialSaving: 28000, feasibility: 'medium' },
        { opportunity: "Consolidation fournisseurs matériaux", potentialSaving: 15000, feasibility: 'medium' }
      ],
      riskAssessment: {
        supplierDependency: 'medium',
        stockRisk: 'low',
        deliveryRisk: 'low',
        priceVolatility: 'medium'
      },
      recommendations: [
        "Diversifier les fournisseurs pour les produits informatiques critiques",
        "Mettre en place des contrats cadre pour stabiliser les prix",
        "Améliorer la prévision de la demande pour optimiser les stocks",
        "Développer des partenariats stratégiques avec les meilleurs fournisseurs"
      ]
    };
  }
};