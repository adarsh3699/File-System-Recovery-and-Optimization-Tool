import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card } from '../common/Card';

interface PerformanceChartProps {
  data: Array<{
    time: string;
    read: number;
    write: number;
  }>;
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <Card title="Read/Write Speed" description="Performance over time (MB/s)" glass>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="time" 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            label={{ value: 'MB/s', angle: -90, position: 'insideLeft', style: { fill: '#9ca3af' } }}
          />
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
          <Line 
            type="monotone" 
            dataKey="read" 
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
            animationDuration={800}
            name="Read Speed"
          />
          <Line 
            type="monotone" 
            dataKey="write" 
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
            animationDuration={800}
            name="Write Speed"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

