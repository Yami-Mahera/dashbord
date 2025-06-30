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

  const handleSort = (sortBy: "name" | "code" | "category" | "createdAt" | "onTimeDeliveryRate") => {
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

  const getStatusBadge = (supplier: Supplier) => {
    const isActive = supplier.isActive;
    return (
      <Badge 
        variant={isActive ? "default" : "secondary"}
        className={isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
      >
        {isActive ? 'Actif' : 'Inactif'}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
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
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Chargement des fournisseurs...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header et actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher un fournisseur..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" size="sm" onClick={resetFilters}>
            <Filter className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => loadSuppliers()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          {onAdd && (
            <Button onClick={onAdd} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau fournisseur
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fournisseurs ({filteredSuppliers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('name')}
                >
                  Nom
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('category')}
                >
                  Catégorie
                </TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Commandes</TableHead>
                <TableHead className="text-right">CA Total</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 text-right"
                  onClick={() => handleSort('onTimeDeliveryRate')}
                >
                  Taux de livraison
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{supplier.name}</div>
                      <div className="text-sm text-gray-500">
                        {supplier.totalOrders} commandes
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{supplier.category}</TableCell>
                  <TableCell>{getStatusBadge(supplier)}</TableCell>
                  <TableCell className="text-right">{supplier.totalOrders}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(supplier.totalAmount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`font-medium ${
                      supplier.onTimeDeliveryRate >= 95 ? 'text-green-600' :
                      supplier.onTimeDeliveryRate >= 85 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {supplier.onTimeDeliveryRate.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onView && (
                          <DropdownMenuItem onClick={() => onView(supplier)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Voir
                          </DropdownMenuItem>
                        )}
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(supplier)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDelete(supplier)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredSuppliers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun fournisseur trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le fournisseur "{selectedSupplier?.name}" ? 
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SuppliersList;