export type EmploymentType = "正社員" | "契約社員" | "業務委託";

export type ActuaryQualification =
  | "未取得"
  | "研究会員"
  | "準会員"
  | "正会員";

export interface Job {
  id: string;
  company: string;
  companyKind: "生命保険" | "損害保険" | "再保険" | "コンサル" | "信託銀行" | "年金" | "その他";
  position: string;
  summary: string;
  location: string;
  salary: string;
  salaryMin: number;
  salaryMax: number;
  employmentType: EmploymentType;
  remote: "フルリモート可" | "一部リモート可" | "出社";
  tags: string[];
  status: "募集中" | "募集終了";
  postedAt: string;
  description: string;
  requirements: string[];
  preferred: string[];
  companyOverview: string;
  workHours: string;
  benefits: string[];
  holidays: string;
  selectionProcess: string[];
  idealCandidate: string;
  isConfidential?: boolean;
  published: boolean;
  sortOrder: number;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  years: number;
  currentCompany: string;
  qualification: ActuaryQualification;
  otherQualifications: string;
  avatarUrl: string | null;
  isAdmin: boolean;
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  appliedAt: string;
  status: "受付済" | "確認中" | "書類通過" | "面接中" | "終了";
  intent: string;
  reason: string;
  currentSituation: string;
  wantsCounseling: boolean;
  freeText: string;
}
