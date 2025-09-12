import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface FinanceMetrics {
  total_revenue: string;
  total_expenses: string;
  net_profit: string;
  profit_margin: string;
  budget_total: string;
  accounts_payable: string;
  accounts_receivable: string;
  collection_rate: string;
}

export interface FinanceRawData {
  total_revenue_value: number;
  total_expenses_value: number;
  net_profit_value: number;
  profit_margin_value: number;
  budget_total_value: number;
  ap_total_value: number;
  ar_total_value: number;
  collection_rate_value: number;
}

export interface FinanceDataInfo {
  gl_txn_records: number;
  budget_records: number;
  ap_records: number;
  ar_records: number;
  sales_records: number;
  revenue_source: string;
}

export interface FinanceDashboardResponse {
  metrics: FinanceMetrics;
  raw_data: FinanceRawData;
  data_info: FinanceDataInfo;
}

export interface ChartDataResponse {
  labels: string[];
  values: number[];
  chart_type?: string;
  title?: string;
}

export interface CommentaryResponse {
  commentary: string;
}

export interface FilterOptions {
  countries: string[];
  channels: string[];
  statuses: string[];
}

export interface MonthlyDataItem {
  name: string;
  value: number;
  net_revenue: number;
  budget_rev: number;
  ebitda: number;
  gross_margin: number;
  [key: string]: string | number;
}

export interface CashFlowDataItem {
  name: string;
  value: number;
  receipts: number;
  payments: number;
  net_flow: number;
  cash: number;
  [key: string]: string | number;
}

export interface AgingDataItem {
  name: string;
  value: number;
  open_amount: number;
  invoice_count: number;
  [key: string]: string | number;
}

export interface InvoiceItem {
  invoice_id: string;
  customer_id?: string;
  vendor_id?: string;
  customer_name?: string;
  vendor_name?: string;
  due_date: string;
  open_amount: number;
  days_past_due: number;
  currency: string;
}

export interface WorkingCapitalMetrics {
  dso: number;
  dpo: number;
  dio: number;
  ccc: number;
  netWorkingCapital: number;
  accountsReceivable: number;
  inventory: number;
  accountsPayable: number;
}

export interface BridgeData {
  startValue: number;
  priceEffect: number;
  volumeEffect: number;
  mixEffect: number;
  endValue: number;
  currency: string;
}

export const financeAPI = {
  getDashboard: async (filters?: {
    countries?: string[];
    channels?: string[];
    statuses?: string[];
    date_start?: string;
    date_end?: string;
  }): Promise<FinanceDashboardResponse> => {
    const params = new URLSearchParams();
    if (filters?.countries) {
      filters.countries.forEach((country) =>
        params.append('countries', country)
      );
    }
    if (filters?.channels) {
      filters.channels.forEach((channel) => params.append('channels', channel));
    }
    if (filters?.statuses) {
      filters.statuses.forEach((status) => params.append('statuses', status));
    }
    if (filters?.date_start) {
      params.append('date_start', filters.date_start);
    }
    if (filters?.date_end) {
      params.append('date_end', filters.date_end);
    }

    const url = `/api/finance/dashboard/${
      params.toString() ? '?' + params.toString() : ''
    }`;
    const response = await api.get(url);
    return response.data;
  },

  getRevenueChart: async (filters?: {
    countries?: string[];
    channels?: string[];
    statuses?: string[];
    date_start?: string;
    date_end?: string;
  }): Promise<ChartDataResponse> => {
    const params = new URLSearchParams();
    if (filters?.countries) {
      filters.countries.forEach((country) =>
        params.append('countries', country)
      );
    }
    if (filters?.channels) {
      filters.channels.forEach((channel) => params.append('channels', channel));
    }
    if (filters?.statuses) {
      filters.statuses.forEach((status) => params.append('statuses', status));
    }
    if (filters?.date_start) {
      params.append('date_start', filters.date_start);
    }
    if (filters?.date_end) {
      params.append('date_end', filters.date_end);
    }

    const url = `/api/finance/charts/revenue/${
      params.toString() ? '?' + params.toString() : ''
    }`;
    const response = await api.get(url);
    return response.data;
  },

  getExpenseChart: async (filters?: {
    countries?: string[];
    channels?: string[];
    statuses?: string[];
    date_start?: string;
    date_end?: string;
  }): Promise<ChartDataResponse> => {
    const params = new URLSearchParams();
    if (filters?.countries) {
      filters.countries.forEach((country) =>
        params.append('countries', country)
      );
    }
    if (filters?.channels) {
      filters.channels.forEach((channel) => params.append('channels', channel));
    }
    if (filters?.statuses) {
      filters.statuses.forEach((status) => params.append('statuses', status));
    }
    if (filters?.date_start) {
      params.append('date_start', filters.date_start);
    }
    if (filters?.date_end) {
      params.append('date_end', filters.date_end);
    }

    const url = `/api/finance/charts/expenses/${
      params.toString() ? '?' + params.toString() : ''
    }`;
    const response = await api.get(url);
    return response.data;
  },

  getCommentary: async (filters?: {
    countries?: string[];
    channels?: string[];
    statuses?: string[];
    date_start?: string;
    date_end?: string;
  }): Promise<CommentaryResponse> => {
    const params = new URLSearchParams();
    if (filters?.countries) {
      filters.countries.forEach((country) =>
        params.append('countries', country)
      );
    }
    if (filters?.channels) {
      filters.channels.forEach((channel) => params.append('channels', channel));
    }
    if (filters?.statuses) {
      filters.statuses.forEach((status) => params.append('statuses', status));
    }
    if (filters?.date_start) {
      params.append('date_start', filters.date_start);
    }
    if (filters?.date_end) {
      params.append('date_end', filters.date_end);
    }

    const url = `/api/finance/analytics/commentary/${
      params.toString() ? '?' + params.toString() : ''
    }`;
    const response = await api.get(url);
    return response.data;
  },

  // New endpoints for the refactored dashboard
  getFilters: async (): Promise<FilterOptions> => {
    const response = await api.get('/api/finance/filters/');
    return response.data;
  },

  getMonthlyData: async (filters?: {
    countries?: string[];
    channels?: string[];
    statuses?: string[];
    date_start?: string;
    date_end?: string;
  }): Promise<MonthlyDataItem[]> => {
    const params = new URLSearchParams();
    if (filters?.countries) {
      filters.countries.forEach((country) =>
        params.append('countries', country)
      );
    }
    if (filters?.channels) {
      filters.channels.forEach((channel) => params.append('channels', channel));
    }
    if (filters?.statuses) {
      filters.statuses.forEach((status) => params.append('statuses', status));
    }
    if (filters?.date_start) {
      params.append('date_start', filters.date_start);
    }
    if (filters?.date_end) {
      params.append('date_end', filters.date_end);
    }

    const url = `/api/finance/data/monthly/${
      params.toString() ? '?' + params.toString() : ''
    }`;
    const response = await api.get(url);
    return response.data;
  },

  getCashFlowData: async (filters?: {
    countries?: string[];
    channels?: string[];
    statuses?: string[];
    date_start?: string;
    date_end?: string;
  }): Promise<CashFlowDataItem[]> => {
    const params = new URLSearchParams();
    if (filters?.countries) {
      filters.countries.forEach((country) =>
        params.append('countries', country)
      );
    }
    if (filters?.channels) {
      filters.channels.forEach((channel) => params.append('channels', channel));
    }
    if (filters?.statuses) {
      filters.statuses.forEach((status) => params.append('statuses', status));
    }
    if (filters?.date_start) {
      params.append('date_start', filters.date_start);
    }
    if (filters?.date_end) {
      params.append('date_end', filters.date_end);
    }

    const url = `/api/finance/data/cashflow/${
      params.toString() ? '?' + params.toString() : ''
    }`;
    const response = await api.get(url);
    return response.data;
  },

  getAgingData: async (filters?: {
    countries?: string[];
    channels?: string[];
    statuses?: string[];
    date_start?: string;
    date_end?: string;
  }): Promise<AgingDataItem[]> => {
    const params = new URLSearchParams();
    if (filters?.countries) {
      filters.countries.forEach((country) =>
        params.append('countries', country)
      );
    }
    if (filters?.channels) {
      filters.channels.forEach((channel) => params.append('channels', channel));
    }
    if (filters?.statuses) {
      filters.statuses.forEach((status) => params.append('statuses', status));
    }
    if (filters?.date_start) {
      params.append('date_start', filters.date_start);
    }
    if (filters?.date_end) {
      params.append('date_end', filters.date_end);
    }

    const url = `/api/finance/data/aging/${
      params.toString() ? '?' + params.toString() : ''
    }`;
    const response = await api.get(url);
    return response.data;
  },

  getARInvoices: async (filters?: {
    countries?: string[];
    channels?: string[];
    statuses?: string[];
    date_start?: string;
    date_end?: string;
  }): Promise<InvoiceItem[]> => {
    const params = new URLSearchParams();
    if (filters?.countries) {
      filters.countries.forEach((country) =>
        params.append('countries', country)
      );
    }
    if (filters?.channels) {
      filters.channels.forEach((channel) => params.append('channels', channel));
    }
    if (filters?.statuses) {
      filters.statuses.forEach((status) => params.append('statuses', status));
    }
    if (filters?.date_start) {
      params.append('date_start', filters.date_start);
    }
    if (filters?.date_end) {
      params.append('date_end', filters.date_end);
    }

    const url = `/api/finance/invoices/ar/${
      params.toString() ? '?' + params.toString() : ''
    }`;
    const response = await api.get(url);
    return response.data;
  },

  getAPInvoices: async (filters?: {
    countries?: string[];
    channels?: string[];
    statuses?: string[];
    date_start?: string;
    date_end?: string;
  }): Promise<InvoiceItem[]> => {
    const params = new URLSearchParams();
    if (filters?.countries) {
      filters.countries.forEach((country) =>
        params.append('countries', country)
      );
    }
    if (filters?.channels) {
      filters.channels.forEach((channel) => params.append('channels', channel));
    }
    if (filters?.statuses) {
      filters.statuses.forEach((status) => params.append('statuses', status));
    }
    if (filters?.date_start) {
      params.append('date_start', filters.date_start);
    }
    if (filters?.date_end) {
      params.append('date_end', filters.date_end);
    }

    const url = `/api/finance/invoices/ap/${
      params.toString() ? '?' + params.toString() : ''
    }`;
    const response = await api.get(url);
    return response.data;
  },

  getWorkingCapitalMetrics: async (filters?: {
    countries?: string[];
    channels?: string[];
    statuses?: string[];
    date_start?: string;
    date_end?: string;
  }): Promise<WorkingCapitalMetrics> => {
    const params = new URLSearchParams();
    if (filters?.countries) {
      filters.countries.forEach((country) =>
        params.append('countries', country)
      );
    }
    if (filters?.channels) {
      filters.channels.forEach((channel) => params.append('channels', channel));
    }
    if (filters?.statuses) {
      filters.statuses.forEach((status) => params.append('statuses', status));
    }
    if (filters?.date_start) {
      params.append('date_start', filters.date_start);
    }
    if (filters?.date_end) {
      params.append('date_end', filters.date_end);
    }

    const url = `/api/finance/metrics/working-capital/${
      params.toString() ? '?' + params.toString() : ''
    }`;
    const response = await api.get(url);
    return response.data;
  },

  getBridgeData: async (filters?: {
    countries?: string[];
    channels?: string[];
    statuses?: string[];
    date_start?: string;
    date_end?: string;
  }): Promise<BridgeData> => {
    const params = new URLSearchParams();
    if (filters?.countries) {
      filters.countries.forEach((country) =>
        params.append('countries', country)
      );
    }
    if (filters?.channels) {
      filters.channels.forEach((channel) => params.append('channels', channel));
    }
    if (filters?.statuses) {
      filters.statuses.forEach((status) => params.append('statuses', status));
    }
    if (filters?.date_start) {
      params.append('date_start', filters.date_start);
    }
    if (filters?.date_end) {
      params.append('date_end', filters.date_end);
    }

    const url = `/api/finance/data/bridge/${
      params.toString() ? '?' + params.toString() : ''
    }`;
    const response = await api.get(url);
    return response.data;
  },
};

// Generic API error handler
export const handleAPIError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as {
      response?: { data?: { error?: string } };
      message?: string;
    };
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
    if (axiosError.message) {
      return axiosError.message;
    }
  }
  return 'An unexpected error occurred';
};

export default api;
