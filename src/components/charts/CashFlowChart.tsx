'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CashFlowData } from '@/types/finance';

interface CashFlowChartProps {
  data: CashFlowData[];
}

export default function CashFlowChart({ data }: CashFlowChartProps) {
  return (
    <div className='w-full h-96 bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-100'>
      <h3 className='text-xl font-bold text-gray-800 mb-4 flex items-center'>
        <div className='w-2 h-6 bg-gradient-to-b from-green-500 to-teal-600 rounded-full mr-3'></div>
        Cash Flow Analysis
      </h3>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray='3 3' className='opacity-20' />
          <XAxis
            dataKey='month'
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip
            formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
            labelStyle={{ color: '#374151', fontWeight: 'bold' }}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar
            dataKey='operating'
            fill='url(#operatingGradient)'
            name='Operating'
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey='investing'
            fill='url(#investingGradient)'
            name='Investing'
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey='financing'
            fill='url(#financingGradient)'
            name='Financing'
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey='netCashFlow'
            fill='url(#netCashFlowGradient)'
            name='Net Cash Flow'
            radius={[4, 4, 0, 0]}
          />
          <defs>
            <linearGradient id='operatingGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#10b981' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#059669' stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id='investingGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#ef4444' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#dc2626' stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id='financingGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#1d4ed8' stopOpacity={0.6} />
            </linearGradient>
            <linearGradient
              id='netCashFlowGradient'
              x1='0'
              y1='0'
              x2='0'
              y2='1'
            >
              <stop offset='5%' stopColor='#8b5cf6' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#7c3aed' stopOpacity={0.6} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
