import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card } from '../common/Card';

interface OperationChartProps {
  data: Array<{
    operation: string;
    count: number;
  }>;
}

export function OperationChart({ data }: OperationChartProps) {
  return (
    <Card title="Operation Statistics" description="File operations performed" glass>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="operation" 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
              color: '#fff'
            }}
            itemStyle={{
              color: '#fff'
            }}
            labelStyle={{
              color: '#fff'
            }}
          />
          <Bar 
            dataKey="count" 
            fill="#8b5cf6"
            animationDuration={800}
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

