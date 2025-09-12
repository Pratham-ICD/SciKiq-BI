'use client';

import { useState, useEffect } from 'react';
import { BarChart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { financeAPI } from '@/lib/api';
import type { BridgeData } from '@/lib/api';

interface PnLBridgeTabProps {
  filters?: {
    countries?: string[];
    channels?: string[];
    statuses?: string[];
    date_start?: string;
    date_end?: string;
  };
}

export function PnLBridgeTab({ filters }: PnLBridgeTabProps) {
  const [bridgeData, setBridgeData] = useState<BridgeData>({
    startValue: 500000,
    priceEffect: 75000,
    volumeEffect: -25000,
    mixEffect: 15000,
    endValue: 565000,
    currency: 'AED',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await financeAPI.getBridgeData(filters);
        setBridgeData(data);
      } catch (error) {
        console.error('Failed to load bridge data:', error);
        // Keep default values as fallback
      }
    };

    fetchData();
  }, [filters]);

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-xl font-semibold'>Price–Volume–Mix Bridge</h3>
        <div className='flex items-center gap-4 text-sm text-gray-600'>
          <span className='text-red-500'>2025-07-01 00:00:00</span>
          <span>→</span>
          <span className='text-blue-500'>2025-08-01 00:00:00</span>
        </div>
      </div>

      <Card>
        <CardContent className='pt-6'>
          <div className='h-96 flex items-center justify-center'>
            {/* Waterfall chart would go here */}
            <div className='text-center'>
              <BarChart className='h-16 w-16 mx-auto text-gray-400 mb-4' />
              <p className='text-gray-600'>
                Price-Volume-Mix Bridge: 2025-07-01 → 2025-08-01
              </p>
              <div className='mt-4 grid grid-cols-5 gap-4 text-sm'>
                <div className='text-center'>
                  <div className='text-lg font-bold text-blue-600'>
                    {bridgeData.currency}{' '}
                    {bridgeData.startValue.toLocaleString()}
                  </div>
                  <div className='text-gray-600'>Start (P1)</div>
                </div>
                <div className='text-center'>
                  <div className='text-lg font-bold text-teal-600'>
                    {bridgeData.currency}{' '}
                    {(
                      bridgeData.startValue + bridgeData.priceEffect
                    ).toLocaleString()}
                  </div>
                  <div className='text-gray-600'>Price</div>
                </div>
                <div className='text-center'>
                  <div className='text-lg font-bold text-teal-600'>
                    {bridgeData.currency}{' '}
                    {(
                      bridgeData.startValue +
                      bridgeData.priceEffect +
                      bridgeData.volumeEffect
                    ).toLocaleString()}
                  </div>
                  <div className='text-gray-600'>Price + Volume</div>
                </div>
                <div className='text-center'>
                  <div className='text-lg font-bold text-teal-600'>
                    {bridgeData.currency} {bridgeData.endValue.toLocaleString()}
                  </div>
                  <div className='text-gray-600'>Price + Volume + Mix</div>
                </div>
                <div className='text-center'>
                  <div className='text-lg font-bold text-green-600'>
                    {bridgeData.currency} {bridgeData.endValue.toLocaleString()}
                  </div>
                  <div className='text-gray-600'>End (P2)</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
