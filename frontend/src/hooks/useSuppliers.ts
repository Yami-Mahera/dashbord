import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  fetchSuppliers,
  fetchSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  setFilters,
  clearFilters,
  clearError,
  setCurrentSupplier,
  clearCurrentSupplier,
  selectSuppliers,
  selectCurrentSupplier,
  selectSuppliersLoading,
  selectSuppliersCreating,
  selectSuppliersUpdating,
  selectSuppliersDeleting,
  selectSuppliersError,
  selectSuppliersPagination,
  selectSuppliersFilters,
  selectSupplierById,
  selectActiveSuppliers,
} from "../store/slices/suppliersSlice";
import {
  CreateSupplierData,
  UpdateSupplierData,
  SupplierFilters,
} from "../types/supplier.types";

export const useSuppliers = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const suppliers = useAppSelector(selectSuppliers);
  const currentSupplier = useAppSelector(selectCurrentSupplier);
  const isLoading = useAppSelector(selectSuppliersLoading);
  const isCreating = useAppSelector(selectSuppliersCreating);
  const isUpdating = useAppSelector(selectSuppliersUpdating);
  const isDeleting = useAppSelector(selectSuppliersDeleting);
  const error = useAppSelector(selectSuppliersError);
  const pagination = useAppSelector(selectSuppliersPagination);
  const filters = useAppSelector(selectSuppliersFilters);
  const activeSuppliers = useAppSelector(selectActiveSuppliers);

  // Actions

  const loadSuppliers = useCallback(
    (filters?: SupplierFilters) => {
      return dispatch(fetchSuppliers(filters));
    },
    [dispatch]
  );

  const loadSupplierById = useCallback(
    (id: number) => {
      return dispatch(fetchSupplierById(id));
    },
    [dispatch]
  );

  const createNewSupplier = useCallback(
    (data: CreateSupplierData) => {
      return dispatch(createSupplier(data));
    },
    [dispatch]
  );

  const updateExistingSupplier = useCallback(
    (id: number, data: UpdateSupplierData) => {
      return dispatch(updateSupplier({ id, data }));
    },
    [dispatch]
  );

  const deleteExistingSupplier = useCallback(
    (id: number) => {
      return dispatch(deleteSupplier(id));
    },
    [dispatch]
  );

  const updateFilters = useCallback(
    (newFilters: SupplierFilters) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const clearErrorMessage = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const selectSupplier = useCallback(
    (supplier: any) => {
      dispatch(setCurrentSupplier(supplier));
    },
    [dispatch]
  );

  const clearSelectedSupplier = useCallback(() => {
    dispatch(clearCurrentSupplier());
  }, [dispatch]);

  // Auto-load suppliers when filters change
  useEffect(() => {
    loadSuppliers(filters);
  }, [filters, loadSuppliers]);

  return {
    // Data
    suppliers,
    currentSupplier,
    activeSuppliers,
    pagination,
    filters,

    // Loading states
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,

    // Actions
    loadSuppliers,
    loadSupplierById,
    createNewSupplier,
    updateExistingSupplier,
    deleteExistingSupplier,
    updateFilters,
    resetFilters,
    clearErrorMessage,
    selectSupplier,
    clearSelectedSupplier,

    // Computed values
    hasSuppliers: suppliers.length > 0,
    totalSuppliers: pagination.total,
    hasNextPage: pagination.page * pagination.limit < pagination.total,
    hasPreviousPage: pagination.page > 1,
  };
};

// Hook pour un fournisseur spécifique
export const useSupplier = (id: number) => {
  const dispatch = useAppDispatch();

  const supplier = useAppSelector((state) => selectSupplierById(id)(state));
  const isLoading = useAppSelector(selectSuppliersLoading);
  const error = useAppSelector(selectSuppliersError);

  const loadSupplier = useCallback(() => {
    if (id) {
      return dispatch(fetchSupplierById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && !supplier) {
      loadSupplier();
    }
  }, [id, supplier, loadSupplier]);

  return {
    supplier,
    isLoading,
    error,
    loadSupplier,
  };
};