'use client';

import { useState } from 'react';
import { Search, SortAsc, SortDesc } from 'lucide-react';

interface TableFiltersProps {
  onFilterChange: (filters: TableFilterState) => void;
  type: 'receivable' | 'payable';
}

interface TableFilterState {
  search: string;
  status: string;
  daysOutstanding: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'current', label: 'Current' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'critical', label: 'Critical' },
];

const daysOutstandingOptions = [
  { value: 'all', label: 'All Days' },
  { value: '0-30', label: '0-30 days' },
  { value: '31-60', label: '31-60 days' },
  { value: '61-90', label: '61-90 days' },
  { value: '90+', label: '90+ days' },
];

const sortOptions = [
  { value: 'customerSupplier', label: 'Name' },
  { value: 'amount', label: 'Amount' },
  { value: 'daysOutstanding', label: 'Days Outstanding' },
  { value: 'dueDate', label: 'Due Date' },
];

export default function TableFilters({
  onFilterChange,
  type,
}: TableFiltersProps) {
  const [filters, setFilters] = useState<TableFilterState>({
    search: '',
    status: 'all',
    daysOutstanding: 'all',
    sortBy: 'daysOutstanding',
    sortOrder: 'desc',
  });

  const handleFilterChange = (
    key: keyof TableFilterState,
    value: string | 'asc' | 'desc'
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleSortOrder = () => {
    const newOrder = filters.sortOrder === 'asc' ? 'desc' : 'asc';
    handleFilterChange('sortOrder', newOrder);
  };

  return (
    <div className='bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-200 mb-4'>
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
        {/* Search */}
        <div className='md:col-span-2'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Search {type === 'receivable' ? 'Customers' : 'Suppliers'}
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <Search className='h-4 w-4 text-gray-400' />
            </div>
            <input
              type='text'
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder={`Search ${
                type === 'receivable' ? 'customers' : 'suppliers'
              }...`}
              className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Days Outstanding Filter */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Days Outstanding
          </label>
          <select
            value={filters.daysOutstanding}
            onChange={(e) =>
              handleFilterChange('daysOutstanding', e.target.value)
            }
            className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          >
            {daysOutstandingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Sort By
          </label>
          <div className='flex'>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className='flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={toggleSortOrder}
              className='px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors'
              title={`Sort ${
                filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'
              }`}
            >
              {filters.sortOrder === 'asc' ? (
                <SortAsc className='w-4 h-4' />
              ) : (
                <SortDesc className='w-4 h-4' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.search ||
        filters.status !== 'all' ||
        filters.daysOutstanding !== 'all') && (
        <div className='mt-3 pt-3 border-t border-gray-200'>
          <div className='flex flex-wrap gap-2 items-center'>
            <span className='text-sm text-gray-600'>Active filters:</span>
            {filters.search && (
              <span className='px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full'>
                Search: &quot;{filters.search}&quot;
              </span>
            )}
            {filters.status !== 'all' && (
              <span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>
                {statusOptions.find((o) => o.value === filters.status)?.label}
              </span>
            )}
            {filters.daysOutstanding !== 'all' && (
              <span className='px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full'>
                {
                  daysOutstandingOptions.find(
                    (o) => o.value === filters.daysOutstanding
                  )?.label
                }
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
