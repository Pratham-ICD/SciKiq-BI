'use client';

import {
  BarChart3,
  TrendingUp,
  PiggyBank,
  CreditCard,
  Users,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CockpitTab } from './CockpitTab';
import { PnLBridgeTab } from './PnLBridgeTab';
import { WorkingCapitalTab } from './WorkingCapitalTab';
import { ARWorkbenchTab } from './ARWorkbenchTab';
import { APWorkbenchTab } from './APWorkbenchTab';
import type { FinanceDashboardResponse } from '@/lib/api';

interface DashboardTabsProps {
  dashboardData: FinanceDashboardResponse | null;
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

export function DashboardTabs({
  dashboardData,
  trailingDays,
  setTrailingDays,
  startingCash,
  setStartingCash,
  filters,
}: DashboardTabsProps) {
  return (
    <Tabs defaultValue='cockpit' className='space-y-6'>
      <TabsList className='grid w-full grid-cols-5'>
        <TabsTrigger value='cockpit' className='flex items-center gap-2'>
          <BarChart3 className='h-4 w-4' />
          Cockpit
        </TabsTrigger>
        <TabsTrigger value='pnl-bridge' className='flex items-center gap-2'>
          <TrendingUp className='h-4 w-4' />
          P&L Bridge
        </TabsTrigger>
        <TabsTrigger
          value='working-capital'
          className='flex items-center gap-2'
        >
          <PiggyBank className='h-4 w-4' />
          Working Capital
        </TabsTrigger>
        <TabsTrigger value='ar-workbench' className='flex items-center gap-2'>
          <CreditCard className='h-4 w-4' />
          AR Workbench
        </TabsTrigger>
        <TabsTrigger value='ap-workbench' className='flex items-center gap-2'>
          <Users className='h-4 w-4' />
          AP Workbench
        </TabsTrigger>
      </TabsList>

      {/* Cockpit Tab */}
      <TabsContent value='cockpit' className='space-y-6'>
        <CockpitTab dashboardData={dashboardData} filters={filters} />
      </TabsContent>

      {/* P&L Bridge Tab */}
      <TabsContent value='pnl-bridge' className='space-y-6'>
        <PnLBridgeTab filters={filters} />
      </TabsContent>

      {/* Working Capital Tab */}
      <TabsContent value='working-capital' className='space-y-6'>
        <WorkingCapitalTab
          trailingDays={trailingDays}
          setTrailingDays={setTrailingDays}
          startingCash={startingCash}
          setStartingCash={setStartingCash}
          filters={filters}
        />
      </TabsContent>

      {/* AR Workbench Tab */}
      <TabsContent value='ar-workbench' className='space-y-6'>
        <ARWorkbenchTab filters={filters} />
      </TabsContent>

      {/* AP Workbench Tab */}
      <TabsContent value='ap-workbench' className='space-y-6'>
        <APWorkbenchTab filters={filters} />
      </TabsContent>
    </Tabs>
  );
}
