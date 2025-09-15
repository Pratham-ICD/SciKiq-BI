'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Legend,
} from 'recharts';
import { MonthlyHiring, DepartmentDiversity } from '../../types/hr';

interface PeopleOverviewChartsProps {
  monthlyHiring: MonthlyHiring[];
  departmentDiversity: DepartmentDiversity[];
}

export default function PeopleOverviewCharts({
  monthlyHiring,
  departmentDiversity,
}: PeopleOverviewChartsProps) {
  // Transform monthly hiring data for display
  const hiringData = monthlyHiring.map((item) => ({
    ...item,
    monthDisplay: new Date(item.month + '-01').toLocaleDateString('en-US', {
      month: 'short',
      year: '2-digit',
    }),
  }));

  // Custom tooltip for hiring chart
  const HiringTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-white p-3 border border-gray-200 rounded-lg shadow-lg'>
          <p className='font-medium text-gray-900'>{label}</p>
          <p className='text-green-600'>
            <span className='inline-block w-3 h-3 bg-green-500 rounded-full mr-2'></span>
            Hires: {payload[0]?.value || 0}
          </p>
          <p className='text-red-600'>
            <span className='inline-block w-3 h-3 bg-red-500 rounded-full mr-2'></span>
            Terms: {payload[1]?.value || 0}
          </p>
          <p className='text-blue-600 font-medium'>
            Net: {(payload[0]?.value || 0) - (payload[1]?.value || 0)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for diversity scatter plot
  const DiversityTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ payload: DepartmentDiversity }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className='bg-white p-3 border border-gray-200 rounded-lg shadow-lg'>
          <p className='font-medium text-gray-900'>{data.department}</p>
          <p className='text-gray-600'>Headcount: {data.headcount}</p>
          <p className='text-pink-600'>Female: {data.female_pct}%</p>
          <p className='text-blue-600'>Avg Tenure: {data.avg_tenure} years</p>
        </div>
      );
    }
    return null;
  };

  // Generate different colors for departments
  const departmentColors = [
    '#3B82F6',
    '#EF4444',
    '#10B981',
    '#F59E0B',
    '#8B5CF6',
    '#EC4899',
    '#06B6D4',
    '#84CC16',
    '#F97316',
    '#6366F1',
  ];

  const diversityDataWithColors = departmentDiversity.map((item, index) => ({
    ...item,
    color: departmentColors[index % departmentColors.length],
  }));

  return (
    <div className='space-y-6'>
      {/* Monthly Hiring Trends */}
      <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
        <div className='mb-4'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Hires vs Terms by Month
          </h3>
          <p className='text-sm text-gray-600'>
            Monthly hiring activity and net headcount change
          </p>
        </div>

        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={hiringData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
              <XAxis
                dataKey='monthDisplay'
                stroke='#6b7280'
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke='#6b7280'
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<HiringTooltip />} />
              <Legend />
              <Bar
                dataKey='hires'
                name='Hires'
                fill='#10B981'
                radius={[2, 2, 0, 0]}
                opacity={0.8}
              />
              <Bar
                dataKey='terms'
                name='Terms'
                fill='#EF4444'
                radius={[2, 2, 0, 0]}
                opacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Diversity Analysis */}
      <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
        <div className='mb-4'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Diversity vs Tenure by Department
          </h3>
          <p className='text-sm text-gray-600'>
            Gender diversity and average tenure across departments (bubble size
            = headcount)
          </p>
        </div>

        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <ScatterChart
              data={diversityDataWithColors}
              margin={{ top: 20, right: 30, left: 40, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
              <XAxis
                dataKey='avg_tenure'
                name='Average Tenure (years)'
                stroke='#6b7280'
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={{
                  value: 'Average Tenure (years)',
                  position: 'insideBottom',
                  offset: -10,
                  style: { textAnchor: 'middle' },
                }}
              />
              <YAxis
                dataKey='female_pct'
                name='Female %'
                stroke='#6b7280'
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={{
                  value: 'Female %',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' },
                }}
              />
              <Tooltip content={<DiversityTooltip />} />
              {diversityDataWithColors.map((dept) => (
                <Scatter
                  key={dept.department}
                  data={[dept]}
                  fill={dept.color}
                  name={dept.department}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Department legend */}
        <div className='mt-4 flex flex-wrap gap-3'>
          {diversityDataWithColors.map((dept) => (
            <div key={dept.department} className='flex items-center space-x-2'>
              <div
                className='w-3 h-3 rounded-full'
                style={{ backgroundColor: dept.color }}
              ></div>
              <span className='text-sm text-gray-600'>{dept.department}</span>
              <span className='text-xs text-gray-400'>({dept.headcount})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200'>
          <div className='text-green-800'>
            <p className='text-sm font-medium'>Total Hires (Last 12 Months)</p>
            <p className='text-2xl font-bold'>
              {hiringData.reduce((sum, month) => sum + month.hires, 0)}
            </p>
          </div>
        </div>

        <div className='bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200'>
          <div className='text-red-800'>
            <p className='text-sm font-medium'>Total Terms (Last 12 Months)</p>
            <p className='text-2xl font-bold'>
              {hiringData.reduce((sum, month) => sum + month.terms, 0)}
            </p>
          </div>
        </div>

        <div className='bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200'>
          <div className='text-blue-800'>
            <p className='text-sm font-medium'>Net Headcount Change</p>
            <p className='text-2xl font-bold'>
              {hiringData.reduce(
                (sum, month) => sum + (month.hires - month.terms),
                0
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
