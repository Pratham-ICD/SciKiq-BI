'use client';

import { ARAPData } from '@/types/finance';
import { format } from 'date-fns';

interface ARAPTableProps {
  data: ARAPData[];
  title: string;
  type: 'receivable' | 'payable';
}

export default function ARAPTable({ data, title, type }: ARAPTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'current':
        return 'Current';
      case 'overdue':
        return 'Overdue';
      case 'critical':
        return 'Critical';
      default:
        return 'Unknown';
    }
  };

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
  const avgDaysOutstanding =
    data.reduce((sum, item) => sum + item.daysOutstanding, 0) / data.length;

  return (
    <div className='bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-100'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-xl font-bold text-gray-800 flex items-center'>
          <div
            className={`w-2 h-6 rounded-full mr-3 ${
              type === 'receivable'
                ? 'bg-gradient-to-b from-blue-500 to-indigo-600'
                : 'bg-gradient-to-b from-red-500 to-rose-600'
            }`}
          ></div>
          {title}
        </h3>
        <div className='text-right bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border shadow-sm'>
          <div className='text-sm font-medium text-gray-600'>Total Amount</div>
          <div className='text-2xl font-bold text-gray-900'>
            ${totalAmount.toLocaleString()}
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4 mb-6'>
        <div className='bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200'>
          <div className='text-sm font-medium text-blue-700'>
            Average Days Outstanding
          </div>
          <div className='text-xl font-bold text-blue-900'>
            {avgDaysOutstanding.toFixed(1)} days
          </div>
        </div>
        <div className='bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-200'>
          <div className='text-sm font-medium text-purple-700'>
            Number of Items
          </div>
          <div className='text-xl font-bold text-purple-900'>{data.length}</div>
        </div>
      </div>

      <div className='overflow-x-auto rounded-lg border border-gray-200'>
        <table className='min-w-full table-auto bg-white'>
          <thead className='bg-gradient-to-r from-gray-50 to-gray-100'>
            <tr>
              <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>
                {type === 'receivable' ? 'Customer' : 'Supplier'}
              </th>
              <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>
                Amount
              </th>
              <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>
                Days Outstanding
              </th>
              <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>
                Due Date
              </th>
              <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>
                Status
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {data.map((item, index) => (
              <tr
                key={index}
                className='hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200'
              >
                <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900'>
                  {item.customerSupplier}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900'>
                  ${item.amount.toLocaleString()}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  <span className='font-medium'>{item.daysOutstanding}</span>{' '}
                  days
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {format(new Date(item.dueDate), 'MMM dd, yyyy')}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {getStatusText(item.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
