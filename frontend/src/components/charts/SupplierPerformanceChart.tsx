import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Users } from 'lucide-react';
import { SupplierPerformanceData } from '../../types';

interface SupplierPerformanceChartProps {
  data: SupplierPerformanceData[];
}

const SupplierPerformanceChart: React.FC<SupplierPerformanceChartProps> = ({ data }) => {
  // Limiter à 8 fournisseurs pour une meilleure lisibilité
  const limitedData = data.slice(0, 8).map(supplier => ({
    ...supplier,
    name: supplier.name.length > 15 ? supplier.name.substring(0, 15) + '...' : supplier.name
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Performance fournisseurs
        </CardTitle>
        <CardDescription>
          Évaluation des fournisseurs principaux
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
                  `${value.toFixed(1)}%`,
                  name === 'onTimeDelivery' ? 'Livraison à temps' :
                  name === 'qualityScore' ? 'Score qualité' :
                  'Efficacité coût'
                ]}
              />
              <Legend />
              <Bar
                dataKey="onTimeDelivery"
                fill="#3b82f6"
                name="Livraison à temps (%)"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="qualityScore"
                fill="#10b981"
                name="Score qualité (%)"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="costEfficiency"
                fill="#f59e0b"
                name="Efficacité coût (%)"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierPerformanceChart;