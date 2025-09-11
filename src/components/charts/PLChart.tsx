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
import { FinancialData } from '@/types/finance';

interface PLChartProps {
  data: FinancialData[];
}

export default function PLChart({ data }: PLChartProps) {
  if (data.length === 0) {
    return (
      <div className='w-full h-96 bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-100'>
        <h3 className='text-xl font-bold text-gray-800 mb-4 flex items-center'>
          <div className='w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3'></div>
          Profit & Loss Analysis
        </h3>
        <div className='flex items-center justify-center h-full'>
          <div className='text-center'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <div className='w-8 h-8 bg-gray-300 rounded-full'></div>
            </div>
            <h4 className='text-lg font-semibold text-gray-600 mb-2'>
              No Data Available
            </h4>
            <p className='text-gray-500 text-sm'>
              Adjust your filters to see P&L data
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full h-96 bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-100'>
      <h3 className='text-xl font-bold text-gray-800 mb-4 flex items-center'>
        <div className='w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3'></div>
        Profit & Loss Analysis
      </h3>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray='3 3' className='opacity-20' />
          <XAxis
            dataKey='date'
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
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
            dataKey='revenue'
            fill='url(#revenueGradient)'
            name='Revenue'
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey='expenses'
            fill='url(#expensesGradient)'
            name='Expenses'
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey='profit'
            fill='url(#profitGradient)'
            name='Profit'
            radius={[4, 4, 0, 0]}
          />
          <defs>
            <linearGradient id='revenueGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#1d4ed8' stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id='expensesGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#ef4444' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#dc2626' stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id='profitGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#10b981' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#059669' stopOpacity={0.6} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
