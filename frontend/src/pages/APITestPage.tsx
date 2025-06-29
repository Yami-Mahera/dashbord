import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle, XCircle, Clock, Wifi, WifiOff } from 'lucide-react';

const APITestPage: React.FC = () => {
  const [apiStatus, setApiStatus] = useState({
    basic: { status: 'idle', data: null, error: null },
    dashboard: { status: 'idle', data: null, error: null },
    kpis: { status: 'idle', data: null, error: null }
  });

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  const testAPI = async (endpoint: string, key: string) => {
    setApiStatus(prev => ({
      ...prev,
      [key]: { status: 'loading', data: null, error: null }
    }));

    try {
      const response = await fetch(`${BACKEND_URL}/api${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setApiStatus(prev => ({
        ...prev,
        [key]: { status: 'success', data, error: null }
      }));
    } catch (error) {
      setApiStatus(prev => ({
        ...prev,
        [key]: { status: 'error', data: null, error: error.message }
      }));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'loading':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Wifi className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'loading':
        return <Badge variant="secondary">En cours...</Badge>;
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Succès</Badge>;
      case 'error':
        return <Badge variant="destructive">Erreur</Badge>;
      default:
        return <Badge variant="outline">Non testé</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Test de Communication API</h1>
          <p className="text-gray-600">Vérification de la connexion entre le frontend et le backend</p>
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-sm">
              <strong>URL Backend configurée:</strong> <code className="bg-white px-2 py-1 rounded">{BACKEND_URL}</code>
            </p>
          </div>
        </div>

        {/* Tests API */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Test API de base */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(apiStatus.basic.status)}
                API de Base
              </CardTitle>
              <CardDescription>Test de l'endpoint /api/</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {getStatusBadge(apiStatus.basic.status)}
              <Button 
                onClick={() => testAPI('/', 'basic')}
                disabled={apiStatus.basic.status === 'loading'}
                className="w-full"
              >
                Tester /api/
              </Button>
              {apiStatus.basic.error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{apiStatus.basic.error}</AlertDescription>
                </Alert>
              )}
              {apiStatus.basic.data && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <code className="text-sm text-green-800">
                    {JSON.stringify(apiStatus.basic.data, null, 2)}
                  </code>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Dashboard */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(apiStatus.dashboard.status)}
                Dashboard
              </CardTitle>
              <CardDescription>Test des données du dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {getStatusBadge(apiStatus.dashboard.status)}
              <Button 
                onClick={() => testAPI('/dashboard/data', 'dashboard')}
                disabled={apiStatus.dashboard.status === 'loading'}
                className="w-full"
              >
                Tester Dashboard
              </Button>
              {apiStatus.dashboard.error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{apiStatus.dashboard.error}</AlertDescription>
                </Alert>
              )}
              {apiStatus.dashboard.data && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-800">
                    <p><strong>KPIs:</strong> {apiStatus.dashboard.data.kpis ? 'Présents' : 'Manquants'}</p>
                    <p><strong>Graphiques:</strong> {apiStatus.dashboard.data.charts ? 'Présents' : 'Manquants'}</p>
                    <p><strong>Activités:</strong> {apiStatus.dashboard.data.recentActivities?.length || 0}</p>
                    <p><strong>Alertes:</strong> {apiStatus.dashboard.data.criticalAlerts?.length || 0}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test KPIs */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(apiStatus.kpis.status)}
                Indicateurs
              </CardTitle>
              <CardDescription>Test des KPIs du dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {getStatusBadge(apiStatus.kpis.status)}
              <Button 
                onClick={() => testAPI('/dashboard/kpis', 'kpis')}
                disabled={apiStatus.kpis.status === 'loading'}
                className="w-full"
              >
                Tester KPIs
              </Button>
              {apiStatus.kpis.error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{apiStatus.kpis.error}</AlertDescription>
                </Alert>
              )}
              {apiStatus.kpis.data && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-800 space-y-1">
                    <p><strong>Commandes:</strong> {apiStatus.kpis.data.totalOrders}</p>
                    <p><strong>Fournisseurs:</strong> {apiStatus.kpis.data.totalSuppliers}</p>
                    <p><strong>Stock faible:</strong> {apiStatus.kpis.data.lowStockItems}</p>
                    <p><strong>Niveau service:</strong> {apiStatus.kpis.data.serviceLevel}%</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Test automatique */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Test Automatique</CardTitle>
            <CardDescription>Lance tous les tests en séquence</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => {
                testAPI('/', 'basic');
                setTimeout(() => testAPI('/dashboard/data', 'dashboard'), 1000);
                setTimeout(() => testAPI('/dashboard/kpis', 'kpis'), 2000);
              }}
              className="w-full"
              size="lg"
            >
              Lancer tous les tests
            </Button>
          </CardContent>
        </Card>

        {/* Status général */}
        <Card className="shadow-lg border-l-4 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {Object.values(apiStatus).every(test => test.status === 'success') ? 
                <CheckCircle className="w-5 h-5 text-green-500" /> :
                Object.values(apiStatus).some(test => test.status === 'error') ?
                <XCircle className="w-5 h-5 text-red-500" /> :
                <WifiOff className="w-5 h-5 text-gray-400" />
              }
              Status de la Communication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>• <strong>Configuration réseau:</strong> 
                {BACKEND_URL.includes('localhost') ? 
                  <Badge className="ml-2 bg-blue-100 text-blue-800">Local</Badge> : 
                  <Badge className="ml-2 bg-purple-100 text-purple-800">Distant</Badge>
                }
              </p>
              <p>• <strong>CORS configuré:</strong> <Badge className="ml-2 bg-green-100 text-green-800">Oui</Badge></p>
              <p>• <strong>API préfixe:</strong> <Badge className="ml-2 bg-gray-100 text-gray-800">/api</Badge></p>
              {Object.values(apiStatus).every(test => test.status === 'success') && (
                <Alert className="mt-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    ✅ Tous les tests réussis ! La communication frontend-backend fonctionne parfaitement.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default APITestPage;