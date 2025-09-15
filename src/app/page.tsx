'use client';

import { useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import FilterPanel from '@/components/FilterPanel';
import TableFilters from '@/components/TableFilters';
import DataSummary from '@/components/DataSummary';
import KPICard from '@/components/KPICard';
import PLChart from '@/components/charts/PLChart';
import WorkingCapitalChart from '@/components/charts/WorkingCapitalChart';
import CashFlowChart from '@/components/charts/CashFlowChart';
import ARAPTable from '@/components/ARAPTable';

// HR Components
import HRFilterPanel from '@/components/hr/HRFilterPanel';
import HRKPICards from '@/components/hr/HRKPICards';
import PeopleOverviewCharts from '@/components/hr/PeopleOverviewCharts';
import AttritionRiskTable from '@/components/hr/AttritionRiskTable';
import RecruitingPipeline from '@/components/hr/RecruitingPipeline';
import EngagementPerformance from '@/components/hr/EngagementPerformance';
import CompensationEquity from '@/components/hr/CompensationEquity';
import AbsenceManagement from '@/components/hr/AbsenceManagement';

import {
  financialData,
  workingCapitalData,
  arData,
  apData,
  cashFlowData,
} from '@/data/sampleData';

// HR Data
import { hrSampleData, hrFilterOptions } from '@/data/hrSampleData';

import {
  filterFinancialData,
  filterWorkingCapitalData,
  filterCashFlowData,
  filterARAPData,
  calculateFilteredKPIs,
  FilterOptions,
  TableFilterOptions,
} from '@/utils/dataFilters';

// HR Utilities
import {
  filterEmployeeData,
  calculateHRMetrics,
  calculateAttritionRisk,
  calculateDepartmentDiversity,
  calculateMonthlyHiring,
} from '@/utils/hrDataFilters';
import { HRFilters } from '@/types/hr';

export default function Home() {
  const [activeModule, setActiveModule] = useState('finance');
  const [activeTab, setActiveTab] = useState('overview');

  // Finance filters
  // Extract available filter options from data
  const availableCountries = useMemo(
    () =>
      [
        ...new Set(financialData.map((item) => item.country).filter(Boolean)),
      ] as string[],
    []
  );

  const availableChannels = useMemo(
    () =>
      [
        ...new Set(financialData.map((item) => item.channel).filter(Boolean)),
      ] as string[],
    []
  );

  const availableStatuses = useMemo(
    () =>
      [
        ...new Set(financialData.map((item) => item.status).filter(Boolean)),
      ] as string[],
    []
  );

  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: 'ytd',
    countries: availableCountries.slice(0, 3), // Default to first 3 countries
    channels: availableChannels, // Default to all
    statuses: availableStatuses.filter((s) => s !== 'Cancelled'), // Default to non-cancelled
  });

  const [tableFilters, setTableFilters] = useState<TableFilterOptions>({
    search: '',
    status: 'all',
    daysOutstanding: 'all',
    sortBy: 'daysOutstanding',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  // HR filters
  const [hrFilters, setHrFilters] = useState<HRFilters>({
    dateRange: 'ytd',
    departments: hrFilterOptions.departments.slice(0, 3), // Default to first 3 departments
    locations: hrFilterOptions.locations, // Default to all locations
    grades: hrFilterOptions.grades, // Default to all grades
  });

  // Compute filtered data using useMemo for performance
  const filteredFinancialData = useMemo(
    () => filterFinancialData(financialData, filters),
    [filters]
  );

  const filteredWorkingCapitalData = useMemo(
    () => filterWorkingCapitalData(workingCapitalData, filters),
    [filters]
  );

  const filteredCashFlowData = useMemo(
    () => filterCashFlowData(cashFlowData, filters),
    [filters]
  );

  const filteredARData = useMemo(
    () => filterARAPData(arData, tableFilters),
    [tableFilters]
  );

  const filteredAPData = useMemo(
    () => filterARAPData(apData, tableFilters),
    [tableFilters]
  );

  const filteredKPIData = useMemo(
    () =>
      calculateFilteredKPIs(
        filteredFinancialData,
        filteredWorkingCapitalData,
        filteredARData
      ),
    [filteredFinancialData, filteredWorkingCapitalData, filteredARData]
  );

  // HR filtered data
  const filteredEmployees = useMemo(
    () => filterEmployeeData(hrSampleData.employees, hrFilters),
    [hrFilters]
  );

  const hrMetrics = useMemo(
    () => calculateHRMetrics(filteredEmployees),
    [filteredEmployees]
  );

  const attritionRiskData = useMemo(
    () => calculateAttritionRisk(filteredEmployees),
    [filteredEmployees]
  );

  const departmentDiversity = useMemo(
    () => calculateDepartmentDiversity(filteredEmployees),
    [filteredEmployees]
  );

  const monthlyHiring = useMemo(
    () => calculateMonthlyHiring(filteredEmployees),
    [filteredEmployees]
  );

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    console.log('Filters updated:', newFilters);
  };

  const handleTableFilterChange = (newFilters: TableFilterOptions) => {
    setTableFilters(newFilters);
    console.log('Table filters updated:', newFilters);
  };

  const handleHRFilterChange = (newFilters: HRFilters) => {
    setHrFilters(newFilters);
    console.log('HR Filters updated:', newFilters);
  };

  const getPageTitle = () => {
    if (activeModule === 'hr') {
      switch (activeTab) {
        case 'hr-overview':
          return 'People Overview';
        case 'attrition-risk':
          return 'Attrition Risk Analysis';
        case 'recruiting':
          return 'Recruiting Pipeline';
        case 'engagement':
          return 'Engagement & Performance';
        case 'compensation':
          return 'Compensation & Equity';
        case 'absence':
          return 'Absence Management';
        default:
          return 'HR Dashboard';
      }
    }

    switch (activeTab) {
      case 'overview':
        return 'Financial Overview';
      case 'pl':
        return 'Profit & Loss Analysis';
      case 'working-capital':
        return 'Working Capital Management';
      case 'receivables':
        return 'Accounts Receivable';
      case 'payables':
        return 'Accounts Payable';
      case 'cash-flow':
        return 'Cash Flow Analysis';
      default:
        return 'Finance Cockpit';
    }
  };

  const getPageSubtitle = () => {
    if (activeModule === 'hr') {
      switch (activeTab) {
        case 'hr-overview':
          return 'Employee metrics, hiring trends, and diversity analytics';
        case 'attrition-risk':
          return 'Risk scoring and retention insights';
        case 'recruiting':
          return 'Candidate pipeline and hiring funnel analysis';
        case 'engagement':
          return 'Performance ratings and engagement trends';
        case 'compensation':
          return 'Salary analysis and pay equity insights';
        case 'absence':
          return 'Leave utilization and absence patterns';
        default:
          return 'People analytics and workforce insights';
      }
    }

    switch (activeTab) {
      case 'overview':
        return 'Key performance indicators and financial metrics';
      case 'pl':
        return 'Revenue, expenses, and profitability analysis';
      case 'working-capital':
        return 'Inventory, receivables, and payables tracking';
      case 'receivables':
        return 'Customer payment tracking and aging analysis';
      case 'payables':
        return 'Supplier payment management and scheduling';
      case 'cash-flow':
        return 'Operating, investing, and financing cash flows';
      default:
        return 'Real-time financial insights and analytics';
    }
  };

  const renderContent = () => {
    if (activeModule === 'hr') {
      return (
        <div className='space-y-6'>
          <div className='mb-6'>
            <HRFilterPanel
              onFilterChange={handleHRFilterChange}
              availableDepartments={[
                'Sales',
                'Marketing',
                'Operations',
                'Finance',
                'HR',
                'IT',
                'Procurement',
                'Logistics',
                'Quality',
              ]}
              availableLocations={[
                'Dubai',
                'Abu Dhabi',
                'Sharjah',
                'Riyadh',
                'Doha',
              ]}
              availableGrades={['G1', 'G2', 'G3', 'M1', 'M2', 'D1']}
            />
          </div>

          {activeTab === 'hr-overview' && (
            <>
              <HRKPICards metrics={hrMetrics} />
              <PeopleOverviewCharts
                monthlyHiring={monthlyHiring}
                departmentDiversity={departmentDiversity}
              />
            </>
          )}

          {activeTab === 'attrition-risk' && (
            <>
              <HRKPICards metrics={hrMetrics} />
              <AttritionRiskTable riskEmployees={attritionRiskData} />
            </>
          )}

          {activeTab === 'recruiting' && (
            <>
              <HRKPICards metrics={hrMetrics} />
              <RecruitingPipeline
                requisitions={hrSampleData.requisitions}
                candidates={hrSampleData.candidates}
              />
            </>
          )}

          {activeTab === 'engagement' && (
            <>
              <HRKPICards metrics={hrMetrics} />
              <EngagementPerformance
                employees={filteredEmployees}
                engagementData={hrSampleData.engagementMonthly}
              />
            </>
          )}

          {activeTab === 'compensation' && (
            <>
              <HRKPICards metrics={hrMetrics} />
              <CompensationEquity employees={filteredEmployees} />
            </>
          )}

          {activeTab === 'absence' && (
            <>
              <HRKPICards metrics={hrMetrics} />
              <AbsenceManagement
                employees={filteredEmployees}
                leaveData={hrSampleData.leaves}
              />
            </>
          )}
        </div>
      );
    }

    if (activeModule !== 'finance') {
      return (
        <div className='flex items-center justify-center h-96'>
          <div className='text-center'>
            <div className='w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full'></div>
            </div>
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>
              Module Coming Soon
            </h3>
            <p className='text-gray-500'>
              This module will be available in the next update.
            </p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className='space-y-8'>
            <FilterPanel
              onFilterChange={handleFilterChange}
              availableCountries={availableCountries}
              availableChannels={availableChannels}
              availableStatuses={availableStatuses}
            />
            <DataSummary
              filteredCount={filteredFinancialData.length}
              totalCount={financialData.length}
              dataType='months of data'
            />

            {/* KPI Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6'>
              {filteredKPIData.map((kpi, index) => (
                <KPICard key={index} kpi={kpi} />
              ))}
            </div>

            {/* Charts Grid */}
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
              <PLChart data={filteredFinancialData} />
              <WorkingCapitalChart data={filteredWorkingCapitalData} />
            </div>

            {/* Quick Stats */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
              <div className='bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200'>
                <h4 className='text-sm font-semibold text-blue-700 mb-2'>
                  Total Revenue
                </h4>
                <p className='text-2xl font-bold text-blue-900'>
                  $
                  {filteredFinancialData
                    .reduce((sum, item) => sum + item.revenue, 0)
                    .toLocaleString()}
                </p>
                <p className='text-xs text-blue-600 mt-1'>Filtered Period</p>
              </div>
              <div className='bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200'>
                <h4 className='text-sm font-semibold text-green-700 mb-2'>
                  Net Profit
                </h4>
                <p className='text-2xl font-bold text-green-900'>
                  $
                  {filteredFinancialData
                    .reduce((sum, item) => sum + item.profit, 0)
                    .toLocaleString()}
                </p>
                <p className='text-xs text-green-600 mt-1'>Filtered Period</p>
              </div>
              <div className='bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-200'>
                <h4 className='text-sm font-semibold text-purple-700 mb-2'>
                  Working Capital
                </h4>
                <p className='text-2xl font-bold text-purple-900'>
                  $
                  {filteredWorkingCapitalData.length > 0
                    ? filteredWorkingCapitalData[
                        filteredWorkingCapitalData.length - 1
                      ]?.workingCapital.toLocaleString()
                    : '0'}
                </p>
                <p className='text-xs text-purple-600 mt-1'>Latest Month</p>
              </div>
              <div className='bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-200'>
                <h4 className='text-sm font-semibold text-orange-700 mb-2'>
                  Cash Flow
                </h4>
                <p className='text-2xl font-bold text-orange-900'>
                  $
                  {filteredCashFlowData
                    .reduce((sum, item) => sum + item.netCashFlow, 0)
                    .toLocaleString()}
                </p>
                <p className='text-xs text-orange-600 mt-1'>Filtered Period</p>
              </div>
            </div>
          </div>
        );

      case 'pl':
        return (
          <div className='space-y-8'>
            <FilterPanel
              onFilterChange={handleFilterChange}
              availableCountries={availableCountries}
              availableChannels={availableChannels}
              availableStatuses={availableStatuses}
            />
            <DataSummary
              filteredCount={filteredFinancialData.length}
              totalCount={financialData.length}
              dataType='months of P&L data'
            />

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl shadow-lg border border-blue-200'>
                <h3 className='text-lg font-bold text-blue-800 mb-2'>
                  Total Revenue
                </h3>
                <p className='text-3xl font-bold text-blue-900'>
                  $
                  {filteredFinancialData
                    .reduce((sum, item) => sum + item.revenue, 0)
                    .toLocaleString()}
                </p>
                <p className='text-sm text-blue-600 mt-1'>Filtered Period</p>
              </div>
              <div className='bg-gradient-to-br from-red-50 to-rose-100 p-6 rounded-xl shadow-lg border border-red-200'>
                <h3 className='text-lg font-bold text-red-800 mb-2'>
                  Total Expenses
                </h3>
                <p className='text-3xl font-bold text-red-900'>
                  $
                  {filteredFinancialData
                    .reduce((sum, item) => sum + item.expenses, 0)
                    .toLocaleString()}
                </p>
                <p className='text-sm text-red-600 mt-1'>Filtered Period</p>
              </div>
              <div className='bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl shadow-lg border border-green-200'>
                <h3 className='text-lg font-bold text-green-800 mb-2'>
                  Net Profit
                </h3>
                <p className='text-3xl font-bold text-green-900'>
                  $
                  {filteredFinancialData
                    .reduce((sum, item) => sum + item.profit, 0)
                    .toLocaleString()}
                </p>
                <p className='text-sm text-green-600 mt-1'>Filtered Period</p>
              </div>
            </div>
            <PLChart data={filteredFinancialData} />
          </div>
        );

      case 'working-capital':
        return (
          <div className='space-y-8'>
            <FilterPanel
              onFilterChange={handleFilterChange}
              availableCountries={availableCountries}
              availableChannels={availableChannels}
              availableStatuses={availableStatuses}
            />

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-xl shadow-lg border border-purple-200'>
                <h3 className='text-lg font-bold text-purple-800 mb-2'>
                  Current Inventory
                </h3>
                <p className='text-3xl font-bold text-purple-900'>
                  $
                  {filteredWorkingCapitalData.length > 0
                    ? filteredWorkingCapitalData[
                        filteredWorkingCapitalData.length - 1
                      ]?.inventory.toLocaleString()
                    : '0'}
                </p>
                <p className='text-sm text-purple-600 mt-1'>Latest Month</p>
              </div>
              <div className='bg-gradient-to-br from-orange-50 to-amber-100 p-6 rounded-xl shadow-lg border border-orange-200'>
                <h3 className='text-lg font-bold text-orange-800 mb-2'>
                  Current AR
                </h3>
                <p className='text-3xl font-bold text-orange-900'>
                  $
                  {filteredWorkingCapitalData.length > 0
                    ? filteredWorkingCapitalData[
                        filteredWorkingCapitalData.length - 1
                      ]?.accountsReceivable.toLocaleString()
                    : '0'}
                </p>
                <p className='text-sm text-orange-600 mt-1'>Latest Month</p>
              </div>
              <div className='bg-gradient-to-br from-red-50 to-rose-100 p-6 rounded-xl shadow-lg border border-red-200'>
                <h3 className='text-lg font-bold text-red-800 mb-2'>
                  Current AP
                </h3>
                <p className='text-3xl font-bold text-red-900'>
                  $
                  {filteredWorkingCapitalData.length > 0
                    ? filteredWorkingCapitalData[
                        filteredWorkingCapitalData.length - 1
                      ]?.accountsPayable.toLocaleString()
                    : '0'}
                </p>
                <p className='text-sm text-red-600 mt-1'>Latest Month</p>
              </div>
            </div>
            <WorkingCapitalChart data={filteredWorkingCapitalData} />
          </div>
        );

      case 'receivables':
        return (
          <div className='space-y-8'>
            <TableFilters
              onFilterChange={handleTableFilterChange}
              type='receivable'
            />
            <DataSummary
              filteredCount={filteredARData.length}
              totalCount={arData.length}
              dataType='receivable records'
            />
            <ARAPTable
              data={filteredARData}
              title='Accounts Receivable Workbench'
              type='receivable'
            />
          </div>
        );

      case 'payables':
        return (
          <div className='space-y-8'>
            <TableFilters
              onFilterChange={handleTableFilterChange}
              type='payable'
            />
            <DataSummary
              filteredCount={filteredAPData.length}
              totalCount={apData.length}
              dataType='payable records'
            />
            <ARAPTable
              data={filteredAPData}
              title='Accounts Payable Workbench'
              type='payable'
            />
          </div>
        );

      case 'cash-flow':
        return (
          <div className='space-y-8'>
            <FilterPanel
              onFilterChange={handleFilterChange}
              availableCountries={availableCountries}
              availableChannels={availableChannels}
              availableStatuses={availableStatuses}
            />

            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
              <div className='bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl shadow-lg border border-green-200'>
                <h3 className='text-lg font-bold text-green-800 mb-2'>
                  Operating CF
                </h3>
                <p className='text-3xl font-bold text-green-900'>
                  $
                  {filteredCashFlowData
                    .reduce((sum, item) => sum + item.operating, 0)
                    .toLocaleString()}
                </p>
                <p className='text-sm text-green-600 mt-1'>Filtered Period</p>
              </div>
              <div className='bg-gradient-to-br from-red-50 to-rose-100 p-6 rounded-xl shadow-lg border border-red-200'>
                <h3 className='text-lg font-bold text-red-800 mb-2'>
                  Investing CF
                </h3>
                <p className='text-3xl font-bold text-red-900'>
                  $
                  {filteredCashFlowData
                    .reduce((sum, item) => sum + item.investing, 0)
                    .toLocaleString()}
                </p>
                <p className='text-sm text-red-600 mt-1'>Filtered Period</p>
              </div>
              <div className='bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl shadow-lg border border-blue-200'>
                <h3 className='text-lg font-bold text-blue-800 mb-2'>
                  Financing CF
                </h3>
                <p className='text-3xl font-bold text-blue-900'>
                  $
                  {filteredCashFlowData
                    .reduce((sum, item) => sum + item.financing, 0)
                    .toLocaleString()}
                </p>
                <p className='text-sm text-blue-600 mt-1'>Filtered Period</p>
              </div>
              <div className='bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-xl shadow-lg border border-purple-200'>
                <h3 className='text-lg font-bold text-purple-800 mb-2'>
                  Net Cash Flow
                </h3>
                <p className='text-3xl font-bold text-purple-900'>
                  $
                  {filteredCashFlowData
                    .reduce((sum, item) => sum + item.netCashFlow, 0)
                    .toLocaleString()}
                </p>
                <p className='text-sm text-purple-600 mt-1'>Filtered Period</p>
              </div>
            </div>
            <CashFlowChart data={filteredCashFlowData} />
          </div>
        );

      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100'>
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className='lg:ml-80 transition-all duration-300'>
        <Header title={getPageTitle()} subtitle={getPageSubtitle()} />

        <main className='p-6'>
          <div className='max-w-7xl mx-auto'>{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
