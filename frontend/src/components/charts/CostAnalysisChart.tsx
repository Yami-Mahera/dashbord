import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { DollarSign } from 'lucide-react';
import { CostAnalysisData } from '../../types';

interface CostAnalysisChartProps {
  data: CostAnalysisData[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const CostAnalysisChart: React.FC<CostAnalysisChartProps> = ({ data }) => {
  const pieData = data.map((item, index) => ({
    name: item.category,
    value: item.spent,
    budget: item.budget,
    forecast: item.forecast,
    fill: COLORS[index % COLORS.length]
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Répartition des coûts
        </CardTitle>
        <CardDescription>
          Dépenses par catégorie vs budget
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number, name: string, props: any) => [
                  [
                    `${(value / 1000).toFixed(0)}k€ dépensé`,
                    `${(props.payload.budget / 1000).toFixed(0)}k€ budget`,
                    `${(props.payload.forecast / 1000).toFixed(0)}k€ prévision`
                  ],
                  props.payload.name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Légende détaillée */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          {data.map((item, index) => (
            <div key={item.category} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.category}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{(item.spent / 1000).toFixed(0)}k€</span>
                  <span>/</span>
                  <span>{(item.budget / 1000).toFixed(0)}k€</span>
                  <span 
                    className={`ml-1 ${
                      item.spent <= item.budget ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    ({((item.spent / item.budget) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CostAnalysisChart;