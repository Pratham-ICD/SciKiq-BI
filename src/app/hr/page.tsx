'use client';

import { useState, useMemo } from 'react';
import { Users } from 'lucide-react';
import HRKPICards, {
  DiversityMetricCard,
} from '../../components/hr/HRKPICards';
import PeopleOverviewCharts from '../../components/hr/PeopleOverviewCharts';
import AttritionRiskTable from '../../components/hr/AttritionRiskTable';
import { hrSampleData, hrFilterOptions } from '../../data/hrSampleData';
import {
  filterEmployeeData,
  calculateHRMetrics,
  calculateAttritionRisk,
  calculateDepartmentDiversity,
  calculateMonthlyHiring,
} from '../../utils/hrDataFilters';
import { HRFilters } from '../../types/hr';

// Simple filter component for HR
function HRFilterPanel({
  onFilterChange,
  availableDepartments = [],
  availableLocations = [],
  availableGrades = [],
}: {
  onFilterChange: (filters: HRFilters) => void;
  availableDepartments?: string[];
  availableLocations?: string[];
  availableGrades?: string[];
}) {
  const [filters, setFilters] = useState<HRFilters>({
    dateRange: 'all',
    departments: availableDepartments.slice(0, 3),
    locations: availableLocations,
    grades: availableGrades,
  });

  const handleFilterChange = (
    key: keyof HRFilters,
    value: string | string[]
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleMultiSelectChange = (
    key: keyof HRFilters,
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
      <div className='flex items-center space-x-3 mb-4'>
        <Users className='w-5 h-5 text-gray-600' />
        <h3 className='text-lg font-semibold text-gray-800'>HR Filters</h3>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Department Filter */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Departments ({filters.departments.length})
          </label>
          <div className='max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2 bg-white'>
            {availableDepartments.map((dept) => (
              <label key={dept} className='flex items-center space-x-2 py-1'>
                <input
                  type='checkbox'
                  checked={filters.departments.includes(dept)}
                  onChange={(e) =>
                    handleMultiSelectChange(
                      'departments',
                      dept,
                      e.target.checked
                    )
                  }
                  className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
                <span className='text-sm text-gray-700'>{dept}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Location Filter */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Locations ({filters.locations.length})
          </label>
          <div className='max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2 bg-white'>
            {availableLocations.map((location) => (
              <label
                key={location}
                className='flex items-center space-x-2 py-1'
              >
                <input
                  type='checkbox'
                  checked={filters.locations.includes(location)}
                  onChange={(e) =>
                    handleMultiSelectChange(
                      'locations',
                      location,
                      e.target.checked
                    )
                  }
                  className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
                <span className='text-sm text-gray-700'>{location}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Grade Filter */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Grades ({filters.grades.length})
          </label>
          <div className='max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2 bg-white'>
            {availableGrades.map((grade) => (
              <label key={grade} className='flex items-center space-x-2 py-1'>
                <input
                  type='checkbox'
                  checked={filters.grades.includes(grade)}
                  onChange={(e) =>
                    handleMultiSelectChange('grades', grade, e.target.checked)
                  }
                  className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
                <span className='text-sm text-gray-700'>{grade}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HRDashboard() {
  const [currentFilters, setCurrentFilters] = useState<HRFilters>({
    dateRange: 'all',
    departments: hrFilterOptions.departments.slice(0, 3),
    locations: hrFilterOptions.locations,
    grades: hrFilterOptions.grades,
  });

  const [activeTab, setActiveTab] = useState('people');

  // Apply filters to data
  const filteredEmployees = useMemo(
    () => filterEmployeeData(hrSampleData.employees, currentFilters),
    [currentFilters]
  );

  // Calculate metrics based on filtered data
  const hrMetrics = useMemo(
    () => calculateHRMetrics(filteredEmployees),
    [filteredEmployees]
  );

  const attritionRisk = useMemo(
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

  const tabs = [
    { id: 'people', name: 'People Overview', icon: '👥' },
    { id: 'attrition', name: 'Attrition Risk', icon: '⚠️' },
    { id: 'recruiting', name: 'Recruiting', icon: '🎯' },
    { id: 'engagement', name: 'Engagement', icon: '📊' },
    { id: 'compensation', name: 'Compensation', icon: '💰' },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='py-6'>
            <div className='flex items-center space-x-3'>
              <div className='flex-shrink-0'>
                <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center'>
                  <Users className='w-6 h-6 text-white' />
                </div>
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>
                  Head of HR – People Analytics Cockpit
                </h1>
                <p className='text-gray-600'>
                  Comprehensive HR dashboard for people management and analytics
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Filters */}
        <HRFilterPanel
          onFilterChange={setCurrentFilters}
          availableDepartments={hrFilterOptions.departments}
          availableLocations={hrFilterOptions.locations}
          availableGrades={hrFilterOptions.grades}
        />

        {/* KPI Cards */}
        <HRKPICards metrics={hrMetrics} />

        {/* Diversity Metric */}
        <div className='mb-6'>
          <DiversityMetricCard femalePercentage={hrMetrics.female_percentage} />
        </div>

        {/* Tab Navigation */}
        <div className='mb-6'>
          <div className='border-b border-gray-200'>
            <nav className='-mb-px flex space-x-8'>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className='mr-2'>{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'people' && (
          <PeopleOverviewCharts
            monthlyHiring={monthlyHiring}
            departmentDiversity={departmentDiversity}
          />
        )}

        {activeTab === 'attrition' && (
          <AttritionRiskTable riskEmployees={attritionRisk} />
        )}

        {activeTab === 'recruiting' && (
          <div className='bg-white p-8 rounded-xl shadow-sm border border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Recruiting Pipeline
            </h3>
            <p className='text-gray-600 mb-4'>
              Recruiting funnel analysis coming soon...
            </p>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='bg-blue-50 p-4 rounded-lg'>
                <p className='text-sm font-medium text-gray-600'>
                  Open Requisitions
                </p>
                <p className='text-2xl font-bold text-blue-600'>
                  {hrSampleData.requisitions.length}
                </p>
              </div>
              <div className='bg-green-50 p-4 rounded-lg'>
                <p className='text-sm font-medium text-gray-600'>
                  Total Candidates
                </p>
                <p className='text-2xl font-bold text-green-600'>
                  {hrSampleData.candidates.length}
                </p>
              </div>
              <div className='bg-purple-50 p-4 rounded-lg'>
                <p className='text-sm font-medium text-gray-600'>
                  Candidates Hired
                </p>
                <p className='text-2xl font-bold text-purple-600'>
                  {
                    hrSampleData.candidates.filter((c) => c.stage === 'Hired')
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'engagement' && (
          <div className='bg-white p-8 rounded-xl shadow-sm border border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Engagement & Performance
            </h3>
            <p className='text-gray-600 mb-4'>
              Employee engagement and performance analytics coming soon...
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='bg-green-50 p-4 rounded-lg'>
                <p className='text-sm font-medium text-gray-600'>
                  Avg Engagement Score
                </p>
                <p className='text-2xl font-bold text-green-600'>
                  {(
                    hrSampleData.engagementMonthly.reduce(
                      (sum: number, e) => sum + e.engagement_score,
                      0
                    ) / hrSampleData.engagementMonthly.length
                  ).toFixed(1)}
                </p>
              </div>
              <div className='bg-yellow-50 p-4 rounded-lg'>
                <p className='text-sm font-medium text-gray-600'>
                  High Performers
                </p>
                <p className='text-2xl font-bold text-yellow-600'>
                  {
                    filteredEmployees.filter((e) => e.performance_rating >= 4)
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compensation' && (
          <div className='bg-white p-8 rounded-xl shadow-sm border border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Compensation & Equity
            </h3>
            <p className='text-gray-600 mb-4'>
              Salary analysis and pay equity insights coming soon...
            </p>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='bg-indigo-50 p-4 rounded-lg'>
                <p className='text-sm font-medium text-gray-600'>
                  Avg Salary (AED)
                </p>
                <p className='text-2xl font-bold text-indigo-600'>
                  {Math.round(
                    filteredEmployees.reduce(
                      (sum: number, e) => sum + e.salary_aed,
                      0
                    ) / filteredEmployees.length
                  ).toLocaleString()}
                </p>
              </div>
              <div className='bg-pink-50 p-4 rounded-lg'>
                <p className='text-sm font-medium text-gray-600'>
                  Gender Pay Gap
                </p>
                <p className='text-2xl font-bold text-pink-600'>
                  Analysis Available
                </p>
              </div>
              <div className='bg-orange-50 p-4 rounded-lg'>
                <p className='text-sm font-medium text-gray-600'>
                  Grade Levels
                </p>
                <p className='text-2xl font-bold text-orange-600'>
                  {hrFilterOptions.grades.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
