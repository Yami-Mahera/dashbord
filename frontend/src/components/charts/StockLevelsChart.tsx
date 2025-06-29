import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Package, AlertTriangle } from 'lucide-react';
import { StockLevelData } from '../../types';

interface StockLevelsChartProps {
  data: StockLevelData[];
}

const StockLevelsChart: React.FC<StockLevelsChartProps> = ({ data }) => {
  // Limiter aux 10 premiers articles pour la lisibilité
  const limitedData = data.slice(0, 10).map(item => ({
    ...item,
    name: item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name
  }));

  const getBarColor = (status: string) => {
    switch (status) {
      case 'critical': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'good': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="w-5 h-5 mr-2" />
          Niveaux de stock
        </CardTitle>
        <CardDescription>
          Stock actuel vs min/max par article
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={limitedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                className="text-gray-600"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-gray-600"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number, name: string) => [
                  `${value} unités`,
                  name === 'current' ? 'Stock actuel' :
                  name === 'min' ? 'Stock minimum' :
                  name === 'max' ? 'Stock maximum' :
                  'Stock optimal'
                ]}
              />
              
              {/* Barres pour stock min, optimal, max */}
              <Bar 
                dataKey="max" 
                fill="#e5e7eb" 
                name="Stock maximum"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="optimal" 
                fill="#d1d5db" 
                name="Stock optimal"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="min" 
                fill="#9ca3af" 
                name="Stock minimum"
                radius={[2, 2, 0, 0]}
              />
              
              {/* Barre pour stock actuel avec couleur dynamique */}
              <Bar 
                dataKey="current" 
                name="Stock actuel"
                radius={[2, 2, 0, 0]}
              >
                {limitedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Légende des statuts */}
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm text-gray-600">Critique</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm text-gray-600">Attention</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-600">Bon</span>
          </div>
        </div>
        
        {/* Alertes critiques */}
        {limitedData.some(item => item.status === 'critical') && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-sm font-medium text-red-900">
                {limitedData.filter(item => item.status === 'critical').length} article(s) en stock critique
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockLevelsChart;