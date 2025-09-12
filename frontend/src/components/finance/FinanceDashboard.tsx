'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  financeAPI,
  handleAPIError,
  type FinanceDashboardResponse,
} from '@/lib/api';
import { FilterSidebar } from './FilterSidebar';
import { DashboardHeader } from './DashboardHeader';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { DashboardTabs } from './DashboardTabs';
import { AutomatedCommentary } from './AutomatedCommentary';

export function FinanceDashboard() {
  const [dashboardData, setDashboardData] =
    useState<FinanceDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [dateRange, setDateRange] = useState(['2025-01-01', '2025-08-10']);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  // Working capital states
  const [trailingDays, setTrailingDays] = useState(90);
  const [startingCash, setStartingCash] = useState(0);

  // Create filter object for API calls
  const getCurrentFilters = useCallback(() => {
    return {
      countries: selectedCountries.length > 0 ? selectedCountries : undefined,
      channels: selectedChannels.length > 0 ? selectedChannels : undefined,
      statuses: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      date_start: dateRange[0] || undefined,
      date_end: dateRange[1] || undefined,
    };
  }, [selectedCountries, selectedChannels, selectedStatuses, dateRange]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = getCurrentFilters();
      const dashboard = await financeAPI.getDashboard(filters);
      setDashboardData(dashboard);
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  }, [getCurrentFilters]);

  // Fetch data when component mounts
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Refresh data when filters change (with debouncing)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (
        selectedCountries.length > 0 ||
        selectedChannels.length > 0 ||
        selectedStatuses.length > 0
      ) {
        fetchDashboardData();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    selectedCountries,
    selectedChannels,
    selectedStatuses,
    dateRange,
    fetchDashboardData,
  ]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchDashboardData} />;
  }

  return (
    <div className='flex h-full'>
      {/* Left Sidebar - Filters */}
      <FilterSidebar
        dateRange={dateRange}
        setDateRange={setDateRange}
        selectedCountries={selectedCountries}
        setSelectedCountries={setSelectedCountries}
        selectedChannels={selectedChannels}
        setSelectedChannels={setSelectedChannels}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
      />

      {/* Main Content Area */}
      <div className='flex-1 p-6'>
        {/* Header */}
        <DashboardHeader onRefresh={fetchDashboardData} />

        {/* Main Tabs */}
        <DashboardTabs
          dashboardData={dashboardData}
          trailingDays={trailingDays}
          setTrailingDays={setTrailingDays}
          startingCash={startingCash}
          setStartingCash={setStartingCash}
          filters={getCurrentFilters()}
        />

        {/* Automated Commentary Section */}
        <div className='mt-12 border-t pt-8'>
          <AutomatedCommentary
            dashboardData={dashboardData}
            filters={getCurrentFilters()}
          />
        </div>
      </div>
    </div>
  );
}
