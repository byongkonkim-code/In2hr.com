export type Language = "ko" | "en";

export type VisaStatus =
  | "US Citizen"
  | "Green Card (Permanent Resident)"
  | "H-1B Specialty Occupation"
  | "OPT / STEM OPT (F-1)"
  | "E-2 Employee Visa"
  | "TN / L-1 Visa"
  | "Sponsorship Required";

export interface LanguageProficiency {
  korean: "Native" | "Fluent" | "Business" | "Conversational" | "None";
  english: "Native" | "Fluent" | "Business" | "Conversational" | "None";
  spanish: "Native" | "Fluent" | "Business" | "Conversational" | "None";
}

export interface JobPosting {
  id: string;
  title: string;
  clientName: string;
  location: string;
  employmentType: "Direct Hire" | "Contract-to-Hire" | "Temp / Staffing";
  requiredVisa: VisaStatus[];
  requiredLanguages: ("Korean" | "English" | "Spanish")[];
  requiredSkills: string[];
  minExperienceYears: number;
  salaryRange: string;
  hourlyBillRate?: number;
  hourlyPayRate?: number;
}

export interface CandidateResumeAnalysis {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  targetJobId: string;
  sourceChannel: "LinkedIn" | "Indeed" | "IN2U Job Board" | "Referral";
  rawResumeText: string;
  visaStatus: VisaStatus;
  visaVerified: boolean;
  languages: LanguageProficiency;
  extractedSkills: string[];
  experienceYears: number;
  education: string;
  matchScore: number; // 0-100
  scoreBreakdown: {
    visaScore: number; // max 30
    languageScore: number; // max 30
    skillsExperienceScore: number; // max 40
  };
  aiSummaryKo: string;
  aiSummaryEn: string;
  standardizedSummaryBulletPoints: string[];
  status: "Priority Shortlist" | "Review Needed" | "Auto-Filtered";
  parsedAt: string;
}

export interface PreScreeningSession {
  id: string;
  candidateName: string;
  phone: string;
  jobTitle: string;
  channel: "KakaoTalk" | "SMS" | "WebChat";
  chatLang: "KO" | "EN" | "ES";
  status: "Completed" | "In Progress" | "Link Sent";
  collectedData: {
    expectedSalary: string;
    availableStartDate: string;
    preferredLocation: string;
    needsVisaSponsorship: boolean;
    shiftFlexibility: string;
  };
  messages: {
    sender: "bot" | "candidate";
    text: string;
    timestamp: string;
  }[];
}

export interface InterviewSchedule {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  clientName: string;
  interviewerName: string;
  jobTitle: string;
  availableSlots: string[];
  selectedSlot: string | null;
  meetingPlatform: "Zoom" | "Microsoft Teams" | "On-site";
  meetingLink: string;
  calendlyEventUri?: string;
  reminder24hSent: boolean;
  reminder2hSent: boolean;
  candidateFormattedProfileReady: boolean;
  status: "Slot Pending" | "Confirmed" | "Reminder Dispatched" | "Completed";
}

export interface OnboardingPacket {
  id: string;
  candidateName: string;
  email: string;
  clientName: string;
  jobTitle: string;
  startDate: string;
  docusignEnvelopeId: string;
  documents: {
    offerLetter: "Signed" | "Sent" | "Pending";
    formI9: "Verified" | "Submitted" | "Pending";
    formW4: "Signed" | "Sent" | "Pending";
    directDeposit: "Completed" | "Pending";
    ndaAgreement: "Signed" | "Sent" | "Pending";
  };
  backgroundCheck: {
    provider: "Checkr API";
    reportId: string;
    status: "Clear" | "In Progress" | "Consider" | "Not Started";
    completedAt?: string;
  };
  lastReminderSentAt: string;
  overallProgress: number; // 0-100
}

export interface TimesheetRecord {
  id: string;
  workerName: string;
  clientName: string;
  department: string;
  weekEnding: string;
  regularHours: number;
  overtimeHours: number;
  lateFlags: number;
  payRate: number; // $/hr paid to worker
  billRate: number; // $/hr billed to client
  taxWithholdingRate: number; // e.g., 0.18
  clientApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  payrollStatus: "Draft" | "Calculated" | "Disbursed";
  invoiceStatus: "Pending Approval" | "Generated" | "Sent via QuickBooks" | "Paid";
  invoiceId?: string;
}
