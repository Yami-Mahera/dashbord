import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Users, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  DollarSign,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { fetchDashboardData } from '../store/slices/dashboardSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { kpis, charts, recentActivities, criticalAlerts, topSuppliers, isLoading } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const kpiCards = [
    {
      title: 'Commandes Totales',
      value: kpis.totalOrders,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      trend: { value: 12, isUp: true },
      description: 'Total des commandes'
    },
    {
      title: 'En Attente',
      value: kpis.pendingOrders,
      icon: Clock,
      color: 'bg-yellow-500',
      trend: { value: 8, isUp: false },
      description: 'Commandes en attente'
    },
    {
      title: 'Fournisseurs Actifs',
      value: kpis.totalSuppliers,
      icon: Users,
      color: 'bg-green-500',
      trend: { value: 5, isUp: true },
      description: 'Fournisseurs actifs'
    },
    {
      title: 'Alertes Stock',
      value: kpis.lowStockItems,
      icon: AlertTriangle,
      color: 'bg-red-500',
      trend: { value: 15, isUp: false },
      description: 'Articles en stock faible'
    },
    {
      title: 'Délai Moyen',
      value: `${kpis.averageDeliveryTime} j`,
      icon: Calendar,
      color: 'bg-purple-500',
      trend: { value: 2, isUp: false },
      description: 'Délai de livraison moyen'
    },
    {
      title: 'Taux de Service',
      value: `${kpis.serviceLevel}%`,
      icon: CheckCircle,
      color: 'bg-indigo-500',
      trend: { value: 3, isUp: true },
      description: 'Niveau de service'
    },
    {
      title: 'Économies',
      value: `${(kpis.costSavings / 1000).toFixed(0)}k€`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      trend: { value: 18, isUp: true },
      description: 'Économies réalisées'
    },
    {
      title: 'Livraisons',
      value: `${kpis.onTimeDelivery}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      trend: { value: 4, isUp: true },
      description: 'Livraisons à temps'
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'order_created': return <ShoppingCart className="w-4 h-4" />;
      case 'order_approved': return <CheckCircle className="w-4 h-4" />;
      case 'stock_alert': return <AlertTriangle className="w-4 h-4" />;
      case 'delivery_completed': return <Package className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'order_created': return 'text-blue-600 bg-blue-100';
      case 'order_approved': return 'text-green-600 bg-green-100';
      case 'stock_alert': return 'text-red-600 bg-red-100';
      case 'delivery_completed': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'il y a moins d\'1h';
    if (diffInHours < 24) return `il y a ${diffInHours}h`;
    return `il y a ${Math.floor(diffInHours / 24)}j`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
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
            <h1 className="text-3xl font-bold text-gray-900">
              {getGreeting()}, {user?.firstName} !
            </h1>
            <p className="text-gray-600 mt-1">
              Voici un aperçu de vos approvisionnements aujourd'hui
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              Rapport
            </Button>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {kpi.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${kpi.color}`}>
                  <kpi.icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                <div className="flex items-center mt-2">
                  {kpi.trend.isUp ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${kpi.trend.isUp ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.trend.value}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{kpi.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Évolution des commandes
              </CardTitle>
              <CardDescription>
                Commandes et montants des 6 derniers mois
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Graphique des tendances</p>
                  <p className="text-sm">Intégration avec une bibliothèque de graphiques</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Critical Alerts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                Alertes critiques
              </CardTitle>
              <CardDescription>
                Alertes nécessitant une attention immédiate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {criticalAlerts.length > 0 ? (
                  criticalAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-red-900">{alert.title}</p>
                        <p className="text-xs text-red-700 mt-1">{alert.message}</p>
                        <p className="text-xs text-red-600 mt-1">{formatTimeAgo(alert.createdAt)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucune alerte critique</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Activités récentes
              </CardTitle>
              <CardDescription>
                Dernières actions dans le système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.message}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</span>
                        {activity.user && (
                          <>
                            <span className="text-xs text-gray-400 mx-1">•</span>
                            <span className="text-xs text-gray-500">{activity.user.name}</span>
                          </>
                        )}
                        <Badge className={`ml-2 text-xs ${getPriorityColor(activity.priority)}`}>
                          {activity.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Suppliers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Top fournisseurs
              </CardTitle>
              <CardDescription>
                Fournisseurs les plus performants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSuppliers.map((supplier, index) => (
                  <div key={supplier.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{supplier.name}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex-1">
                          <Progress value={supplier.performanceScore} className="h-2" />
                        </div>
                        <span className="text-xs text-gray-500 ml-2">{supplier.performanceScore}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{supplier.orders}</p>
                      <p className="text-xs text-gray-500">commandes</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;