import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp } from 'lucide-react';
import { OrdersTrendData } from '../../types';

interface OrdersTrendChartProps {
  data: OrdersTrendData[];
}

const OrdersTrendChart: React.FC<OrdersTrendChartProps> = ({ data }) => {
  return (
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
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                className="text-gray-600"
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
                  name === 'orders' ? `${value} commandes` : 
                  name === 'amount' ? `${(value / 1000).toFixed(0)}k€` :
                  `${(value / 1000).toFixed(0)}k€`,
                  name === 'orders' ? 'Commandes' : 
                  name === 'amount' ? 'Montant' : 'Budget'
                ]}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorOrders)"
                name="Commandes"
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                name="Montant (€)"
              />
              <Line
                type="monotone"
                dataKey="budget"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                name="Budget (€)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersTrendChart;