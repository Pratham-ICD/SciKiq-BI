export interface FinancialData {
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
  grossMargin: number;
  country?: string;
  channel?: string;
  status?: string;
}

export interface WorkingCapitalData {
  month: string;
  inventory: number;
  accountsReceivable: number;
  accountsPayable: number;
  workingCapital: number;
}

export interface ARAPData {
  customerSupplier: string;
  amount: number;
  daysOutstanding: number;
  status: 'current' | 'overdue' | 'critical';
  dueDate: string;
}

export interface KPIData {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
}

export interface CashFlowData {
  month: string;
  operating: number;
  investing: number;
  financing: number;
  netCashFlow: number;
}
