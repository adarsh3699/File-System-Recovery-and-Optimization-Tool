import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../common/Card';

interface SpaceChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const COLORS = {
  free: '#10b981',
  used: '#3b82f6',
  metadata: '#f59e0b',
  bad: '#ef4444',
  cached: '#8b5cf6',
};

export function SpaceChart({ data }: SpaceChartProps) {
  return (
    <Card title="Disk Space Distribution" description="Current allocation breakdown" glass>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(1)}%`}
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS] || '#6b7280'} 
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
              color: '#fff'
            }}
          />
          <Legend 
            wrapperStyle={{ color: '#9ca3af' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

