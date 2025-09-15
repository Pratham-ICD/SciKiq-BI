'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, Clock, Target, CheckCircle } from 'lucide-react';
import { RequisitionData, CandidateData } from '../../types/hr';

interface RecruitingPipelineProps {
  requisitions: RequisitionData[];
  candidates: CandidateData[];
}

export default function RecruitingPipeline({
  requisitions,
  candidates,
}: RecruitingPipelineProps) {
  // Calculate recruiting metrics
  const totalRequisitions = requisitions.length;
  const activeRequisitions = requisitions.filter(
    (req) => req.status === 'Open'
  ).length;
  const closedRequisitions = requisitions.filter(
    (req) => req.status === 'Closed'
  ).length;

  // Calculate average time to hire (simplified - using days since open)
  const avgDaysOpen =
    requisitions
      .map((req) => {
        const days = Math.floor(
          (new Date().getTime() - new Date(req.open_date).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return days;
      })
      .reduce((sum, days) => sum + days, 0) / totalRequisitions || 0;

  // Candidate funnel data
  const funnelData = [
    {
      name: 'Sourced',
      value: candidates.filter((c) => c.stage === 'Sourced').length,
      fill: '#3B82F6',
    },
    {
      name: 'Screen',
      value: candidates.filter((c) => c.stage === 'Screen').length,
      fill: '#06B6D4',
    },
    {
      name: 'Interview',
      value: candidates.filter((c) => c.stage === 'Interview').length,
      fill: '#10B981',
    },
    {
      name: 'Offer',
      value: candidates.filter((c) => c.stage === 'Offer').length,
      fill: '#F59E0B',
    },
    {
      name: 'Hired',
      value: candidates.filter((c) => c.stage === 'Hired').length,
      fill: '#8B5CF6',
    },
    {
      name: 'Rejected',
      value: candidates.filter((c) => c.stage === 'Rejected').length,
      fill: '#EF4444',
    },
  ].filter((item) => item.value > 0);

  // Department-wise requisitions
  const deptRequisitions = requisitions.reduce((acc, req) => {
    acc[req.department] = (acc[req.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const departmentData = Object.entries(deptRequisitions).map(
    ([dept, count]) => ({
      department: dept,
      openings: count,
    })
  );

  // Candidate submissions by month
  const submissionsByMonth = candidates.reduce((acc, candidate) => {
    const month = new Date(candidate.submitted_date)
      .toISOString()
      .substring(0, 7);
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const submissionData = Object.entries(submissionsByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6) // Last 6 months
    .map(([month, count]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      }),
      submissions: count,
    }));

  // Stage distribution
  const stageData = [
    {
      stage: 'Sourced',
      count: candidates.filter((c) => c.stage === 'Sourced').length,
      fill: '#3B82F6',
    },
    {
      stage: 'Screen',
      count: candidates.filter((c) => c.stage === 'Screen').length,
      fill: '#06B6D4',
    },
    {
      stage: 'Interview',
      count: candidates.filter((c) => c.stage === 'Interview').length,
      fill: '#10B981',
    },
    {
      stage: 'Offer',
      count: candidates.filter((c) => c.stage === 'Offer').length,
      fill: '#F59E0B',
    },
    {
      stage: 'Hired',
      count: candidates.filter((c) => c.stage === 'Hired').length,
      fill: '#8B5CF6',
    },
    {
      stage: 'Rejected',
      count: candidates.filter((c) => c.stage === 'Rejected').length,
      fill: '#EF4444',
    },
  ].filter((item) => item.count > 0);

  return (
    <div className='space-y-6'>
      {/* KPI Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Total Openings
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {totalRequisitions}
              </p>
            </div>
            <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
              <Target className='w-6 h-6 text-blue-600' />
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Active Openings
              </p>
              <p className='text-2xl font-bold text-orange-600'>
                {activeRequisitions}
              </p>
            </div>
            <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center'>
              <Clock className='w-6 h-6 text-orange-600' />
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Closed Positions
              </p>
              <p className='text-2xl font-bold text-green-600'>
                {closedRequisitions}
              </p>
            </div>
            <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
              <CheckCircle className='w-6 h-6 text-green-600' />
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Avg. Days Open
              </p>
              <p className='text-2xl font-bold text-purple-600'>
                {Math.round(avgDaysOpen)}
              </p>
            </div>
            <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center'>
              <TrendingUp className='w-6 h-6 text-purple-600' />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        {/* Candidate Pipeline Stages */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold mb-4'>Candidate Pipeline</h3>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={stageData}
                cx='50%'
                cy='50%'
                outerRadius={80}
                dataKey='count'
              >
                {stageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Department Openings */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold mb-4'>Openings by Department</h3>
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
              <Bar dataKey='openings' fill='#3B82F6' />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        {/* Monthly Submissions */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold mb-4'>
            Monthly Candidate Submissions
          </h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={submissionData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='month' />
              <YAxis />
              <Tooltip />
              <Bar dataKey='submissions' fill='#06B6D4' />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Funnel Conversion */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold mb-4'>Recruitment Funnel</h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={funnelData} layout='horizontal'>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis type='number' />
              <YAxis dataKey='name' type='category' width={80} />
              <Tooltip />
              <Bar dataKey='value' fill='#8B5CF6' />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        {/* Active Requisitions Table */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold mb-4'>Active Requisitions</h3>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead>
                <tr>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Req ID
                  </th>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Department
                  </th>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Days Open
                  </th>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Candidates
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {requisitions
                  .filter((req) => req.status === 'Open')
                  .slice(0, 8)
                  .map((req, index) => {
                    const daysOpen = Math.floor(
                      (new Date().getTime() -
                        new Date(req.open_date).getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    const candidateCount = candidates.filter(
                      (c) => c.req_id === req.req_id
                    ).length;
                    return (
                      <tr key={index}>
                        <td className='px-4 py-2 text-sm text-gray-900'>
                          {req.req_id}
                        </td>
                        <td className='px-4 py-2 text-sm text-gray-600'>
                          {req.department}
                        </td>
                        <td className='px-4 py-2 text-sm text-gray-600'>
                          {daysOpen}
                        </td>
                        <td className='px-4 py-2 text-sm text-gray-600'>
                          {candidateCount}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Candidates */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold mb-4'>
            Recent Candidate Activity
          </h3>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead>
                <tr>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Candidate ID
                  </th>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Req ID
                  </th>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Stage
                  </th>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {candidates
                  .sort(
                    (a, b) =>
                      new Date(b.submitted_date).getTime() -
                      new Date(a.submitted_date).getTime()
                  )
                  .slice(0, 8)
                  .map((candidate, index) => (
                    <tr key={index}>
                      <td className='px-4 py-2 text-sm text-gray-900'>
                        {candidate.candidate_id}
                      </td>
                      <td className='px-4 py-2 text-sm text-gray-600'>
                        {candidate.req_id}
                      </td>
                      <td className='px-4 py-2'>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            candidate.stage === 'Hired'
                              ? 'bg-green-100 text-green-800'
                              : candidate.stage === 'Rejected'
                              ? 'bg-red-100 text-red-800'
                              : candidate.stage === 'Offer'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {candidate.stage}
                        </span>
                      </td>
                      <td className='px-4 py-2 text-sm text-gray-600'>
                        {new Date(
                          candidate.submitted_date
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
