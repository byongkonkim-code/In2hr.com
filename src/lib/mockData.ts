import {
  JobPosting,
  CandidateResumeAnalysis,
  PreScreeningSession,
  InterviewSchedule,
  OnboardingPacket,
  TimesheetRecord,
} from "./types";

export const INITIAL_JOBS: JobPosting[] = [
  {
    id: "JD-2026-01",
    title: "Bilingual HR & Payroll Specialist (KO/EN)",
    clientName: "Hyundai Mobis North America (Savannah, GA)",
    location: "Savannah, GA (On-site)",
    employmentType: "Direct Hire",
    requiredVisa: ["US Citizen", "Green Card (Permanent Resident)", "E-2 Employee Visa"],
    requiredLanguages: ["Korean", "English"],
    requiredSkills: ["ADP Workforce Now", "US Labor Law", "I-9 Compliance", "Bilingual Communication", "Excel Pivot"],
    minExperienceYears: 3,
    salaryRange: "$72,000 - $88,000 / yr",
  },
  {
    id: "JD-2026-02",
    title: "Warehouse & Production Shift Supervisor (EN/ES)",
    clientName: "CJ Logistics America (Dallas, TX)",
    location: "Dallas, TX",
    employmentType: "Temp / Staffing",
    requiredVisa: ["US Citizen", "Green Card (Permanent Resident)"],
    requiredLanguages: ["English", "Spanish"],
    requiredSkills: ["WMS (SAP)", "OSHA Safety", "Forklift Certified", "Shift Scheduling", "Team Leadership"],
    minExperienceYears: 2,
    salaryRange: "$28.00 - $34.00 / hr",
    hourlyPayRate: 30,
    hourlyBillRate: 43.5,
  },
  {
    id: "JD-2026-03",
    title: "Manufacturing Quality Assurance Engineer (KO/EN)",
    clientName: "SK Battery America (Commerce, GA)",
    location: "Commerce, GA",
    employmentType: "Contract-to-Hire",
    requiredVisa: [
      "US Citizen",
      "Green Card (Permanent Resident)",
      "OPT / STEM OPT (F-1)",
      "H-1B Specialty Occupation",
    ],
    requiredLanguages: ["Korean", "English"],
    requiredSkills: ["Six Sigma", "ISO 9001", "IATF 16949", "Root Cause Analysis", "AutoCAD"],
    minExperienceYears: 4,
    salaryRange: "$90,000 - $110,000 / yr",
    hourlyPayRate: 48,
    hourlyBillRate: 68,
  },
];

export const INITIAL_CANDIDATES: CandidateResumeAnalysis[] = [
  {
    id: "CAND-101",
    candidateName: "Jisoo Park (박지수)",
    email: "jisoo.park.hr@gmail.com",
    phone: "+1 (404) 892-3104",
    targetJobId: "JD-2026-01",
    sourceChannel: "LinkedIn",
    rawResumeText: `JISOO PARK | Atlanta, GA | Green Card Holder (US Permanent Resident)
EXPERIENCE:
HR Generalist & Payroll Coordinator @ Hanwha Q CELLS USA (2021 - Present, 4.5 yrs)
- Processed bi-weekly payroll for 320+ manufacturing and corporate employees using ADP Workforce Now.
- Managed full-cycle onboarding, E-Verify / Form I-9 compliance, W-4 withholding, and benefit administration.
- Served as primary bilingual liaison between Korean HQ expatriates and US local workforce.
EDUCATION: B.B.A. in Human Resource Management, Georgia State University
LANGUAGES: Korean (Native), English (Fluent), Spanish (None)`,
    visaStatus: "Green Card (Permanent Resident)",
    visaVerified: true,
    languages: {
      korean: "Native",
      english: "Fluent",
      spanish: "None",
    },
    extractedSkills: ["ADP Workforce Now", "US Labor Law", "I-9 Compliance", "Bilingual Communication", "E-Verify"],
    experienceYears: 4.5,
    education: "B.B.A. Human Resource Management, Georgia State University",
    matchScore: 96,
    scoreBreakdown: {
      visaScore: 30,
      languageScore: 30,
      skillsExperienceScore: 36,
    },
    aiSummaryKo:
      "미국 영주권 보유자로 스폰서십 불필요. 한화큐셀 미국 법인에서 4.5년간 ADP 페이롤 및 I-9 컴플라이언스 실무 수행. 한국어/영어 완벽 구사하며 JD 필수 요건 100% 부합.",
    aiSummaryEn:
      "US Permanent Resident (no sponsorship required). 4.5 yrs experience at Hanwha Q CELLS USA handling ADP Workforce Now payroll & I-9 compliance. Native Korean & Fluent English.",
    standardizedSummaryBulletPoints: [
      "Work Authorization: US Permanent Resident (Green Card) - Immediate start available",
      "Languages: Korean (Native) / English (Fluent) - Experienced HQ-Subsidiary bridge communicator",
      "Core Payroll & HRIS: 4.5+ years hands-on with ADP Workforce Now, E-Verify, Form I-9 & W-4 compliance",
    ],
    status: "Priority Shortlist",
    parsedAt: "2026-10-26 09:15 AM",
  },
  {
    id: "CAND-102",
    candidateName: "Carlos Mendoza",
    email: "c.mendoza.logistics@outlook.com",
    phone: "+1 (214) 509-7782",
    targetJobId: "JD-2026-02",
    sourceChannel: "Indeed",
    rawResumeText: `CARLOS MENDOZA | Irving, TX | US Citizen
SUMMARY: Bilingual (English/Spanish) Warehouse Shift Lead with 5 years of 3PL logistics experience.
EXPERIENCE:
Warehouse Supervisor @ DHL Supply Chain Dallas (2021 - 2026)
- Supervised 45+ warehouse associates across 1st and 2nd shifts; managed daily timecards and overtime control.
- Operated SAP WMS, RF scanners, and maintained 100% OSHA safety compliance & Forklift certification.
LANGUAGES: English (Native), Spanish (Native), Korean (None)`,
    visaStatus: "US Citizen",
    visaVerified: true,
    languages: {
      korean: "None",
      english: "Native",
      spanish: "Native",
    },
    extractedSkills: ["WMS (SAP)", "OSHA Safety", "Forklift Certified", "Shift Scheduling", "Team Leadership"],
    experienceYears: 5,
    education: "A.S. Supply Chain Management, Dallas College",
    matchScore: 94,
    scoreBreakdown: {
      visaScore: 30,
      languageScore: 30,
      skillsExperienceScore: 34,
    },
    aiSummaryKo:
      "미국 시민권자. 영어/스페인어 원어민 수준으로 텍사스 물류센터 현장 작업자 통솔 및 SAP WMS·OSHA 안전 관리 5년 경력 보유. CJ대한통운 댈러스 지점 즉시 투입 가능.",
    aiSummaryEn:
      "US Citizen, Native English/Spanish bilingual. 5 yrs 3PL warehouse supervision at DHL Dallas with SAP WMS, OSHA & Forklift certification.",
    standardizedSummaryBulletPoints: [
      "Work Authorization: US Citizen",
      "Languages: English (Native) / Spanish (Native) - Proven floor leadership for diverse warehouse teams",
      "Technical & Safety: SAP WMS, OSHA 30 Certified, Forklift Trainer, 5 yrs 3PL shift management",
    ],
    status: "Priority Shortlist",
    parsedAt: "2026-10-26 10:02 AM",
  },
  {
    id: "CAND-103",
    candidateName: "Minho Kim (김민호)",
    email: "minho.kim.eng@gmail.com",
    phone: "+1 (678) 412-9901",
    targetJobId: "JD-2026-03",
    sourceChannel: "IN2U Job Board",
    rawResumeText: `MINHO KIM | Duluth, GA | F-1 STEM OPT (Valid until 08/2028, requires H-1B sponsorship later)
EXPERIENCE:
Quality Assurance Engineer @ Automotive Tier-1 Supplier (3.5 years)
- Conducted Root Cause Analysis (8D, 5-Why), IATF 16949 audits, and Six Sigma Green Belt projects.
- Fluent in Korean and Business English; basic conversational Spanish on the shop floor.
EDUCATION: M.S. Industrial Engineering, Georgia Tech`,
    visaStatus: "OPT / STEM OPT (F-1)",
    visaVerified: true,
    languages: {
      korean: "Native",
      english: "Business",
      spanish: "Conversational",
    },
    extractedSkills: ["Six Sigma", "IATF 16949", "Root Cause Analysis", "AutoCAD"],
    experienceYears: 3.5,
    education: "M.S. Industrial Engineering, Georgia Tech",
    matchScore: 84,
    scoreBreakdown: {
      visaScore: 24,
      languageScore: 28,
      skillsExperienceScore: 32,
    },
    aiSummaryKo:
      "F-1 STEM OPT 비자 보유(2028년 8월까지 취업 가능, 추후 H-1B 스폰서 필요). 배터리/자동차 부품 QA 경력 3.5년 및 Six Sigma·IATF 16949 보유.",
    aiSummaryEn:
      "F-1 STEM OPT valid through 08/2028. 3.5 yrs Automotive QA experience with Six Sigma & IATF 16949. Native Korean, Business English, Conversational Spanish.",
    standardizedSummaryBulletPoints: [
      "Work Authorization: F-1 STEM OPT (EAD valid for 24+ months; future H-1B sponsorship needed)",
      "Languages: Korean (Native) / English (Business) / Spanish (Conversational)",
      "QA Engineering: M.S. Georgia Tech, 3.5 yrs IATF 16949, 8D Root Cause Analysis & Six Sigma Green Belt",
    ],
    status: "Review Needed",
    parsedAt: "2026-10-26 11:20 AM",
  },
  {
    id: "CAND-104",
    candidateName: "David Ross",
    email: "dross88@yahoo.com",
    phone: "+1 (912) 331-0092",
    targetJobId: "JD-2026-01",
    sourceChannel: "Indeed",
    rawResumeText: `DAVID ROSS | Savannah, GA | US Citizen
EXPERIENCE: Office Administrator (1 year) - Handled basic filing and phone calls.
LANGUAGES: English Only (No Korean).`,
    visaStatus: "US Citizen",
    visaVerified: true,
    languages: {
      korean: "None",
      english: "Native",
      spanish: "None",
    },
    extractedSkills: ["Microsoft Word", "Office Filing"],
    experienceYears: 1,
    education: "B.A. History",
    matchScore: 38,
    scoreBreakdown: {
      visaScore: 30,
      languageScore: 5,
      skillsExperienceScore: 3,
    },
    aiSummaryKo:
      "미국 시민권자이나, JD 필수 요건인 한국어 구사 능력 및 ADP 페이롤/HR 경력(최소 3년) 미달로 자동 필터링 분류됨.",
    aiSummaryEn:
      "US Citizen, but lacks required Bilingual Korean proficiency and minimum 3+ yrs ADP Payroll/HR experience. Auto-filtered.",
    standardizedSummaryBulletPoints: [
      "Work Authorization: US Citizen",
      "Missing Critical Requirement: No Korean language proficiency; only 1 yr general office experience",
    ],
    status: "Auto-Filtered",
    parsedAt: "2026-10-26 11:45 AM",
  },
];

export const SAMPLE_RESUMES_FOR_TEST = [
  {
    label: "샘플 1: 한영 바이링구얼 시니어 HR/Payroll (영주권자, 높은 적합도)",
    targetJobId: "JD-2026-01",
    candidateName: "Soyeon Lee (이소연)",
    email: "soyeon.lee.hr@gmail.com",
    phone: "+1 (912) 774-2091",
    sourceChannel: "LinkedIn" as const,
    text: `SOYEON LEE, SHRM-CP
Location: Pooler, GA (15 mins from Savannah, GA)
Work Authorization: US Permanent Resident (Green Card - No Sponsorship Needed)

PROFESSIONAL EXPERIENCE
Senior HR & Payroll Specialist | LG Energy Solution Michigan / Georgia | 2020 - 2026 (6 Years)
- Executed end-to-end bi-weekly and monthly payroll for 450+ non-exempt and exempt workers via ADP Workforce Now.
- Audited Form I-9, E-Verify, W-4 tax withholding, and multi-state US Labor Law compliance.
- Translated HR policies and conducted bilingual new-hire orientation in Korean and English.
- Advanced Excel Pivot Tables & VLOOKUP for weekly labor cost & overtime reporting.

LANGUAGES
- Korean: Native
- English: Fluent (Full Professional Proficiency)
- Spanish: Conversational`,
  },
  {
    label: "샘플 2: 영/스페인어 물류 슈퍼바이저 (미국 시민권자, 댈러스)",
    targetJobId: "JD-2026-02",
    candidateName: "Mateo Hernandez",
    email: "mateo.hernandez.tx@gmail.com",
    phone: "+1 (469) 882-1940",
    sourceChannel: "Indeed" as const,
    text: `MATEO HERNANDEZ
Location: Dallas, TX | US Citizen
Languages: English (Native), Spanish (Native)

EXPERIENCE
Distribution Center Shift Supervisor | Amazon Fulfillment DFW | 2022 - 2026 (4 Years)
- Directed 60+ bilingual warehouse associates in high-volume inbound/outbound operations.
- Certified OSHA Safety Trainer & Forklift Operator; reduced floor incidents by 35%.
- Managed SAP WMS inventory tracking, shift scheduling, and daily timesheet verification.`,
  },
  {
    label: "샘플 3: 한국 거주 지원자 (비자 스폰서 필요 & 경력 부족 - 필터링 테스트)",
    targetJobId: "JD-2026-01",
    candidateName: "Junho Choi (최준호)",
    email: "junho.choi.kr@naver.com",
    phone: "+82 10-4921-8832",
    sourceChannel: "IN2U Job Board" as const,
    text: `JUNHO CHOI | Seoul, South Korea
Visa Status: Requires new H-1B or J-1 Visa Sponsorship from employer.
Experience: 6 months internship in general marketing.
Languages: Korean (Native), English (Conversational). No experience with ADP or US Payroll.`,
  },
];

export const INITIAL_PRESCREEN_SESSIONS: PreScreeningSession[] = [
  {
    id: "PRE-201",
    candidateName: "Jisoo Park (박지수)",
    phone: "+1 (404) 892-3104",
    jobTitle: "Bilingual HR & Payroll Specialist (KO/EN)",
    channel: "KakaoTalk",
    chatLang: "KO",
    status: "Completed",
    collectedData: {
      expectedSalary: "$80,000 / yr",
      availableStartDate: "2주 노티스 후 즉시 가능 (2026-11-09)",
      preferredLocation: "Savannah, GA (리로케이션 완료 가능)",
      needsVisaSponsorship: false,
      shiftFlexibility: "주간 풀타임 (오버타임 가능)",
    },
    messages: [
      {
        sender: "bot",
        text: "안녕하세요 박지수님! IN2U HR AI 리크루팅 어시스턴트입니다. 지원해주신 [Bilingual HR & Payroll Specialist] 포지션 1차 프리 스크리닝(약 2분 소요)을 시작할게요. 현재 비자 스폰서십이 필요하신가요?",
        timestamp: "09:16 AM",
      },
      {
        sender: "candidate",
        text: "안녕하세요! 아니요, 미국 영주권(Green Card) 소지자라 스폰서십 필요 없습니다.",
        timestamp: "09:16 AM",
      },
      {
        sender: "bot",
        text: "확인 감사합니다! 희망하시는 연봉 수준(Expected Salary)과 출근 가능일(Available Start Date)을 알려주시겠어요?",
        timestamp: "09:17 AM",
      },
      {
        sender: "candidate",
        text: "연봉은 $80,000 내외 희망하고, 오퍼 확정 후 2주 노티스 뒤 11월 9일부터 출근 가능합니다. 사바나 지역 출퇴근도 문제없습니다.",
        timestamp: "09:18 AM",
      },
      {
        sender: "bot",
        text: "모든 사전 질문이 완료되었습니다! 담당 리크루터에게 상위 우선순위로 전달되었으며 곧 면접 일정 안내 링크를 보내드리겠습니다.",
        timestamp: "09:18 AM",
      },
    ],
  },
  {
    id: "PRE-202",
    candidateName: "Carlos Mendoza",
    phone: "+1 (214) 509-7782",
    jobTitle: "Warehouse & Production Shift Supervisor (EN/ES)",
    channel: "SMS",
    chatLang: "ES",
    status: "Completed",
    collectedData: {
      expectedSalary: "$31.00 / hr",
      availableStartDate: "Immediately (2026-11-02)",
      preferredLocation: "Dallas / Irving, TX",
      needsVisaSponsorship: false,
      shiftFlexibility: "1st or 2nd Shift + Weekend OT available",
    },
    messages: [
      {
        sender: "bot",
        text: "¡Hola Carlos! Soy el asistente de IA de IN2U HR. Gracias por postularte a Supervisor de Almacén en Dallas, TX. ¿Necesitas patrocinio de visa para trabajar en EE. UU.?",
        timestamp: "10:05 AM",
      },
      {
        sender: "candidate",
        text: "Hola, no necesito patrocinio. Soy ciudadano estadounidense.",
        timestamp: "10:06 AM",
      },
      {
        sender: "bot",
        text: "¡Perfecto! ¿Cuál es tu expectativa salarial por hora y cuándo podrías comenzar en Dallas, TX?",
        timestamp: "10:06 AM",
      },
      {
        sender: "candidate",
        text: "Busco alrededor de $31/hr y puedo empezar de inmediato la próxima semana. Tengo disponibilidad para 1er o 2do turno.",
        timestamp: "10:07 AM",
      },
    ],
  },
];

export const INITIAL_INTERVIEWS: InterviewSchedule[] = [
  {
    id: "INT-301",
    candidateName: "Jisoo Park (박지수)",
    candidateEmail: "jisoo.park.hr@gmail.com",
    candidatePhone: "+1 (404) 892-3104",
    clientName: "Hyundai Mobis North America",
    interviewerName: "Director Kevin Baek (HR VP)",
    jobTitle: "Bilingual HR & Payroll Specialist (KO/EN)",
    availableSlots: [
      "2026-10-28 (Wed) 10:30 AM EDT",
      "2026-10-28 (Wed) 02:00 PM EDT",
      "2026-10-29 (Thu) 11:00 AM EDT",
    ],
    selectedSlot: "2026-10-28 (Wed) 02:00 PM EDT",
    meetingPlatform: "Zoom",
    meetingLink: "https://zoom.us/j/98234109281?pwd=in2uhr_auto",
    calendlyEventUri: "https://calendly.com/in2u-hr/hyundai-mobis-interview-301",
    reminder24hSent: true,
    reminder2hSent: false,
    candidateFormattedProfileReady: true,
    status: "Confirmed",
  },
  {
    id: "INT-302",
    candidateName: "Carlos Mendoza",
    candidateEmail: "c.mendoza.logistics@outlook.com",
    candidatePhone: "+1 (214) 509-7782",
    clientName: "CJ Logistics America",
    interviewerName: "Sarah Jenkins (Operations GM)",
    jobTitle: "Warehouse & Production Shift Supervisor (EN/ES)",
    availableSlots: [
      "2026-10-29 (Thu) 09:30 AM CDT",
      "2026-10-29 (Thu) 03:30 PM CDT",
      "2026-10-30 (Fri) 10:00 AM CDT",
    ],
    selectedSlot: null,
    meetingPlatform: "Microsoft Teams",
    meetingLink: "Pending Candidate Slot Selection",
    calendlyEventUri: "https://calendly.com/in2u-hr/cj-logistics-interview-302",
    reminder24hSent: false,
    reminder2hSent: false,
    candidateFormattedProfileReady: true,
    status: "Slot Pending",
  },
  {
    id: "INT-303",
    candidateName: "Minho Kim (김민호)",
    candidateEmail: "minho.kim.eng@gmail.com",
    candidatePhone: "+1 (678) 412-9901",
    clientName: "SK Battery America",
    interviewerName: "Sanghoon Jung (QA Team Lead)",
    jobTitle: "Manufacturing Quality Assurance Engineer (KO/EN)",
    availableSlots: [
      "2026-10-30 (Fri) 01:00 PM EDT",
      "2026-10-30 (Fri) 04:00 PM EDT",
    ],
    selectedSlot: "2026-10-30 (Fri) 01:00 PM EDT",
    meetingPlatform: "Zoom",
    meetingLink: "https://zoom.us/j/94412098412?pwd=in2uhr_skba",
    calendlyEventUri: "https://calendly.com/in2u-hr/skba-qa-interview-303",
    reminder24hSent: true,
    reminder2hSent: true,
    candidateFormattedProfileReady: true,
    status: "Reminder Dispatched",
  },
];

export const INITIAL_ONBOARDING: OnboardingPacket[] = [
  {
    id: "ONB-401",
    candidateName: "Hyunjin Cho (조현진)",
    email: "hyunjin.cho@gmail.com",
    clientName: "Hyundai Mobis North America",
    jobTitle: "Supply Chain Coordinator (KO/EN)",
    startDate: "2026-11-02",
    docusignEnvelopeId: "DS-ENV-884920-A",
    documents: {
      offerLetter: "Signed",
      formI9: "Verified",
      formW4: "Signed",
      directDeposit: "Completed",
      ndaAgreement: "Signed",
    },
    backgroundCheck: {
      provider: "Checkr API",
      reportId: "CHK-992014",
      status: "Clear",
      completedAt: "2026-10-25 04:12 PM",
    },
    lastReminderSentAt: "2026-10-24 10:00 AM",
    overallProgress: 100,
  },
  {
    id: "ONB-402",
    candidateName: "Miguel Angel Rivera",
    email: "m.rivera.tx@gmail.com",
    clientName: "CJ Logistics America",
    jobTitle: "Forklift & Inventory Lead (EN/ES)",
    startDate: "2026-11-03",
    docusignEnvelopeId: "DS-ENV-884955-B",
    documents: {
      offerLetter: "Signed",
      formI9: "Submitted",
      formW4: "Signed",
      directDeposit: "Pending",
      ndaAgreement: "Sent",
    },
    backgroundCheck: {
      provider: "Checkr API",
      reportId: "CHK-992088",
      status: "In Progress",
    },
    lastReminderSentAt: "2026-10-26 08:30 AM",
    overallProgress: 60,
  },
  {
    id: "ONB-403",
    candidateName: "Eunbi Kang (강은비)",
    email: "eunbi.kang.acct@gmail.com",
    clientName: "SK Battery America",
    jobTitle: "Bilingual Cost Accountant (KO/EN)",
    startDate: "2026-11-09",
    docusignEnvelopeId: "DS-ENV-885012-C",
    documents: {
      offerLetter: "Signed",
      formI9: "Pending",
      formW4: "Sent",
      directDeposit: "Pending",
      ndaAgreement: "Signed",
    },
    backgroundCheck: {
      provider: "Checkr API",
      reportId: "CHK-992140",
      status: "In Progress",
    },
    lastReminderSentAt: "2026-10-25 02:00 PM",
    overallProgress: 40,
  },
];

export const INITIAL_TIMESHEETS: TimesheetRecord[] = [
  {
    id: "TS-501",
    workerName: "Daniel Kim (김다니엘)",
    clientName: "SK Battery America",
    department: "Electrode Assembly Line A",
    weekEnding: "2026-10-25",
    regularHours: 40,
    overtimeHours: 6.5,
    lateFlags: 0,
    payRate: 32.0,
    billRate: 46.4,
    taxWithholdingRate: 0.18,
    clientApproved: true,
    approvedBy: "Manager S.H. Jung",
    approvedAt: "2026-10-26 08:45 AM",
    payrollStatus: "Calculated",
    invoiceStatus: "Sent via QuickBooks",
    invoiceId: "QBO-INV-2026-1084",
  },
  {
    id: "TS-502",
    workerName: "Luis Fernando Gomez",
    clientName: "CJ Logistics America",
    department: "Dallas Cold Storage Hub",
    weekEnding: "2026-10-25",
    regularHours: 40,
    overtimeHours: 4.0,
    lateFlags: 0,
    payRate: 24.0,
    billRate: 34.8,
    taxWithholdingRate: 0.16,
    clientApproved: false,
    payrollStatus: "Draft",
    invoiceStatus: "Pending Approval",
  },
  {
    id: "TS-503",
    workerName: "Sujin Han (한수진)",
    clientName: "Hyundai Mobis North America",
    department: "Logistics & Parts QA",
    weekEnding: "2026-10-25",
    regularHours: 38.5,
    overtimeHours: 0,
    lateFlags: 1,
    payRate: 28.0,
    billRate: 40.6,
    taxWithholdingRate: 0.17,
    clientApproved: false,
    payrollStatus: "Draft",
    invoiceStatus: "Pending Approval",
  },
  {
    id: "TS-504",
    workerName: "Roberto Diaz",
    clientName: "CJ Logistics America",
    department: "Dallas Outbound Dock",
    weekEnding: "2026-10-25",
    regularHours: 40,
    overtimeHours: 8.0,
    lateFlags: 0,
    payRate: 25.0,
    billRate: 36.25,
    taxWithholdingRate: 0.16,
    clientApproved: true,
    approvedBy: "GM Sarah Jenkins",
    approvedAt: "2026-10-26 09:10 AM",
    payrollStatus: "Calculated",
    invoiceStatus: "Generated",
    invoiceId: "QBO-INV-2026-1085",
  },
];
