'use client';

import { RefreshCw } from 'lucide-react';

export function LoadingState() {
  return (
    <div className='flex items-center justify-center h-64'>
      <div className='text-center'>
        <RefreshCw className='h-8 w-8 animate-spin mx-auto mb-4 text-blue-600' />
        <p className='text-gray-600'>Loading financial data...</p>
      </div>
    </div>
  );
}
