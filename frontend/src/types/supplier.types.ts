// Types de base pour les fournisseurs
export interface SupplierAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface SupplierContact {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  isPrimary: boolean;
}

export interface SupplierDocument {
  id: number;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

// Interface principale pour un fournisseur
export interface Supplier {
  id: number;
  name: string;
  code: string;
  category: string;
  address: SupplierAddress;
  contacts: SupplierContact[];
  payment_terms: number;
  delivery_time: number;
  documents: SupplierDocument[];
  createdAt?: string;
  updatedAt?: string;
  status?: "active" | "inactive" | "pending";
}

// Type pour la création d'un fournisseur (certains champs optionnels)
export interface CreateSupplierData {
  name: string;
  code: string;
  category: string;
  address: SupplierAddress;
  contacts?: Omit<SupplierContact, "id">[];
  payment_terms: number;
  delivery_time: number;
  documents?: Omit<SupplierDocument, "id">[];
  status?: "active" | "inactive" | "pending";
}

// Type pour la mise à jour d'un fournisseur
export interface UpdateSupplierData extends Partial<CreateSupplierData> {
  id?: never; // Empêche la modification de l'ID
}

// Interface pour la pagination
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

// Interface pour les filtres de recherche
export interface SupplierFilters {
  search?: string;
  category?: string;
  status?: "active" | "inactive" | "pending";
  city?: string;
  country?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "code" | "category" | "createdAt";
  sortOrder?: "asc" | "desc";
}

// Interface pour la réponse de l'API
export interface SuppliersApiResponse {
  data: Supplier[];
  pagination: Pagination;
  success: boolean;
  message?: string;
}

// Interface pour une réponse d'API simple
export interface SupplierApiResponse {
  data: Supplier;
  success: boolean;
  message?: string;
}

// Interface pour l'état du slice
export interface SupplierState {
  suppliers: Supplier[];
  currentSupplier: Supplier | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  filters: SupplierFilters;
  pagination: Pagination;
}

// Types pour les erreurs
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// Types pour les thunks
export interface ThunkConfig {
  rejectValue: string;
}
