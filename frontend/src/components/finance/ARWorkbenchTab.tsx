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

interface ARWorkbenchTabProps {
  filters?: {
    countries?: string[];
    channels?: string[];
    statuses?: string[];
    date_start?: string;
    date_end?: string;
  };
}

export function ARWorkbenchTab({ filters }: ARWorkbenchTabProps) {
  const [agingData, setAgingData] = useState<AgingDataItem[]>([]);
  const [arInvoices, setArInvoices] = useState<InvoiceItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aging, invoices] = await Promise.all([
          financeAPI.getAgingData(filters),
          financeAPI.getARInvoices(filters),
        ]);
        setAgingData(aging);
        setArInvoices(invoices);
      } catch (error) {
        console.error('Failed to load AR workbench data:', error);
      }
    };

    fetchData();
  }, [filters]);

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* AR Aging Chart */}
        <BeautifulBarChart
          title='AR Aging (Open Amount)'
          description='Receivables by aging bucket'
          data={agingData}
          dataKey='open_amount'
          color='#3b82f6'
        />

        {/* Top Overdue Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>Top Overdue Invoices</CardTitle>
            <CardDescription>
              Invoices with highest past due amounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {arInvoices.map((invoice, index) => (
                <div
                  key={index}
                  className='flex justify-between items-center p-3 border rounded-lg'
                >
                  <div>
                    <div className='font-medium text-sm'>
                      {invoice.invoice_id}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {invoice.customer_id}
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
