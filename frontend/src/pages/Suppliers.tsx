import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Star, 
  TrendingUp,
  TrendingDown,
  Users,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import { fetchSuppliers, createSupplier, updateSupplier, deleteSupplier, setFilters } from '../store/slices/suppliersSlice';

const SuppliersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const { suppliers, isLoading, filters } = useSelector(state => state.suppliers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);  
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'France'
    },
    contacts: [{
      name: '',
      email: '',
      phone: '',
      position: '',
      isPrimary: true
    }],
    paymentTerms: '30 jours',
    currency: 'EUR',
    isActive: true
  });

  useEffect(() => {
    dispatch(fetchSuppliers(filters));
  }, [dispatch, filters]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    dispatch(setFilters({ search: value }));
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleCreateSupplier = async () => {
    try {
      await dispatch(createSupplier(formData)).unwrap();
      toast({
        title: "Succès",
        description: "Fournisseur créé avec succès",
      });
      setShowCreateDialog(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erreur",
        description: error,
        variant: "destructive",
      });
    }
  };

  const handleEditSupplier = async () => {
    try {
      await dispatch(updateSupplier({ id: selectedSupplier.id, data: formData })).unwrap();
      toast({
        title: "Succès", 
        description: "Fournisseur modifié avec succès",
      });
      setShowEditDialog(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erreur",
        description: error,
        variant: "destructive",
      });
    }
  };

  const handleDeleteSupplier = async () => {
    try {
      await dispatch(deleteSupplier(selectedSupplier.id)).unwrap();
      toast({
        title: "Succès",
        description: "Fournisseur supprimé avec succès",
      });
      setShowDeleteDialog(false);
      setSelectedSupplier(null);
    } catch (error) {
      toast({
        title: "Erreur", 
        description: error,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      category: '',
      address: {
        street: '',
        city: '',
        postalCode: '',
        country: 'France'
      },
      contacts: [{
        name: '',
        email: '',
        phone: '',
        position: '',
        isPrimary: true
      }],
      paymentTerms: '30 jours',
      currency: 'EUR',
      isActive: true
    });
    setSelectedSupplier(null);
  };

  const openEditDialog = (supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      name: supplier.name,
      code: supplier.code,
      category: supplier.category,
      address: supplier.address,
      contacts: supplier.contacts,
      paymentTerms: supplier.paymentTerms,
      currency: supplier.currency,
      isActive: supplier.isActive
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (supplier) => {
    setSelectedSupplier(supplier);
    setShowDeleteDialog(true);
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getPerformanceTrend = (rate) => {
    if (rate >= 95) return { icon: TrendingUp, color: 'text-green-500', label: 'Excellent' };
    if (rate >= 85) return { icon: TrendingUp, color: 'text-blue-500', label: 'Bon' };
    return { icon: TrendingDown, color: 'text-red-500', label: 'À améliorer' };
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
            <h1 className="text-3xl font-bold text-gray-900">Fournisseurs</h1>
            <p className="text-gray-600 mt-1">
              Gérez vos fournisseurs et leurs performances
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau fournisseur
            </Button>
          </div>
        </div>
      </motion.div>

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
                  placeholder="Rechercher par nom, code ou catégorie..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filters.category || 'all'} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="Électronique">Électronique</SelectItem>
                <SelectItem value="Matériaux">Matériaux</SelectItem>
                <SelectItem value="Logistique">Logistique</SelectItem>
              </SelectContent> 
            </Select>
            <Select value={filters.isActive?.toString() || 'all'} onValueChange={(value) => handleFilterChange('isActive', value === 'all' ? undefined : value === 'true')}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="true">Actifs</SelectItem>
                <SelectItem value="false">Inactifs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {suppliers.map((supplier) => {
            const performance = getPerformanceTrend(supplier.onTimeDeliveryRate);
            const TrendIcon = performance.icon;
            
            return (
              <motion.div
                key={supplier.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{supplier.name}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Badge variant={supplier.isActive ? "default" : "secondary"} className="mr-2">
                            {supplier.code}
                          </Badge>
                          <span className="text-sm">{supplier.category}</span>
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(supplier)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => openDeleteDialog(supplier)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {supplier.address.city}, {supplier.address.country}
                      </div>
                      {supplier.contacts[0] && (
                        <>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            {supplier.contacts[0].name}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-2" />
                            {supplier.contacts[0].email}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getRatingStars(supplier.rating)}
                        <span className="ml-2 text-sm text-gray-600">
                          {supplier.rating.toFixed(1)}
                        </span>
                      </div>
                      <div className={`flex items-center ${performance.color}`}>
                        <TrendIcon className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">{performance.label}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">{supplier.totalOrders}</div>
                        <div className="text-xs text-gray-500">Commandes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">{supplier.onTimeDeliveryRate}%</div>
                        <div className="text-xs text-gray-500">Ponctualité</div>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-gray-600">Montant total</span>
                      <span className="font-semibold text-gray-900">
                        {(supplier.totalAmount / 1000).toFixed(0)}k€
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Create Supplier Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouveau fournisseur</DialogTitle>
            <DialogDescription>
              Ajoutez un nouveau fournisseur à votre liste
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom du fournisseur *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nom du fournisseur"
                />
              </div>
              <div>
                <Label htmlFor="code">Code fournisseur *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  placeholder="Code unique"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Électronique">Électronique</SelectItem>
                  <SelectItem value="Matériaux">Matériaux</SelectItem>
                  <SelectItem value="Logistique">Logistique</SelectItem>
                  <SelectItem value="Services">Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Adresse</Label>
              <Input
                value={formData.address.street}
                onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})}
                placeholder="Adresse"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={formData.address.city}
                  onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})}
                  placeholder="Ville"
                />
                <Input
                  value={formData.address.postalCode}
                  onChange={(e) => setFormData({...formData, address: {...formData.address, postalCode: e.target.value}})}
                  placeholder="Code postal"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Contact principal</Label>
              <Input
                value={formData.contacts[0].name}
                onChange={(e) => setFormData({...formData, contacts: [{...formData.contacts[0], name: e.target.value}]})}
                placeholder="Nom du contact"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={formData.contacts[0].email}
                  onChange={(e) => setFormData({...formData, contacts: [{...formData.contacts[0], email: e.target.value}]})}
                  placeholder="Email"
                  type="email"
                />
                <Input
                  value={formData.contacts[0].phone}
                  onChange={(e) => setFormData({...formData, contacts: [{...formData.contacts[0], phone: e.target.value}]})}
                  placeholder="Téléphone"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateSupplier}>
              Créer le fournisseur
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Supplier Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le fournisseur</DialogTitle>
            <DialogDescription>
              Modifiez les informations du fournisseur
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Nom du fournisseur *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nom du fournisseur"
                />
              </div>
              <div>
                <Label htmlFor="edit-code">Code fournisseur *</Label>
                <Input
                  id="edit-code"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  placeholder="Code unique"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-category">Catégorie</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Électronique">Électronique</SelectItem>
                  <SelectItem value="Matériaux">Matériaux</SelectItem>
                  <SelectItem value="Logistique">Logistique</SelectItem>
                  <SelectItem value="Services">Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Adresse</Label>
              <Input
                value={formData.address.street}
                onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})}
                placeholder="Adresse"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={formData.address.city}
                  onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})}
                  placeholder="Ville"
                />
                <Input
                  value={formData.address.postalCode}
                  onChange={(e) => setFormData({...formData, address: {...formData.address, postalCode: e.target.value}})}
                  placeholder="Code postal"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditSupplier}>
              Enregistrer les modifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le fournisseur</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le fournisseur "{selectedSupplier?.name}" ? 
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteSupplier}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuppliersPage;