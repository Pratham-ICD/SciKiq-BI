/**
 * Beautiful chart components using Recharts
 */
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface BaseChartProps {
  title: string;
  description?: string;
  data: ChartData[];
  className?: string;
}

interface LineChartProps extends BaseChartProps {
  dataKey: string;
  secondaryDataKey?: string;
  color?: string;
  secondaryColor?: string;
}

interface BarChartProps extends BaseChartProps {
  dataKey: string;
  secondaryDataKey?: string;
  color?: string;
  secondaryColor?: string;
}

interface PieChartProps extends BaseChartProps {
  dataKey: string;
  colors?: string[];
}

const CHART_COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
];

// Custom tooltip for better UX
interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-white p-4 border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700'>
        <p className='font-medium text-gray-900 dark:text-gray-100'>{label}</p>
        {payload.map((entry: TooltipPayload, index: number) => (
          <p key={index} className='text-sm' style={{ color: entry.color }}>
            {`${entry.name}: ${
              typeof entry.value === 'number'
                ? entry.value.toLocaleString()
                : entry.value
            }`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function BeautifulLineChart({
  title,
  description,
  data,
  dataKey,
  secondaryDataKey,
  color = '#3b82f6',
  secondaryColor = '#10b981',
  className,
}: LineChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='text-lg font-semibold'>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' className='opacity-30' />
            <XAxis dataKey='name' className='text-xs' tick={{ fontSize: 12 }} />
            <YAxis
              className='text-xs'
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type='monotone'
              dataKey={dataKey}
              stroke={color}
              strokeWidth={3}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
            />
            {secondaryDataKey && (
              <Line
                type='monotone'
                dataKey={secondaryDataKey}
                stroke={secondaryColor}
                strokeWidth={3}
                dot={{ fill: secondaryColor, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: secondaryColor, strokeWidth: 2 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function BeautifulBarChart({
  title,
  description,
  data,
  dataKey,
  secondaryDataKey,
  color = '#3b82f6',
  secondaryColor = '#10b981',
  className,
}: BarChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='text-lg font-semibold'>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' className='opacity-30' />
            <XAxis dataKey='name' className='text-xs' tick={{ fontSize: 12 }} />
            <YAxis
              className='text-xs'
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            {secondaryDataKey && (
              <Bar
                dataKey={secondaryDataKey}
                fill={secondaryColor}
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function BeautifulAreaChart({
  title,
  description,
  data,
  dataKey,
  secondaryDataKey,
  color = '#3b82f6',
  secondaryColor = '#10b981',
  className,
}: LineChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='text-lg font-semibold'>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <AreaChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' className='opacity-30' />
            <XAxis dataKey='name' className='text-xs' tick={{ fontSize: 12 }} />
            <YAxis
              className='text-xs'
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type='monotone'
              dataKey={dataKey}
              stroke={color}
              fill={color}
              fillOpacity={0.6}
            />
            {secondaryDataKey && (
              <Area
                type='monotone'
                dataKey={secondaryDataKey}
                stroke={secondaryColor}
                fill={secondaryColor}
                fillOpacity={0.4}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function BeautifulPieChart({
  title,
  description,
  data,
  dataKey,
  colors = CHART_COLORS,
  className,
}: PieChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='text-lg font-semibold'>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <PieChart>
            <Pie
              data={data}
              cx='50%'
              cy='50%'
              labelLine={false}
              label={({ name, percent }: { name: string; percent?: number }) =>
                `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
              }
              outerRadius={80}
              fill='#8884d8'
              dataKey={dataKey}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
