import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Check, 
  X,
  Clock,
  AlertTriangle,
  Truck,
  ShoppingCart,
  Calendar,
  User,
  DollarSign
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import { fetchOrders, validateOrder, rejectOrder, setFilters } from '../store/slices/ordersSlice';
import { OrderData } from '../types/order.types';

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const { orders, isLoading, filters, orderStats } = useAppSelector(state => state.orders);
  const { user } = useAppSelector(state => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showValidateDialog, setShowValidateDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    dispatch(fetchOrders(filters));
  }, [dispatch, filters]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    dispatch(setFilters({ search: value }));
  };

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleValidateOrder = async () => {
    if (!selectedOrder || !user) return;
    try {
      await dispatch(validateOrder({ id: selectedOrder.id, validatedBy: user })).unwrap();
      toast({
        title: "Succès",
        description: "Commande validée avec succès",
      });
      setShowValidateDialog(false);
      setSelectedOrder(null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: String(error),
        variant: "destructive",
      });
    }
  };

  const handleRejectOrder = async () => {
    if (!selectedOrder || !user) return;
    try {
      await dispatch(rejectOrder({ id: selectedOrder.id, reason: rejectionReason, rejectedBy: user })).unwrap();
      toast({
        title: "Succès",
        description: "Commande rejetée",
      });
      setShowRejectDialog(false);
      setSelectedOrder(null);
      setRejectionReason('');
    } catch (error) {
      toast({
        title: "Erreur",
        description: String(error),
        variant: "destructive",
      });
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'en_attente':
        return { 
          label: 'En attente', 
          color: 'bg-yellow-100 text-yellow-800',
          icon: Clock
        };
      case 'validee':
        return { 
          label: 'Validée', 
          color: 'bg-blue-100 text-blue-800',
          icon: Check
        };
      case 'livree':
        return { 
          label: 'Livrée', 
          color: 'bg-green-100 text-green-800',
          icon: Truck
        };
      case 'rejetee':
        return { 
          label: 'Rejetée', 
          color: 'bg-red-100 text-red-800',
          icon: X
        };
      default:
        return { 
          label: status, 
          color: 'bg-gray-100 text-gray-800',
          icon: Clock
        };
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return { label: 'Urgent', color: 'bg-red-100 text-red-800' };
      case 'normal':
        return { label: 'Normal', color: 'bg-blue-100 text-blue-800' };
      case 'low':
        return { label: 'Faible', color: 'bg-gray-100 text-gray-800' };
      default:
        return { label: priority, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const canValidateOrder = (order: OrderData) => {
    return order.status === 'en_attente' && 
           user && (user.role === 'gestionnaire' || user.role === 'administrateur');
  };

  const openDetailsDialog = (order: OrderData) => {
    setSelectedOrder(order);
    setShowDetailsDialog(true);
  };

  const openValidateDialog = (order: OrderData) => {
    setSelectedOrder(order);
    setShowValidateDialog(true);
  };

  const openRejectDialog = (order: OrderData) => {
    setSelectedOrder(order);
    setShowRejectDialog(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Commandes</h1>
            <p className="text-gray-600 mt-1">
              Gérez vos commandes d'achat et leur validation
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle commande
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Validées</p>
                <p className="text-2xl font-bold text-blue-600">{orderStats.validated}</p>
              </div>
              <Check className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Livrées</p>
                <p className="text-2xl font-bold text-green-600">{orderStats.delivered}</p>
              </div>
              <Truck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En retard</p>
                <p className="text-2xl font-bold text-red-600">{orderStats.delayed}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par numéro, fournisseur ou statut..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="validee">Validée</SelectItem>
                <SelectItem value="livree">Livrée</SelectItem>
                <SelectItem value="rejetee">Rejetée</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.priority || 'all'} onValueChange={(value) => handleFilterChange('priority', value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Faible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        <AnimatePresence>
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const priorityConfig = getPriorityConfig(order.priority);
            const StatusIcon = statusConfig.icon;
            
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {order.orderNumber}
                          </h3>
                          <Badge variant="default" className={statusConfig.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                          <Badge variant="default" className={priorityConfig.color}>
                            {priorityConfig.label}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <User className="w-4 h-4 mr-2" />
                            <span>{order.supplier.name}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>Commande: {formatDate(order.orderDate)}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Truck className="w-4 h-4 mr-2" />
                            <span>Livraison: {formatDate(order.expectedDeliveryDate)}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="w-4 h-4 mr-2" />
                            <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Demandeur:</span> {order.requestedBy.firstName} {order.requestedBy.lastName}
                          </p>
                          {order.notes && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Notes:</span> {order.notes}
                            </p>
                          )}
                        </div>

                        <div className="mt-3 text-sm text-gray-500">
                          <span className="font-medium">{order.items.length}</span> article(s) • 
                          <span className="ml-1">Créée {formatDate(order.orderDate)}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDetailsDialog(order)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                        
                        {canValidateOrder(order) && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => openValidateDialog(order)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Valider
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openRejectDialog(order)}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Rejeter
                            </Button>
                          </>
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openDetailsDialog(order)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Voir les détails
                            </DropdownMenuItem>
                            {order.status === 'en_attente' && (
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la commande {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              Informations complètes sur la commande
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 py-4">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Fournisseur</Label>
                  <p className="text-sm text-gray-900">{selectedOrder.supplier.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Statut</Label>
                  <p className="text-sm text-gray-900">{getStatusConfig(selectedOrder.status).label}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Date de commande</Label>
                  <p className="text-sm text-gray-900">{formatDate(selectedOrder.orderDate)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Livraison prévue</Label>
                  <p className="text-sm text-gray-900">{formatDate(selectedOrder.expectedDeliveryDate)}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Articles commandés</Label>
                <div className="border rounded-lg">
                  <div className="grid grid-cols-5 gap-4 p-3 bg-gray-50 font-medium text-sm">
                    <span>Article</span>
                    <span>Quantité</span>
                    <span>Prix unitaire</span>
                    <span>Total</span>
                    <span>Notes</span>
                  </div>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-5 gap-4 p-3 border-t text-sm">
                      <span>{item.article.name}</span>
                      <span>{item.quantity} {item.article.unit || 'pièce'}</span>
                      <span>{formatCurrency(item.unitPrice)}</span>
                      <span>{formatCurrency(item.totalPrice)}</span>
                      <span className="text-gray-600">{item.notes || '-'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total:</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA:</span>
                    <span>{formatCurrency(selectedOrder.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* History */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Historique</Label>
                <div className="space-y-3">
                  {selectedOrder.history.map((entry, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{entry.comment}</p>
                        <p className="text-xs text-gray-500">
                          {entry.user.firstName} {entry.user.lastName} • {formatDate(entry.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Validate Order Dialog */}
      <Dialog open={showValidateDialog} onOpenChange={setShowValidateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Valider la commande</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir valider la commande {selectedOrder?.orderNumber} ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowValidateDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleValidateOrder} className="bg-green-600 hover:bg-green-700">
              Valider la commande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Order Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la commande</DialogTitle>
            <DialogDescription>
              Indiquez la raison du rejet de la commande {selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="rejection-reason">Raison du rejet *</Label>
            <Textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Expliquez pourquoi cette commande est rejetée..."
              rows={3}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleRejectOrder} 
              variant="destructive"
              disabled={!rejectionReason.trim()}
            >
              Rejeter la commande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;