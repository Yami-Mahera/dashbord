import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  AlertTriangle,
  Package,
  TrendingDown,
  TrendingUp,
  DollarSign,
  BarChart3,
  Eye,
  RefreshCw
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
import { Progress } from '../components/ui/progress';
import { useToast } from '../hooks/use-toast';
import { fetchArticles, createArticle, updateArticle, deleteArticle, setFilters } from '../store/slices/articlesSlice';

const ArticlesPage = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  const { articles, isLoading, filters, categories, lowStockAlerts } = useSelector(state => state.articles);
  const { suppliers } = useSelector(state => state.suppliers);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStockDialog, setShowStockDialog] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [formData, setFormData] = useState({
    reference: '',
    name: '',
    description: '',
    category: '',
    subCategory: '',
    supplier: null,
    price: '',
    currency: 'EUR',
    unit: 'pièce',
    minOrderQuantity: 1,
    maxOrderQuantity: 1000,
    leadTime: 7,
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    reorderPoint: 0,
    stockLocation: '',
    isActive: true
  });
  const [stockUpdateData, setStockUpdateData] = useState({
    newStock: 0,
    reason: ''
  });

  useEffect(() => {
    dispatch(fetchArticles(filters));
  }, [dispatch, filters]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    dispatch(setFilters({ search: value }));
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleCreateArticle = async () => {
    try {
      await dispatch(createArticle(formData)).unwrap();
      toast({
        title: "Succès",
        description: "Article créé avec succès",
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

  const handleEditArticle = async () => {
    try {
      await dispatch(updateArticle({ id: selectedArticle.id, data: formData })).unwrap();
      toast({
        title: "Succès",
        description: "Article modifié avec succès",
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

  const handleDeleteArticle = async () => {
    try {
      await dispatch(deleteArticle(selectedArticle.id)).unwrap();
      toast({
        title: "Succès",
        description: "Article supprimé avec succès",
      });
      setShowDeleteDialog(false);
      setSelectedArticle(null);
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
      reference: '',
      name: '',
      description: '',
      category: '',
      subCategory: '',
      supplier: null,
      price: '',
      currency: 'EUR',
      unit: 'pièce',
      minOrderQuantity: 1,
      maxOrderQuantity: 1000,
      leadTime: 7,
      currentStock: 0,
      minStock: 0,
      maxStock: 0,
      reorderPoint: 0,
      stockLocation: '',
      isActive: true
    });
    setSelectedArticle(null);
  };

  const openEditDialog = (article) => {
    setSelectedArticle(article);
    setFormData({
      reference: article.reference,
      name: article.name,
      description: article.description,
      category: article.category,
      subCategory: article.subCategory,
      supplier: article.supplier,
      price: article.price,
      currency: article.currency,
      unit: article.unit,
      minOrderQuantity: article.minOrderQuantity,
      maxOrderQuantity: article.maxOrderQuantity,
      leadTime: article.leadTime,
      currentStock: article.currentStock,
      minStock: article.minStock,
      maxStock: article.maxStock,
      reorderPoint: article.reorderPoint,
      stockLocation: article.stockLocation,
      isActive: article.isActive
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (article) => {
    setSelectedArticle(article);
    setShowDeleteDialog(true);
  };

  const openStockDialog = (article) => {
    setSelectedArticle(article);
    setStockUpdateData({
      newStock: article.currentStock,
      reason: ''
    });
    setShowStockDialog(true);
  };

  const getStockStatus = (article) => {
    if (article.currentStock <= article.minStock) {
      return { status: 'critical', color: 'bg-red-500', label: 'Stock critique' };
    } else if (article.currentStock <= article.reorderPoint) {
      return { status: 'warning', color: 'bg-yellow-500', label: 'Réappro. nécessaire' };
    } else if (article.currentStock >= article.maxStock * 0.8) {
      return { status: 'high', color: 'bg-blue-500', label: 'Stock élevé' };
    }
    return { status: 'normal', color: 'bg-green-500', label: 'Stock normal' };
  };

  const getStockPercentage = (article) => {
    if (article.maxStock === 0) return 0;
    return Math.min((article.currentStock / article.maxStock) * 100, 100);
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
            <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
            <p className="text-gray-600 mt-1">
              Gérez votre inventaire et suivez les stocks
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analyse
            </Button>
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvel article
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Articles</p>
                <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock faible</p>
                <p className="text-2xl font-bold text-red-600">{lowStockAlerts.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Catégories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
              <Filter className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valeur stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(articles.reduce((sum, a) => sum + a.stockValue, 0) / 1000)}k€
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
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
                  placeholder="Rechercher par référence, nom ou description..."
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
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.lowStock ? 'true' : 'all'} onValueChange={(value) => handleFilterChange('lowStock', value === 'true')}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="true">Stock faible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {articles.map((article) => {
            const stockStatus = getStockStatus(article);
            const stockPercentage = getStockPercentage(article);
            
            return (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {article.reference}
                          </Badge>
                          <Badge className={stockStatus.color + ' text-white text-xs'}>
                            {stockStatus.label}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg mt-2">{article.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {article.category} • {article.supplier.name}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openStockDialog(article)}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Mettre à jour stock
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(article)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => openDeleteDialog(article)}
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
                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {article.description}
                    </p>

                    {/* Stock Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Stock actuel</span>
                        <span className="font-medium">
                          {article.currentStock} / {article.maxStock} {article.unit}
                        </span>
                      </div>
                      <Progress value={stockPercentage} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Min: {article.minStock}</span>
                        <span>Réappro: {article.reorderPoint}</span>
                        <span>Max: {article.maxStock}</span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          {article.price}€
                        </p>
                        <p className="text-xs text-gray-500">par {article.unit}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {Math.round(article.stockValue)}€
                        </p>
                        <p className="text-xs text-gray-500">valeur stock</p>
                      </div>
                    </div>

                    {/* Supplier and Lead Time */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div>
                        <p className="text-xs text-gray-500">Délai livraison</p>
                        <p className="text-sm font-medium">{article.leadTime} jours</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Emplacement</p>
                        <p className="text-sm font-medium truncate">{article.stockLocation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Create Article Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvel article</DialogTitle>
            <DialogDescription>
              Ajoutez un nouvel article à votre inventaire
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reference">Référence *</Label>
                <Input
                  id="reference"
                  value={formData.reference}
                  onChange={(e) => setFormData({...formData, reference: e.target.value})}
                  placeholder="Référence unique"
                />
              </div>
              <div>
                <Label htmlFor="name">Nom de l'article *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nom de l'article"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Description de l'article"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Informatique">Informatique</SelectItem>
                    <SelectItem value="Matériaux">Matériaux</SelectItem>
                    <SelectItem value="Logistique">Logistique</SelectItem>
                    <SelectItem value="Fournitures">Fournitures</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Prix unitaire</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="currentStock">Stock actuel</Label>
                <Input
                  id="currentStock"
                  type="number"
                  value={formData.currentStock}
                  onChange={(e) => setFormData({...formData, currentStock: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="minStock">Stock minimum</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="maxStock">Stock maximum</Label>
                <Input
                  id="maxStock"
                  type="number"
                  value={formData.maxStock}
                  onChange={(e) => setFormData({...formData, maxStock: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateArticle}>
              Créer l'article
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Article Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l'article</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'article
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-reference">Référence *</Label>
                <Input
                  id="edit-reference"
                  value={formData.reference}
                  onChange={(e) => setFormData({...formData, reference: e.target.value})}
                  placeholder="Référence unique"
                />
              </div>
              <div>
                <Label htmlFor="edit-name">Nom de l'article *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nom de l'article"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Description de l'article"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category">Catégorie</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Informatique">Informatique</SelectItem>
                    <SelectItem value="Matériaux">Matériaux</SelectItem>
                    <SelectItem value="Logistique">Logistique</SelectItem>
                    <SelectItem value="Fournitures">Fournitures</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-price">Prix unitaire</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-minStock">Stock minimum</Label>
                <Input
                  id="edit-minStock"
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="edit-maxStock">Stock maximum</Label>
                <Input
                  id="edit-maxStock"
                  type="number"
                  value={formData.maxStock}
                  onChange={(e) => setFormData({...formData, maxStock: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="edit-reorderPoint">Point de commande</Label>
                <Input
                  id="edit-reorderPoint"
                  type="number"
                  value={formData.reorderPoint}
                  onChange={(e) => setFormData({...formData, reorderPoint: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditArticle}>
              Enregistrer les modifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l'article</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l'article "{selectedArticle?.name}" ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteArticle}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArticlesPage;