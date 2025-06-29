// Types pour les commandes
export interface OrderFilters {
  search?: string;
  status?: string;
  priority?: string;
  supplier?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface OrderItem {
  id: number;
  articleId?: number; // Rendu optionnel pour compatibilité avec les données mockées
  article: {
    id: number;
    name: string;
    reference: string;
    price: number;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface OrderCreateData {
  supplier: any;
  items: OrderItem[];
  priority?: string;
  expectedDeliveryDate: string;
  requestedBy: any;
  currency?: string;
  paymentTerms?: string;
  deliveryAddress: any;
  notes?: string;
  attachments?: any[];
}

export interface OrderUpdateData {
  items?: OrderItem[];
  priority?: string;
  expectedDeliveryDate?: string;
  deliveryAddress?: any;
  notes?: string;
  attachments?: any[];
  updatedBy?: any;
  updateReason?: string;
}

export interface DeliveryData {
  deliveryDate?: string;
  notes?: string;
  documents?: any[];
  confirmedBy: any;
}

export interface SimulationData {
  items: Array<{
    articleId: number;
    quantity: number;
  }>;
  supplier: {
    id: number;
  };
  deliveryDate: string;
}

export interface ValidationWorkflowStep {
  name: string;
  status: string;
  user: any;
  date: string | null;
}

export interface ValidationWorkflow {
  requiredApprovals: string[];
  currentStep: string;
  steps: ValidationWorkflowStep[];
}

export interface OrderHistoryEntry {
  date: string;
  action: string;
  user: any;
  comment: string;
}

export interface OrderData {
  id: number;
  orderNumber: string;
  supplier: any;
  status: string;
  priority: string;
  orderDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate: string | null;
  requestedBy: any;
  approvedBy: any;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  paymentTerms: string;
  deliveryAddress: any;
  notes: string;
  attachments: any[];
  history: OrderHistoryEntry[];
  validationWorkflow: ValidationWorkflow;
  rejectionReason?: string;
  deliveryNotes?: string;
  deliveryDocuments?: any[];
}

export interface OrderStats {
  total: number;
  pending: number;
  validated: number;
  delivered: number;
  delayed: number;
}

export interface OrderPagination {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

export interface OrdersResponse {
  data: OrderData[];
  pagination: OrderPagination;
  stats: OrderStats;
  pendingOrders: OrderData[];
  urgentOrders: OrderData[];
}