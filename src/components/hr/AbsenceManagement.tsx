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
} from 'recharts';
import { Calendar, AlertTriangle, Users, Target } from 'lucide-react';
import { EmployeeData, LeaveData } from '../../types/hr';

interface AbsenceManagementProps {
  employees: EmployeeData[];
  leaveData: LeaveData[];
}

export default function AbsenceManagement({
  employees,
  leaveData,
}: AbsenceManagementProps) {
  // Calculate absence metrics
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Current year leave data
  const currentYearLeave = leaveData.filter(
    (leave) => new Date(leave.date).getFullYear() === currentYear
  );

  const currentYearTotal = currentYearLeave.reduce(
    (sum, leave) => sum + leave.days,
    0
  );

  // Leave utilization rate (assuming 22 annual leave days per employee)
  const annualLeaveEntitlement = employees.length * 22;
  const utilizationRate = (currentYearTotal / annualLeaveEntitlement) * 100;

  // Employees with high absence (>20 days this year)
  const employeeLeaveCount = currentYearLeave.reduce((acc, leave) => {
    acc[leave.employee_id] = (acc[leave.employee_id] || 0) + leave.days;
    return acc;
  }, {} as Record<string, number>);

  const highAbsenceEmployees = Object.entries(employeeLeaveCount).filter(
    ([, days]) => days > 20
  ).length;

  // Leave types distribution
  const leaveTypes = currentYearLeave.reduce((acc, leave) => {
    acc[leave.type] = (acc[leave.type] || 0) + leave.days;
    return acc;
  }, {} as Record<string, number>);

  const leaveTypeData = Object.entries(leaveTypes).map(([type, days]) => ({
    type,
    days,
    fill:
      type === 'Annual'
        ? '#3B82F6'
        : type === 'Sick'
        ? '#EF4444'
        : type === 'Emergency'
        ? '#F59E0B'
        : type === 'Maternity'
        ? '#8B5CF6'
        : '#10B981',
  }));

  // Monthly leave trends
  const monthlyLeave = currentYearLeave.reduce((acc, leave) => {
    const month = new Date(leave.date).toISOString().substring(0, 7);
    acc[month] = (acc[month] || 0) + leave.days;
    return acc;
  }, {} as Record<string, number>);

  const monthlyData = Object.entries(monthlyLeave)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, days]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', {
        month: 'short',
      }),
      leaveDays: days,
    }));

  // Department absence analysis
  const departmentAbsence = employees.reduce((acc, emp) => {
    const empLeave = employeeLeaveCount[emp.employee_id] || 0;
    if (!acc[emp.department]) {
      acc[emp.department] = { leaveDays: 0, employees: 0 };
    }
    acc[emp.department].employees += 1;
    acc[emp.department].leaveDays += empLeave;
    return acc;
  }, {} as Record<string, { employees: number; leaveDays: number }>);

  const departmentData = Object.entries(departmentAbsence).map(
    ([dept, data]) => ({
      department: dept,
      avgLeaveDays: Math.round((data.leaveDays / data.employees) * 10) / 10,
      totalLeaveDays: data.leaveDays,
      employees: data.employees,
    })
  );

  // Leave patterns by day of week
  const dayOfWeekLeave = currentYearLeave.reduce((acc, leave) => {
    const dayOfWeek = new Date(leave.date).toLocaleDateString('en-US', {
      weekday: 'long',
    });
    acc[dayOfWeek] = (acc[dayOfWeek] || 0) + 1; // Count instances, not days
    return acc;
  }, {} as Record<string, number>);

  const dayOfWeekData = Object.entries(dayOfWeekLeave).map(([day, count]) => ({
    day,
    leaveInstances: count,
  }));

  // Top absentees
  const topAbsentees = Object.entries(employeeLeaveCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([empId, days]) => {
      const employee = employees.find((emp) => emp.employee_id === empId);
      return {
        employeeId: empId,
        alias: employee?.alias || 'Unknown',
        department: employee?.department || 'Unknown',
        leaveDays: days,
      };
    });

  // Leave balance analysis (assuming 22 days annual entitlement)
  const leaveBalanceData = employees
    .map((emp) => {
      const usedDays = employeeLeaveCount[emp.employee_id] || 0;
      const remainingDays = Math.max(0, 22 - usedDays);
      return {
        alias: emp.alias,
        department: emp.department,
        usedDays,
        remainingDays,
        utilizationPct: Math.round((usedDays / 22) * 100),
      };
    })
    .sort((a, b) => b.usedDays - a.usedDays);

  return (
    <div className='space-y-6'>
      {/* KPI Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Total Leave Days
              </p>
              <p className='text-2xl font-bold text-blue-600'>
                {currentYearTotal}
              </p>
              <p className='text-xs text-gray-500'>This year</p>
            </div>
            <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
              <Calendar className='w-6 h-6 text-blue-600' />
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Avg per Employee
              </p>
              <p className='text-2xl font-bold text-green-600'>
                {(currentYearTotal / employees.length).toFixed(1)}
              </p>
              <p className='text-xs text-gray-500'>Days taken</p>
            </div>
            <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
              <Users className='w-6 h-6 text-green-600' />
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Utilization Rate
              </p>
              <p className='text-2xl font-bold text-purple-600'>
                {utilizationRate.toFixed(1)}%
              </p>
              <p className='text-xs text-gray-500'>Of entitlement</p>
            </div>
            <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center'>
              <Target className='w-6 h-6 text-purple-600' />
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>High Absence</p>
              <p className='text-2xl font-bold text-red-600'>
                {highAbsenceEmployees}
              </p>
              <p className='text-xs text-gray-500'>Employees (&gt;20 days)</p>
            </div>
            <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center'>
              <AlertTriangle className='w-6 h-6 text-red-600' />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        {/* Leave Types Distribution */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold mb-4'>
            Leave Types Distribution
          </h3>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={leaveTypeData}
                cx='50%'
                cy='50%'
                outerRadius={80}
                dataKey='days'
              >
                {leaveTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} days`, 'Leave Days']} />
            </PieChart>
          </ResponsiveContainer>
          <div className='mt-4 space-y-2'>
            {leaveTypeData.map((type, index) => (
              <div
                key={index}
                className='flex items-center justify-between text-sm'
              >
                <div className='flex items-center gap-2'>
                  <div
                    className={`w-3 h-3 rounded-full`}
                    style={{ backgroundColor: type.fill }}
                  ></div>
                  <span>{type.type}</span>
                </div>
                <span className='font-medium'>{type.days} days</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Leave Trends */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold mb-4'>Monthly Leave Trends</h3>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='month' />
              <YAxis />
              <Tooltip />
              <Line
                type='monotone'
                dataKey='leaveDays'
                stroke='#06B6D4'
                strokeWidth={2}
                dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        {/* Department Absence */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold mb-4'>
            Average Leave Days by Department
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
              <YAxis />
              <Tooltip />
              <Bar dataKey='avgLeaveDays' fill='#8B5CF6' />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leave Patterns by Day */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold mb-4'>
            Leave Instances by Day of Week
          </h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={dayOfWeekData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='day' />
              <YAxis />
              <Tooltip />
              <Bar dataKey='leaveInstances' fill='#10B981' />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Row */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        {/* Top Absentees */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold mb-4'>
            Employees with Highest Absence
          </h3>
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
                    Leave Days
                  </th>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {topAbsentees.slice(0, 8).map((emp, index) => (
                  <tr key={index}>
                    <td className='px-4 py-2 text-sm text-gray-900'>
                      {emp.alias}
                    </td>
                    <td className='px-4 py-2 text-sm text-gray-600'>
                      {emp.department}
                    </td>
                    <td className='px-4 py-2 text-sm font-medium text-blue-600'>
                      {emp.leaveDays}
                    </td>
                    <td className='px-4 py-2'>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          emp.leaveDays > 25
                            ? 'bg-red-100 text-red-800'
                            : emp.leaveDays > 20
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {emp.leaveDays > 25
                          ? 'Critical'
                          : emp.leaveDays > 20
                          ? 'High'
                          : 'Normal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Leave Balance Analysis */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold mb-4'>
            Leave Utilization Analysis
          </h3>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead>
                <tr>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Employee
                  </th>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Used
                  </th>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Remaining
                  </th>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Utilization
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {leaveBalanceData.slice(0, 8).map((emp, index) => (
                  <tr key={index}>
                    <td className='px-4 py-2 text-sm text-gray-900'>
                      {emp.alias}
                    </td>
                    <td className='px-4 py-2 text-sm text-gray-600'>
                      {emp.usedDays}
                    </td>
                    <td className='px-4 py-2 text-sm text-gray-600'>
                      {emp.remainingDays}
                    </td>
                    <td className='px-4 py-2'>
                      <div className='flex items-center'>
                        <div className='w-full bg-gray-200 rounded-full h-2 mr-2'>
                          <div
                            className={`h-2 rounded-full ${
                              emp.utilizationPct > 90
                                ? 'bg-red-500'
                                : emp.utilizationPct > 70
                                ? 'bg-orange-500'
                                : 'bg-green-500'
                            }`}
                            style={{
                              width: `${Math.min(emp.utilizationPct, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <span className='text-sm text-gray-600'>
                          {emp.utilizationPct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg'>
          <h4 className='text-lg font-semibold text-blue-800 mb-2'>
            Leave Policy Compliance
          </h4>
          <p className='text-sm text-blue-700'>
            Average utilization of {utilizationRate.toFixed(1)}% indicates{' '}
            {utilizationRate > 80
              ? 'high'
              : utilizationRate > 60
              ? 'moderate'
              : 'low'}{' '}
            leave usage. Most employees are within normal leave patterns.
          </p>
        </div>

        <div className='bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg'>
          <h4 className='text-lg font-semibold text-green-800 mb-2'>
            Sick Leave Trends
          </h4>
          <p className='text-sm text-green-700'>
            Sick leave accounts for{' '}
            {Math.round(((leaveTypes['Sick'] || 0) / currentYearTotal) * 100)}%
            of total leave. This is within acceptable industry standards.
          </p>
        </div>

        <div className='bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg'>
          <h4 className='text-lg font-semibold text-orange-800 mb-2'>
            Action Required
          </h4>
          <p className='text-sm text-orange-700'>
            {highAbsenceEmployees} employees have excessive absence (&gt;20
            days). Consider reviewing individual cases for intervention.
          </p>
        </div>
      </div>
    </div>
  );
}
