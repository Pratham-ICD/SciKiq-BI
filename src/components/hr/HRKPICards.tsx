'use client';

import {
  Users,
  UserPlus,
  UserMinus,
  AlertTriangle,
  Clock,
  DollarSign,
} from 'lucide-react';
import { HRMetrics } from '../../types/hr';

interface HRKPICardsProps {
  metrics: HRMetrics;
}

export default function HRKPICards({ metrics }: HRKPICardsProps) {
  const formatAED = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const kpiData = [
    {
      title: 'Headcount',
      value: metrics.headcount.toLocaleString(),
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      description: 'Active employees',
    },
    {
      title: 'Hires (30d)',
      value: metrics.hires_30d.toLocaleString(),
      icon: UserPlus,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      description: 'New joiners this month',
    },
    {
      title: 'Terms (30d)',
      value: metrics.terms_30d.toLocaleString(),
      icon: UserMinus,
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-red-100',
      description: 'Departures this month',
    },
    {
      title: 'Attrition Rate',
      value: `${metrics.attrition_rate}%`,
      icon: AlertTriangle,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      description: 'Annualized rate',
    },
    {
      title: 'Avg Tenure',
      value: `${metrics.avg_tenure} yrs`,
      icon: Clock,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      description: 'Employee average',
    },
    {
      title: 'Total Payroll',
      value: formatAED(metrics.total_payroll),
      icon: DollarSign,
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100',
      description: 'Monthly total',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6'>
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <div
            key={index}
            className={`relative overflow-hidden rounded-xl p-6 bg-gradient-to-br ${kpi.bgGradient} border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105`}
          >
            {/* Background decoration */}
            <div className='absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 rounded-full bg-white opacity-10'></div>

            {/* Icon */}
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${kpi.gradient} text-white mb-4 shadow-lg`}
            >
              <Icon className='w-6 h-6' />
            </div>

            {/* Content */}
            <div className='relative'>
              <p className='text-sm font-medium text-gray-600 mb-1'>
                {kpi.title}
              </p>
              <p className='text-2xl font-bold text-gray-900 mb-1'>
                {kpi.value}
              </p>
              <p className='text-xs text-gray-500'>{kpi.description}</p>
            </div>

            {/* Trend indicator (placeholder for future enhancement) */}
            <div className='absolute bottom-2 right-2'>
              <div className='w-2 h-2 rounded-full bg-gray-300 opacity-50'></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Additional diversity metric card
export function DiversityMetricCard({
  femalePercentage,
}: {
  femalePercentage: number;
}) {
  return (
    <div className='bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-xl p-4 shadow-sm'>
      <div className='flex items-center space-x-3'>
        <div className='flex-shrink-0'>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center text-white'>
            <Users className='w-5 h-5' />
          </div>
        </div>
        <div>
          <p className='text-sm font-medium text-gray-600'>Gender Diversity</p>
          <p className='text-xl font-bold text-gray-900'>{femalePercentage}%</p>
          <p className='text-xs text-gray-500'>Female employees</p>
        </div>
      </div>
    </div>
  );
}
