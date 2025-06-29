import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Check, 
  X,
  AlertTriangle,
  Package,
  Clock,
  TrendingDown,
  Settings,
  CheckCircle2,
  Eye,
  Archive
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useToast } from '../hooks/use-toast';
import { fetchAlerts, markAsRead, markAllAsRead, dismissAlert, setFilters } from '../store/slices/alertsSlice';

const AlertsPage = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const { alerts, isLoading, filters, unreadCount, criticalCount } = useAppSelector(state => state.alerts);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    dispatch(fetchAlerts(filters));
  }, [dispatch, filters]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    dispatch(setFilters({ search: value }));
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleMarkAsRead = async (alertId: string) => {
    try {
      await dispatch(markAsRead(alertId));
      toast({
        title: "Succès",
        description: "Alerte marquée comme lue",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: String(error),
        variant: "destructive",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllAsRead()).unwrap();
      toast({
        title: "Succès",
        description: "Toutes les alertes ont été marquées comme lues",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error,
        variant: "destructive",
      });
    }
  };

  const handleDismissAlert = async (alertId) => {
    try {
      await dispatch(dismissAlert(alertId)).unwrap();
      toast({
        title: "Succès",
        description: "Alerte supprimée",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error,
        variant: "destructive",
      });
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'stock_low':
        return Package;
      case 'order_delay':
        return Clock;
      case 'approval_pending':
        return CheckCircle2;
      case 'supplier_performance':
        return TrendingDown;
      default:
        return AlertTriangle;
    }
  };

  const getAlertTypeLabel = (type) => {
    switch (type) {
      case 'stock_low':
        return 'Stock faible';
      case 'order_delay':
        return 'Retard commande';
      case 'approval_pending':
        return 'Approbation en attente';
      case 'supplier_performance':
        return 'Performance fournisseur';
      default:
        return 'Alerte';
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'critical':
        return { 
          label: 'Critique', 
          color: 'bg-red-100 text-red-800 border-red-200',
          bgColor: 'bg-red-50',
          iconColor: 'text-red-500'
        };
      case 'high':
        return { 
          label: 'Élevée', 
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          bgColor: 'bg-orange-50',
          iconColor: 'text-orange-500'
        };
      case 'medium':
        return { 
          label: 'Moyenne', 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          bgColor: 'bg-yellow-50',
          iconColor: 'text-yellow-500'
        };
      case 'low':
        return { 
          label: 'Faible', 
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-500'
        };
      default:
        return { 
          label: priority, 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          bgColor: 'bg-gray-50',
          iconColor: 'text-gray-500'
        };
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `il y a ${diffInMinutes}min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `il y a ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `il y a ${diffInDays}j`;
  };

  const openDetailsDialog = (alert) => {
    setSelectedAlert(alert);
    setShowDetailsDialog(true);
    if (!alert.read) {
      handleMarkAsRead(alert.id);
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Alertes</h1>
            <p className="text-gray-600 mt-1">
              Suivez les alertes et notifications importantes
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </Button>
            {unreadCount > 0 && (
              <Button 
                size="sm" 
                onClick={handleMarkAllAsRead}
                className="bg-gradient-to-r from-blue-500 to-purple-600"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Tout marquer lu ({unreadCount})
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Non lues</p>
                <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
              </div>
              <Eye className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critiques</p>
                <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Action requise</p>
                <p className="text-2xl font-bold text-purple-600">
                  {alerts.filter(a => a.actionRequired).length}
                </p>
              </div>
              <Check className="w-8 h-8 text-purple-500" />
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
                  placeholder="Rechercher dans les alertes..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filters.type || 'all'} onValueChange={(value) => handleFilterChange('type', value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type d'alerte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="stock_low">Stock faible</SelectItem>
                <SelectItem value="order_delay">Retard commande</SelectItem>
                <SelectItem value="approval_pending">Approbation en attente</SelectItem>
                <SelectItem value="supplier_performance">Performance fournisseur</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.priority || 'all'} onValueChange={(value) => handleFilterChange('priority', value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="critical">Critique</SelectItem>
                <SelectItem value="high">Élevée</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="low">Faible</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.read || 'all'} onValueChange={(value) => handleFilterChange('read', value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="unread">Non lues</SelectItem>
                <SelectItem value="read">Lues</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-3">
        <AnimatePresence>
          {alerts.map((alert) => {
            const priorityConfig = getPriorityConfig(alert.priority);
            const AlertIcon = getAlertIcon(alert.type);
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <Card 
                  className={`hover:shadow-md transition-all duration-300 cursor-pointer border-l-4 ${
                    alert.read ? 'opacity-75' : ''
                  } ${priorityConfig.color.includes('red') ? 'border-l-red-500' : 
                      priorityConfig.color.includes('orange') ? 'border-l-orange-500' :
                      priorityConfig.color.includes('yellow') ? 'border-l-yellow-500' : 'border-l-blue-500'}`}
                  onClick={() => openDetailsDialog(alert)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`p-2 rounded-lg ${priorityConfig.bgColor}`}>
                          <AlertIcon className={`w-5 h-5 ${priorityConfig.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className={`font-semibold ${alert.read ? 'text-gray-700' : 'text-gray-900'}`}>
                              {alert.title}
                            </h3>
                            {!alert.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <Badge className={priorityConfig.color}>
                              {priorityConfig.label}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {getAlertTypeLabel(alert.type)}
                            </Badge>
                          </div>
                          <p className={`text-sm ${alert.read ? 'text-gray-600' : 'text-gray-700'} mb-2`}>
                            {alert.message}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{formatTimeAgo(alert.createdAt)}</span>
                            {alert.actionRequired && (
                              <Badge className="bg-purple-100 text-purple-800 text-xs">
                                Action requise
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {!alert.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(alert.id);
                            }}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openDetailsDialog(alert)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Voir les détails
                            </DropdownMenuItem>
                            {!alert.read && (
                              <DropdownMenuItem onClick={() => handleMarkAsRead(alert.id)}>
                                <Check className="w-4 h-4 mr-2" />
                                Marquer comme lu
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => handleDismissAlert(alert.id)}
                              className="text-red-600"
                            >
                              <Archive className="w-4 h-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
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
        
        {alerts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune alerte</h3>
            <p className="text-gray-600">
              {Object.values(filters).some(f => f && f !== 'all') 
                ? "Aucune alerte ne correspond à vos critères de recherche"
                : "Vous n'avez aucune alerte pour le moment"
              }
            </p>
          </motion.div>
        )}
      </div>

      {/* Alert Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedAlert && (
                <>
                  {React.createElement(getAlertIcon(selectedAlert.type), { 
                    className: `w-5 h-5 ${getPriorityConfig(selectedAlert.priority).iconColor}` 
                  })}
                  <span>{selectedAlert.title}</span>
                  <Badge className={getPriorityConfig(selectedAlert.priority).color}>
                    {getPriorityConfig(selectedAlert.priority).label}
                  </Badge>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Détails de l'alerte
            </DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Message</Label>
                <p className="text-sm text-gray-900 mt-1">{selectedAlert.message}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Type</Label>
                  <p className="text-sm text-gray-900">{getAlertTypeLabel(selectedAlert.type)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Priorité</Label>
                  <p className="text-sm text-gray-900">{getPriorityConfig(selectedAlert.priority).label}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Créée le</Label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedAlert.createdAt).toLocaleString('fr-FR')}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Action requise</Label>
                  <p className="text-sm text-gray-900">
                    {selectedAlert.actionRequired ? 'Oui' : 'Non'}
                  </p>
                </div>
              </div>

              {/* Contextual Information */}
              {selectedAlert.article && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Article concerné</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">{selectedAlert.article.name}</p>
                    <p className="text-sm text-gray-600">Réf: {selectedAlert.article.reference}</p>
                    {selectedAlert.currentValue !== undefined && (
                      <p className="text-sm text-gray-600">
                        Stock actuel: {selectedAlert.currentValue} / Seuil: {selectedAlert.threshold}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {selectedAlert.order && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Commande concernée</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">{selectedAlert.order.orderNumber}</p>
                    <p className="text-sm text-gray-600">
                      Fournisseur: {selectedAlert.order.supplier.name}
                    </p>
                    {selectedAlert.expectedDate && (
                      <p className="text-sm text-gray-600">
                        Livraison prévue: {new Date(selectedAlert.expectedDate).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {selectedAlert.supplier && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Fournisseur concerné</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">{selectedAlert.supplier.name}</p>
                    <p className="text-sm text-gray-600">
                      Catégorie: {selectedAlert.supplier.category}
                    </p>
                    {selectedAlert.currentValue !== undefined && selectedAlert.previousValue !== undefined && (
                      <p className="text-sm text-gray-600">
                        Performance: {selectedAlert.currentValue}% (était {selectedAlert.previousValue}%)
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlertsPage;