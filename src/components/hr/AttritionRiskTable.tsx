'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Download,
  Info,
  TrendingUp,
  Users,
  Target,
} from 'lucide-react';
import { AttritionRiskEmployee } from '../../types/hr';

interface AttritionRiskTableProps {
  riskEmployees: AttritionRiskEmployee[];
}

export default function AttritionRiskTable({
  riskEmployees,
}: AttritionRiskTableProps) {
  const [showAll, setShowAll] = useState(false);
  const displayLimit = 20;

  const displayedEmployees = showAll
    ? riskEmployees
    : riskEmployees.slice(0, displayLimit);
  const highRiskCount = riskEmployees.filter(
    (emp) => emp.risk_score >= 70
  ).length;
  const mediumRiskCount = riskEmployees.filter(
    (emp) => emp.risk_score >= 40 && emp.risk_score < 70
  ).length;

  const getRiskLevel = (score: number) => {
    if (score >= 70)
      return {
        level: 'High',
        color: 'text-red-600 bg-red-100',
        dotColor: 'bg-red-500',
      };
    if (score >= 40)
      return {
        level: 'Medium',
        color: 'text-orange-600 bg-orange-100',
        dotColor: 'bg-orange-500',
      };
    return {
      level: 'Low',
      color: 'text-green-600 bg-green-100',
      dotColor: 'bg-green-500',
    };
  };

  const downloadCSV = () => {
    const headers = [
      'Employee',
      'Department',
      'Location',
      'Grade',
      'Tenure (Years)',
      'Performance',
      'Engagement',
      'Risk Score',
      'Risk Reasons',
    ];
    const rows = riskEmployees.map((emp) => [
      emp.alias,
      emp.department,
      emp.location,
      emp.grade,
      emp.tenure_years.toString(),
      emp.performance_rating.toString(),
      emp.engagement_score.toString(),
      emp.risk_score.toString(),
      emp.reasons,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'hr_attrition_risk.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate department hotspots
  const departmentRisk = riskEmployees
    .filter((emp) => emp.risk_score >= 50)
    .reduce((acc, emp) => {
      if (!acc[emp.department]) {
        acc[emp.department] = { count: 0, totalRisk: 0 };
      }
      acc[emp.department].count++;
      acc[emp.department].totalRisk += emp.risk_score;
      return acc;
    }, {} as Record<string, { count: number; totalRisk: number }>);

  const topRiskDepartments = Object.entries(departmentRisk)
    .map(([dept, data]) => ({
      department: dept,
      count: data.count,
      avgRisk: Math.round(data.totalRisk / data.count),
    }))
    .sort((a, b) => b.avgRisk - a.avgRisk)
    .slice(0, 3);

  return (
    <div className='space-y-6'>
      {/* Risk Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200'>
          <div className='flex items-center space-x-3'>
            <AlertTriangle className='w-8 h-8 text-red-600' />
            <div>
              <p className='text-sm font-medium text-gray-600'>High Risk</p>
              <p className='text-2xl font-bold text-red-700'>{highRiskCount}</p>
              <p className='text-xs text-gray-500'>Score ≥ 70</p>
            </div>
          </div>
        </div>

        <div className='bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200'>
          <div className='flex items-center space-x-3'>
            <TrendingUp className='w-8 h-8 text-orange-600' />
            <div>
              <p className='text-sm font-medium text-gray-600'>Medium Risk</p>
              <p className='text-2xl font-bold text-orange-700'>
                {mediumRiskCount}
              </p>
              <p className='text-xs text-gray-500'>Score 40-69</p>
            </div>
          </div>
        </div>

        <div className='bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200'>
          <div className='flex items-center space-x-3'>
            <Users className='w-8 h-8 text-blue-600' />
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Total Analyzed
              </p>
              <p className='text-2xl font-bold text-blue-700'>
                {riskEmployees.length}
              </p>
              <p className='text-xs text-gray-500'>Active employees</p>
            </div>
          </div>
        </div>

        <div className='bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200'>
          <div className='flex items-center space-x-3'>
            <Target className='w-8 h-8 text-purple-600' />
            <div>
              <p className='text-sm font-medium text-gray-600'>Risk %</p>
              <p className='text-2xl font-bold text-purple-700'>
                {Math.round(
                  ((highRiskCount + mediumRiskCount) / riskEmployees.length) *
                    100
                )}
                %
              </p>
              <p className='text-xs text-gray-500'>Medium + High</p>
            </div>
          </div>
        </div>
      </div>

      {/* Department Hotspots */}
      {topRiskDepartments.length > 0 && (
        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Department Risk Hotspots
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {topRiskDepartments.map((dept) => (
              <div key={dept.department} className='bg-gray-50 p-4 rounded-lg'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='font-medium text-gray-900'>
                      {dept.department}
                    </p>
                    <p className='text-sm text-gray-600'>
                      {dept.count} at-risk employees
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-lg font-bold text-red-600'>
                      {dept.avgRisk}
                    </p>
                    <p className='text-xs text-gray-500'>Avg Risk Score</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Table */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200'>
        <div className='p-6 border-b border-gray-200'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900'>
                Attrition Risk Analysis
              </h3>
              <p className='text-sm text-gray-600'>
                Employees ranked by risk score (showing top {displayLimit})
              </p>
            </div>
            <div className='flex items-center space-x-3'>
              <button
                onClick={downloadCSV}
                className='flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
              >
                <Download className='w-4 h-4' />
                <span>Download CSV</span>
              </button>
            </div>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Employee
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Department
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Location
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Grade
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Tenure
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Performance
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Engagement
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Risk Score
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Risk Factors
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {displayedEmployees.map((employee) => {
                const risk = getRiskLevel(employee.risk_score);
                return (
                  <tr key={employee.employee_id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {employee.alias}
                      </div>
                      <div className='text-xs text-gray-500'>
                        {employee.employee_id}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {employee.department}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {employee.location}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {employee.grade}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {employee.tenure_years} yrs
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='text-sm text-gray-900'>
                          {employee.performance_rating}
                        </div>
                        <div className='ml-2 flex'>
                          {Array.from({ length: 5 }, (_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full mr-1 ${
                                i < employee.performance_rating
                                  ? 'bg-yellow-400'
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {employee.engagement_score}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center space-x-2'>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${risk.color}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-1 ${risk.dotColor}`}
                          ></div>
                          {employee.risk_score}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div
                        className='text-sm text-gray-900 max-w-xs truncate'
                        title={employee.reasons}
                      >
                        {employee.reasons}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {riskEmployees.length > displayLimit && (
          <div className='px-6 py-4 border-t border-gray-200 bg-gray-50'>
            <button
              onClick={() => setShowAll(!showAll)}
              className='text-blue-600 hover:text-blue-800 text-sm font-medium'
            >
              {showAll
                ? 'Show Less'
                : `Show All ${riskEmployees.length} Employees`}
            </button>
          </div>
        )}
      </div>

      {/* Risk Methodology */}
      <div className='bg-blue-50 border border-blue-200 rounded-xl p-6'>
        <div className='flex items-start space-x-3'>
          <Info className='w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0' />
          <div>
            <h4 className='text-sm font-medium text-blue-900 mb-2'>
              Risk Scoring Methodology
            </h4>
            <div className='text-sm text-blue-800 space-y-1'>
              <p>
                <strong>Risk Score (0-100):</strong> Combines multiple factors
                weighted by impact on attrition:
              </p>
              <ul className='list-disc list-inside ml-4 space-y-1'>
                <li>
                  <strong>Performance (25%):</strong> Low ratings increase risk
                </li>
                <li>
                  <strong>Engagement (25%):</strong> Scores below 3.0 indicate
                  disengagement
                </li>
                <li>
                  <strong>Tenure (15%):</strong> New hires (&lt;6 months) are
                  flight risks
                </li>
                <li>
                  <strong>Promotion History (15%):</strong> No promotion in 3+
                  years
                </li>
                <li>
                  <strong>Overtime (10%):</strong> Excessive hours
                  (&gt;25/month) indicate burnout
                </li>
                <li>
                  <strong>Compensation (10%):</strong> Below-market pay relative
                  to grade median
                </li>
              </ul>
              <p className='mt-2'>
                <strong>Privacy:</strong> Employee aliases are used to protect
                individual identity while enabling HR action.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
