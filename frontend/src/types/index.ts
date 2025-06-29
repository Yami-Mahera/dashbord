// Types principaux pour l'application de tableau de bord

export interface User {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface KPI {
  totalOrders: number;
  pendingOrders: number;
  totalSuppliers: number;
  lowStockItems: number;
  averageDeliveryTime: number;
  serviceLevel: number;
  costSavings: number;
  onTimeDelivery: number;
}

export interface OrdersTrendData {
  month: string;
  orders: number;
  amount: number;
  budget: number;
}

export interface StockLevelData {
  name: string;
  category: string;
  current: number;
  min: number;
  max: number;
  optimal: number;
  status: 'critical' | 'warning' | 'good';
}

export interface SupplierPerformanceData {
  name: string;
  onTimeDelivery: number;
  qualityScore: number;
  costEfficiency: number;
  totalOrders: number;
  reliability: 'excellent' | 'good' | 'needs_improvement';
}

export interface CostAnalysisData {
  category: string;
  budget: number;
  spent: number;
  forecast: number;
}

export interface ChartsData {
  ordersTrend: OrdersTrendData[];
  stockLevels: StockLevelData[];
  supplierPerformance: SupplierPerformanceData[];
  costAnalysis: CostAnalysisData[];
}

export interface Activity {
  id: number;
  type: 'order_created' | 'stock_alert' | 'order_approved' | 'delivery_completed' | 'supplier_update';
  title: string;
  message: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  user: {
    name: string;
    avatar: string | null;
  };
}

export interface Alert {
  id: string | number;
  type: 'stock_low' | 'order_delay' | 'approval_pending' | 'supplier_performance';
  title: string;
  message: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  read: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Supplier {
  id: string | number;
  name: string;
  category: string;
  isActive: boolean;
  totalOrders: number;
  totalAmount: number;
  averageDeliveryTime: number;
  onTimeDeliveryRate: number;
  qualityRating: number;
  performanceScore?: number;
  trend?: 'up' | 'down';
  lastOrder?: string;
  orders?: number;
}

export interface Article {
  id: string | number;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  stockRotation: number;
  averageConsumption?: number;
  stockValue: number;
}

export interface Order {
  id: string;
  status: 'en_attente' | 'validee' | 'livree' | 'annulee';
  totalAmount: number;
  createdAt: string;
  supplierId: string;
}

export interface StockRotationData {
  id: string | number;
  name: string;
  category: string;
  rotationRate: number;
  daysOfStock: number;
  stockValue: number;
  status: 'fast' | 'normal' | 'slow';
}

export interface DashboardData {
  kpis: KPI;
  charts: ChartsData;
  recentActivities: Activity[];
  criticalAlerts: Alert[];
  topSuppliers: Supplier[];
  stockRotation: StockRotationData[];
  lastUpdated: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface DashboardState {
  kpis: KPI;
  charts: ChartsData;
  recentActivities: Activity[];
  criticalAlerts: Alert[];
  topSuppliers: Supplier[];
  stockRotation: StockRotationData[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// Props des composants
export interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  trend: {
    value: number;
    isUp: boolean;
  };
  description: string;
}

export interface ChartContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

// Types pour les filtres et la pagination
export interface DateRange {
  startDate?: string;
  endDate?: string;
}

export interface TablePaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface TableSortingState {
  id: string;
  desc: boolean;
}

export interface TableFiltersState {
  id: string;
  value: unknown;
}