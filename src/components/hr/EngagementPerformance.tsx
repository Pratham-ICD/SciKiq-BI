'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from 'recharts';
import {
  TrendingUp,
  Star,
  Target,
  Award,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { EmployeeData, EngagementData } from '../../types/hr';

interface EngagementPerformanceProps {
  employees: EmployeeData[];
  engagementData: EngagementData[];
}

export default function EngagementPerformance({
  employees,
  engagementData,
}: EngagementPerformanceProps) {
  // Calculate performance metrics
  const avgPerformance =
    employees.reduce((sum, emp) => sum + emp.performance_rating, 0) /
    employees.length;
  const avgEngagement =
    employees.reduce((sum, emp) => sum + emp.engagement_score, 0) /
    employees.length;
  const highPerformers = employees.filter(
    (emp) => emp.performance_rating >= 4
  ).length;
  const lowPerformers = employees.filter(
    (emp) => emp.performance_rating <= 2
  ).length;

  // Performance distribution
  const performanceDistribution = [
    {
      rating: '1 - Poor',
      count: employees.filter((emp) => emp.performance_rating === 1).length,
      fill: '#EF4444',
    },
    {
      rating: '2 - Below Avg',
      count: employees.filter((emp) => emp.performance_rating === 2).length,
      fill: '#F59E0B',
    },
    {
      rating: '3 - Average',
      count: employees.filter((emp) => emp.performance_rating === 3).length,
      fill: '#10B981',
    },
    {
      rating: '4 - Good',
      count: employees.filter((emp) => emp.performance_rating === 4).length,
      fill: '#06B6D4',
    },
    {
      rating: '5 - Excellent',
      count: employees.filter((emp) => emp.performance_rating === 5).length,
      fill: '#8B5CF6',
    },
  ];

  // Engagement trends (monthly data)
  const engagementTrends = engagementData
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
    .slice(-12) // Last 12 months
    .map((item) => ({
      month: new Date(item.month).toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      }),
      engagement: item.engagement_score,
    }));

  // Department performance comparison
  const departmentPerformance = employees.reduce((acc, emp) => {
    if (!acc[emp.department]) {
      acc[emp.department] = { total: 0, sum: 0, engSum: 0 };
    }
    acc[emp.department].total += 1;
    acc[emp.department].sum += emp.performance_rating;
    acc[emp.department].engSum += emp.engagement_score;
    return acc;
  }, {} as Record<string, { total: number; sum: number; engSum: number }>);

  const deptPerformanceData = Object.entries(departmentPerformance).map(
    ([dept, data]) => ({
      department: dept,
      avgPerformance: Math.round((data.sum / data.total) * 100) / 100,
      avgEngagement: Math.round((data.engSum / data.total) * 100) / 100,
      headcount: data.total,
    })
  );

  // Performance vs Engagement scatter
  const scatterData = employees.map((emp) => ({
    performance: emp.performance_rating,
    engagement: emp.engagement_score,
    department: emp.department,
    name: emp.alias,
  }));

  // Grade-wise performance
  const gradePerformance = employees.reduce((acc, emp) => {
    if (!acc[emp.grade]) {
      acc[emp.grade] = { total: 0, sum: 0 };
    }
    acc[emp.grade].total += 1;
    acc[emp.grade].sum += emp.performance_rating;
    return acc;
  }, {} as Record<string, { total: number; sum: number }>);

  const gradeData = Object.entries(gradePerformance).map(([grade, data]) => ({
    grade,
    avgPerformance: Math.round((data.sum / data.total) * 100) / 100,
    count: data.total,
  }));

  // Engagement levels distribution
  const engagementLevels = [
    {
      level: 'Low (≤3.0)',
      count: employees.filter((emp) => emp.engagement_score <= 3.0).length,
      fill: '#EF4444',
    },
    {
      level: 'Medium (3.1-3.8)',
      count: employees.filter(
        (emp) => emp.engagement_score > 3.0 && emp.engagement_score <= 3.8
      ).length,
      fill: '#F59E0B',
    },
    {
      level: 'High (>3.8)',
      count: employees.filter((emp) => emp.engagement_score > 3.8).length,
      fill: '#10B981',
    },
  ];

  return (
    <div className='space-y-6'>
      {/* KPI Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Avg Performance
              </p>
              <p className='text-2xl font-bold text-blue-600'>
                {avgPerformance.toFixed(1)}/5
              </p>
            </div>
            <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
              <Star className='w-6 h-6 text-blue-600' />
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Avg Engagement
              </p>
              <p className='text-2xl font-bold text-green-600'>
                {avgEngagement.toFixed(1)}/5
              </p>
            </div>
            <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
              <TrendingUp className='w-6 h-6 text-green-600' />
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                High Performers
              </p>
              <p className='text-2xl font-bold text-purple-600'>
                {highPerformers}
              </p>
              <p className='text-xs text-gray-500'>
                {Math.round((highPerformers / employees.length) * 100)}% of
                workforce
              </p>
            </div>
            <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center'>
              <Award className='w-6 h-6 text-purple-600' />
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>At Risk</p>
              <p className='text-2xl font-bold text-red-600'>{lowPerformers}</p>
              <p className='text-xs text-gray-500'>
                {Math.round((lowPerformers / employees.length) * 100)}% need
                attention
              </p>
            </div>
            <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center'>
              <AlertTriangle className='w-6 h-6 text-red-600' />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        {/* Performance Distribution */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold mb-4'>
            Performance Rating Distribution
          </h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={performanceDistribution}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='rating'
                angle={-45}
                textAnchor='end'
                height={80}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey='count' fill='#3B82F6' />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Trends */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold mb-4'>
            Engagement Trends (12 Months)
          </h3>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={engagementTrends}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='month' />
              <YAxis domain={[2.5, 4.5]} />
              <Tooltip />
              <Line
                type='monotone'
                dataKey='engagement'
                stroke='#10B981'
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        {/* Department Performance */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold mb-4'>
            Department Performance & Engagement
          </h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={deptPerformanceData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='department'
                angle={-45}
                textAnchor='end'
                height={80}
              />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey='avgPerformance'
                fill='#3B82F6'
                name='Avg Performance'
              />
              <Bar
                dataKey='avgEngagement'
                fill='#10B981'
                name='Avg Engagement'
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Levels */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold mb-4'>
            Engagement Level Distribution
          </h3>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={engagementLevels}
                cx='50%'
                cy='50%'
                outerRadius={80}
                dataKey='count'
              >
                {engagementLevels.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className='mt-4 space-y-2'>
            {engagementLevels.map((level, index) => (
              <div
                key={index}
                className='flex items-center justify-between text-sm'
              >
                <div className='flex items-center gap-2'>
                  <div
                    className={`w-3 h-3 rounded-full`}
                    style={{ backgroundColor: level.fill }}
                  ></div>
                  <span>{level.level}</span>
                </div>
                <span className='font-medium'>{level.count} employees</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        {/* Performance vs Engagement Scatter */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold mb-4'>
            Performance vs Engagement Matrix
          </h3>
          <ResponsiveContainer width='100%' height={300}>
            <ScatterChart data={scatterData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='performance'
                type='number'
                domain={[0.5, 5.5]}
                label={{
                  value: 'Performance Rating',
                  position: 'insideBottom',
                  offset: -5,
                }}
              />
              <YAxis
                dataKey='engagement'
                type='number'
                domain={[2.5, 4.5]}
                label={{
                  value: 'Engagement Score',
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <Tooltip
                formatter={(value, name) => [value, name]}
                labelFormatter={(label) => `Employee: ${label}`}
              />
              <Scatter dataKey='engagement' fill='#3B82F6' fillOpacity={0.6} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Grade Performance */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold mb-4'>
            Performance by Grade Level
          </h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={gradeData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='grade' />
              <YAxis />
              <Tooltip />
              <Bar dataKey='avgPerformance' fill='#8B5CF6' />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Details Table */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h3 className='text-lg font-semibold mb-4'>Top & Bottom Performers</h3>
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
          {/* Top Performers */}
          <div>
            <h4 className='text-md font-medium text-green-700 mb-3'>
              Top Performers (Rating ≥ 4)
            </h4>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead>
                  <tr>
                    <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Employee
                    </th>
                    <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Department
                    </th>
                    <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Performance
                    </th>
                    <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Engagement
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {employees
                    .filter((emp) => emp.performance_rating >= 4)
                    .sort((a, b) => b.performance_rating - a.performance_rating)
                    .slice(0, 8)
                    .map((emp, index) => (
                      <tr key={index}>
                        <td className='px-4 py-2 text-sm text-gray-900'>
                          {emp.alias}
                        </td>
                        <td className='px-4 py-2 text-sm text-gray-600'>
                          {emp.department}
                        </td>
                        <td className='px-4 py-2 text-sm font-medium text-green-600'>
                          {emp.performance_rating}
                        </td>
                        <td className='px-4 py-2 text-sm text-gray-600'>
                          {emp.engagement_score.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Performers */}
          <div>
            <h4 className='text-md font-medium text-red-700 mb-3'>
              Needs Attention (Rating ≤ 2)
            </h4>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead>
                  <tr>
                    <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Employee
                    </th>
                    <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Department
                    </th>
                    <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Performance
                    </th>
                    <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Engagement
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {employees
                    .filter((emp) => emp.performance_rating <= 2)
                    .sort((a, b) => a.performance_rating - b.performance_rating)
                    .slice(0, 8)
                    .map((emp, index) => (
                      <tr key={index}>
                        <td className='px-4 py-2 text-sm text-gray-900'>
                          {emp.alias}
                        </td>
                        <td className='px-4 py-2 text-sm text-gray-600'>
                          {emp.department}
                        </td>
                        <td className='px-4 py-2 text-sm font-medium text-red-600'>
                          {emp.performance_rating}
                        </td>
                        <td className='px-4 py-2 text-sm text-gray-600'>
                          {emp.engagement_score.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
