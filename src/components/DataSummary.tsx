'use client';

interface DataSummaryProps {
  filteredCount: number;
  totalCount: number;
  dataType: string;
}

export default function DataSummary({
  filteredCount,
  totalCount,
  dataType,
}: DataSummaryProps) {
  const isFiltered = filteredCount !== totalCount;

  return (
    <div className='flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg border border-blue-200 mb-4'>
      <div className='flex items-center space-x-3'>
        <div className='flex items-center space-x-2'>
          <div
            className={`w-3 h-3 rounded-full ${
              isFiltered ? 'bg-blue-500' : 'bg-gray-400'
            }`}
          ></div>
          <span className='text-sm font-medium text-gray-700'>
            Showing {filteredCount.toLocaleString()} of{' '}
            {totalCount.toLocaleString()} {dataType}
          </span>
        </div>
        {isFiltered && (
          <span className='px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full'>
            Filtered
          </span>
        )}
      </div>

      {isFiltered && (
        <div className='text-xs text-blue-600'>
          {Math.round((filteredCount / totalCount) * 100)}% of total data
        </div>
      )}
    </div>
  );
}
