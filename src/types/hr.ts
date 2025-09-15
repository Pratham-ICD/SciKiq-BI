// HR Data Types based on the HR Streamlit application

export interface EmployeeData {
  employee_id: string;
  name: string;
  alias: string;
  gender: 'Male' | 'Female';
  age: number;
  department: string;
  location: string;
  grade: string;
  manager_id?: string;
  hire_date: string;
  term_date?: string;
  status: 'Active' | 'Terminated';
  salary_aed: number;
  performance_rating: 1 | 2 | 3 | 4 | 5;
  engagement_score: number; // 1-5 scale
  overtime_hours_m: number;
  last_promotion_date?: string;
}

export interface RequisitionData {
  req_id: string;
  department: string;
  open_date: string;
  status: 'Open' | 'Closed';
}

export interface CandidateData {
  req_id: string;
  candidate_id: string;
  stage: 'Sourced' | 'Screen' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
  submitted_date: string;
}

export interface EngagementData {
  month: string;
  engagement_score: number;
}

export interface LeaveData {
  employee_id: string;
  date: string;
  type: string;
  days: number;
}

export interface HRFilterOptions {
  departments: string[];
  locations: string[];
  grades: string[];
}

export interface HRFilters {
  dateRange: string;
  departments: string[];
  locations: string[];
  grades: string[];
}

export interface AttritionRiskEmployee {
  employee_id: string;
  alias: string;
  department: string;
  location: string;
  grade: string;
  tenure_years: number;
  performance_rating: number;
  engagement_score: number;
  risk_score: number;
  reasons: string;
}

export interface HRMetrics {
  headcount: number;
  hires_30d: number;
  terms_30d: number;
  attrition_rate: number;
  avg_tenure: number;
  total_payroll: number;
  female_percentage: number;
}

export interface DepartmentDiversity {
  department: string;
  headcount: number;
  female_pct: number;
  avg_tenure: number;
}

export interface MonthlyHiring {
  month: string;
  hires: number;
  terms: number;
}

export interface SalaryByGrade {
  grade: string;
  count: number;
  median: number;
  mean: number;
}

export interface GenderPayGap {
  grade: string;
  gender: string;
  salary_aed: number;
}

export interface PerformanceDistribution {
  rating: number;
  count: number;
}

export interface RecruitingMetrics {
  open_reqs: number;
  offer_acceptance_rate: number;
  total_hires: number;
  median_time_to_fill: number;
}

export interface StageFunnel {
  stage: string;
  count: number;
  percentage: number;
}
