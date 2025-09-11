'use client';

import { useState } from 'react';
import {
  Calendar,
  Filter,
  RotateCcw,
  MapPin,
  Layers,
  CheckCircle,
} from 'lucide-react';

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  availableCountries?: string[];
  availableChannels?: string[];
  availableStatuses?: string[];
}

interface FilterState {
  dateRange: string;
  countries: string[];
  channels: string[];
  statuses: string[];
}

const dateRangeOptions = [
  { value: 'ytd', label: 'Year to Date' },
  { value: 'qtd', label: 'Quarter to Date' },
  { value: 'mtd', label: 'Month to Date' },
  { value: 'last12months', label: 'Last 12 Months' },
  { value: 'last6months', label: 'Last 6 Months' },
  { value: 'last3months', label: 'Last 3 Months' },
  { value: 'all', label: 'All Time' },
];

export default function FilterPanel({
  onFilterChange,
  availableCountries = ['UAE', 'Saudi Arabia', 'Qatar', 'Kuwait'],
  availableChannels = ['Online', 'Retail', 'Wholesale'],
  availableStatuses = ['Completed', 'Pending', 'Cancelled'],
}: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'ytd',
    countries: availableCountries.slice(0, 3), // Default to first 3 countries
    channels: availableChannels, // Default to all channels
    statuses: availableStatuses.filter((s) => s !== 'Cancelled'), // Default to non-cancelled
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (
    key: keyof FilterState,
    value: string | string[]
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      dateRange: 'ytd',
      countries: availableCountries.slice(0, 3),
      channels: availableChannels,
      statuses: availableStatuses.filter((s) => s !== 'Cancelled'),
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters =
    filters.dateRange !== 'ytd' ||
    filters.countries.length !== Math.min(3, availableCountries.length) ||
    filters.channels.length !== availableChannels.length ||
    filters.statuses.length !==
      availableStatuses.filter((s) => s !== 'Cancelled').length;

  const handleMultiSelectChange = (
    key: keyof FilterState,
    value: string,
    checked: boolean
  ) => {
    const currentValues = filters[key] as string[];
    let newValues: string[];

    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter((v) => v !== value);
    }

    handleFilterChange(key, newValues);
  };

  return (
    <div className='bg-gradient-to-r from-white to-gray-50 p-4 rounded-xl shadow-lg border border-gray-200 mb-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <div className='flex items-center space-x-2'>
            <Filter className='w-5 h-5 text-gray-600' />
            <h3 className='text-lg font-semibold text-gray-800'>Filters</h3>
            {hasActiveFilters && (
              <span className='px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full'>
                Active
              </span>
            )}
          </div>
        </div>

        <div className='flex items-center space-x-2'>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className='flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors'
            >
              <RotateCcw className='w-4 h-4' />
              <span>Reset</span>
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className='md:hidden px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors'
          >
            {isExpanded ? 'Hide' : 'Show'} Filters
          </button>
        </div>
      </div>

      <div
        className={`mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 ${
          isExpanded ? 'block' : 'hidden md:grid'
        }`}
      >
        {/* Date Range Filter */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            <Calendar className='w-4 h-4 inline mr-1' />
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
          >
            {dateRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className='text-xs text-gray-500 mt-1'>
            Sample data: Jan 2024 - Sep 2024
          </p>
        </div>

        {/* Country Filter */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            <MapPin className='w-4 h-4 inline mr-1' />
            Countries ({filters.countries.length})
          </label>
          <div className='max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2 bg-white'>
            {availableCountries.map((country) => (
              <label key={country} className='flex items-center space-x-2 py-1'>
                <input
                  type='checkbox'
                  checked={filters.countries.includes(country)}
                  onChange={(e) =>
                    handleMultiSelectChange(
                      'countries',
                      country,
                      e.target.checked
                    )
                  }
                  className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
                <span className='text-sm text-gray-700'>{country}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Channel Filter */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            <Layers className='w-4 h-4 inline mr-1' />
            Channels ({filters.channels.length})
          </label>
          <div className='max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2 bg-white'>
            {availableChannels.map((channel) => (
              <label key={channel} className='flex items-center space-x-2 py-1'>
                <input
                  type='checkbox'
                  checked={filters.channels.includes(channel)}
                  onChange={(e) =>
                    handleMultiSelectChange(
                      'channels',
                      channel,
                      e.target.checked
                    )
                  }
                  className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
                <span className='text-sm text-gray-700'>{channel}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            <CheckCircle className='w-4 h-4 inline mr-1' />
            Status ({filters.statuses.length})
          </label>
          <div className='max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2 bg-white'>
            {availableStatuses.map((status) => (
              <label key={status} className='flex items-center space-x-2 py-1'>
                <input
                  type='checkbox'
                  checked={filters.statuses.includes(status)}
                  onChange={(e) =>
                    handleMultiSelectChange(
                      'statuses',
                      status,
                      e.target.checked
                    )
                  }
                  className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
                <span className='text-sm text-gray-700'>{status}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Applied Filters Summary */}
      {hasActiveFilters && (
        <div className='mt-4 pt-4 border-t border-gray-200'>
          <div className='flex flex-wrap gap-2'>
            <span className='text-sm text-gray-600'>Active filters:</span>
            {filters.dateRange !== 'ytd' && (
              <span className='px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full'>
                {
                  dateRangeOptions.find((o) => o.value === filters.dateRange)
                    ?.label
                }
              </span>
            )}
            {filters.countries.length < availableCountries.length && (
              <span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>
                {filters.countries.length} of {availableCountries.length}{' '}
                countries
              </span>
            )}
            {filters.channels.length < availableChannels.length && (
              <span className='px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full'>
                {filters.channels.length} of {availableChannels.length} channels
              </span>
            )}
            {filters.statuses.length < availableStatuses.length && (
              <span className='px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full'>
                {filters.statuses.length} of {availableStatuses.length} statuses
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
