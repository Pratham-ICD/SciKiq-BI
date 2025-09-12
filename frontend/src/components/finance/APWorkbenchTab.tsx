'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BeautifulBarChart } from '@/components/ui/charts';
import { financeAPI } from '@/lib/api';
import type { AgingDataItem, InvoiceItem } from '@/lib/api';

interface APWorkbenchTabProps {
  filters?: {
    countries?: string[];
    channels?: string[];
    statuses?: string[];
    date_start?: string;
    date_end?: string;
  };
}

export function APWorkbenchTab({ filters }: APWorkbenchTabProps) {
  const [agingData, setAgingData] = useState<AgingDataItem[]>([]);
  const [apInvoices, setApInvoices] = useState<InvoiceItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aging, invoices] = await Promise.all([
          financeAPI.getAgingData(filters),
          financeAPI.getAPInvoices(filters),
        ]);
        setAgingData(aging);
        setApInvoices(invoices);
      } catch (error) {
        console.error('Failed to load AP workbench data:', error);
      }
    };

    fetchData();
  }, [filters]);

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* AP Aging Chart */}
        <BeautifulBarChart
          title='AP Aging (Open Amount)'
          description='Payables by aging bucket'
          data={agingData}
          dataKey='open_amount'
          color='#ef4444'
        />

        {/* Top Overdue Bills Table */}
        <Card>
          <CardHeader>
            <CardTitle>Top Overdue Bills</CardTitle>
            <CardDescription>
              Bills with highest past due amounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {apInvoices.map((invoice, index) => (
                <div
                  key={index}
                  className='flex justify-between items-center p-3 border rounded-lg'
                >
                  <div>
                    <div className='font-medium text-sm'>
                      {invoice.invoice_id}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {invoice.vendor_id}
                    </div>
                    <div className='text-xs text-gray-500'>
                      Due: {invoice.due_date}
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='font-bold text-red-600'>
                      {invoice.currency} {invoice.open_amount.toLocaleString()}
                    </div>
                    <div className='text-xs text-red-500'>
                      {invoice.days_past_due} days overdue
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
