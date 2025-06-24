// Mock data for the procurement management system

export const mockUsers = [
  {
    id: 1,
    email: "admin@company.com",
    password: "admin123",
    firstName: "Jean",
    lastName: "Dupont",
    role: "administrateur",
    department: "IT",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    isActive: true,
    lastLogin: "2024-01-20T09:00:00Z",
    permissions: ["all"]
  },
  {
    id: 2,
    email: "manager@company.com",
    password: "manager123",
    firstName: "Marie",
    lastName: "Martin",
    role: "gestionnaire",
    department: "Procurement",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b9e0d06c?w=100&h=100&fit=crop&crop=face",
    isActive: true,
    lastLogin: "2024-01-20T08:30:00Z",
    permissions: ["manage_orders", "manage_suppliers", "view_reports"]
  },
  {
    id: 3,
    email: "buyer@company.com",
    password: "buyer123",
    firstName: "Pierre",
    lastName: "Bernard",
    role: "acheteur",
    department: "Procurement",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    isActive: true,
    lastLogin: "2024-01-20T08:00:00Z",
    permissions: ["create_orders", "view_suppliers", "view_articles"]
  }
];

export const mockSuppliers = [
  {
    id: 1,
    name: "TechnoFrance SAS",
    code: "TF001",
    category: "Électronique",
    address: {
      street: "123 Avenue des Champs-Élysées",
      city: "Paris",
      postalCode: "75008",
      country: "France"
    },
    contacts: [
      {
        id: 1,
        name: "Jacques Mercier",
        email: "j.mercier@technofrance.fr",
        phone: "+33 1 42 25 67 89",
        position: "Directeur Commercial",
        isPrimary: true
      },
      {
        id: 2,
        name: "Sophie Dubois",
        email: "s.dubois@technofrance.fr",
        phone: "+33 1 42 25 67 90",
        position: "Responsable Achats",
        isPrimary: false
      }
    ],
    paymentTerms: "30 jours",
    currency: "EUR",
    rating: 4.5,
    isActive: true,
    createdAt: "2023-01-15T00:00:00Z",
    totalOrders: 156,
    totalAmount: 2450000,
    averageDeliveryTime: 7,
    onTimeDeliveryRate: 94.2,
    qualityRating: 4.3,
    documents: [
      { name: "Certificat ISO 9001", url: "/docs/iso9001_technofrance.pdf" },
      { name: "Conditions générales", url: "/docs/cgv_technofrance.pdf" }
    ]
  },
  {
    id: 2,
    name: "ProMatériaux SARL",
    code: "PM002",
    category: "Matériaux",
    address: {
      street: "45 Rue de l'Industrie",
      city: "Lyon",
      postalCode: "69001",
      country: "France"
    },
    contacts: [
      {
        id: 3,
        name: "Michel Rousseau",
        email: "m.rousseau@promateriayx.fr",
        phone: "+33 4 78 42 15 63",
        position: "Gérant",
        isPrimary: true
      }
    ],
    paymentTerms: "45 jours",
    currency: "EUR",
    rating: 4.0,
    isActive: true,
    createdAt: "2023-03-22T00:00:00Z",
    totalOrders: 89,
    totalAmount: 1250000,
    averageDeliveryTime: 12,
    onTimeDeliveryRate: 87.5,
    qualityRating: 4.0,
    documents: []
  },
  {
    id: 3,
    name: "Global Logistics Ltd",
    code: "GL003",
    category: "Logistique",
    address: {
      street: "789 Business Park",
      city: "Marseille",
      postalCode: "13001",
      country: "France"
    },
    contacts: [
      {
        id: 4,
        name: "Anna Schmidt",
        email: "a.schmidt@globallogistics.com",
        phone: "+33 4 91 22 33 44",
        position: "Account Manager",
        isPrimary: true
      }
    ],
    paymentTerms: "15 jours",
    currency: "EUR",
    rating: 3.8,
    isActive: true,
    createdAt: "2023-06-10T00:00:00Z",
    totalOrders: 234,
    totalAmount: 890000,
    averageDeliveryTime: 3,
    onTimeDeliveryRate: 96.8,
    qualityRating: 3.9,
    documents: []
  }
];

export const mockArticles = [
  {
    id: 1,
    reference: "COMP-LAP-001",
    name: "Ordinateur Portable HP ProBook 450",
    description: "Ordinateur portable professionnel avec processeur Intel Core i5, 8GB RAM, 256GB SSD",
    category: "Informatique",
    subCategory: "Ordinateurs Portables",
    supplier: mockSuppliers[0],
    price: 899.99,
    currency: "EUR",
    unit: "pièce",
    minOrderQuantity: 1,
    maxOrderQuantity: 50,
    leadTime: 7,
    currentStock: 12,
    minStock: 5,
    maxStock: 30,
    reorderPoint: 8,
    stockLocation: "Entrepôt A - Zone 1",
    variants: [
      { name: "RAM", options: ["8GB", "16GB", "32GB"] },
      { name: "Stockage", options: ["256GB SSD", "512GB SSD", "1TB SSD"] }
    ],
    specifications: {
      brand: "HP",
      model: "ProBook 450",
      warranty: "24 mois",
      weight: "1.8 kg"
    },
    isActive: true,
    createdAt: "2023-01-20T00:00:00Z",
    lastUpdated: "2024-01-15T00:00:00Z",
    averageConsumption: 3.2,
    stockRotation: 12.5,
    stockValue: 10799.88,
    documents: [
      { name: "Fiche technique", url: "/docs/hp_probook_450_spec.pdf" },
      { name: "Manuel utilisateur", url: "/docs/hp_probook_450_manual.pdf" }
    ]
  },
  {
    id: 2,
    reference: "MAT-CIM-002",
    name: "Ciment Portland CEM II 32.5",
    description: "Ciment Portland composé pour usage général en construction",
    category: "Matériaux",
    subCategory: "Ciments",
    supplier: mockSuppliers[1],
    price: 12.50,
    currency: "EUR",
    unit: "sac 25kg",
    minOrderQuantity: 50,
    maxOrderQuantity: 1000,
    leadTime: 14,
    currentStock: 125,
    minStock: 100,
    maxStock: 500,
    reorderPoint: 150,
    stockLocation: "Entrepôt B - Zone Extérieure",
    variants: [
      { name: "Conditionnement", options: ["Sac 25kg", "Sac 50kg", "Vrac"] }
    ],
    specifications: {
      brand: "Lafarge",
      norm: "NF EN 197-1",
      resistance: "32.5 MPa",
      density: "3.15 g/cm³"
    },
    isActive: true,
    createdAt: "2023-02-10T00:00:00Z",
    lastUpdated: "2024-01-10T00:00:00Z",
    averageConsumption: 45.8,
    stockRotation: 8.2,
    stockValue: 1562.50,
    documents: []
  },
  {
    id: 3,
    reference: "LOG-PAL-003",
    name: "Palette Europe EPAL",
    description: "Palette en bois standard européenne 120x80cm",
    category: "Logistique",
    subCategory: "Palettes",
    supplier: mockSuppliers[2],
    price: 8.50,
    currency: "EUR",
    unit: "pièce",
    minOrderQuantity: 20,
    maxOrderQuantity: 200,
    leadTime: 3,
    currentStock: 2,
    minStock: 10,
    maxStock: 100,
    reorderPoint: 15,
    stockLocation: "Entrepôt C - Zone Palettes",
    variants: [
      { name: "État", options: ["Neuve", "Occasion Grade A", "Occasion Grade B"] }
    ],
    specifications: {
      dimensions: "120x80x14.4 cm",
      weight: "25 kg",
      capacity: "1500 kg"
    },
    isActive: true,
    createdAt: "2023-04-05T00:00:00Z",
    lastUpdated: "2024-01-18T00:00:00Z",
    averageConsumption: 28.5,
    stockRotation: 15.8,
    stockValue: 17.00,
    documents: []
  }
];

export const mockOrders = [
  {
    id: 1,
    orderNumber: "PO-2024-001",
    supplier: mockSuppliers[0],
    status: "en_attente",
    priority: "normal",
    orderDate: "2024-01-18T00:00:00Z",
    expectedDeliveryDate: "2024-01-25T00:00:00Z",
    actualDeliveryDate: null,
    requestedBy: mockUsers[2],
    approvedBy: null,
    items: [
      {
        id: 1,
        article: mockArticles[0],
        quantity: 5,
        unitPrice: 899.99,
        totalPrice: 4499.95,
        notes: "Configuration standard avec 16GB RAM"
      }
    ],
    subtotal: 4499.95,
    taxAmount: 899.99,
    totalAmount: 5399.94,
    currency: "EUR",
    paymentTerms: "30 jours",
    deliveryAddress: {
      street: "15 Rue de la Paix",
      city: "Paris",
      postalCode: "75001",
      country: "France"
    },
    notes: "Livraison urgente pour nouveau projet",
    attachments: [],
    history: [
      {
        date: "2024-01-18T10:30:00Z",
        action: "created",
        user: mockUsers[2],
        comment: "Commande créée"
      }
    ],
    validationWorkflow: {
      requiredApprovals: ["gestionnaire"],
      currentStep: "pending_manager_approval",
      steps: [
        { name: "manager_approval", status: "pending", user: null, date: null }
      ]
    }
  },
  {
    id: 2,
    orderNumber: "PO-2024-002",
    supplier: mockSuppliers[1],
    status: "validee",
    priority: "urgent",
    orderDate: "2024-01-15T00:00:00Z",
    expectedDeliveryDate: "2024-01-29T00:00:00Z",
    actualDeliveryDate: null,
    requestedBy: mockUsers[2],
    approvedBy: mockUsers[1],
    items: [
      {
        id: 2,
        article: mockArticles[1],
        quantity: 200,
        unitPrice: 12.50,
        totalPrice: 2500.00,
        notes: "Livraison en 2 fois"
      }
    ],
    subtotal: 2500.00,
    taxAmount: 500.00,
    totalAmount: 3000.00,
    currency: "EUR",
    paymentTerms: "45 jours",
    deliveryAddress: {
      street: "Zone Industrielle Nord",
      city: "Rennes",
      postalCode: "35000",
      country: "France"
    },
    notes: "Chantier prioritaire - Livraison échelonnée",
    attachments: [],
    history: [
      {
        date: "2024-01-15T09:15:00Z",
        action: "created",
        user: mockUsers[2],
        comment: "Commande créée"
      },
      {
        date: "2024-01-15T14:20:00Z",
        action: "approved",
        user: mockUsers[1],
        comment: "Commande approuvée - Projet prioritaire"
      }
    ],
    validationWorkflow: {
      requiredApprovals: ["gestionnaire"],
      currentStep: "approved",
      steps: [
        { name: "manager_approval", status: "approved", user: mockUsers[1], date: "2024-01-15T14:20:00Z" }
      ]
    }
  },
  {
    id: 3,
    orderNumber: "PO-2024-003",
    supplier: mockSuppliers[2],
    status: "livree",
    priority: "urgent",
    orderDate: "2024-01-10T00:00:00Z",
    expectedDeliveryDate: "2024-01-13T00:00:00Z",
    actualDeliveryDate: "2024-01-12T00:00:00Z",
    requestedBy: mockUsers[2],
    approvedBy: mockUsers[1],
    items: [
      {
        id: 3,
        article: mockArticles[2],
        quantity: 50,
        unitPrice: 8.50,
        totalPrice: 425.00,
        notes: "Palettes neuves uniquement"
      }
    ],
    subtotal: 425.00,
    taxAmount: 85.00,
    totalAmount: 510.00,
    currency: "EUR",
    paymentTerms: "15 jours",
    deliveryAddress: {
      street: "Entrepôt Principal",
      city: "Bordeaux",
      postalCode: "33000",
      country: "France"
    },
    notes: "Livraison effectuée avec 1 jour d'avance",
    attachments: [
      { name: "Bon de livraison", url: "/docs/delivery_note_PO2024003.pdf" }
    ],
    history: [
      {
        date: "2024-01-10T08:00:00Z",
        action: "created",
        user: mockUsers[2],
        comment: "Commande créée"
      },
      {
        date: "2024-01-10T11:30:00Z",
        action: "approved",
        user: mockUsers[1],
        comment: "Commande approuvée"
      },
      {
        date: "2024-01-12T15:45:00Z",
        action: "delivered",
        user: mockUsers[1],
        comment: "Livraison confirmée - Qualité conforme"
      }
    ],
    validationWorkflow: {
      requiredApprovals: ["gestionnaire"],
      currentStep: "completed",
      steps: [
        { name: "manager_approval", status: "approved", user: mockUsers[1], date: "2024-01-10T11:30:00Z" }
      ]
    }
  }
];

export const mockAlerts = [
  {
    id: 1,
    type: "stock_low",
    priority: "critical",
    title: "Stock critique",
    message: "Le stock de Palette Europe EPAL est critique (2 unités restantes)",
    article: mockArticles[2],
    threshold: 10,
    currentValue: 2,
    read: false,
    createdAt: "2024-01-20T08:00:00Z",
    actionRequired: true
  },
  {
    id: 2,
    type: "order_delay",
    priority: "high",
    title: "Retard de livraison",
    message: "La commande PO-2024-002 risque d'être en retard",
    order: mockOrders[1],
    expectedDate: "2024-01-29T00:00:00Z",
    estimatedDelay: 3,
    read: false,
    createdAt: "2024-01-19T14:30:00Z",
    actionRequired: true
  },
  {
    id: 3,
    type: "approval_pending",
    priority: "medium",
    title: "Approbation en attente",
    message: "La commande PO-2024-001 est en attente d'approbation",
    order: mockOrders[0],
    pendingSince: "2024-01-18T10:30:00Z",
    read: true,
    createdAt: "2024-01-18T16:00:00Z",
    actionRequired: true
  },
  {
    id: 4,
    type: "supplier_performance",
    priority: "low",
    title: "Performance fournisseur",
    message: "Le taux de livraison à temps de ProMatériaux SARL a baissé à 87.5%",
    supplier: mockSuppliers[1],
    metric: "onTimeDelivery",
    currentValue: 87.5,
    previousValue: 92.1,
    read: true,
    createdAt: "2024-01-17T09:00:00Z",
    actionRequired: false
  }
];

export const mockDashboardData = {
  kpis: {
    totalOrders: 156,
    pendingOrders: 12,
    totalSuppliers: 23,
    lowStockItems: 5,
    averageDeliveryTime: 8.5,
    serviceLevel: 94.2,
    costSavings: 125000,
    onTimeDelivery: 91.8
  },
  charts: {
    ordersTrend: [
      { month: "Jan", orders: 45, amount: 125000 },
      { month: "Fév", orders: 52, amount: 142000 },
      { month: "Mar", orders: 38, amount: 98000 },
      { month: "Avr", orders: 61, amount: 178000 },
      { month: "Mai", orders: 55, amount: 156000 },
      { month: "Jui", orders: 48, amount: 132000 }
    ],
    stockLevels: [
      { category: "Informatique", optimal: 85, current: 78, critical: 12 },
      { category: "Matériaux", optimal: 65, current: 71, critical: 8 },
      { category: "Logistique", optimal: 45, current: 23, critical: 15 }
    ],
    supplierPerformance: [
      { supplier: "TechnoFrance", onTime: 94.2, quality: 4.3, cost: 8.2 },
      { supplier: "ProMatériaux", onTime: 87.5, quality: 4.0, cost: 7.8 },
      { supplier: "GlobalLogistics", onTime: 96.8, quality: 3.9, cost: 9.1 }
    ]
  },
  recentActivities: [
    {
      id: 1,
      type: "order_created",
      message: "Nouvelle commande PO-2024-001 créée",
      user: "Pierre Bernard",
      timestamp: "2024-01-18T10:30:00Z"
    },
    {
      id: 2,
      type: "order_approved",
      message: "Commande PO-2024-002 approuvée",
      user: "Marie Martin",
      timestamp: "2024-01-15T14:20:00Z"
    },
    {
      id: 3,
      type: "stock_alert",
      message: "Alerte stock critique: Palette Europe EPAL",
      user: "Système",
      timestamp: "2024-01-20T08:00:00Z"
    }
  ],
  criticalAlerts: mockAlerts.filter(alert => alert.priority === 'critical'),
  topSuppliers: [
    { name: "TechnoFrance SAS", orders: 156, amount: 2450000, rating: 4.5 },
    { name: "ProMatériaux SARL", orders: 89, amount: 1250000, rating: 4.0 },
    { name: "Global Logistics Ltd", orders: 234, amount: 890000, rating: 3.8 }
  ]
};