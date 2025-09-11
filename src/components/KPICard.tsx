'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { KPIData } from '@/types/finance';

interface KPICardProps {
  kpi: KPIData;
}

export default function KPICard({ kpi }: KPICardProps) {
  const getTrendIcon = () => {
    switch (kpi.trend) {
      case 'up':
        return <TrendingUp className='w-5 h-5 text-green-500' />;
      case 'down':
        return <TrendingDown className='w-5 h-5 text-red-500' />;
      default:
        return <Minus className='w-5 h-5 text-gray-500' />;
    }
  };

  const getPerformanceColor = () => {
    if (kpi.percentage >= 100) return 'text-green-600';
    if (kpi.percentage >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradientBackground = () => {
    if (kpi.percentage >= 100)
      return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200';
    if (kpi.percentage >= 90)
      return 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200';
    return 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200';
  };

  return (
    <div
      className={`${getGradientBackground()} p-6 rounded-xl shadow-lg border-2 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
    >
      <div className='flex items-center justify-between mb-3'>
        <h3 className='text-sm font-semibold text-gray-700 uppercase tracking-wide'>
          {kpi.name}
        </h3>
        <div className='p-2 rounded-lg bg-white shadow-sm'>
          {getTrendIcon()}
        </div>
      </div>

      <div className='flex items-baseline space-x-2 mb-3'>
        <span className='text-3xl font-bold text-gray-900'>
          {kpi.value.toLocaleString()}
        </span>
        <span className='text-sm font-medium text-gray-600'>{kpi.unit}</span>
      </div>

      <div className='flex items-center justify-between text-sm mb-3'>
        <div className='flex items-center space-x-1'>
          <span className='text-gray-500'>Target:</span>
          <span className='font-semibold text-gray-700'>
            {kpi.target.toLocaleString()}
            {kpi.unit}
          </span>
        </div>
        <div className={`font-bold text-lg ${getPerformanceColor()}`}>
          {kpi.percentage.toFixed(1)}%
        </div>
      </div>

      <div className='w-full bg-gray-200 rounded-full h-3 overflow-hidden'>
        <div
          className={`h-3 rounded-full transition-all duration-500 ease-out ${
            kpi.percentage >= 100
              ? 'bg-gradient-to-r from-green-400 to-green-600'
              : kpi.percentage >= 90
              ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
              : 'bg-gradient-to-r from-red-400 to-red-600'
          } shadow-sm`}
          style={{ width: `${Math.min(kpi.percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
