import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useSuppliers } from '../../hooks/useSuppliers';
import { SupplierUtils } from '../../utils/supplierUtils';
import { Supplier } from '../../types/supplier.types';
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

interface SuppliersListProps {
  onEdit?: (supplier: Supplier) => void;
  onView?: (supplier: Supplier) => void;
  onAdd?: () => void;
}

const SuppliersList: React.FC<SuppliersListProps> = ({
  onEdit,
  onView,
  onAdd
}) => {
  const {
    suppliers,
    isLoading,
    isDeleting,
    error,
    filters,
    pagination,
    updateFilters,
    resetFilters,
    deleteExistingSupplier,
    loadSuppliers,
    clearErrorMessage
  } = useSuppliers();

  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Filtrage et tri local
  const filteredSuppliers = useMemo(() => {
    let filtered = SupplierUtils.filterSuppliers(suppliers, { search: searchTerm });
    
    if (filters.sortBy) {
      filtered = SupplierUtils.sortSuppliers(
        filtered,
        filters.sortBy,
        filters.sortOrder || 'asc'
      );
    }
    
    return filtered;
  }, [suppliers, searchTerm, filters.sortBy, filters.sortOrder]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateFilters({ search: value, page: 1 });
  };

  const handleSort = (sortBy: keyof Supplier) => {
    const sortOrder = filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    updateFilters({ sortBy, sortOrder });
  };

  const handleDelete = async (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedSupplier) {
      try {
        await deleteExistingSupplier(selectedSupplier.id);
        setShowDeleteDialog(false);
        setSelectedSupplier(null);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleExport = async () => {
    try {
      const csvContent = SupplierUtils.exportToCSV(filteredSuppliers);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `fournisseurs_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    }
  };

  const getStatusBadge = (status: string = 'active') => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };

    const labels = {
      active: 'Actif',
      inactive: 'Inactif',
      pending: 'En attente'
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Erreur: {error}</p>
            <Button onClick={clearErrorMessage} className="mt-2">
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );