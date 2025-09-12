'use client';

import { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  RefreshCw,
} from 'lucide-react';
import { MetricCard } from '@/components/ui/metric-card';
import { BeautifulBarChart, BeautifulAreaChart } from '@/components/ui/charts';
import { financeAPI, type MonthlyDataItem } from '@/lib/api';
import type { FinanceDashboardResponse } from '@/lib/api';

interface CockpitTabProps {
  dashboardData: FinanceDashboardResponse | null;
  filters?: {
    countries?: string[];
    channels?: string[];
    statuses?: string[];
    date_start?: string;
    date_end?: string;
  };
}

export function CockpitTab({ dashboardData, filters }: CockpitTabProps) {
  const [monthlyData, setMonthlyData] = useState<MonthlyDataItem[]>([]);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const data = await financeAPI.getMonthlyData(filters);
        setMonthlyData(data);
      } catch (error) {
        console.error('Failed to load monthly data:', error);
        // Keep empty array as fallback
      }
    };

    fetchMonthlyData();
  }, [filters]);

  if (!dashboardData) return <div>Loading...</div>;

  return (
    <div className='space-y-6'>
      {/* Key Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
        <MetricCard
          title='Net Revenue (YTD)'
          value={dashboardData.metrics.total_revenue}
          icon={DollarSign}
          iconColor='text-green-600'
          className='border-l-4 border-l-green-500'
        />
        <MetricCard
          title='Gross Margin % (YTD)'
          value='28.7%'
          icon={TrendingUp}
          iconColor='text-blue-600'
          className='border-l-4 border-l-blue-500'
        />
        <MetricCard
          title='EBITDA % (YTD)'
          value='-151.0%'
          icon={TrendingDown}
          iconColor='text-red-600'
          className='border-l-4 border-l-red-500'
        />
        <MetricCard
          title='Net Working Capital'
          value='AED 782,150'
          icon={PiggyBank}
          iconColor='text-purple-600'
          className='border-l-4 border-l-purple-500'
        />
        <MetricCard
          title='Cash Conversion Cycle'
          value='23,331.5 d'
          icon={RefreshCw}
          iconColor='text-orange-600'
          className='border-l-4 border-l-orange-500'
        />
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <BeautifulAreaChart
          title='Revenue & EBITDA (Monthly)'
          description='Monthly performance trends'
          data={monthlyData}
          dataKey='net_revenue'
          secondaryDataKey='ebitda'
          color='#10b981'
          secondaryColor='#3b82f6'
        />

        <BeautifulBarChart
          title='Actual vs Budget – Net Revenue'
          description='Performance against budget'
          data={monthlyData}
          dataKey='net_revenue'
          secondaryDataKey='budget_rev'
          color='#3b82f6'
          secondaryColor='#e5e7eb'
        />
      </div>
    </div>
  );
}
