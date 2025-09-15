import {
  EmployeeData,
  RequisitionData,
  CandidateData,
  EngagementData,
  LeaveData,
} from '../types/hr';

// Helper functions to generate consistent data
function generateRandomDate(start: Date, end: Date): string {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split('T')[0];
}

function generateRandomDateAfter(
  startDate: string,
  maxDaysAfter: number
): string {
  const start = new Date(startDate);
  const date = new Date(
    start.getTime() + Math.random() * maxDaysAfter * 24 * 60 * 60 * 1000
  );
  return date.toISOString().split('T')[0];
}

function generateRandomChoice<T>(array: T[], weights?: number[]): T {
  if (!weights) {
    return array[Math.floor(Math.random() * array.length)];
  }

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < array.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return array[i];
    }
  }

  return array[array.length - 1];
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).toUpperCase().substring(0, 4);
}

function generateAlias(name: string, employeeId: string): string {
  const initial = name.split(' ')[0]?.charAt(0) || 'E';
  const hash = hashString(employeeId);
  return `${initial}…${hash}`;
}

// Generate HR sample data (similar to Streamlit _simulate_hr_data)
function generateHRSampleData(
  numEmployees: number = 500,
  monthsBack: number = 18
) {
  const today = new Date();
  const startDate = new Date(
    today.getTime() - monthsBack * 30 * 24 * 60 * 60 * 1000
  );

  // Constants from Streamlit app
  const departments = [
    'Sales',
    'Marketing',
    'Operations',
    'Finance',
    'HR',
    'IT',
    'Procurement',
    'Logistics',
    'Quality',
  ];

  const locations = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Riyadh', 'Doha'];
  const grades = ['G1', 'G2', 'G3', 'M1', 'M2', 'D1'];
  const genders = ['Male', 'Female'];
  const performanceScores = [1, 2, 3, 4, 5];

  // Grade salary mapping from Streamlit
  const baseSalaryByGrade: Record<string, number> = {
    G1: 6000,
    G2: 9000,
    G3: 14000,
    M1: 22000,
    M2: 30000,
    D1: 45000,
  };

  const employees: EmployeeData[] = [];

  for (let i = 1; i <= numEmployees; i++) {
    const employeeId = `E${i.toString().padStart(5, '0')}`;
    const name = `Person ${i}`;

    const department = generateRandomChoice(departments);
    const location = generateRandomChoice(locations);
    const grade = generateRandomChoice(grades, [25, 25, 20, 15, 10, 5]);
    const gender = generateRandomChoice(genders, [65, 35]);

    const hireDate = generateRandomDate(startDate, today);

    // Some employees are terminated (12% termination rate)
    const isActive = Math.random() > 0.12;
    let termDate: string | undefined;

    if (!isActive) {
      const hireDateObj = new Date(hireDate);
      const possibleTermDate = new Date(
        hireDateObj.getTime() +
          Math.random() * (today.getTime() - hireDateObj.getTime())
      );
      if (possibleTermDate <= today) {
        termDate = possibleTermDate.toISOString().split('T')[0];
      }
    }

    // Generate salary with lognormal distribution
    const baseSalary = baseSalaryByGrade[grade];
    const salaryMultiplier = Math.exp(Math.random() * 0.3 - 0.15); // Approximates lognormal
    const salary = Math.round(baseSalary * salaryMultiplier);

    // Performance rating
    const performance = generateRandomChoice(
      performanceScores,
      [5, 15, 50, 25, 5]
    );

    // Engagement score (normal distribution around 3.6)
    const engagementBase = 3.6 + (Math.random() - 0.5) * 1.2; // ~N(3.6, 0.6)
    const engagement = Math.max(
      1,
      Math.min(5, Math.round(engagementBase * 100) / 100)
    );

    // Overtime hours
    const overtimeBase = department === 'Operations' ? 20 : 10;
    const overtime = Math.max(0, overtimeBase + (Math.random() - 0.5) * 12);

    // Last promotion date
    const lastPromotion =
      Math.random() > 0.3 ? generateRandomDateAfter(hireDate, 900) : undefined;

    // Manager ID (simplified)
    const managerId =
      i > 10
        ? `E${Math.floor(Math.random() * (i - 1) + 1)
            .toString()
            .padStart(5, '0')}`
        : undefined;

    // Age
    const age = Math.round(33 + (Math.random() - 0.5) * 14); // Normal around 33, ±7

    employees.push({
      employee_id: employeeId,
      name: name,
      alias: generateAlias(name, employeeId),
      gender: gender as 'Male' | 'Female',
      age: Math.max(21, Math.min(60, age)),
      department,
      location,
      grade,
      manager_id: managerId,
      hire_date: hireDate,
      term_date: termDate,
      status: termDate ? 'Terminated' : 'Active',
      salary_aed: salary,
      performance_rating: performance as 1 | 2 | 3 | 4 | 5,
      engagement_score: engagement,
      overtime_hours_m: Math.round(overtime * 10) / 10,
      last_promotion_date: lastPromotion,
    });
  }

  // Generate recruiting data
  const requisitions: RequisitionData[] = [];
  const candidates: CandidateData[] = [];
  const stages = [
    'Sourced',
    'Screen',
    'Interview',
    'Offer',
    'Hired',
    'Rejected',
  ];

  for (let r = 1; r <= 25; r++) {
    const reqId = `R${r.toString().padStart(3, '0')}`;
    const department = generateRandomChoice(departments);
    const openDate = generateRandomDate(
      new Date(today.getTime() - 120 * 24 * 60 * 60 * 1000),
      new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)
    );

    requisitions.push({
      req_id: reqId,
      department,
      open_date: openDate,
      status: 'Open',
    });

    // Generate candidates for this requisition
    const numCandidates = Math.floor(Math.random() * 20) + 5;
    for (let k = 1; k <= numCandidates; k++) {
      const candidateId = `C${r.toString().padStart(3, '0')}-${k
        .toString()
        .padStart(3, '0')}`;
      const stage = generateRandomChoice(stages, [20, 25, 25, 15, 10, 5]);
      const submittedDate = generateRandomDateAfter(openDate, 60);

      candidates.push({
        req_id: reqId,
        candidate_id: candidateId,
        stage: stage as
          | 'Sourced'
          | 'Screen'
          | 'Interview'
          | 'Offer'
          | 'Hired'
          | 'Rejected',
        submitted_date: submittedDate,
      });
    }
  }

  // Generate monthly engagement data
  const engagementMonthly: EngagementData[] = [];
  const monthsRange = monthsBack;

  for (let i = 0; i < monthsRange; i++) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const engagementScore = 3.6 + (Math.random() - 0.5) * 0.4; // ±0.2 variation

    engagementMonthly.push({
      month: monthDate.toISOString().split('T')[0],
      engagement_score:
        Math.round(Math.max(2.8, Math.min(4.4, engagementScore)) * 100) / 100,
    });
  }

  // Generate leave data (sample)
  const leaves: LeaveData[] = [];
  const leaveTypes = ['Annual', 'Sick', 'Personal', 'Maternity', 'Emergency'];

  // Generate some leave records for active employees
  const activeEmployees = employees.filter((emp) => emp.status === 'Active');
  for (let i = 0; i < Math.min(100, activeEmployees.length); i++) {
    const employee =
      activeEmployees[Math.floor(Math.random() * activeEmployees.length)];
    const leaveDate = generateRandomDate(
      new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000),
      today
    );
    const leaveType = generateRandomChoice(leaveTypes);
    const leaveDays = Math.floor(Math.random() * 5) + 1;

    leaves.push({
      employee_id: employee.employee_id,
      date: leaveDate,
      type: leaveType,
      days: leaveDays,
    });
  }

  return {
    employees,
    requisitions,
    candidates,
    engagementMonthly,
    leaves,
  };
}

// Export the generated data
export const hrSampleData = generateHRSampleData();

// Export available filter options
export const hrFilterOptions = {
  departments: [
    ...new Set(hrSampleData.employees.map((emp) => emp.department)),
  ].sort(),
  locations: [
    ...new Set(hrSampleData.employees.map((emp) => emp.location)),
  ].sort(),
  grades: [...new Set(hrSampleData.employees.map((emp) => emp.grade))].sort(),
};
