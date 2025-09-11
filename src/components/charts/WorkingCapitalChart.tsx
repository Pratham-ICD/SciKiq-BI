'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { WorkingCapitalData } from '@/types/finance';

interface WorkingCapitalChartProps {
  data: WorkingCapitalData[];
}

export default function WorkingCapitalChart({
  data,
}: WorkingCapitalChartProps) {
  return (
    <div className='w-full h-96 bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-100'>
      <h3 className='text-xl font-bold text-gray-800 mb-4 flex items-center'>
        <div className='w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full mr-3'></div>
        Working Capital Analysis
      </h3>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
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
          <Line
            type='monotone'
            dataKey='inventory'
            stroke='url(#inventoryGradient)'
            strokeWidth={3}
            name='Inventory'
            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, fill: '#8b5cf6', strokeWidth: 2 }}
          />
          <Line
            type='monotone'
            dataKey='accountsReceivable'
            stroke='url(#arGradient)'
            strokeWidth={3}
            name='Accounts Receivable'
            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, fill: '#f59e0b', strokeWidth: 2 }}
          />
          <Line
            type='monotone'
            dataKey='accountsPayable'
            stroke='url(#apGradient)'
            strokeWidth={3}
            name='Accounts Payable'
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, fill: '#ef4444', strokeWidth: 2 }}
          />
          <Line
            type='monotone'
            dataKey='workingCapital'
            stroke='url(#wcGradient)'
            strokeWidth={4}
            name='Working Capital'
            dot={{ fill: '#10b981', strokeWidth: 3, r: 7 }}
            activeDot={{ r: 9, fill: '#10b981', strokeWidth: 3 }}
          />
          <defs>
            <linearGradient id='inventoryGradient' x1='0' y1='0' x2='1' y2='0'>
              <stop offset='5%' stopColor='#8b5cf6' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#a855f7' stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id='arGradient' x1='0' y1='0' x2='1' y2='0'>
              <stop offset='5%' stopColor='#f59e0b' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#d97706' stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id='apGradient' x1='0' y1='0' x2='1' y2='0'>
              <stop offset='5%' stopColor='#ef4444' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#dc2626' stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id='wcGradient' x1='0' y1='0' x2='1' y2='0'>
              <stop offset='5%' stopColor='#10b981' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#059669' stopOpacity={0.6} />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
