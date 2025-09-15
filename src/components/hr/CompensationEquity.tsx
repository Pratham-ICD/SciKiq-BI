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
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  Users,
  AlertCircle,
  Award,
  Target,
} from 'lucide-react';
import { EmployeeData } from '../../types/hr';

interface CompensationEquityProps {
  employees: EmployeeData[];
}

export default function CompensationEquity({
  employees,
}: CompensationEquityProps) {
  // Calculate compensation metrics
  const totalPayroll = employees.reduce((sum, emp) => sum + emp.salary_aed, 0);
  const avgSalary = totalPayroll / employees.length;
  const medianSalary =
    [...employees].sort((a, b) => a.salary_aed - b.salary_aed)[
      Math.floor(employees.length / 2)
    ]?.salary_aed || 0;

  // Gender pay analysis
  const maleEmployees = employees.filter((emp) => emp.gender === 'Male');
  const femaleEmployees = employees.filter((emp) => emp.gender === 'Female');
  const avgMaleSalary =
    maleEmployees.reduce((sum, emp) => sum + emp.salary_aed, 0) /
    maleEmployees.length;
  const avgFemaleSalary =
    femaleEmployees.reduce((sum, emp) => sum + emp.salary_aed, 0) /
    femaleEmployees.length;
  const payGap = ((avgMaleSalary - avgFemaleSalary) / avgMaleSalary) * 100;

  // Salary by grade
  const salaryByGrade = employees.reduce((acc, emp) => {
    if (!acc[emp.grade]) {
      acc[emp.grade] = { total: 0, sum: 0, salaries: [] };
    }
    acc[emp.grade].total += 1;
    acc[emp.grade].sum += emp.salary_aed;
    acc[emp.grade].salaries.push(emp.salary_aed);
    return acc;
  }, {} as Record<string, { total: number; sum: number; salaries: number[] }>);

  const gradeData = Object.entries(salaryByGrade).map(([grade, data]) => {
    const sortedSalaries = data.salaries.sort((a, b) => a - b);
    const median = sortedSalaries[Math.floor(sortedSalaries.length / 2)];
    const min = Math.min(...sortedSalaries);
    const max = Math.max(...sortedSalaries);
    return {
      grade,
      avgSalary: Math.round(data.sum / data.total),
      medianSalary: median,
      minSalary: min,
      maxSalary: max,
      count: data.total,
    };
  });

  // Department compensation analysis
  const deptSalaryData = employees.reduce((acc, emp) => {
    if (!acc[emp.department]) {
      acc[emp.department] = {
        total: 0,
        sum: 0,
        male: 0,
        female: 0,
        maleSum: 0,
        femaleSum: 0,
      };
    }
    acc[emp.department].total += 1;
    acc[emp.department].sum += emp.salary_aed;
    if (emp.gender === 'Male') {
      acc[emp.department].male += 1;
      acc[emp.department].maleSum += emp.salary_aed;
    } else {
      acc[emp.department].female += 1;
      acc[emp.department].femaleSum += emp.salary_aed;
    }
    return acc;
  }, {} as Record<string, { total: number; sum: number; male: number; female: number; maleSum: number; femaleSum: number }>);

  const departmentData = Object.entries(deptSalaryData).map(([dept, data]) => ({
    department: dept,
    avgSalary: Math.round(data.sum / data.total),
    avgMaleSalary: data.male > 0 ? Math.round(data.maleSum / data.male) : 0,
    avgFemaleSalary:
      data.female > 0 ? Math.round(data.femaleSum / data.female) : 0,
    payGap:
      data.male > 0 && data.female > 0
        ? Math.round(
            ((data.maleSum / data.male - data.femaleSum / data.female) /
              (data.maleSum / data.male)) *
              100
          )
        : 0,
    headcount: data.total,
  }));

  // Age vs Salary scatter
  const ageSalaryData = employees.map((emp) => ({
    age: emp.age,
    salary: emp.salary_aed,
    department: emp.department,
    grade: emp.grade,
    name: emp.alias,
  }));

  // Tenure vs Salary analysis
  const tenureSalaryData = employees.map((emp) => {
    const tenure = emp.hire_date
      ? Math.floor(
          (new Date().getTime() - new Date(emp.hire_date).getTime()) /
            (1000 * 60 * 60 * 24 * 365)
        )
      : 0;
    return {
      tenure,
      salary: emp.salary_aed,
      department: emp.department,
      name: emp.alias,
    };
  });

  // Salary distribution ranges
  const salaryRanges = [
    {
      range: '< 10K',
      count: employees.filter((emp) => emp.salary_aed < 10000).length,
      fill: '#EF4444',
    },
    {
      range: '10K-20K',
      count: employees.filter(
        (emp) => emp.salary_aed >= 10000 && emp.salary_aed < 20000
      ).length,
      fill: '#F59E0B',
    },
    {
      range: '20K-30K',
      count: employees.filter(
        (emp) => emp.salary_aed >= 20000 && emp.salary_aed < 30000
      ).length,
      fill: '#10B981',
    },
    {
      range: '30K-40K',
      count: employees.filter(
        (emp) => emp.salary_aed >= 30000 && emp.salary_aed < 40000
      ).length,
      fill: '#06B6D4',
    },
    {
      range: '40K+',
      count: employees.filter((emp) => emp.salary_aed >= 40000).length,
      fill: '#8B5CF6',
    },
  ].filter((range) => range.count > 0);

  // Compensation quartiles
  const sortedSalaries = [...employees].sort(
    (a, b) => a.salary_aed - b.salary_aed
  );
  const q1 =
    sortedSalaries[Math.floor(sortedSalaries.length * 0.25)]?.salary_aed || 0;
  const q2 = medianSalary;
  const q3 =
    sortedSalaries[Math.floor(sortedSalaries.length * 0.75)]?.salary_aed || 0;

  return (
    <div className='space-y-6'>
      {/* KPI Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Total Payroll</p>
              <p className='text-2xl font-bold text-green-600'>
                AED {(totalPayroll / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
              <DollarSign className='w-6 h-6 text-green-600' />
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Average Salary
              </p>
              <p className='text-2xl font-bold text-blue-600'>
                AED {Math.round(avgSalary / 1000)}K
              </p>
            </div>
            <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
              <TrendingUp className='w-6 h-6 text-blue-600' />
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Median Salary</p>
              <p className='text-2xl font-bold text-purple-600'>
                AED {Math.round(medianSalary / 1000)}K
              </p>
            </div>
            <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center'>
              <Target className='w-6 h-6 text-purple-600' />
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Gender Pay Gap
              </p>
              <p className='text-2xl font-bold text-orange-600'>
                {payGap.toFixed(1)}%
              </p>
              <p className='text-xs text-gray-500'>Male vs Female avg</p>
            </div>
            <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center'>
              <AlertCircle className='w-6 h-6 text-orange-600' />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        {/* Salary by Grade */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold mb-4'>
            Salary Distribution by Grade
          </h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={gradeData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='grade' />
              <YAxis
                tickFormatter={(value) => `${Math.round(value / 1000)}K`}
              />
              <Tooltip
                formatter={(value) => [
                  `AED ${Math.round(Number(value) / 1000)}K`,
                  'Salary',
                ]}
              />
              <Bar dataKey='avgSalary' fill='#3B82F6' name='Average' />
              <Bar dataKey='medianSalary' fill='#10B981' name='Median' />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department Pay Analysis */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold mb-4'>
            Department Average Salaries
          </h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='department'
                angle={-45}
                textAnchor='end'
                height={80}
              />
              <YAxis
                tickFormatter={(value) => `${Math.round(value / 1000)}K`}
              />
              <Tooltip
                formatter={(value) => [
                  `AED ${Math.round(Number(value) / 1000)}K`,
                  'Avg Salary',
                ]}
              />
              <Bar dataKey='avgSalary' fill='#8B5CF6' />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        {/* Age vs Salary Scatter */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold mb-4'>
            Age vs Salary Distribution
          </h3>
          <ResponsiveContainer width='100%' height={300}>
            <ScatterChart data={ageSalaryData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='age'
                type='number'
                domain={[20, 65]}
                label={{ value: 'Age', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                dataKey='salary'
                type='number'
                tickFormatter={(value) => `${Math.round(value / 1000)}K`}
                label={{
                  value: 'Salary (AED)',
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <Tooltip
                formatter={(value, name) => [
                  name === 'salary'
                    ? `AED ${Math.round(Number(value) / 1000)}K`
                    : value,
                  name,
                ]}
                labelFormatter={(label) => `Age: ${label}`}
              />
              <Scatter dataKey='salary' fill='#06B6D4' fillOpacity={0.6} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Salary Range Distribution */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold mb-4'>
            Salary Range Distribution
          </h3>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={salaryRanges}
                cx='50%'
                cy='50%'
                outerRadius={80}
                dataKey='count'
              >
                {salaryRanges.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className='mt-4 space-y-2'>
            {salaryRanges.map((range, index) => (
              <div
                key={index}
                className='flex items-center justify-between text-sm'
              >
                <div className='flex items-center gap-2'>
                  <div
                    className={`w-3 h-3 rounded-full`}
                    style={{ backgroundColor: range.fill }}
                  ></div>
                  <span>{range.range}</span>
                </div>
                <span className='font-medium'>{range.count} employees</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        {/* Tenure vs Salary */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold mb-4'>
            Tenure vs Salary Analysis
          </h3>
          <ResponsiveContainer width='100%' height={300}>
            <ScatterChart data={tenureSalaryData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='tenure'
                type='number'
                domain={[0, 25]}
                label={{
                  value: 'Years of Service',
                  position: 'insideBottom',
                  offset: -5,
                }}
              />
              <YAxis
                dataKey='salary'
                type='number'
                tickFormatter={(value) => `${Math.round(value / 1000)}K`}
                label={{
                  value: 'Salary (AED)',
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <Tooltip
                formatter={(value, name) => [
                  name === 'salary'
                    ? `AED ${Math.round(Number(value) / 1000)}K`
                    : name === 'tenure'
                    ? `${value} years`
                    : value,
                  name,
                ]}
              />
              <Scatter dataKey='salary' fill='#F59E0B' fillOpacity={0.6} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Pay Gap by Department */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold mb-4'>
            Gender Pay Gap by Department
          </h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={departmentData.filter((d) => d.payGap !== 0)}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='department'
                angle={-45}
                textAnchor='end'
                height={80}
              />
              <YAxis
                label={{
                  value: 'Pay Gap %',
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <Tooltip formatter={(value) => [`${value}%`, 'Pay Gap']} />
              <Bar dataKey='payGap' fill='#F59E0B' />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Compensation Summary Table */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h3 className='text-lg font-semibold mb-4'>
          Compensation Summary by Grade
        </h3>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead>
              <tr>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Grade
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Count
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Min Salary
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Average
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Median
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Max Salary
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {gradeData
                .sort((a, b) => a.grade.localeCompare(b.grade))
                .map((grade, index) => (
                  <tr key={index}>
                    <td className='px-4 py-2 text-sm font-medium text-gray-900'>
                      {grade.grade}
                    </td>
                    <td className='px-4 py-2 text-sm text-gray-600'>
                      {grade.count}
                    </td>
                    <td className='px-4 py-2 text-sm text-gray-600'>
                      AED {Math.round(grade.minSalary / 1000)}K
                    </td>
                    <td className='px-4 py-2 text-sm font-medium text-blue-600'>
                      AED {Math.round(grade.avgSalary / 1000)}K
                    </td>
                    <td className='px-4 py-2 text-sm text-gray-600'>
                      AED {Math.round(grade.medianSalary / 1000)}K
                    </td>
                    <td className='px-4 py-2 text-sm text-gray-600'>
                      AED {Math.round(grade.maxSalary / 1000)}K
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compensation Quartiles */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h3 className='text-lg font-semibold mb-4'>Salary Quartiles</h3>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div className='text-center p-4 bg-blue-50 rounded-lg'>
            <h4 className='text-sm font-medium text-blue-700'>
              Q1 (25th percentile)
            </h4>
            <p className='text-xl font-bold text-blue-600'>
              AED {Math.round(q1 / 1000)}K
            </p>
          </div>
          <div className='text-center p-4 bg-green-50 rounded-lg'>
            <h4 className='text-sm font-medium text-green-700'>Q2 (Median)</h4>
            <p className='text-xl font-bold text-green-600'>
              AED {Math.round(q2 / 1000)}K
            </p>
          </div>
          <div className='text-center p-4 bg-purple-50 rounded-lg'>
            <h4 className='text-sm font-medium text-purple-700'>
              Q3 (75th percentile)
            </h4>
            <p className='text-xl font-bold text-purple-600'>
              AED {Math.round(q3 / 1000)}K
            </p>
          </div>
          <div className='text-center p-4 bg-orange-50 rounded-lg'>
            <h4 className='text-sm font-medium text-orange-700'>Range</h4>
            <p className='text-xl font-bold text-orange-600'>
              AED {Math.round((q3 - q1) / 1000)}K
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
