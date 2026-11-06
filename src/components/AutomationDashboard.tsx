"use client";

import React, { useState } from "react";
import {
  FileText,
  MessageSquare,
  Calendar,
  ShieldCheck,
  DollarSign,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  Globe,
  Filter,
  Building2,
  UserCheck,
  Bell,
  ArrowRight,
  Copy,
  Check,
  Code2,
  RefreshCw,
  FileSpreadsheet,
  Video,
  Award,
  Briefcase,
} from "lucide-react";
import {
  INITIAL_JOBS,
  INITIAL_CANDIDATES,
  SAMPLE_RESUMES_FOR_TEST,
  INITIAL_PRESCREEN_SESSIONS,
  INITIAL_INTERVIEWS,
  INITIAL_ONBOARDING,
  INITIAL_TIMESHEETS,
} from "@/lib/mockData";
import {
  Language,
  CandidateResumeAnalysis,
  PreScreeningSession,
  InterviewSchedule,
  OnboardingPacket,
  TimesheetRecord,
} from "@/lib/types";

export default function AutomationDashboard() {
  const [lang, setLang] = useState<Language>("ko");
  const [activeTab, setActiveTab] = useState<number>(1);
  const [toast, setToast] = useState<string | null>(null);
  const [showApiModal, setShowApiModal] = useState<boolean>(false);

  // Module 1 State: AI Resume Parsing & JD Scoring
  const [selectedJobId, setSelectedJobId] = useState<string>(INITIAL_JOBS[0].id);
  const [candidates, setCandidates] = useState<CandidateResumeAnalysis[]>(INITIAL_CANDIDATES);
  const [applicantName, setApplicantName] = useState<string>(SAMPLE_RESUMES_FOR_TEST[0].candidateName);
  const [applicantEmail, setApplicantEmail] = useState<string>(SAMPLE_RESUMES_FOR_TEST[0].email);
  const [applicantPhone, setApplicantPhone] = useState<string>(SAMPLE_RESUMES_FOR_TEST[0].phone);
  const [resumeInput, setResumeInput] = useState<string>(SAMPLE_RESUMES_FOR_TEST[0].text);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [selectedCandidateForProfile, setSelectedCandidateForProfile] =
    useState<CandidateResumeAnalysis | null>(INITIAL_CANDIDATES[0]);
  const [copiedProfile, setCopiedProfile] = useState<boolean>(false);

  // Module 2 State: Multilingual Pre-screening Chatbot
  const [sessions, setSessions] = useState<PreScreeningSession[]>(INITIAL_PRESCREEN_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState<string>(INITIAL_PRESCREEN_SESSIONS[0].id);
  const [chatLang, setChatLang] = useState<"KO" | "EN" | "ES">("KO");
  const [chatStep, setChatStep] = useState<number>(1);
  const [chatInput, setChatInput] = useState<string>("");
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const [liveChatMessages, setLiveChatMessages] = useState<
    { sender: "bot" | "candidate"; text: string; timestamp: string }[]
  >([
    {
      sender: "bot",
      text: "안녕하세요! IN2U HR 24/7 AI 프리 스크리닝 챗봇입니다. 지원하신 포지션 관련 4가지 기본 자격(비자/희망연봉/출근가능일/근무지역)을 2분 내로 확인해 드립니다. 질문 1: 현재 미국 내 취업 비자 스폰서십이 필요하신가요?",
      timestamp: "방금 전",
    },
  ]);
  const [liveCollected, setLiveCollected] = useState({
    needsVisaSponsorship: false,
    expectedSalary: "미입력",
    availableStartDate: "미입력",
    preferredLocation: "미입력",
  });

  // Module 3 State: Calendar Synced Interview Scheduling & No-Show Reminders
  const [interviews, setInterviews] = useState<InterviewSchedule[]>(INITIAL_INTERVIEWS);

  // Module 4 State: Digital Onboarding & Compliance (DocuSign + Checkr)
  const [onboardingList, setOnboardingList] = useState<OnboardingPacket[]>(INITIAL_ONBOARDING);
  const [newHireName, setNewHireName] = useState<string>("Jisoo Park (박지수)");
  const [newHireEmail, setNewHireEmail] = useState<string>("jisoo.park.hr@gmail.com");
  const [newHireClient, setNewHireClient] = useState<string>("Hyundai Mobis North America");
  const [newHireRole, setNewHireRole] = useState<string>("Bilingual HR & Payroll Specialist");

  // Module 5 State: Staffing Timesheet, Payroll & QuickBooks Auto-Invoicing
  const [timesheets, setTimesheets] = useState<TimesheetRecord[]>(INITIAL_TIMESHEETS);
  const [selectedInvoicePreview, setSelectedInvoicePreview] = useState<TimesheetRecord | null>(null);

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // --- Module 1 Handlers ---
  const handleLoadSampleResume = (idx: number) => {
    const sample = SAMPLE_RESUMES_FOR_TEST[idx];
    setSelectedJobId(sample.targetJobId);
    setApplicantName(sample.candidateName);
    setApplicantEmail(sample.email);
    setApplicantPhone(sample.phone);
    setResumeInput(sample.text);
  };

  const handleRunResumeAnalysis = async () => {
    if (!resumeInput.trim()) return;
    setIsParsing(true);
    try {
      const res = await fetch("/api/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: resumeInput,
          targetJobId: selectedJobId,
          candidateName: applicantName,
          email: applicantEmail,
          phone: applicantPhone,
          sourceChannel: "LinkedIn",
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        const updated = [data.analysis, ...candidates].sort((a, b) => b.matchScore - a.matchScore);
        setCandidates(updated);
        setSelectedCandidateForProfile(data.analysis);
        showNotification(
          lang === "ko"
            ? `✅ AI 이력서 파싱 완료! [${data.analysis.candidateName}] 적합도 ${data.analysis.matchScore}점 (${data.analysis.status})`
            : `✅ AI Resume Parsed! [${data.analysis.candidateName}] Match Score: ${data.analysis.matchScore}/100`
        );
      }
    } finally {
      setIsParsing(false);
    }
  };

  const handleCopyStandardProfile = (cand: CandidateResumeAnalysis) => {
    const job = INITIAL_JOBS.find((j) => j.id === cand.targetJobId) || INITIAL_JOBS[0];
    const formatted = `[IN2U HR — STANDARDIZED CANDIDATE SUBMISSION PROFILE]
Candidate: ${cand.candidateName} | Target Role: ${job.title} (${job.clientName})
AI Fit Score: ${cand.matchScore}/100 (${cand.status})
------------------------------------------------------------
• Work Authorization: ${cand.visaStatus}
• Languages: KO (${cand.languages.korean}) | EN (${cand.languages.english}) | ES (${cand.languages.spanish})
• Experience: ${cand.experienceYears} Years | Core Skills: ${cand.extractedSkills.join(", ")}
• Executive Summary: ${lang === "ko" ? cand.aiSummaryKo : cand.aiSummaryEn}`;
    navigator.clipboard.writeText(formatted);
    setCopiedProfile(true);
    setTimeout(() => setCopiedProfile(false), 2500);
    showNotification(
      lang === "ko"
        ? "📋 고객사 제출용 표준 후보자 추천서(Candidate Profile)가 클립보드에 복사되었습니다."
        : "📋 Standardized Candidate Submission Profile copied to clipboard."
    );
  };

  // --- Module 2 Handlers ---
  const handleSwitchChatLanguage = (newLang: "KO" | "EN" | "ES") => {
    setChatLang(newLang);
    setChatStep(1);
    setLiveCollected({
      needsVisaSponsorship: false,
      expectedSalary: "미입력",
      availableStartDate: "미입력",
      preferredLocation: "미입력",
    });
    const greetings = {
      KO: "안녕하세요! IN2U HR 24/7 AI 프리 스크리닝 챗봇입니다. 질문 1/4: 현재 미국 내 취업 비자 스폰서십이 필요하신가요? (예: 영주권자라 필요 없음 / H-1B 스폰서 필요)",
      EN: "Hello! Welcome to IN2U HR's 24/7 AI Pre-Screening Assistant. Question 1/4: Do you require US visa sponsorship now or in the future? (e.g., No, Green Card holder / Yes, OPT)",
      ES: "¡Hola! Bienvenido al asistente de preselección 24/7 de IN2U HR. Pregunta 1/4: ¿Necesitas patrocinio de visa para trabajar en EE. UU.? (Ej. No, soy ciudadano / residente)",
    };
    setLiveChatMessages([{ sender: "bot", text: greetings[newLang], timestamp: "Just now" }]);
  };

  const handleSendChatMessage = async (presetText?: string) => {
    const textToSend = presetText ?? chatInput;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: "candidate" as const,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setLiveChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsBotTyping(true);

    try {
      const res = await fetch("/api/prescreen-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          chatLang,
          step: chatStep,
          candidateName: "지원자(Live Demo)",
          currentData: liveCollected,
        }),
      });
      const data = await res.json();
      setLiveCollected(data.collectedData);
      setChatStep(data.nextStep);
      setLiveChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      if (data.completed) {
        const newSession: PreScreeningSession = {
          id: `PRE-${Math.floor(205 + Math.random() * 700)}`,
          candidateName: `신규 응답자 (${chatLang})`,
          phone: "+1 (404) 555-0199",
          jobTitle: INITIAL_JOBS[0].title,
          channel: chatLang === "KO" ? "KakaoTalk" : "SMS",
          chatLang,
          status: "Completed",
          collectedData: {
            expectedSalary: data.collectedData.expectedSalary || "$78,000 / yr",
            availableStartDate: data.collectedData.availableStartDate || "Immediate",
            preferredLocation: data.collectedData.preferredLocation || "Savannah / Atlanta, GA",
            needsVisaSponsorship: !!data.collectedData.needsVisaSponsorship,
            shiftFlexibility: "Full-time / OT OK",
          },
          messages: [...liveChatMessages, userMsg, { sender: "bot", text: data.reply, timestamp: "Now" }],
        };
        setSessions((prev) => [newSession, ...prev]);
        showNotification(
          lang === "ko"
            ? "✅ 2분 프리 스크리닝 완료! 응답 데이터가 ATS 테이블에 자동 저장되었습니다."
            : "✅ Pre-screening completed! Candidate data synced to ATS."
        );
      }
    } finally {
      setIsBotTyping(false);
    }
  };

  // --- Module 3 Handlers ---
  const handleSelectInterviewSlot = async (interviewId: string, slot: string, platform: string) => {
    const res = await fetch("/api/integrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "CONFIRM_INTERVIEW_SLOT",
        payload: { interviewId, selectedSlot: slot, platform },
      }),
    });
    const data = await res.json();
    if (data.success) {
      setInterviews((prev) =>
        prev.map((item) =>
          item.id === interviewId
            ? {
                ...item,
                selectedSlot: slot,
                meetingLink: data.meetingLink,
                status: "Confirmed",
              }
            : item
        )
      );
      showNotification(
        lang === "ko"
          ? `📅 면접 슬롯 확정 완료! ${platform} 링크 자동 생성 및 양측 캘린더 초대가 발송되었습니다.`
          : `📅 Slot confirmed! ${platform} link generated and calendar invites dispatched.`
      );
    }
  };

  const handleSendInterviewReminder = async (item: InterviewSchedule) => {
    const res = await fetch("/api/integrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "SEND_INTERVIEW_REMINDER",
        payload: {
          interviewId: item.id,
          candidateName: item.candidateName,
          candidatePhone: item.candidatePhone,
        },
      }),
    });
    const data = await res.json();
    if (data.success) {
      setInterviews((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, reminder24hSent: true, reminder2hSent: true, status: "Reminder Dispatched" }
            : i
        )
      );
      showNotification(
        lang === "ko"
          ? `📲 [${item.candidateName}] 후보자에게 SMS/이메일 리마인더 + 면접 팁 & 오시는 길 안내가 발송되었습니다.`
          : `📲 SMS & Email Reminder + Interview Tips sent to ${item.candidateName}.`
      );
    }
  };

  // --- Module 4 Handlers ---
  const handleDispatchOnboardingPackage = async () => {
    const res = await fetch("/api/integrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "SEND_DOCUSIGN_PACKAGE",
        payload: {
          candidateName: newHireName,
          email: newHireEmail,
          clientName: newHireClient,
          jobTitle: newHireRole,
        },
      }),
    });
    const data = await res.json();
    if (data.success) {
      const newPkg: OnboardingPacket = {
        id: `ONB-${Math.floor(405 + Math.random() * 500)}`,
        candidateName: newHireName,
        email: newHireEmail,
        clientName: newHireClient,
        jobTitle: newHireRole,
        startDate: "2026-11-16",
        docusignEnvelopeId: data.envelopeId,
        documents: {
          offerLetter: "Sent",
          formI9: "Pending",
          formW4: "Sent",
          directDeposit: "Pending",
          ndaAgreement: "Sent",
        },
        backgroundCheck: {
          provider: "Checkr API",
          reportId: data.checkrReportId,
          status: "In Progress",
        },
        lastReminderSentAt: "Just now",
        overallProgress: 20,
      };
      setOnboardingList((prev) => [newPkg, ...prev]);
      showNotification(
        lang === "ko"
          ? `✍️ DocuSign 온보딩 패키지(${data.envelopeId}) 발송 및 Checkr 신원조회(${data.checkrReportId})가 자동 요청되었습니다!`
          : `✍️ DocuSign Envelope (${data.envelopeId}) & Checkr Background Check (${data.checkrReportId}) initiated!`
      );
    }
  };

  const handleSimulateSignAllAndClearCheckr = (packetId: string) => {
    setOnboardingList((prev) =>
      prev.map((pkt) =>
        pkt.id === packetId
          ? {
              ...pkt,
              documents: {
                offerLetter: "Signed",
                formI9: "Verified",
                formW4: "Signed",
                directDeposit: "Completed",
                ndaAgreement: "Signed",
              },
              backgroundCheck: {
                ...pkt.backgroundCheck,
                status: "Clear",
                completedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
              overallProgress: 100,
            }
          : pkt
      )
    );
    showNotification(
      lang === "ko"
        ? "🎉 DocuSign 전자서명(I-9/W-4/NDA) 완료 및 Checkr 백그라운드 체크 [Clear] 웹훅 수신 완료!"
        : "🎉 All DocuSign documents signed & Checkr Background Check webhook returned [CLEAR]!"
    );
  };

  // --- Module 5 Handlers ---
  const handleOneClickApproveTimesheet = async (ts: TimesheetRecord) => {
    const res = await fetch("/api/integrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "APPROVE_TIMESHEET_AND_INVOICE",
        payload: {
          timesheetId: ts.id,
          regularHours: ts.regularHours,
          overtimeHours: ts.overtimeHours,
          payRate: ts.payRate,
          billRate: ts.billRate,
          taxWithholdingRate: ts.taxWithholdingRate,
        },
      }),
    });
    const data = await res.json();
    if (data.success) {
      const updatedTs: TimesheetRecord = {
        ...ts,
        clientApproved: true,
        approvedBy: "Client Portal One-Click",
        approvedAt: data.approvedAt,
        payrollStatus: "Calculated",
        invoiceStatus: "Sent via QuickBooks",
        invoiceId: data.qboInvoiceId,
      };
      setTimesheets((prev) => prev.map((item) => (item.id === ts.id ? updatedTs : item)));
      setSelectedInvoicePreview(updatedTs);
      showNotification(
        lang === "ko"
          ? `💸 타임시트 원클릭 승인 완료! 급여 정산 및 QuickBooks 인보이스(${data.qboInvoiceId})가 자동 발행되었습니다.`
          : `💸 Timesheet approved! Payroll calculated & QuickBooks Invoice (${data.qboInvoiceId}) dispatched.`
      );
    }
  };

  const handleApproveAllPendingTimesheets = async () => {
    const pending = timesheets.filter((t) => !t.clientApproved);
    for (const ts of pending) {
      await handleOneClickApproveTimesheet(ts);
    }
  };

  const modules = [
    {
      id: 1,
      stepLabel: "Stage 1 & 2",
      titleKo: "① AI 이력서 파싱 & 적합도 스코어링",
      titleEn: "① AI Resume Parsing & Fit Scoring",
      subKo: "비자 상태 · 한/영/스페인어 수준 · 핵심 경력 자동 추출 및 JD 매칭",
      subEn: "Auto-extract Visa, KO/EN/ES proficiency & rank 0-100 JD match",
      icon: FileText,
      badge: `${candidates.filter((c) => c.status === "Priority Shortlist").length} Priority`,
    },
    {
      id: 2,
      stepLabel: "Stage 2",
      titleKo: "② 다국어 프리 스크리닝 챗봇/음성 AI",
      titleEn: "② Multilingual Pre-Screening AI Bot",
      subKo: "카톡/SMS/웹챗 24시간 응대 · 희망연봉/출근일/비자 2분 자동 수집",
      subEn: "24/7 Kakao/SMS/WebChat · Cuts 1st phone screening time by 70%+",
      icon: MessageSquare,
      badge: "KO · EN · ES",
    },
    {
      id: 3,
      stepLabel: "Stage 3",
      titleKo: "③ 캘린더 면접 조율 & 리마인더 자동화",
      titleEn: "③ Calendar Sync & No-Show Reminder",
      subKo: "Calendly 슬롯 연동 · Zoom 자동 생성 · 표준 추천서 및 노쇼 방지 알림",
      subEn: "Calendly/Zoom auto-links, D-1 SMS reminders & standardized profiles",
      icon: Calendar,
      badge: `${interviews.filter((i) => i.status !== "Slot Pending").length}/${interviews.length} Synced`,
    },
    {
      id: 4,
      stepLabel: "Stage 4",
      titleKo: "④ 디지털 온보딩 & 컴플라이언스",
      titleEn: "④ Digital Onboarding & Compliance",
      subKo: "DocuSign(I-9, W-4, NDA) 자동 발송 · 미서명 독촉 · Checkr 신원조회",
      subEn: "DocuSign I-9/W-4/NDA auto-dispatch & Checkr Background Check API",
      icon: ShieldCheck,
      badge: `${onboardingList.filter((o) => o.overallProgress === 100).length} Cleared`,
    },
    {
      id: 5,
      stepLabel: "Stage 5 (Staffing)",
      titleKo: "⑤ 타임시트 연동 페이롤 & 인보이스 발행",
      titleEn: "⑤ Timesheet Payroll & QuickBooks Invoice",
      subKo: "현장 출퇴근 원클릭 승인 → 초과근무/급여/세금 계산 → 인보이스 자동 발행",
      subEn: "1-Click Timesheet Approval → Payroll & QuickBooks Auto-Invoicing",
      icon: DollarSign,
      badge: "QuickBooks Sync",
    },
  ];

  const currentJob = INITIAL_JOBS.find((j) => j.id === selectedJobId) || INITIAL_JOBS[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-blue-400 shrink-0" />
          <span className="text-sm font-medium leading-snug">{toast}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-lg shadow-md">
              IN2U
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg tracking-tight">IN2U HR Automation Suite</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-medium">
                  AI & RPA Staffing Platform
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === "ko"
                  ? "스태핑/리크루팅 에이전시 5단계 핵심 업무 엔드투엔드 자동화 워크스페이스"
                  : "End-to-End 5-Stage Staffing & Recruiting Agency Workflow Automation"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowApiModal(true)}
              className="flex items-center gap-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-lg border border-slate-700 transition"
            >
              <Code2 className="w-4 h-4 text-blue-400" />
              {lang === "ko" ? "외부 API 연동 설정 (.env)" : "External API Config"}
            </button>

            <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setLang("ko")}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                  lang === "ko" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                한국어
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                  lang === "en" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                ENG
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Top KPI & Process Bottleneck Resolution Bar */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {modules.map((m) => {
              const Icon = m.icon;
              const isActive = activeTab === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveTab(m.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                    isActive
                      ? "bg-blue-50/90 border-blue-600 ring-2 ring-blue-500/20 shadow-sm"
                      : "bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200/80 text-slate-700">
                      {m.stepLabel}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {m.badge}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm text-slate-900 mb-1">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-600" : "text-slate-500"}`} />
                      <span className="line-clamp-1">{lang === "ko" ? m.titleKo : m.titleEn}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {lang === "ko" ? m.subKo : m.subEn}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* =====================================================================
            MODULE 1: AI RESUME PARSING & JD FIT SCORING
           ===================================================================== */}
        {activeTab === 1 && (
          <div className="space-y-6">
            {/* Bottleneck vs Automation Impact Banner */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {lang === "ko"
                    ? "프로세스 1 & 2단계 자동화: 채용 의뢰 접수 · 소싱 & 1차 스크리닝"
                    : "Stage 1 & 2 Automation: Sourcing, Parsing & JD Match Scoring"}
                </div>
                <h2 className="text-xl font-bold">
                  {lang === "ko"
                    ? "① AI 기반 이력서 파싱 및 적합도 스코어링 (0~100점 자동 정렬)"
                    : "① AI Resume Parsing & JD Fit Scoring Engine (0–100 Priority Ranking)"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {lang === "ko"
                    ? "기존 병목(상이한 이력서 포맷, 비자 상태 및 한·영·스페인어 구사 여부 수기 확인)을 해결하여 상위 적합자를 즉시 선별하고 고객사 제출용 표준 추천서를 1초 만에 생성합니다."
                    : "Eliminates manual resume review by extracting (1) US Visa Status, (2) KO/EN/ES Proficiency, and (3) Core Skills to rank candidates against JD criteria."}
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <div className="bg-white/10 backdrop-blur px-4 py-2.5 rounded-xl border border-white/15 text-center">
                  <div className="text-lg font-extrabold text-emerald-300">-82%</div>
                  <div className="text-[11px] text-slate-300">
                    {lang === "ko" ? "이력서 검토 시간 단축" : "Screening Time Saved"}
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur px-4 py-2.5 rounded-xl border border-white/15 text-center">
                  <div className="text-lg font-extrabold text-blue-300">100%</div>
                  <div className="text-[11px] text-slate-300">
                    {lang === "ko" ? "비자·어학 자동 검증" : "Visa & Lang Verified"}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Target JD Selector & AI Resume Parser Input */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      {lang === "ko" ? "1. 타겟 채용공고(JD) 선택" : "1. Select Target Client JD"}
                    </h3>
                    <span className="text-xs text-slate-500">{currentJob.employmentType}</span>
                  </div>

                  <select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {INITIAL_JOBS.map((job) => (
                      <option key={job.id} value={job.id}>
                        [{job.id}] {job.title} — {job.clientName}
                      </option>
                    ))}
                  </select>

                  {/* Target JD Essential Requirements Summary */}
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">
                        {lang === "ko" ? "고객사 / 근무지:" : "Client / Location:"}
                      </span>
                      <span className="font-semibold text-slate-800">{currentJob.clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">
                        {lang === "ko" ? "허용 비자 기준 (30점):" : "Eligible Visas (30pt):"}
                      </span>
                      <span className="font-semibold text-blue-700 text-right">
                        {currentJob.requiredVisa.join(", ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">
                        {lang === "ko" ? "필수 어학 요건 (30점):" : "Required Languages (30pt):"}
                      </span>
                      <span className="font-semibold text-emerald-700">
                        {currentJob.requiredLanguages.join(" + ")}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium block mb-1">
                        {lang === "ko"
                          ? `핵심 기술 & 최소 경력 ${currentJob.minExperienceYears}년+ (40점):`
                          : `Core Skills & Min ${currentJob.minExperienceYears}+ Yrs Exp (40pt):`}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {currentJob.requiredSkills.map((sk) => (
                          <span
                            key={sk}
                            className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-700"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-200" />

                  {/* Sample Resume Loader */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700">
                        {lang === "ko"
                          ? "2. 지원자 이력서 원문 입력 (국/영문 자유 포맷)"
                          : "2. Paste Raw Candidate Resume (EN/KO/ES)"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {SAMPLE_RESUMES_FOR_TEST.map((smp, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleLoadSampleResume(idx)}
                          className="text-[11px] bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-2.5 py-1 rounded-lg border border-blue-200 transition"
                        >
                          {smp.label}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        type="text"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="Candidate Name"
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                      />
                      <input
                        type="text"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        placeholder="Phone Number"
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                      />
                    </div>

                    <textarea
                      rows={7}
                      value={resumeInput}
                      onChange={(e) => setResumeInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-3 text-xs font-mono bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Paste English or Korean resume text here..."
                    />
                  </div>

                  <button
                    onClick={handleRunResumeAnalysis}
                    disabled={isParsing}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl shadow-sm transition flex items-center justify-center gap-2 text-sm"
                  >
                    {isParsing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        {lang === "ko"
                          ? "AI 비자·어학·경력 추출 및 JD 대조 중..."
                          : "Extracting Visa, Languages & Scoring JD Fit..."}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        {lang === "ko"
                          ? "AI 이력서 파싱 & 적합도 점수(0~100점) 산출"
                          : "Run AI Resume Parser & Calculate Fit Score"}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Ranked Candidate Priority Queue & Standardized Profile Generator */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Filter className="w-4 h-4 text-blue-600" />
                        {lang === "ko"
                          ? "AI 적합도 스코어링 자동 정렬 리스트 (우선순위 순)"
                          : "AI-Ranked Candidate Priority Queue (Sorted by JD Fit Score)"}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {lang === "ko"
                          ? "클릭하면 우측 하단에 고객사 송부용 표준 후보자 추천서(Candidate Profile)가 자동 생성됩니다."
                          : "Click any candidate to inspect score breakdown and generate a standardized client submission profile."}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {candidates.map((cand) => {
                      const isSelected = selectedCandidateForProfile?.id === cand.id;
                      const scoreColor =
                        cand.matchScore >= 85
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : cand.matchScore >= 65
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-rose-50 text-rose-700 border-rose-200";

                      return (
                        <div
                          key={cand.id}
                          onClick={() => setSelectedCandidateForProfile(cand)}
                          className={`p-4 rounded-xl border transition cursor-pointer ${
                            isSelected
                              ? "border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/15"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900">{cand.candidateName}</span>
                                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                                  {cand.sourceChannel}
                                </span>
                                <span
                                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${scoreColor}`}
                                >
                                  {cand.status}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                                <span>
                                  🛂 <strong>Visa:</strong> {cand.visaStatus}
                                </span>
                                <span>
                                  🌐 <strong>KO:</strong> {cand.languages.korean} |{" "}
                                  <strong>EN:</strong> {cand.languages.english} |{" "}
                                  <strong>ES:</strong> {cand.languages.spanish}
                                </span>
                                <span>
                                  💼 <strong>Exp:</strong> {cand.experienceYears} yrs
                                </span>
                              </div>
                            </div>

                            {/* Total Score Badge */}
                            <div className="text-right">
                              <div className="inline-flex items-baseline gap-1 px-3 py-1 rounded-xl bg-slate-900 text-white">
                                <span className="text-xl font-extrabold">{cand.matchScore}</span>
                                <span className="text-[11px] text-slate-300">/100점</span>
                              </div>
                              <div className="text-[10px] text-slate-500 mt-1">
                                비자 {cand.scoreBreakdown.visaScore} · 어학 {cand.scoreBreakdown.languageScore} · 역량{" "}
                                {cand.scoreBreakdown.skillsExperienceScore}
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-slate-700 mt-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                            {lang === "ko" ? cand.aiSummaryKo : cand.aiSummaryEn}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Standardized Candidate Profile Card (Solves Stage 3 Resume Re-formatting bottleneck too!) */}
                {selectedCandidateForProfile && (
                  <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-md space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-400" />
                        <h4 className="font-bold text-sm">
                          {lang === "ko"
                            ? "고객사 송부용 표준 추천서 자동 생성 (Standardized Candidate Profile)"
                            : "Auto-Generated Standardized Client Submission Profile"}
                        </h4>
                      </div>
                      <button
                        onClick={() => handleCopyStandardProfile(selectedCandidateForProfile)}
                        className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-medium transition"
                      >
                        {copiedProfile ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedProfile
                          ? lang === "ko"
                            ? "복사 완료!"
                            : "Copied!"
                          : lang === "ko"
                          ? "추천서 양식 원클릭 복사"
                          : "Copy Formatted Profile"}
                      </button>
                    </div>
                    <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 text-xs space-y-2 font-mono">
                      <div className="text-blue-300 font-bold">
                        [IN2U HR EXECUTIVE CANDIDATE BRIEF — {selectedCandidateForProfile.candidateName}]
                      </div>
                      <div>
                        • Target JD: {selectedCandidateForProfile.targetJobId} | Fit Score:{" "}
                        <span className="text-emerald-400 font-bold">
                          {selectedCandidateForProfile.matchScore}/100 ({selectedCandidateForProfile.status})
                        </span>
                      </div>
                      {selectedCandidateForProfile.standardizedSummaryBulletPoints.map((pt, i) => (
                        <div key={i} className="text-slate-200">
                          • {pt}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            MODULE 2: MULTILINGUAL PRE-SCREENING CHATBOT / VOICE & SMS AI
           ===================================================================== */}
        {activeTab === 2 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-1">
                  <Globe className="w-3.5 h-3.5" />
                  {lang === "ko"
                    ? "프로세스 2단계 자동화: 다국어(한국어·영어·스페인어) 24시간 즉시 응대"
                    : "Stage 2 Automation: 24/7 Multilingual (KO/EN/ES) Instant Pre-Screening"}
                </div>
                <h2 className="text-xl font-bold">
                  {lang === "ko"
                    ? "② 다국어 프리 스크리닝 챗봇 / SMS · 카카오톡 자동 인터뷰"
                    : "② Multilingual Pre-Screening Chatbot & SMS/Kakao Automation"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 mt-1">
                  {lang === "ko"
                    ? "웹사이트 또는 링크드인 지원 즉시 카카오톡/SMS/웹챗 링크를 자동 발송하여 비자 스폰서 필요 여부, 희망 연봉, 출근 가능일, 선호 근무지를 2~3분 대화로 자동 수집합니다."
                    : "Automatically dispatches SMS/Kakao/WebChat links upon application to collect Visa Sponsorship, Expected Salary, Start Date, and Location in 2 minutes."}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur px-5 py-3 rounded-xl border border-white/15 text-center shrink-0">
                <div className="text-xl font-extrabold text-emerald-300">-70%+</div>
                <div className="text-xs text-slate-200">
                  {lang === "ko" ? "1차 전화 스크리닝 시간 단축" : "Phone Screening Time Reduced"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Live Interactive Multilingual Chatbot Simulator */}
              <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <div>
                      <h3 className="font-bold text-sm">
                        {lang === "ko"
                          ? "실시간 다국어 프리 스크리닝 챗봇 시뮬레이터"
                          : "Live Multilingual Pre-Screening Bot Simulator"}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        KakaoTalk / Twilio SMS / WebChat Webhook Connected
                      </p>
                    </div>
                  </div>

                  {/* Language Switcher for Bot */}
                  <div className="flex gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
                    {(["KO", "EN", "ES"] as const).map((l) => (
                      <button
                        key={l}
                        onClick={() => handleSwitchChatLanguage(l)}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                          chatLang === l ? "bg-emerald-600 text-white" : "text-slate-300 hover:text-white"
                        }`}
                      >
                        {l === "KO" ? "한국어" : l === "EN" ? "English" : "Español"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Messages Window */}
                <div className="p-4 space-y-3 h-80 overflow-y-auto bg-slate-50">
                  {liveChatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === "candidate" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                          msg.sender === "candidate"
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span
                          className={`block text-[10px] mt-1 ${
                            msg.sender === "candidate" ? "text-blue-200" : "text-slate-400"
                          }`}
                        >
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                  {isBotTyping && (
                    <div className="text-xs text-slate-400 italic">AI Recruiter is typing...</div>
                  )}
                </div>

                {/* Quick Reply Chips for Easy Testing */}
                <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 mr-1">
                    {lang === "ko" ? "원클릭 답변 테스트:" : "Quick Replies:"}
                  </span>
                  {chatLang === "KO" && (
                    <>
                      <button
                        onClick={() => handleSendChatMessage("아니요, 영주권자라 비자 스폰서 필요 없습니다.")}
                        className="text-[11px] bg-white hover:bg-emerald-50 text-slate-700 px-2.5 py-1 rounded-full border border-slate-300"
                      >
                        1. 영주권자 (스폰서 불필요)
                      </button>
                      <button
                        onClick={() => handleSendChatMessage("연봉 $82,000 희망합니다.")}
                        className="text-[11px] bg-white hover:bg-emerald-50 text-slate-700 px-2.5 py-1 rounded-full border border-slate-300"
                      >
                        2. 희망연봉 $82,000
                      </button>
                      <button
                        onClick={() => handleSendChatMessage("2주 뒤(11월 9일) 즉시 출근 가능합니다.")}
                        className="text-[11px] bg-white hover:bg-emerald-50 text-slate-700 px-2.5 py-1 rounded-full border border-slate-300"
                      >
                        3. 2주 뒤 출근 가능
                      </button>
                      <button
                        onClick={() => handleSendChatMessage("조지아주 사바나/애틀랜타 근무 및 오버타임 가능합니다.")}
                        className="text-[11px] bg-white hover:bg-emerald-50 text-slate-700 px-2.5 py-1 rounded-full border border-slate-300"
                      >
                        4. 사바나 근무 가능
                      </button>
                    </>
                  )}
                  {chatLang === "EN" && (
                    <>
                      <button
                        onClick={() => handleSendChatMessage("No sponsorship needed, I am a US Citizen.")}
                        className="text-[11px] bg-white hover:bg-emerald-50 text-slate-700 px-2.5 py-1 rounded-full border border-slate-300"
                      >
                        1. US Citizen (No Sponsor)
                      </button>
                      <button
                        onClick={() => handleSendChatMessage("$85,000/yr or $42/hr")}
                        className="text-[11px] bg-white hover:bg-emerald-50 text-slate-700 px-2.5 py-1 rounded-full border border-slate-300"
                      >
                        2. $85,000/yr
                      </button>
                      <button
                        onClick={() => handleSendChatMessage("Available in 2 weeks (Nov 9)")}
                        className="text-[11px] bg-white hover:bg-emerald-50 text-slate-700 px-2.5 py-1 rounded-full border border-slate-300"
                      >
                        3. Start in 2 weeks
                      </button>
                      <button
                        onClick={() => handleSendChatMessage("Savannah, GA on-site full time OK")}
                        className="text-[11px] bg-white hover:bg-emerald-50 text-slate-700 px-2.5 py-1 rounded-full border border-slate-300"
                      >
                        4. Savannah On-site OK
                      </button>
                    </>
                  )}
                  {chatLang === "ES" && (
                    <>
                      <button
                        onClick={() => handleSendChatMessage("No necesito patrocinio, tengo residencia permanente.")}
                        className="text-[11px] bg-white hover:bg-emerald-50 text-slate-700 px-2.5 py-1 rounded-full border border-slate-300"
                      >
                        1. Sin patrocinio (Residente)
                      </button>
                      <button
                        onClick={() => handleSendChatMessage("$32 por hora")}
                        className="text-[11px] bg-white hover:bg-emerald-50 text-slate-700 px-2.5 py-1 rounded-full border border-slate-300"
                      >
                        2. $32 / hr
                      </button>
                      <button
                        onClick={() => handleSendChatMessage("Disponible este lunes de inmediato")}
                        className="text-[11px] bg-white hover:bg-emerald-50 text-slate-700 px-2.5 py-1 rounded-full border border-slate-300"
                      >
                        3. Disponible inmediato
                      </button>
                      <button
                        onClick={() => handleSendChatMessage("Dallas, TX - 1er o 2do turno disponible")}
                        className="text-[11px] bg-white hover:bg-emerald-50 text-slate-700 px-2.5 py-1 rounded-full border border-slate-300"
                      >
                        4. Dallas TX Turno 1/2
                      </button>
                    </>
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                    placeholder={
                      chatLang === "KO"
                        ? "메시지를 입력하거나 위 원클릭 버튼을 눌러보세요..."
                        : "Type candidate response or click a quick reply chip above..."
                    }
                    className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={() => handleSendChatMessage()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {lang === "ko" ? "전송" : "Send"}
                  </button>
                </div>
              </div>

              {/* Right: Live Extracted Structured Pre-Screening Data & Completed Sessions */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    {lang === "ko"
                      ? "실시간 대화 데이터 → ATS 필드 자동 추출 현황"
                      : "Real-Time Conversational Entity Extraction to ATS"}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block mb-0.5">
                        1. 비자 스폰서십 필요 여부 (Visa Sponsorship)
                      </span>
                      <span className="font-bold text-slate-900">
                        {liveCollected.needsVisaSponsorship ? "필요 (Yes)" : "불필요 / 취업 허가 보유 (No)"}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block mb-0.5">2. 희망 연봉/시급 (Expected Pay)</span>
                      <span className="font-bold text-emerald-700">{liveCollected.expectedSalary}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block mb-0.5">3. 출근 가능일 (Available Start Date)</span>
                      <span className="font-bold text-blue-700">{liveCollected.availableStartDate}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 block mb-0.5">
                        4. 근무 가능 지역/시프트 (Location & Shift)
                      </span>
                      <span className="font-bold text-slate-900">{liveCollected.preferredLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm">
                      {lang === "ko"
                        ? "최근 완료된 자동 프리 스크리닝 기록 (Kakao / SMS / WebChat)"
                        : "Completed Pre-Screening Logs"}
                    </h3>
                    <button
                      onClick={() =>
                        showNotification(
                          lang === "ko"
                            ? "📲 신규 지원자 3명에게 카카오톡 알림톡 및 SMS 프리 스크리닝 링크가 발송되었습니다!"
                            : "📲 Pre-screening SMS & Kakao links dispatched to 3 new applicants!"
                        )
                      }
                      className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold px-3 py-1.5 rounded-lg border border-emerald-200 transition"
                    >
                      + {lang === "ko" ? "신규 지원자 링크 일괄 발송" : "Dispatch Bulk SMS/Kakao Links"}
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {sessions.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setActiveSessionId(s.id)}
                        className={`p-3.5 rounded-xl border text-xs transition cursor-pointer ${
                          activeSessionId === s.id
                            ? "border-emerald-500 bg-emerald-50/30"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{s.candidateName}</span>
                            <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">
                              {s.channel} · {s.chatLang}
                            </span>
                          </div>
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> {s.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80">
                          <div>
                            <span className="text-slate-400 block">희망 급여</span>
                            <strong>{s.collectedData.expectedSalary}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block">출근 가능일</span>
                            <strong>{s.collectedData.availableStartDate}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block">근무 지역</span>
                            <strong>{s.collectedData.preferredLocation}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block">비자 스폰서</span>
                            <strong>{s.collectedData.needsVisaSponsorship ? "필요" : "불필요"}</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            MODULE 3: CALENDAR-SYNCED INTERVIEW SCHEDULING & NO-SHOW REMINDERS
           ===================================================================== */}
        {activeTab === 3 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white rounded-2xl p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {lang === "ko"
                    ? "프로세스 3단계 자동화: 면접 일정 핑퐁 제거 & 노쇼(No-show) 방지"
                    : "Stage 3 Automation: Zero Email Ping-Pong & Automated No-Show Prevention"}
                </div>
                <h2 className="text-xl font-bold">
                  {lang === "ko"
                    ? "③ 캘린더 연동 면접 스케줄링 및 리마인더 자동화 (Calendly + Zoom/Teams)"
                    : "③ Calendar-Synced Interview Scheduling & Automated SMS/Email Reminders"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 mt-1">
                  {lang === "ko"
                    ? "고객사 면접관의 가용 시간 슬롯을 후보자에게 발송하고, 후보자가 선택하는 즉시 Zoom/Teams 링크 생성 및 면접 전날(D-1) SMS/이메일 리마인더·길 안내·면접 팁을 자동 발송합니다."
                    : "Candidates pick from interviewer time slots to auto-generate Zoom/Teams links and trigger D-1 & H-2 SMS/Email reminders with interview tips."}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur px-5 py-3 rounded-xl border border-white/15 text-center shrink-0">
                <div className="text-xl font-extrabold text-indigo-300">-68%</div>
                <div className="text-xs text-slate-200">
                  {lang === "ko" ? "인터뷰 노쇼(No-show) 감소" : "Interview No-Show Reduction"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {interviews.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                >
                  <div className="space-y-2 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {item.id}
                      </span>
                      <h3 className="font-bold text-base text-slate-900">{item.candidateName}</h3>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-sm text-blue-700">{item.clientName}</span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                          item.status === "Slot Pending"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      <strong>포지션:</strong> {item.jobTitle} | <strong>고객사 면접관:</strong>{" "}
                      {item.interviewerName} | <strong>플랫폼:</strong> {item.meetingPlatform}
                    </p>

                    {/* Available Time Slots (Click to Simulate Candidate Slot Selection) */}
                    <div className="pt-1">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                        {lang === "ko"
                          ? "고객사 면접관 가용 슬롯 (클릭 시 후보자 시간 선택 → Zoom/Teams 자동 생성 시뮬레이션):"
                          : "Interviewer Available Slots (Click a slot to simulate candidate booking):"}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {item.availableSlots.map((slot) => {
                          const isChosen = item.selectedSlot === slot;
                          return (
                            <button
                              key={slot}
                              onClick={() =>
                                handleSelectInterviewSlot(item.id, slot, item.meetingPlatform)
                              }
                              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition flex items-center gap-1.5 ${
                                isChosen
                                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                  : "bg-slate-50 hover:bg-indigo-50 text-slate-700 border-slate-300"
                              }`}
                            >
                              <Clock className="w-3.5 h-3.5" />
                              {slot}
                              {isChosen && " ✓"}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Auto-Generated Video Link */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                      <span className="inline-flex items-center gap-1.5 text-slate-700 bg-slate-100 px-3 py-1 rounded-lg font-mono">
                        <Video className="w-3.5 h-3.5 text-blue-600" />
                        {item.meetingLink}
                      </span>
                      {item.candidateFormattedProfileReady && (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {lang === "ko"
                            ? "표준 이력서(Candidate Profile) 고객사 첨부 완료"
                            : "Standardized Profile Attached"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Action Column: D-1 / H-2 Reminder Automation */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 pt-3 lg:pt-0 lg:pl-5">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-500">D-1 (24시간 전) 리마인더 + 면접 팁:</span>
                        <span
                          className={`font-bold ${
                            item.reminder24hSent ? "text-emerald-600" : "text-amber-600"
                          }`}
                        >
                          {item.reminder24hSent ? "발송 완료 ✓" : "대기 중"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-500">H-2 (2시간 전) SMS 접속 링크 알림:</span>
                        <span
                          className={`font-bold ${
                            item.reminder2hSent ? "text-emerald-600" : "text-amber-600"
                          }`}
                        >
                          {item.reminder2hSent ? "발송 완료 ✓" : "대기 중"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSendInterviewReminder(item)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      {lang === "ko"
                        ? "SMS/이메일 리마인더 & 면접 가이드 즉시 발송"
                        : "Send SMS/Email Reminder & Interview Guide"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            MODULE 4: DIGITAL ONBOARDING & COMPLIANCE (DOCUSIGN + CHECKR)
           ===================================================================== */}
        {activeTab === 4 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {lang === "ko"
                    ? "프로세스 4단계 자동화: 채용 결정 & 미국 노동법 컴플라이언스 온보딩"
                    : "Stage 4 Automation: E-Signature Onboarding & Background Check Compliance"}
                </div>
                <h2 className="text-xl font-bold">
                  {lang === "ko"
                    ? "④ 디지털 온보딩 패키지(DocuSign) & 신원조회(Checkr API) 자동화"
                    : "④ Digital Onboarding (DocuSign) & Background Check (Checkr API) Pipeline"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {lang === "ko"
                    ? "합격 통보 즉시 Offer Letter, Form I-9(취업자격), W-4(세금), Direct Deposit, NDA를 원클릭 발송하고, 서류 누락자 자동 독촉 및 Checkr 백그라운드 체크 결과를 실시간 추적합니다."
                    : "Auto-sends Offer Letter, Form I-9, W-4, Direct Deposit & NDA via DocuSign and triggers Checkr background checks with real-time webhook alerts."}
                </p>
              </div>
            </div>

            {/* Trigger New Onboarding Package Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                {lang === "ko"
                  ? "합격자 온보딩 패키지 원클릭 발송 (DocuSign Envelope + Checkr API 동시 실행)"
                  : "Trigger New Hire Onboarding Package (DocuSign + Checkr API)"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <input
                  type="text"
                  value={newHireName}
                  onChange={(e) => setNewHireName(e.target.value)}
                  placeholder="합격자 성명"
                  className="rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  value={newHireEmail}
                  onChange={(e) => setNewHireEmail(e.target.value)}
                  placeholder="이메일"
                  className="rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  value={newHireClient}
                  onChange={(e) => setNewHireClient(e.target.value)}
                  placeholder="배치 고객사"
                  className="rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  value={newHireRole}
                  onChange={(e) => setNewHireRole(e.target.value)}
                  placeholder="포지션명"
                  className="rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
                <button
                  onClick={handleDispatchOnboardingPackage}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl px-4 py-2.5 shadow-sm transition flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {lang === "ko" ? "온보딩 패키지 자동 발송" : "Send Onboarding Package"}
                </button>
              </div>
            </div>

            {/* Onboarding Tracker Cards */}
            <div className="space-y-4">
              {onboardingList.map((pkt) => (
                <div
                  key={pkt.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-slate-900">{pkt.candidateName}</span>
                        <span className="text-xs px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                          {pkt.docusignEnvelopeId}
                        </span>
                        <span className="text-xs text-slate-500">
                          • {pkt.clientName} ({pkt.jobTitle})
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        입사 예정일(Start Date): <strong>{pkt.startDate}</strong> | 최근 리마인더:{" "}
                        {pkt.lastReminderSentAt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {pkt.overallProgress < 100 && (
                        <>
                          <button
                            onClick={() =>
                              showNotification(
                                lang === "ko"
                                  ? `🔔 [${pkt.candidateName}] 미작성 서류(I-9 / Direct Deposit) 자동 독촉 알림이 발송되었습니다.`
                                  : `🔔 Automated reminder sent to ${pkt.candidateName} for pending documents.`
                              )
                            }
                            className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-lg font-medium transition"
                          >
                            {lang === "ko" ? "미작성 서류 자동 독촉" : "Send Auto-Reminder"}
                          </button>
                          <button
                            onClick={() => handleSimulateSignAllAndClearCheckr(pkt.id)}
                            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-medium transition"
                          >
                            {lang === "ko"
                              ? "서명 완료 & Checkr 승인 시뮬레이션"
                              : "Simulate Full Sign & Checkr Clear"}
                          </button>
                        </>
                      )}
                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl ${
                          pkt.overallProgress === 100
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        진행률 {pkt.overallProgress}%
                      </span>
                    </div>
                  </div>

                  {/* 5 Compliance Documents + Checkr Status Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
                    {[
                      { label: "1. Offer Letter", val: pkt.documents.offerLetter },
                      { label: "2. Form I-9 (E-Verify)", val: pkt.documents.formI9 },
                      { label: "3. Form W-4 (Tax)", val: pkt.documents.formW4 },
                      { label: "4. Direct Deposit", val: pkt.documents.directDeposit },
                      { label: "5. Confidentiality NDA", val: pkt.documents.ndaAgreement },
                    ].map((doc, i) => {
                      const isDone =
                        doc.val === "Signed" || doc.val === "Verified" || doc.val === "Completed";
                      return (
                        <div
                          key={i}
                          className={`p-3 rounded-xl border ${
                            isDone
                              ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                              : "bg-amber-50/50 border-amber-200 text-amber-900"
                          }`}
                        >
                          <span className="text-[11px] text-slate-500 block">{doc.label}</span>
                          <span className="font-bold flex items-center gap-1 mt-1">
                            {isDone ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                            )}
                            {doc.val}
                          </span>
                        </div>
                      );
                    })}

                    {/* Checkr Background Check Card */}
                    <div
                      className={`p-3 rounded-xl border ${
                        pkt.backgroundCheck.status === "Clear"
                          ? "bg-blue-50/70 border-blue-200 text-blue-900"
                          : "bg-slate-100 border-slate-300 text-slate-800"
                      }`}
                    >
                      <span className="text-[11px] text-slate-500 block">
                        6. Checkr 신원조회 ({pkt.backgroundCheck.reportId})
                      </span>
                      <span className="font-bold flex items-center gap-1 mt-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        {pkt.backgroundCheck.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            MODULE 5: TIMESHEET-DRIVEN PAYROLL & AUTO-INVOICING (STAFFING CORE)
           ===================================================================== */}
        {activeTab === 5 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  {lang === "ko"
                    ? "프로세스 5단계 자동화 (Staffing 핵심): 파견 근무 타임시트 · 급여 · 인보이스"
                    : "Stage 5 Automation (Staffing Core): Timesheet → Payroll → QuickBooks Invoice"}
                </div>
                <h2 className="text-xl font-bold">
                  {lang === "ko"
                    ? "⑤ 타임시트 원클릭 승인 연동 페이롤 & 고객사 인보이스 자동 발행"
                    : "⑤ Timesheet-Synced Payroll Calculation & QuickBooks Auto-Invoicing"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {lang === "ko"
                    ? "현장 근무자의 출퇴근/초과근무(OT 1.5배) 기록을 클라이언트 담당자가 원클릭 승인하면, 급여/세금 공제 정산과 동시에 QuickBooks 고객사 청구 인보이스를 자동 생성·발송하여 수작업 엑셀 오지급 및 청구 누락을 원천 차단합니다."
                    : "Client 1-click timesheet approval automatically calculates regular + 1.5x FLSA overtime pay, tax withholding, and dispatches QuickBooks client invoices."}
                </p>
              </div>
              <button
                onClick={handleApproveAllPendingTimesheets}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs px-4 py-3 rounded-xl shadow-md transition shrink-0"
              >
                {lang === "ko"
                  ? "⚡ 미승인 타임시트 일괄 승인 & 인보이스 전체 발행"
                  : "⚡ Bulk Approve All & Generate Invoices"}
              </button>
            </div>

            {/* Timesheet & Invoicing Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                  {lang === "ko"
                    ? "주간 파견 근무자 타임시트 & 자동 정산/인보이스 현황 (Week Ending: 2026-10-25)"
                    : "Weekly Staffing Timesheets, Payroll & Client Billing Ledger"}
                </h3>
                <span className="text-xs text-slate-500">
                  * 미국 FLSA 기준 주 40시간 초과 근무(OT) 시 1.5배 할증 자동 적용
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px]">
                      <th className="py-3 px-4">파견 근무자 / 고객사</th>
                      <th className="py-3 px-3 text-center">정규 / OT 시간</th>
                      <th className="py-3 px-3 text-right">시급(Pay) / 청구단가(Bill)</th>
                      <th className="py-3 px-3 text-right">근무자 실수령액 (세후)</th>
                      <th className="py-3 px-3 text-right">고객사 청구 총액 (Invoice)</th>
                      <th className="py-3 px-3 text-center">클라이언트 승인</th>
                      <th className="py-3 px-4 text-right">QuickBooks 인보이스</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {timesheets.map((ts) => {
                      const grossPay = ts.regularHours * ts.payRate + ts.overtimeHours * (ts.payRate * 1.5);
                      const netPay = grossPay * (1 - ts.taxWithholdingRate);
                      const totalBill =
                        ts.regularHours * ts.billRate + ts.overtimeHours * (ts.billRate * 1.5);

                      return (
                        <tr key={ts.id} className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{ts.workerName}</div>
                            <div className="text-[11px] text-slate-500">
                              {ts.clientName} · {ts.department}
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span className="font-semibold text-slate-800">{ts.regularHours}h</span> 정규 +{" "}
                            <span className="font-bold text-blue-600">{ts.overtimeHours}h OT</span>
                            {ts.lateFlags > 0 && (
                              <span className="block text-[10px] text-amber-600 font-semibold">
                                ⚠️ 지각/근태 확인 1건 (검증 완료)
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono">
                            <div>Pay: ${ts.payRate.toFixed(2)}/hr</div>
                            <div className="text-slate-500">Bill: ${ts.billRate.toFixed(2)}/hr</div>
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono">
                            <div className="font-bold text-emerald-700">${netPay.toFixed(2)}</div>
                            <div className="text-[10px] text-slate-400">
                              세전 ${grossPay.toFixed(2)} (세금 {Math.round(ts.taxWithholdingRate * 100)}%)
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono">
                            <div className="font-extrabold text-slate-900 text-sm">
                              ${totalBill.toFixed(2)}
                            </div>
                            <div className="text-[10px] text-blue-600">
                              에이전시 마진: ${(totalBill - grossPay).toFixed(2)}
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            {ts.clientApproved ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5" /> 승인됨
                              </span>
                            ) : (
                              <button
                                onClick={() => handleOneClickApproveTimesheet(ts)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-lg shadow-sm transition text-[11px]"
                              >
                                {lang === "ko" ? "원클릭 승인 실행" : "1-Click Approve"}
                              </button>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {ts.invoiceId ? (
                              <button
                                onClick={() => setSelectedInvoicePreview(ts)}
                                className="text-blue-600 hover:underline font-mono font-bold text-xs"
                              >
                                {ts.invoiceId} 보기 →
                              </button>
                            ) : (
                              <span className="text-slate-400">승인 대기 중</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Auto-Generated QuickBooks Invoice Preview Card */}
            {selectedInvoicePreview && (
              <div className="bg-white rounded-2xl border-2 border-blue-600 p-6 shadow-lg space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      QUICKBOOKS ONLINE AUTO-GENERATED INVOICE
                    </span>
                    <h4 className="text-lg font-extrabold text-slate-900">
                      INVOICE #{selectedInvoicePreview.invoiceId} — {selectedInvoicePreview.clientName}
                    </h4>
                  </div>
                  <button
                    onClick={() => setSelectedInvoicePreview(null)}
                    className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1 rounded border border-slate-300"
                  >
                    닫기 (Close)
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block">Billed To (Client)</span>
                    <strong className="text-sm text-slate-900">{selectedInvoicePreview.clientName}</strong>
                    <span className="block text-slate-500 mt-0.5">
                      Dept: {selectedInvoicePreview.department} | Approved:{" "}
                      {selectedInvoicePreview.approvedBy}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block">Assigned Staffing Worker</span>
                    <strong className="text-sm text-slate-900">{selectedInvoicePreview.workerName}</strong>
                    <span className="block text-slate-500 mt-0.5">
                      Week Ending: {selectedInvoicePreview.weekEnding} (Reg:{" "}
                      {selectedInvoicePreview.regularHours}h / OT: {selectedInvoicePreview.overtimeHours}h)
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                    <span className="text-blue-600 font-semibold block">Total Invoice Amount Due</span>
                    <strong className="text-xl text-blue-900 font-mono">
                      $
                      {(
                        selectedInvoicePreview.regularHours * selectedInvoicePreview.billRate +
                        selectedInvoicePreview.overtimeHours * (selectedInvoicePreview.billRate * 1.5)
                      ).toFixed(2)}
                    </strong>
                    <span className="block text-blue-700 mt-0.5">
                      Status: Dispatched via QuickBooks API (Net 30)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* External API & Webhook Configuration Modal */}
      {showApiModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">
                  {lang === "ko"
                    ? "IN2U HR 외부 API 및 웹훅(Webhook) 연동 아키텍처"
                    : "External API & Webhook Integration Architecture"}
                </h3>
              </div>
              <button
                onClick={() => setShowApiModal(false)}
                className="text-xs px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold"
              >
                닫기
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              프로젝트 루트의 <code>.env.example</code> 파일을 <code>.env.local</code>로 복사하여 실제 API 키를 입력하면 즉시 프로덕션 API로 전환되며, 키가 없을 때는 내장된 AI/RPA 시뮬레이션 엔진으로 모든 기능이 100% 동작합니다.
            </p>

            <div className="bg-slate-900 text-slate-100 rounded-xl p-4 text-xs font-mono space-y-1.5 overflow-x-auto">
              <div className="text-emerald-400"># 1. Module 1 & 2: OpenAI GPT-4o-mini + Twilio SMS / Kakao AlimTalk</div>
              <div>POST /api/parse-resume → OpenAI Structured JSON Output (Visa, KO/EN/ES, JD Score)</div>
              <div>POST /api/prescreen-chat → Multilingual 24/7 Conversational Extraction</div>
              <div className="text-blue-400 pt-2"># 2. Module 3, 4 & 5: Calendly, DocuSign, Checkr & QuickBooks API</div>
              <div>POST /api/integrations (action: CONFIRM_INTERVIEW_SLOT | SEND_DOCUSIGN_PACKAGE | APPROVE_TIMESHEET_AND_INVOICE)</div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowApiModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
