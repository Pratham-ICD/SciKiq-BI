'use client';

import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  onRefresh: () => void;
}

export function DashboardHeader({ onRefresh }: DashboardHeaderProps) {
  return (
    <div className='flex items-center justify-between mb-6'>
      <div className='flex items-center space-x-3'>
        <div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center'>
          <span className='text-2xl'>💼</span>
        </div>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Finance Cockpit – CFO
          </h1>
          <p className='text-gray-600'>
            Comprehensive financial analytics and insights
          </p>
        </div>
      </div>
      <Button onClick={onRefresh} variant='outline' size='sm'>
        <RefreshCw className='h-4 w-4 mr-2' />
        Refresh
      </Button>
    </div>
  );
}
