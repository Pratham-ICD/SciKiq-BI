'use client';

import { useState, useEffect } from 'react';
import { Clock, CreditCard, Package, Banknote } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { MetricCard } from '@/components/ui/metric-card';
import { BeautifulBarChart, BeautifulAreaChart } from '@/components/ui/charts';
import {
  financeAPI,
  type CashFlowDataItem,
  type WorkingCapitalMetrics,
} from '@/lib/api';

interface WorkingCapitalTabProps {
  trailingDays: number;
  setTrailingDays: (value: number) => void;
  startingCash: number;
  setStartingCash: (value: number) => void;
  filters?: {
    countries?: string[];
    channels?: string[];
    statuses?: string[];
    date_start?: string;
    date_end?: string;
  };
}

export function WorkingCapitalTab({
  trailingDays,
  setTrailingDays,
  startingCash,
  setStartingCash,
  filters,
}: WorkingCapitalTabProps) {
  const [cashFlowData, setCashFlowData] = useState<CashFlowDataItem[]>([]);
  const [workingCapitalMetrics, setWorkingCapitalMetrics] =
    useState<WorkingCapitalMetrics>({
      dso: 48513.8,
      dpo: 52368.9,
      dio: 29176.6,
      ccc: 25321.6,
      netWorkingCapital: 782150,
      accountsReceivable: 1201704,
      inventory: 527813,
      accountsPayable: 947367,
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cashFlow, metrics] = await Promise.all([
          financeAPI.getCashFlowData(filters),
          financeAPI.getWorkingCapitalMetrics(filters),
        ]);
        setCashFlowData(cashFlow);
        setWorkingCapitalMetrics(metrics);
      } catch (error) {
        console.error('Failed to load working capital data:', error);
        // Keep default values as fallback
      }
    };

    fetchData();
  }, [filters]);

  return (
    <div className='space-y-6'>
      {/* Controls */}
      <div className='flex items-center gap-6'>
        <div className='flex items-center gap-4'>
          <Label className='text-sm font-medium'>
            Trailing window for DSO/DPO/DIO (days)
          </Label>
          <div className='w-48'>
            <Slider
              value={[trailingDays]}
              onValueChange={(value) => setTrailingDays(value[0])}
              min={30}
              max={180}
              step={15}
            />
          </div>
          <span className='text-sm font-medium w-8'>{trailingDays}</span>
        </div>
      </div>

      {/* DSO/DPO/DIO Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <MetricCard
          title='Days Sales Outstanding (DSO)'
          value={`${workingCapitalMetrics.dso.toLocaleString()} d`}
          icon={Clock}
        />
        <MetricCard
          title='Days Payable Outstanding (DPO)'
          value={`${workingCapitalMetrics.dpo.toLocaleString()} d`}
          icon={CreditCard}
        />
        <MetricCard
          title='Days Inventory Outstanding (DIO)'
          value={`${workingCapitalMetrics.dio.toLocaleString()} d`}
          icon={Package}
        />
        <MetricCard
          title='Cash Conversion Cycle (CCC)'
          value={`${workingCapitalMetrics.ccc.toLocaleString()} d`}
          icon={Banknote}
        />
      </div>

      <p className='text-sm text-gray-600'>
        Net Working Capital:{' '}
        <strong>
          AED {workingCapitalMetrics.netWorkingCapital.toLocaleString()}
        </strong>{' '}
        (AR AED {workingCapitalMetrics.accountsReceivable.toLocaleString()} +
        Inventory AED {workingCapitalMetrics.inventory.toLocaleString()} − AP
        AED {workingCapitalMetrics.accountsPayable.toLocaleString()})
      </p>

      {/* Starting Cash Input */}
      <div className='flex items-center gap-4'>
        <Label className='text-sm font-medium'>Starting cash (AED)</Label>
        <Input
          type='number'
          value={startingCash}
          onChange={(e) => setStartingCash(Number(e.target.value))}
          className='w-32'
          step={1000}
        />
      </div>

      {/* Cash Flow Chart */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <BeautifulBarChart
          title='13-Week Cash Flow Plan'
          description='Projected receipts, payments, and net cash flow'
          data={cashFlowData}
          dataKey='receipts'
          secondaryDataKey='payments'
          color='#10b981'
          secondaryColor='#ef4444'
        />

        <BeautifulAreaChart
          title='Projected Cash Balance'
          description='Cash position over 13 weeks'
          data={cashFlowData}
          dataKey='cash'
          color='#3b82f6'
        />
      </div>
    </div>
  );
}
