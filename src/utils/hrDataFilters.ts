import { EmployeeData, HRFilters, AttritionRiskEmployee } from '../types/hr';

export function filterEmployeeData(
  employees: EmployeeData[],
  filters: HRFilters
): EmployeeData[] {
  return employees.filter((employee) => {
    // Department filter
    if (
      filters.departments.length > 0 &&
      !filters.departments.includes(employee.department)
    ) {
      return false;
    }

    // Location filter
    if (
      filters.locations.length > 0 &&
      !filters.locations.includes(employee.location)
    ) {
      return false;
    }

    // Grade filter
    if (filters.grades.length > 0 && !filters.grades.includes(employee.grade)) {
      return false;
    }

    // Date range filter (for hire dates)
    if (filters.dateRange !== 'all') {
      const today = new Date();
      const hireDate = new Date(employee.hire_date);

      let startDate: Date;
      switch (filters.dateRange) {
        case 'ytd':
          startDate = new Date(today.getFullYear(), 0, 1);
          break;
        case 'qtd':
          const currentQuarter = Math.floor(today.getMonth() / 3);
          startDate = new Date(today.getFullYear(), currentQuarter * 3, 1);
          break;
        case 'mtd':
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          break;
        case 'last12months':
          startDate = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        case 'last6months':
          startDate = new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000);
          break;
        case 'last3months':
          startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          return true;
      }

      if (hireDate < startDate) {
        return false;
      }
    }

    return true;
  });
}

export function calculateHRMetrics(employees: EmployeeData[]) {
  const today = new Date();
  const activeEmployees = employees.filter((emp) => emp.status === 'Active');

  // Calculate hires and terms in last 30 days
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);

  const hires30d = employees.filter((emp) => {
    const hireDate = new Date(emp.hire_date);
    return hireDate >= thirtyDaysAgo && hireDate <= today;
  }).length;

  const terms30d = employees.filter((emp) => {
    if (!emp.term_date) return false;
    const termDate = new Date(emp.term_date);
    return termDate >= thirtyDaysAgo && termDate <= today;
  }).length;

  // Calculate annualized attrition rate (last 90d terms / avg headcount * 365/90)
  const terms90d = employees.filter((emp) => {
    if (!emp.term_date) return false;
    const termDate = new Date(emp.term_date);
    return termDate >= ninetyDaysAgo && termDate <= today;
  }).length;

  const avgHeadcount = Math.max(1, employees.length - terms90d / 2);
  const attritionRate = (terms90d / avgHeadcount) * (365.0 / 90.0) * 100.0;

  // Calculate average tenure
  const tenures = activeEmployees.map((emp) => {
    const hireDate = new Date(emp.hire_date);
    const diffTime = today.getTime() - hireDate.getTime();
    return diffTime / (365.25 * 24 * 60 * 60 * 1000); // Convert to years
  });
  const avgTenure =
    tenures.reduce((sum, tenure) => sum + tenure, 0) / tenures.length;

  // Calculate female percentage
  const femaleCount = activeEmployees.filter(
    (emp) => emp.gender === 'Female'
  ).length;
  const femalePercentage = (femaleCount / activeEmployees.length) * 100;

  // Calculate total payroll
  const totalPayroll = activeEmployees.reduce(
    (sum, emp) => sum + emp.salary_aed,
    0
  );

  return {
    headcount: activeEmployees.length,
    hires_30d: hires30d,
    terms_30d: terms30d,
    attrition_rate: Math.round(attritionRate * 10) / 10,
    avg_tenure: Math.round(avgTenure * 10) / 10,
    total_payroll: totalPayroll,
    female_percentage: Math.round(femalePercentage * 10) / 10,
  };
}

export function calculateAttritionRisk(
  employees: EmployeeData[]
): AttritionRiskEmployee[] {
  const today = new Date();
  const activeEmployees = employees.filter((emp) => emp.status === 'Active');

  // Calculate grade median salaries for compa-ratio
  const gradeMedians: Record<string, number> = {};
  const gradeGroups = activeEmployees.reduce((acc, emp) => {
    if (!acc[emp.grade]) acc[emp.grade] = [];
    acc[emp.grade].push(emp.salary_aed);
    return acc;
  }, {} as Record<string, number[]>);

  Object.keys(gradeGroups).forEach((grade) => {
    const salaries = gradeGroups[grade].sort((a, b) => a - b);
    const median = salaries[Math.floor(salaries.length / 2)];
    gradeMedians[grade] = median;
  });

  const riskEmployees: AttritionRiskEmployee[] = activeEmployees.map((emp) => {
    const hireDate = new Date(emp.hire_date);
    const tenureYears =
      (today.getTime() - hireDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);

    const sincePromoYears = emp.last_promotion_date
      ? (today.getTime() - new Date(emp.last_promotion_date).getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
      : tenureYears;

    const compaRatio =
      emp.salary_aed / (gradeMedians[emp.grade] || emp.salary_aed);

    // Normalize scores (simplified version of Streamlit z-score calculation)
    let riskScore = 0;

    // Low performance risk (25% weight)
    if (emp.performance_rating <= 2) riskScore += 25;
    else if (emp.performance_rating === 3) riskScore += 10;

    // Low engagement risk (25% weight)
    if (emp.engagement_score < 3.0) riskScore += 25;
    else if (emp.engagement_score < 3.5) riskScore += 15;

    // Short tenure risk (15% weight)
    if (tenureYears < 0.5) riskScore += 15;
    else if (tenureYears < 1) riskScore += 8;

    // No promotion risk (15% weight)
    if (sincePromoYears > 3) riskScore += 15;
    else if (sincePromoYears > 2) riskScore += 8;

    // High overtime risk (10% weight)
    if (emp.overtime_hours_m > 25) riskScore += 10;
    else if (emp.overtime_hours_m > 20) riskScore += 5;

    // Below median pay risk (10% weight)
    if (compaRatio < 0.9) riskScore += 10;
    else if (compaRatio < 0.95) riskScore += 5;

    // Generate reasons
    const reasons: string[] = [];
    if (emp.performance_rating <= 2) reasons.push('Low performance');
    if (emp.engagement_score < 3.0) reasons.push('Low engagement');
    if (tenureYears < 0.5) reasons.push('New hire risk');
    if (sincePromoYears > 3) reasons.push('>3y since promotion');
    if (compaRatio < 0.9) reasons.push('Below grade median pay');
    if (emp.overtime_hours_m > 25) reasons.push('High overtime');

    return {
      employee_id: emp.employee_id,
      alias: emp.alias,
      department: emp.department,
      location: emp.location,
      grade: emp.grade,
      tenure_years: Math.round(tenureYears * 10) / 10,
      performance_rating: emp.performance_rating,
      engagement_score: emp.engagement_score,
      risk_score: Math.min(100, riskScore),
      reasons: reasons.length > 0 ? reasons.join(', ') : '—',
    };
  });

  return riskEmployees.sort((a, b) => b.risk_score - a.risk_score);
}

export function calculateDepartmentDiversity(employees: EmployeeData[]) {
  const today = new Date();
  const activeEmployees = employees.filter((emp) => emp.status === 'Active');

  const deptGroups = activeEmployees.reduce((acc, emp) => {
    if (!acc[emp.department]) {
      acc[emp.department] = [];
    }
    acc[emp.department].push(emp);
    return acc;
  }, {} as Record<string, EmployeeData[]>);

  return Object.keys(deptGroups).map((dept) => {
    const deptEmployees = deptGroups[dept];
    const femaleCount = deptEmployees.filter(
      (emp) => emp.gender === 'Female'
    ).length;
    const femalePercent = (femaleCount / deptEmployees.length) * 100;

    const tenures = deptEmployees.map((emp) => {
      const hireDate = new Date(emp.hire_date);
      return (
        (today.getTime() - hireDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      );
    });
    const avgTenure =
      tenures.reduce((sum, tenure) => sum + tenure, 0) / tenures.length;

    return {
      department: dept,
      headcount: deptEmployees.length,
      female_pct: Math.round(femalePercent * 10) / 10,
      avg_tenure: Math.round(avgTenure * 10) / 10,
    };
  });
}

export function calculateMonthlyHiring(employees: EmployeeData[]) {
  const monthlyData: Record<string, { hires: number; terms: number }> = {};

  // Process hires
  employees.forEach((emp) => {
    const hireMonth = emp.hire_date.substring(0, 7); // YYYY-MM format
    if (!monthlyData[hireMonth]) {
      monthlyData[hireMonth] = { hires: 0, terms: 0 };
    }
    monthlyData[hireMonth].hires++;
  });

  // Process terms
  employees.forEach((emp) => {
    if (emp.term_date) {
      const termMonth = emp.term_date.substring(0, 7); // YYYY-MM format
      if (!monthlyData[termMonth]) {
        monthlyData[termMonth] = { hires: 0, terms: 0 };
      }
      monthlyData[termMonth].terms++;
    }
  });

  return Object.keys(monthlyData)
    .sort()
    .slice(-12) // Last 12 months
    .map((month) => ({
      month,
      hires: monthlyData[month].hires,
      terms: monthlyData[month].terms,
    }));
}
