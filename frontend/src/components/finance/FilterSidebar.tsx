'use client';

import { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { financeAPI, type FilterOptions } from '@/lib/api';

interface FilterSidebarProps {
  dateRange: string[];
  setDateRange: (range: string[]) => void;
  selectedCountries: string[];
  setSelectedCountries: (countries: string[]) => void;
  selectedChannels: string[];
  setSelectedChannels: (channels: string[]) => void;
  selectedStatuses: string[];
  setSelectedStatuses: (statuses: string[]) => void;
}

export function FilterSidebar({
  dateRange,
  setDateRange,
  selectedCountries,
  setSelectedCountries,
  selectedChannels,
  setSelectedChannels,
  selectedStatuses,
  setSelectedStatuses,
}: FilterSidebarProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    countries: [],
    channels: [],
    statuses: [],
  });

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const filters = await financeAPI.getFilters();
        setFilterOptions(filters);

        if (selectedCountries.length === 0 && filters.countries.length > 0) {
          setSelectedCountries(filters.countries.slice(0, 3));
        }
        if (selectedChannels.length === 0) {
          setSelectedChannels(filters.channels);
        }
        if (selectedStatuses.length === 0) {
          setSelectedStatuses(filters.statuses);
        }
      } catch (error) {
        console.error('Failed to load filter options:', error);
        const defaultFilters = {
          countries: ['UAE', 'KSA', 'Qatar', 'Kuwait', 'Bahrain', 'Oman'],
          channels: ['Direct Sales', 'Online', 'Retail Partners', 'B2B'],
          statuses: ['Active', 'Pending', 'Completed', 'Cancelled'],
        };
        setFilterOptions(defaultFilters);
        if (selectedCountries.length === 0) {
          setSelectedCountries(defaultFilters.countries.slice(0, 3));
        }
        if (selectedChannels.length === 0) {
          setSelectedChannels(defaultFilters.channels);
        }
        if (selectedStatuses.length === 0) {
          setSelectedStatuses(defaultFilters.statuses);
        }
      }
    };

    fetchFilters();
  }, [
    selectedCountries.length,
    selectedChannels.length,
    selectedStatuses.length,
    setSelectedCountries,
    setSelectedChannels,
    setSelectedStatuses,
  ]);

  const toggleSelection = (
    item: string,
    selectedItems: string[],
    setSelectedItems: (items: string[]) => void
  ) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  return (
    <div className='w-80 border-r bg-gray-50 p-6 space-y-6'>
      <div>
        <h3 className='text-lg font-semibold mb-4 flex items-center justify-between'>
          <span className='flex items-center'>
            <BarChart3 className='h-5 w-5 mr-2' />
            Data & Filters
          </span>
          {(selectedCountries.length > 0 ||
            selectedChannels.length > 0 ||
            selectedStatuses.length > 0) && (
            <Badge variant='secondary' className='text-xs'>
              {selectedCountries.length +
                selectedChannels.length +
                selectedStatuses.length}{' '}
              active
            </Badge>
          )}
        </h3>

        {/* Active Filters Summary */}
        {(selectedCountries.length > 0 ||
          selectedChannels.length > 0 ||
          selectedStatuses.length > 0) && (
          <div className='mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200'>
            <div className='text-xs font-medium text-blue-800 mb-2'>
              Active Filters:
            </div>
            <div className='space-y-1 text-xs text-blue-700'>
              {selectedCountries.length > 0 && (
                <div>Countries: {selectedCountries.join(', ')}</div>
              )}
              {selectedChannels.length > 0 && (
                <div>Channels: {selectedChannels.join(', ')}</div>
              )}
              {selectedStatuses.length > 0 && (
                <div>Statuses: {selectedStatuses.join(', ')}</div>
              )}
            </div>
          </div>
        )}

        {/* Date Range */}
        <div className='space-y-2'>
          <Label className='text-sm font-medium'>Order Date Range</Label>
          <div className='flex gap-2'>
            <Input
              type='date'
              value={dateRange[0]}
              onChange={(e) => setDateRange([e.target.value, dateRange[1]])}
              className='text-xs'
            />
            <Input
              type='date'
              value={dateRange[1]}
              onChange={(e) => setDateRange([dateRange[0], e.target.value])}
              className='text-xs'
            />
          </div>
        </div>

        {/* Country Filter */}
        <div className='space-y-2'>
          <Label className='text-sm font-medium'>Country</Label>
          <div className='flex flex-wrap gap-1'>
            {filterOptions.countries.map((country) => (
              <Badge
                key={country}
                variant={
                  selectedCountries.includes(country) ? 'default' : 'outline'
                }
                className='cursor-pointer text-xs'
                onClick={() =>
                  toggleSelection(
                    country,
                    selectedCountries,
                    setSelectedCountries
                  )
                }
              >
                {country}
                {selectedCountries.includes(country) && ' ×'}
              </Badge>
            ))}
          </div>
        </div>

        {/* Channel Filter */}
        <div className='space-y-2'>
          <Label className='text-sm font-medium'>Channel</Label>
          <div className='flex flex-wrap gap-1'>
            {filterOptions.channels.map((channel) => (
              <Badge
                key={channel}
                variant={
                  selectedChannels.includes(channel) ? 'default' : 'outline'
                }
                className='cursor-pointer text-xs'
                onClick={() =>
                  toggleSelection(
                    channel,
                    selectedChannels,
                    setSelectedChannels
                  )
                }
              >
                {channel}
                {selectedChannels.includes(channel) && ' ×'}
              </Badge>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className='space-y-2'>
          <Label className='text-sm font-medium'>Status</Label>
          <div className='flex flex-wrap gap-1'>
            {filterOptions.statuses.map((status) => (
              <Badge
                key={status}
                variant={
                  selectedStatuses.includes(status) ? 'default' : 'outline'
                }
                className='cursor-pointer text-xs'
                onClick={() =>
                  toggleSelection(status, selectedStatuses, setSelectedStatuses)
                }
              >
                {status}
                {selectedStatuses.includes(status) && ' ×'}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
