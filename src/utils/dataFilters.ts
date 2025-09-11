import {
  FinancialData,
  WorkingCapitalData,
  ARAPData,
  CashFlowData,
} from '@/types/finance';

export interface FilterOptions {
  dateRange: string;
  countries: string[];
  channels: string[];
  statuses: string[];
}

export interface TableFilterOptions {
  search: string;
  status: string;
  daysOutstanding: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// Helper function to parse date string (e.g., '2024-01' to Date)
const parseMonthString = (dateString: string): Date => {
  const [year, month] = dateString.split('-');
  return new Date(parseInt(year), parseInt(month) - 1);
};

// Helper function to get date range filter
const getDateRangeFilter = (dateRange: string) => {
  // Since our sample data is from 2024 (Jan-Sep), we'll base our filters on that year
  const dataYear = 2024;

  switch (dateRange) {
    case 'mtd': // Month to Date - show only September 2024
      return (date: string) => {
        const itemDate = parseMonthString(date);
        return itemDate.getFullYear() === dataYear && itemDate.getMonth() === 8; // September (0-indexed)
      };

    case 'qtd': // Quarter to Date - show Q3 2024 (Jul-Sep)
      return (date: string) => {
        const itemDate = parseMonthString(date);
        const month = itemDate.getMonth();
        return itemDate.getFullYear() === dataYear && month >= 6 && month <= 8; // Jul-Sep (0-indexed)
      };

    case 'ytd': // Year to Date - show all 2024 data we have (Jan-Sep)
      return (date: string) => {
        const itemDate = parseMonthString(date);
        return itemDate.getFullYear() === dataYear;
      };

    case 'last3months': // Last 3 months - Jul, Aug, Sep
      return (date: string) => {
        const itemDate = parseMonthString(date);
        const month = itemDate.getMonth();
        return itemDate.getFullYear() === dataYear && month >= 6 && month <= 8; // Jul-Sep
      };

    case 'last6months': // Last 6 months - Apr through Sep
      return (date: string) => {
        const itemDate = parseMonthString(date);
        const month = itemDate.getMonth();
        return itemDate.getFullYear() === dataYear && month >= 3 && month <= 8; // Apr-Sep
      };

    case 'last12months': // All available data (Jan-Sep)
      return (date: string) => {
        const itemDate = parseMonthString(date);
        return itemDate.getFullYear() === dataYear;
      };

    default: // 'all'
      return () => true;
  }
};

// Filter financial data
export const filterFinancialData = (
  data: FinancialData[],
  filters: FilterOptions
): FinancialData[] => {
  if (
    filters.dateRange === 'all' &&
    filters.countries.length === 0 &&
    filters.channels.length === 0 &&
    filters.statuses.length === 0
  ) {
    return data; // Return all data if no filters applied
  }

  const dateFilter = getDateRangeFilter(filters.dateRange);

  return data.filter((item) => {
    // Apply date range filter
    if (filters.dateRange !== 'all' && !dateFilter(item.date)) return false;

    // Apply country filter
    if (
      filters.countries.length > 0 &&
      item.country &&
      !filters.countries.includes(item.country)
    )
      return false;

    // Apply channel filter
    if (
      filters.channels.length > 0 &&
      item.channel &&
      !filters.channels.includes(item.channel)
    )
      return false;

    // Apply status filter
    if (
      filters.statuses.length > 0 &&
      item.status &&
      !filters.statuses.includes(item.status)
    )
      return false;

    return true;
  });
};

// Filter working capital data
export const filterWorkingCapitalData = (
  data: WorkingCapitalData[],
  filters: FilterOptions
): WorkingCapitalData[] => {
  // For working capital, we'll use the month field and convert it to a date-like string
  const monthToDateString = (month: string): string => {
    const monthIndex = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ].indexOf(month);
    return `2024-${String(monthIndex + 1).padStart(2, '0')}`;
  };

  if (filters.dateRange === 'all') {
    return data; // Return all data for 'all' filter
  }

  const dateFilter = getDateRangeFilter(filters.dateRange);

  return data.filter((item) => {
    const dateString = monthToDateString(item.month);
    return dateFilter(dateString);
  });
};

// Filter cash flow data
export const filterCashFlowData = (
  data: CashFlowData[],
  filters: FilterOptions
): CashFlowData[] => {
  const monthToDateString = (month: string): string => {
    const monthIndex = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ].indexOf(month);
    return `2024-${String(monthIndex + 1).padStart(2, '0')}`;
  };

  if (filters.dateRange === 'all') {
    return data; // Return all data for 'all' filter
  }

  const dateFilter = getDateRangeFilter(filters.dateRange);

  return data.filter((item) => {
    const dateString = monthToDateString(item.month);
    return dateFilter(dateString);
  });
};

// Filter and sort ARAP data
export const filterARAPData = (
  data: ARAPData[],
  tableFilters: TableFilterOptions
): ARAPData[] => {
  let filteredData = [...data];

  // Apply search filter
  if (tableFilters.search) {
    filteredData = filteredData.filter((item) =>
      item.customerSupplier
        .toLowerCase()
        .includes(tableFilters.search.toLowerCase())
    );
  }

  // Apply status filter
  if (tableFilters.status !== 'all') {
    filteredData = filteredData.filter(
      (item) => item.status === tableFilters.status
    );
  }

  // Apply days outstanding filter
  if (tableFilters.daysOutstanding !== 'all') {
    switch (tableFilters.daysOutstanding) {
      case '0-30':
        filteredData = filteredData.filter(
          (item) => item.daysOutstanding <= 30
        );
        break;
      case '31-60':
        filteredData = filteredData.filter(
          (item) => item.daysOutstanding > 30 && item.daysOutstanding <= 60
        );
        break;
      case '61-90':
        filteredData = filteredData.filter(
          (item) => item.daysOutstanding > 60 && item.daysOutstanding <= 90
        );
        break;
      case '90+':
        filteredData = filteredData.filter((item) => item.daysOutstanding > 90);
        break;
    }
  }

  // Apply sorting
  filteredData.sort((a, b) => {
    let aValue: string | number = a[tableFilters.sortBy as keyof ARAPData] as
      | string
      | number;
    let bValue: string | number = b[tableFilters.sortBy as keyof ARAPData] as
      | string
      | number;

    // Handle different data types
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = (bValue as string).toLowerCase();
    }

    if (aValue < bValue) {
      return tableFilters.sortOrder === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return tableFilters.sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return filteredData;
};

// Calculate filtered KPI data (this would be more complex in a real app)
export const calculateFilteredKPIs = (
  financialData: FinancialData[],
  workingCapitalData: WorkingCapitalData[],
  arData: ARAPData[]
) => {
  if (financialData.length === 0) return [];

  const avgGrossMargin =
    financialData.reduce((sum, item) => sum + item.grossMargin, 0) /
    financialData.length;

  const avgDSO =
    arData.length > 0
      ? arData.reduce((sum, item) => sum + item.daysOutstanding, 0) /
        arData.length
      : 0;

  // Calculate revenue growth if we have at least 2 months
  const revenueGrowth =
    financialData.length >= 2
      ? ((financialData[financialData.length - 1].revenue -
          financialData[0].revenue) /
          financialData[0].revenue) *
        100
      : 0;

  return [
    {
      name: 'Revenue Growth',
      value: parseFloat(revenueGrowth.toFixed(1)),
      target: 12,
      unit: '%',
      trend: (revenueGrowth > 0 ? 'up' : 'down') as 'up' | 'down' | 'stable',
      percentage: ((revenueGrowth + 12) / 12) * 100,
    },
    {
      name: 'Gross Margin',
      value: parseFloat(avgGrossMargin.toFixed(1)),
      target: 28,
      unit: '%',
      trend: (avgGrossMargin > 28 ? 'up' : 'down') as 'up' | 'down' | 'stable',
      percentage: (avgGrossMargin / 28) * 100,
    },
    {
      name: 'Days Sales Outstanding',
      value: Math.round(avgDSO),
      target: 45,
      unit: 'days',
      trend: (avgDSO < 45 ? 'down' : 'up') as 'up' | 'down' | 'stable',
      percentage: avgDSO > 0 ? (45 / avgDSO) * 100 : 100,
    },
    {
      name: 'Current Ratio',
      value: 2.1,
      target: 2.0,
      unit: 'x',
      trend: 'up' as 'up' | 'down' | 'stable',
      percentage: 105.0,
    },
    {
      name: 'Cash Conversion Cycle',
      value: Math.round(avgDSO + 10), // Simplified calculation
      target: 50,
      unit: 'days',
      trend: (avgDSO + 10 < 50 ? 'down' : 'up') as 'up' | 'down' | 'stable',
      percentage: avgDSO + 10 > 0 ? (50 / (avgDSO + 10)) * 100 : 100,
    },
  ];
};
