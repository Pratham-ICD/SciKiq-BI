'use client';

import { useState } from 'react';
import {
  Calendar,
  Filter,
  RotateCcw,
  MapPin,
  Building,
  Trophy,
} from 'lucide-react';
import { HRFilters } from '../../types/hr';

interface HRFilterPanelProps {
  onFilterChange: (filters: HRFilters) => void;
  availableDepartments?: string[];
  availableLocations?: string[];
  availableGrades?: string[];
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

export default function HRFilterPanel({
  onFilterChange,
  availableDepartments = [
    'Sales',
    'Marketing',
    'Operations',
    'Finance',
    'HR',
    'IT',
  ],
  availableLocations = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Riyadh', 'Doha'],
  availableGrades = ['G1', 'G2', 'G3', 'M1', 'M2', 'D1'],
}: HRFilterPanelProps) {
  const [filters, setFilters] = useState<HRFilters>({
    dateRange: 'ytd',
    departments: availableDepartments.slice(0, 4), // Default to first 4 departments
    locations: availableLocations, // Default to all locations
    grades: availableGrades, // Default to all grades
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterUpdate = (newFilters: Partial<HRFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const resetFilters = () => {
    const defaultFilters: HRFilters = {
      dateRange: 'ytd',
      departments: availableDepartments.slice(0, 4),
      locations: availableLocations,
      grades: availableGrades,
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const toggleArrayFilter = (array: string[], value: string) => {
    return array.includes(value)
      ? array.filter((item) => item !== value)
      : [...array, value];
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.departments.length < availableDepartments.length) count++;
    if (filters.locations.length < availableLocations.length) count++;
    if (filters.grades.length < availableGrades.length) count++;
    if (filters.dateRange !== 'all') count++;
    return count;
  };

  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <div className='flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg'>
            <Filter className='w-5 h-5 text-blue-600' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>HR Filters</h3>
            <p className='text-sm text-gray-600'>
              {getActiveFiltersCount()} active filters
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={resetFilters}
            className='flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <RotateCcw className='w-4 h-4' />
            Reset
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className='flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors'
          >
            <Filter className='w-4 h-4' />
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {/* Quick Filters Row */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-4'>
        {/* Date Range */}
        <div>
          <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
            <Calendar className='w-4 h-4' />
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterUpdate({ dateRange: e.target.value })}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          >
            {dateRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Department Filter */}
        <div>
          <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
            <Building className='w-4 h-4' />
            Departments ({filters.departments.length})
          </label>
          <div className='text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border'>
            {filters.departments.length === availableDepartments.length
              ? 'All selected'
              : filters.departments.slice(0, 2).join(', ') +
                (filters.departments.length > 2 ? '...' : '')}
          </div>
        </div>

        {/* Quick Location Filter */}
        <div>
          <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
            <MapPin className='w-4 h-4' />
            Locations ({filters.locations.length})
          </label>
          <div className='text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border'>
            {filters.locations.length === availableLocations.length
              ? 'All selected'
              : filters.locations.slice(0, 2).join(', ') +
                (filters.locations.length > 2 ? '...' : '')}
          </div>
        </div>

        {/* Quick Grade Filter */}
        <div>
          <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
            <Trophy className='w-4 h-4' />
            Grades ({filters.grades.length})
          </label>
          <div className='text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border'>
            {filters.grades.length === availableGrades.length
              ? 'All selected'
              : filters.grades.slice(0, 3).join(', ') +
                (filters.grades.length > 3 ? '...' : '')}
          </div>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className='border-t border-gray-200 pt-4 space-y-6'>
          {/* Departments */}
          <div>
            <div className='flex items-center justify-between mb-3'>
              <label className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                <Building className='w-4 h-4' />
                Departments
              </label>
              <div className='flex gap-2'>
                <button
                  onClick={() =>
                    handleFilterUpdate({ departments: availableDepartments })
                  }
                  className='text-xs text-blue-600 hover:text-blue-800'
                >
                  Select All
                </button>
                <button
                  onClick={() => handleFilterUpdate({ departments: [] })}
                  className='text-xs text-red-600 hover:text-red-800'
                >
                  Clear All
                </button>
              </div>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2'>
              {availableDepartments.map((dept) => (
                <label
                  key={dept}
                  className='flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer text-sm'
                >
                  <input
                    type='checkbox'
                    checked={filters.departments.includes(dept)}
                    onChange={() => {
                      handleFilterUpdate({
                        departments: toggleArrayFilter(
                          filters.departments,
                          dept
                        ),
                      });
                    }}
                    className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                  />
                  <span className='truncate'>{dept}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div>
            <div className='flex items-center justify-between mb-3'>
              <label className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                <MapPin className='w-4 h-4' />
                Locations
              </label>
              <div className='flex gap-2'>
                <button
                  onClick={() =>
                    handleFilterUpdate({ locations: availableLocations })
                  }
                  className='text-xs text-blue-600 hover:text-blue-800'
                >
                  Select All
                </button>
                <button
                  onClick={() => handleFilterUpdate({ locations: [] })}
                  className='text-xs text-red-600 hover:text-red-800'
                >
                  Clear All
                </button>
              </div>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2'>
              {availableLocations.map((location) => (
                <label
                  key={location}
                  className='flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer text-sm'
                >
                  <input
                    type='checkbox'
                    checked={filters.locations.includes(location)}
                    onChange={() => {
                      handleFilterUpdate({
                        locations: toggleArrayFilter(
                          filters.locations,
                          location
                        ),
                      });
                    }}
                    className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                  />
                  <span className='truncate'>{location}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Grades */}
          <div>
            <div className='flex items-center justify-between mb-3'>
              <label className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                <Trophy className='w-4 h-4' />
                Grade Levels
              </label>
              <div className='flex gap-2'>
                <button
                  onClick={() =>
                    handleFilterUpdate({ grades: availableGrades })
                  }
                  className='text-xs text-blue-600 hover:text-blue-800'
                >
                  Select All
                </button>
                <button
                  onClick={() => handleFilterUpdate({ grades: [] })}
                  className='text-xs text-red-600 hover:text-red-800'
                >
                  Clear All
                </button>
              </div>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2'>
              {availableGrades.map((grade) => (
                <label
                  key={grade}
                  className='flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer text-sm'
                >
                  <input
                    type='checkbox'
                    checked={filters.grades.includes(grade)}
                    onChange={() => {
                      handleFilterUpdate({
                        grades: toggleArrayFilter(filters.grades, grade),
                      });
                    }}
                    className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                  />
                  <span className='truncate'>{grade}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
