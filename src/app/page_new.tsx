'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import KPICard from '@/components/KPICard';
import PLChart from '@/components/charts/PLChart';
import WorkingCapitalChart from '@/components/charts/WorkingCapitalChart';
import CashFlowChart from '@/components/charts/CashFlowChart';
import ARAPTable from '@/components/ARAPTable';
import {
  financialData,
  workingCapitalData,
  arData,
  apData,
  kpiData,
  cashFlowData,
} from '@/data/sampleData';

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className='space-y-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6'>
              {kpiData.map((kpi, index) => (
                <KPICard key={index} kpi={kpi} />
              ))}
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              <PLChart data={financialData} />
              <WorkingCapitalChart data={workingCapitalData} />
            </div>
          </div>
        );

      case 'pl':
        return (
          <div className='space-y-8'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='bg-white p-6 rounded-lg shadow-lg'>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                  Total Revenue
                </h3>
                <p className='text-3xl font-bold text-blue-600'>
                  $
                  {financialData
                    .reduce((sum, item) => sum + item.revenue, 0)
                    .toLocaleString()}
                </p>
                <p className='text-sm text-gray-500 mt-1'>YTD Revenue</p>
              </div>
              <div className='bg-white p-6 rounded-lg shadow-lg'>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                  Total Expenses
                </h3>
                <p className='text-3xl font-bold text-red-600'>
                  $
                  {financialData
                    .reduce((sum, item) => sum + item.expenses, 0)
                    .toLocaleString()}
                </p>
                <p className='text-sm text-gray-500 mt-1'>YTD Expenses</p>
              </div>
              <div className='bg-white p-6 rounded-lg shadow-lg'>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                  Net Profit
                </h3>
                <p className='text-3xl font-bold text-green-600'>
                  $
                  {financialData
                    .reduce((sum, item) => sum + item.profit, 0)
                    .toLocaleString()}
                </p>
                <p className='text-sm text-gray-500 mt-1'>YTD Profit</p>
              </div>
            </div>
            <PLChart data={financialData} />
          </div>
        );

      case 'working-capital':
        return (
          <div className='space-y-8'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='bg-white p-6 rounded-lg shadow-lg'>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                  Current Inventory
                </h3>
                <p className='text-3xl font-bold text-purple-600'>
                  $
                  {workingCapitalData[
                    workingCapitalData.length - 1
                  ]?.inventory.toLocaleString()}
                </p>
                <p className='text-sm text-gray-500 mt-1'>Latest Month</p>
              </div>
              <div className='bg-white p-6 rounded-lg shadow-lg'>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                  Current AR
                </h3>
                <p className='text-3xl font-bold text-orange-600'>
                  $
                  {workingCapitalData[
                    workingCapitalData.length - 1
                  ]?.accountsReceivable.toLocaleString()}
                </p>
                <p className='text-sm text-gray-500 mt-1'>Latest Month</p>
              </div>
              <div className='bg-white p-6 rounded-lg shadow-lg'>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                  Current AP
                </h3>
                <p className='text-3xl font-bold text-red-600'>
                  $
                  {workingCapitalData[
                    workingCapitalData.length - 1
                  ]?.accountsPayable.toLocaleString()}
                </p>
                <p className='text-sm text-gray-500 mt-1'>Latest Month</p>
              </div>
            </div>
            <WorkingCapitalChart data={workingCapitalData} />
          </div>
        );

      case 'receivables':
        return (
          <div className='space-y-8'>
            <ARAPTable
              data={arData}
              title='Accounts Receivable Workbench'
              type='receivable'
            />
          </div>
        );

      case 'payables':
        return (
          <div className='space-y-8'>
            <ARAPTable
              data={apData}
              title='Accounts Payable Workbench'
              type='payable'
            />
          </div>
        );

      case 'cash-flow':
        return (
          <div className='space-y-8'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
              <div className='bg-white p-6 rounded-lg shadow-lg'>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                  Operating CF
                </h3>
                <p className='text-3xl font-bold text-green-600'>
                  $
                  {cashFlowData
                    .reduce((sum, item) => sum + item.operating, 0)
                    .toLocaleString()}
                </p>
                <p className='text-sm text-gray-500 mt-1'>YTD Total</p>
              </div>
              <div className='bg-white p-6 rounded-lg shadow-lg'>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                  Investing CF
                </h3>
                <p className='text-3xl font-bold text-red-600'>
                  $
                  {cashFlowData
                    .reduce((sum, item) => sum + item.investing, 0)
                    .toLocaleString()}
                </p>
                <p className='text-sm text-gray-500 mt-1'>YTD Total</p>
              </div>
              <div className='bg-white p-6 rounded-lg shadow-lg'>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                  Financing CF
                </h3>
                <p className='text-3xl font-bold text-blue-600'>
                  $
                  {cashFlowData
                    .reduce((sum, item) => sum + item.financing, 0)
                    .toLocaleString()}
                </p>
                <p className='text-sm text-gray-500 mt-1'>YTD Total</p>
              </div>
              <div className='bg-white p-6 rounded-lg shadow-lg'>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                  Net Cash Flow
                </h3>
                <p className='text-3xl font-bold text-purple-600'>
                  $
                  {cashFlowData
                    .reduce((sum, item) => sum + item.netCashFlow, 0)
                    .toLocaleString()}
                </p>
                <p className='text-sm text-gray-500 mt-1'>YTD Total</p>
              </div>
            </div>
            <CashFlowChart data={cashFlowData} />
          </div>
        );

      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
        {renderContent()}
      </main>
    </div>
  );
}
