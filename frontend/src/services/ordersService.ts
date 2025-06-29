import { mockOrders, mockArticles, mockSuppliers, mockUsers } from "./mockData";
import { OrderFilters, OrderCreateData, OrderUpdateData, DeliveryData, SimulationData, OrderData, OrdersResponse } from "../types/order.types";

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

let ordersData: OrderData[] = [...mockOrders];
let nextId = Math.max(...ordersData.map(o => o.id)) + 1;
let orderCounter = ordersData.length + 1;

export const ordersAPI = {
  async getAll(filters: OrderFilters = {}): Promise<OrdersResponse> {
    await delay(800);
    
    let filteredOrders = [...ordersData];
    
    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredOrders = filteredOrders.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm) ||
        order.supplier.name.toLowerCase().includes(searchTerm) ||
        order.status.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.status && filters.status !== 'all') {
      filteredOrders = filteredOrders.filter(order =>
        order.status === filters.status
      );
    }
    
    if (filters.priority && filters.priority !== 'all') {
      filteredOrders = filteredOrders.filter(order =>
        order.priority === filters.priority
      );
    }
    
    if (filters.supplier && filters.supplier !== 'all') {
      filteredOrders = filteredOrders.filter(order =>
        order.supplier.id === parseInt(filters.supplier)
      );
    }
    
    if (filters.dateFrom) {
      filteredOrders = filteredOrders.filter(order =>
        new Date(order.orderDate) >= new Date(filters.dateFrom!)
      );
    }
    
    if (filters.dateTo) {
      filteredOrders = filteredOrders.filter(order =>
        new Date(order.orderDate) <= new Date(filters.dateTo!)
      );
    }

    // Sorting
    if (filters.sortBy) {
      filteredOrders.sort((a, b) => {
        let aVal: any = (a as any)[filters.sortBy!];
        let bVal: any = (b as any)[filters.sortBy!];
        
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
    
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
    
    // Calculate stats
    const stats = {
      total: ordersData.length,
      pending: ordersData.filter(o => o.status === 'en_attente').length,
      validated: ordersData.filter(o => o.status === 'validee').length,
      delivered: ordersData.filter(o => o.status === 'livree').length,
      delayed: ordersData.filter(o => 
        o.status !== 'livree' && 
        new Date(o.expectedDeliveryDate) < new Date()
      ).length
    };
    
    const pendingOrders = ordersData.filter(o => o.status === 'en_attente');
    const urgentOrders = ordersData.filter(o => o.priority === 'urgent' && o.status !== 'livree');
    
    return {
      data: paginatedOrders,
      pagination: {
        page,
        limit,
        total: filteredOrders.length,
        totalPages: Math.ceil(filteredOrders.length / limit)
      },
      stats,
      pendingOrders,
      urgentOrders
    };
  },

  async getById(id: string | number): Promise<OrderData> {
    await delay(500);
    
    const order = ordersData.find(o => o.id === parseInt(id.toString()));
    if (!order) {
      throw new Error("Commande non trouvée");
    }
    
    return order;
  },

  async create(orderData: OrderCreateData): Promise<OrderData> {
    await delay(1200);
    
    // Validate required fields
    if (!orderData.supplier || !orderData.items || orderData.items.length === 0) {
      throw new Error("Fournisseur et articles sont obligatoires");
    }
    
    // Calculate totals
    const subtotal = orderData.items.reduce((sum: number, item: any) => sum + item.totalPrice, 0);
    const taxAmount = subtotal * 0.2; // 20% VAT
    const totalAmount = subtotal + taxAmount;
    
    const orderNumber = `PO-${new Date().getFullYear()}-${String(orderCounter++).padStart(3, '0')}`;
    
    const newOrder: OrderData = {
      id: nextId++,
      orderNumber,
      supplier: orderData.supplier,
      status: 'en_attente',
      priority: orderData.priority || 'normal',
      orderDate: new Date().toISOString(),
      expectedDeliveryDate: orderData.expectedDeliveryDate,
      actualDeliveryDate: null,
      requestedBy: orderData.requestedBy,
      approvedBy: null,
      items: orderData.items,
      subtotal,
      taxAmount,
      totalAmount,
      currency: orderData.currency || 'EUR',
      paymentTerms: orderData.paymentTerms || orderData.supplier.paymentTerms,
      deliveryAddress: orderData.deliveryAddress,
      notes: orderData.notes || '',
      attachments: orderData.attachments || [],
      history: [
        {
          date: new Date().toISOString(),
          action: 'created',
          user: orderData.requestedBy,
          comment: 'Commande créée'
        }
      ],
      validationWorkflow: {
        requiredApprovals: ['gestionnaire'],
        currentStep: 'pending_manager_approval',
        steps: [
          { name: 'manager_approval', status: 'pending', user: null, date: null }
        ]
      }
    };
    
    ordersData.unshift(newOrder);
    return newOrder;
  },

  async update(id: string | number, orderData: OrderUpdateData): Promise<OrderData> {
    await delay(800);
    
    const index = ordersData.findIndex(o => o.id === parseInt(id.toString()));
    if (index === -1) {
      throw new Error("Commande non trouvée");
    }
    
    const currentOrder = ordersData[index];
    
    // Prevent editing validated/delivered orders
    if (currentOrder.status === 'validee' || currentOrder.status === 'livree') {
      throw new Error("Impossible de modifier une commande validée ou livrée");
    }
    
    // Recalculate totals if items changed
    let updatedOrder = { ...currentOrder, ...orderData };
    
    if (orderData.items) {
      const subtotal = orderData.items.reduce((sum: number, item: any) => sum + item.totalPrice, 0);
      const taxAmount = subtotal * 0.2;
      const totalAmount = subtotal + taxAmount;
      
      updatedOrder = {
        ...updatedOrder,
        subtotal,
        taxAmount,
        totalAmount
      };
    }
    
    // Add to history
    updatedOrder.history.push({
      date: new Date().toISOString(),
      action: 'updated',
      user: orderData.updatedBy || currentOrder.requestedBy,
      comment: orderData.updateReason || 'Commande modifiée'
    });
    
    ordersData[index] = updatedOrder;
    return updatedOrder;
  },

  async validate(id: string | number, validatedBy: any): Promise<OrderData> {
    await delay(800);
    
    const index = ordersData.findIndex(o => o.id === parseInt(id.toString()));
    if (index === -1) {
      throw new Error("Commande non trouvée");
    }
    
    const order = ordersData[index];
    
    if (order.status !== 'en_attente') {
      throw new Error("Seules les commandes en attente peuvent être validées");
    }
    
    // Perform validation checks
    const validationErrors: string[] = [];
    
    // Check stock availability
    order.items.forEach((item: any) => {
      const article = mockArticles.find(a => a.id === item.article.id);
      if (article && article.currentStock < item.quantity) {
        validationErrors.push(`Stock insuffisant pour ${article.name}`);
      }
    });
    
    // Check supplier capacity
    // Mock validation - in real app, this would check supplier capacity
    
    if (validationErrors.length > 0) {
      throw new Error(`Erreurs de validation: ${validationErrors.join(', ')}`);
    }
    
    const validatedOrder: OrderData = {
      ...order,
      status: 'validee',
      approvedBy: validatedBy,
      validationWorkflow: {
        ...order.validationWorkflow,
        currentStep: 'approved',
        steps: [
          { 
            name: 'manager_approval', 
            status: 'approved', 
            user: validatedBy, 
            date: new Date().toISOString() 
          }
        ]
      }
    };
    
    validatedOrder.history.push({
      date: new Date().toISOString(),
      action: 'approved',
      user: validatedBy,
      comment: 'Commande approuvée'
    });
    
    ordersData[index] = validatedOrder;
    return validatedOrder;
  },

  async reject(id: string | number, reason: string, rejectedBy: any): Promise<OrderData> {
    await delay(600);
    
    const index = ordersData.findIndex(o => o.id === parseInt(id.toString()));
    if (index === -1) {
      throw new Error("Commande non trouvée");
    }
    
    const order = ordersData[index];
    
    if (order.status !== 'en_attente') {
      throw new Error("Seules les commandes en attente peuvent être rejetées");
    }
    
    const rejectedOrder: OrderData = {
      ...order,
      status: 'rejetee',
      rejectionReason: reason,
      validationWorkflow: {
        ...order.validationWorkflow,
        currentStep: 'rejected',
        steps: [
          { 
            name: 'manager_approval', 
            status: 'rejected', 
            user: rejectedBy, 
            date: new Date().toISOString() 
          }
        ]
      }
    };
    
    rejectedOrder.history.push({
      date: new Date().toISOString(),
      action: 'rejected',
      user: rejectedBy,
      comment: `Commande rejetée: ${reason}`
    });
    
    ordersData[index] = rejectedOrder;
    return rejectedOrder;
  },

  async markAsDelivered(id: string | number, deliveryData: DeliveryData): Promise<OrderData> {
    await delay(600);
    
    const index = ordersData.findIndex(o => o.id === parseInt(id.toString()));
    if (index === -1) {
      throw new Error("Commande non trouvée");
    }
    
    const order = ordersData[index];
    
    if (order.status !== 'validee') {
      throw new Error("Seules les commandes validées peuvent être marquées comme livrées");
    }
    
    const deliveredOrder: OrderData = {
      ...order,
      status: 'livree',
      actualDeliveryDate: deliveryData.deliveryDate || new Date().toISOString(),
      deliveryNotes: deliveryData.notes || '',
      deliveryDocuments: deliveryData.documents || []
    };
    
    deliveredOrder.history.push({
      date: new Date().toISOString(),
      action: 'delivered',
      user: deliveryData.confirmedBy,
      comment: `Livraison confirmée${deliveryData.notes ? ': ' + deliveryData.notes : ''}`
    });
    
    ordersData[index] = deliveredOrder;
    return deliveredOrder;
  },

  async simulateOrder(simulationData: SimulationData) {
    await delay(1000);
    
    // Simulate order creation with various scenarios
    const { items, supplier, deliveryDate } = simulationData;
    
    let warnings: string[] = [];
    let recommendations: string[] = [];
    let totalCost = 0;
    let estimatedDelivery = deliveryDate;
    
    // Check each item
    items.forEach((item: any) => {
      const article = mockArticles.find(a => a.id === item.articleId);
      if (article) {
        totalCost += item.quantity * article.price;
        
        // Stock warnings
        if (article.currentStock < item.quantity) {
          warnings.push(`Stock insuffisant pour ${article.name} (disponible: ${article.currentStock}, demandé: ${item.quantity})`);
        }
        
        // Lead time warnings
        if (article.leadTime > 7) {
          warnings.push(`Délai de livraison élevé pour ${article.name}: ${article.leadTime} jours`);
          if (new Date(estimatedDelivery) < new Date(Date.now() + article.leadTime * 24 * 60 * 60 * 1000)) {
            estimatedDelivery = new Date(Date.now() + article.leadTime * 24 * 60 * 60 * 1000).toISOString();
          }
        }
        
        // Quantity recommendations
        if (item.quantity < article.minOrderQuantity) {
          recommendations.push(`Quantité minimum pour ${article.name}: ${article.minOrderQuantity} (actuellement: ${item.quantity})`);
        }
      }
    });
    
    // Supplier-specific checks
    const supplierData = mockSuppliers.find(s => s.id === supplier.id);
    if (supplierData) {
      if (supplierData.onTimeDeliveryRate < 90) {
        warnings.push(`Taux de livraison à temps du fournisseur faible: ${supplierData.onTimeDeliveryRate}%`);
      }
      
      if (totalCost > 10000) {
        recommendations.push("Commande importante - Considérer une négociation de prix");
      }
    }
    
    return {
      simulation: {
        totalCost: totalCost * 1.2, // Including tax
        estimatedDelivery,
        leadTime: Math.ceil((new Date(estimatedDelivery).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        feasible: warnings.length === 0,
        confidenceScore: Math.max(100 - warnings.length * 20, 0)
      },
      warnings,
      recommendations,
      alternatives: [
        {
          suggestion: "Réduire les quantités pour respecter le stock disponible",
          impact: "Coût réduit, livraison plus rapide"
        },
        {
          suggestion: "Reporter la livraison pour optimiser les coûts",
          impact: "Meilleur prix, délai plus long"
        }
      ]
    };
  },

  async getOrderAnalytics(period = '3months') {
    await delay(700);
    
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    
    const periodOrders = ordersData.filter(o => 
      new Date(o.orderDate) >= startDate
    );
    
    return {
      period,
      totalOrders: periodOrders.length,
      totalValue: periodOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      averageOrderValue: periodOrders.reduce((sum, o) => sum + o.totalAmount, 0) / periodOrders.length,
      onTimeDeliveryRate: (periodOrders.filter(o => 
        o.actualDeliveryDate && 
        new Date(o.actualDeliveryDate) <= new Date(o.expectedDeliveryDate)
      ).length / periodOrders.filter(o => o.actualDeliveryDate).length) * 100,
      topSuppliers: mockSuppliers.slice(0, 5).map(s => ({
        ...s,
        orderCount: periodOrders.filter(o => o.supplier.id === s.id).length,
        orderValue: periodOrders.filter(o => o.supplier.id === s.id).reduce((sum, o) => sum + o.totalAmount, 0)
      })),
      monthlyTrend: [
        { month: 'Jan', orders: 15, value: 125000 },
        { month: 'Fév', orders: 18, value: 142000 },
        { month: 'Mar', orders: 12, value: 98000 }
      ],
      statusDistribution: {
        pending: ordersData.filter(o => o.status === 'en_attente').length,
        validated: ordersData.filter(o => o.status === 'validee').length,
        delivered: ordersData.filter(o => o.status === 'livree').length,
        rejected: ordersData.filter(o => o.status === 'rejetee').length
      }
    };
  }
};