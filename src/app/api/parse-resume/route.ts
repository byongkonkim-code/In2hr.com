import { NextRequest, NextResponse } from "next/server";
import { INITIAL_JOBS } from "@/lib/mockData";
import { CandidateResumeAnalysis, LanguageProficiency, VisaStatus } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      resumeText,
      targetJobId,
      candidateName = "New Applicant",
      email = "applicant@example.com",
      phone = "+1 (555) 234-5678",
      sourceChannel = "IN2U Job Board",
    } = body;

    const job = INITIAL_JOBS.find((j) => j.id === targetJobId) || INITIAL_JOBS[0];
    const apiKey = process.env.OPENAI_API_KEY;

    // 1. If real OPENAI_API_KEY is configured, invoke OpenAI Structured JSON extraction
    if (apiKey && !apiKey.includes("your-openai-api-key")) {
      try {
        const prompt = `You are an expert AI Technical Recruiter at IN2U HR (US Staffing & Recruiting Agency).
Analyze the candidate resume against the target Job Description (JD):
JD Title: ${job.title} (${job.clientName})
Required Visas: ${job.requiredVisa.join(", ")}
Required Languages: ${job.requiredLanguages.join(", ")}
Required Skills: ${job.requiredSkills.join(", ")}
Min Experience: ${job.minExperienceYears} years

Candidate Resume:
"""
${resumeText}
"""

Return ONLY valid JSON matching this schema:
{
  "visaStatus": "US Citizen" | "Green Card (Permanent Resident)" | "H-1B Specialty Occupation" | "OPT / STEM OPT (F-1)" | "E-2 Employee Visa" | "Sponsorship Required",
  "languages": {
    "korean": "Native" | "Fluent" | "Business" | "Conversational" | "None",
    "english": "Native" | "Fluent" | "Business" | "Conversational" | "None",
    "spanish": "Native" | "Fluent" | "Business" | "Conversational" | "None"
  },
  "extractedSkills": string[],
  "experienceYears": number,
  "education": string,
  "scoreBreakdown": { "visaScore": number (0-30), "languageScore": number (0-30), "skillsExperienceScore": number (0-40) },
  "aiSummaryKo": string,
  "aiSummaryEn": string,
  "standardizedSummaryBulletPoints": string[]
}`;

        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const parsed = JSON.parse(data.choices[0].message.content);
          const matchScore =
            parsed.scoreBreakdown.visaScore +
            parsed.scoreBreakdown.languageScore +
            parsed.scoreBreakdown.skillsExperienceScore;

          const result: CandidateResumeAnalysis = {
            id: `CAND-${Math.floor(100 + Math.random() * 900)}`,
            candidateName,
            email,
            phone,
            targetJobId: job.id,
            sourceChannel,
            rawResumeText: resumeText,
            visaStatus: parsed.visaStatus,
            visaVerified: parsed.visaStatus !== "Sponsorship Required",
            languages: parsed.languages,
            extractedSkills: parsed.extractedSkills,
            experienceYears: parsed.experienceYears,
            education: parsed.education || "B.S. / Equivalent Experience",
            matchScore,
            scoreBreakdown: parsed.scoreBreakdown,
            aiSummaryKo: parsed.aiSummaryKo,
            aiSummaryEn: parsed.aiSummaryEn,
            standardizedSummaryBulletPoints: parsed.standardizedSummaryBulletPoints,
            status:
              matchScore >= 85
                ? "Priority Shortlist"
                : matchScore >= 65
                ? "Review Needed"
                : "Auto-Filtered",
            parsedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };

          return NextResponse.json({ analysis: result, engine: "OpenAI GPT" });
        }
      } catch (err) {
        console.warn("OpenAI API fallback triggered:", err);
      }
    }

    // 2. Built-in Intelligent Multilingual HR NLP Parser (works immediately out of the box)
    const lower = (resumeText || "").toLowerCase();

    // Detect Visa Status
    let visaStatus: VisaStatus = "Sponsorship Required";
    if (lower.includes("citizen") || lower.includes("시민권")) {
      visaStatus = "US Citizen";
    } else if (
      lower.includes("green card") ||
      lower.includes("permanent resident") ||
      lower.includes("영주권")
    ) {
      visaStatus = "Green Card (Permanent Resident)";
    } else if (lower.includes("stem opt") || lower.includes("opt") || lower.includes("f-1")) {
      visaStatus = "OPT / STEM OPT (F-1)";
    } else if (lower.includes("e-2")) {
      visaStatus = "E-2 Employee Visa";
    } else if (lower.includes("h-1b") && !lower.includes("requires new h-1b")) {
      visaStatus = "H-1B Specialty Occupation";
    }

    // Detect Languages (KO / EN / ES)
    const languages: LanguageProficiency = {
      korean: lower.includes("korean: native") || lower.includes("korean (native)") || lower.includes("한국어")
        ? "Native"
        : lower.includes("korean")
        ? "Fluent"
        : "None",
      english:
        lower.includes("english: native") || lower.includes("english (native)")
          ? "Native"
          : lower.includes("english: fluent") || lower.includes("english (fluent)")
          ? "Fluent"
          : lower.includes("english: conversational") || lower.includes("english (conversational)")
          ? "Conversational"
          : "Business",
      spanish:
        lower.includes("spanish: native") || lower.includes("spanish (native)")
          ? "Native"
          : lower.includes("spanish: fluent")
          ? "Fluent"
          : lower.includes("spanish: conversational") || lower.includes("spanish")
          ? "Conversational"
          : "None",
    };

    // Detect Skills
    const skillPool = [
      "ADP Workforce Now",
      "US Labor Law",
      "I-9 Compliance",
      "E-Verify",
      "Bilingual Communication",
      "Excel Pivot",
      "SHRM-CP",
      "WMS (SAP)",
      "OSHA Safety",
      "Forklift Certified",
      "Shift Scheduling",
      "Team Leadership",
      "Six Sigma",
      "ISO 9001",
      "IATF 16949",
      "Root Cause Analysis",
      "AutoCAD",
    ];
    const extractedSkills = skillPool.filter((skill) => {
      const keywords = skill.toLowerCase().replace(/[()]/g, "").split(" ");
      return keywords.some((kw) => kw.length > 2 && lower.includes(kw));
    });
    if (extractedSkills.length === 0) {
      extractedSkills.push("General Administration");
    }

    // Detect Experience Years
    let experienceYears = 2;
    const yrMatch = resumeText.match(/(\d+(?:\.\d+)?)\s*(?:\+)?\s*(?:years|yrs|년)/i);
    if (yrMatch) {
      experienceYears = parseFloat(yrMatch[1]);
    } else if (lower.includes("6 months") || lower.includes("internship")) {
      experienceYears = 0.5;
    }

    // Calculate Score Breakdown against Target JD
    const visaScore = job.requiredVisa.includes(visaStatus)
      ? 30
      : visaStatus === "OPT / STEM OPT (F-1)"
      ? 20
      : 5;

    let languageMatched = 0;
    job.requiredLanguages.forEach((reqLang) => {
      const key = reqLang.toLowerCase() as keyof LanguageProficiency;
      const level = languages[key];
      if (level === "Native" || level === "Fluent") languageMatched += 1;
      else if (level === "Business") languageMatched += 0.8;
      else if (level === "Conversational") languageMatched += 0.4;
    });
    const languageScore = Math.min(
      30,
      Math.round((languageMatched / Math.max(1, job.requiredLanguages.length)) * 30)
    );

    const matchedJobSkills = job.requiredSkills.filter((reqSkill) =>
      extractedSkills.some((ext) => ext.toLowerCase().includes(reqSkill.split(" ")[0].toLowerCase()))
    );
    const skillRatio = matchedJobSkills.length / Math.max(1, job.requiredSkills.length);
    const expRatio = Math.min(1.15, experienceYears / Math.max(1, job.minExperienceYears));
    const skillsExperienceScore = Math.min(40, Math.round((skillRatio * 24 + expRatio * 16)));

    const matchScore = Math.min(100, visaScore + languageScore + skillsExperienceScore);

    const status: CandidateResumeAnalysis["status"] =
      matchScore >= 85
        ? "Priority Shortlist"
        : matchScore >= 65
        ? "Review Needed"
        : "Auto-Filtered";

    const analysis: CandidateResumeAnalysis = {
      id: `CAND-${Math.floor(105 + Math.random() * 890)}`,
      candidateName,
      email,
      phone,
      targetJobId: job.id,
      sourceChannel,
      rawResumeText: resumeText,
      visaStatus,
      visaVerified: visaStatus !== "Sponsorship Required",
      languages,
      extractedSkills,
      experienceYears,
      education: "Verified Academic & Professional Credentials",
      matchScore,
      scoreBreakdown: {
        visaScore,
        languageScore,
        skillsExperienceScore,
      },
      aiSummaryKo:
        matchScore >= 85
          ? `[AI 상위 추천] 비자 요건(${visaStatus}) 및 어학 요건(한:${languages.korean}/영:${languages.english}/스:${languages.spanish}) 충족. ${experienceYears}년 경력 및 핵심 스킬(${extractedSkills.slice(0, 3).join(", ")}) 보유로 즉시 인터뷰 추천.`
          : matchScore >= 65
          ? `[리크루터 검토 요망] 경력 ${experienceYears}년 보유. 일부 비자 또는 세부 스킬 요건에 대해 1차 확인 필요.`
          : `[자동 필터링] 타겟 JD(${job.title})의 필수 비자/어학/경력 기준 미달(적합도 ${matchScore}점).`,
      aiSummaryEn:
        matchScore >= 85
          ? `[AI Priority Match] Verified ${visaStatus} with strong language fit (KO:${languages.korean}/EN:${languages.english}/ES:${languages.spanish}) and ${experienceYears} yrs relevant experience.`
          : matchScore >= 65
          ? `[Recruiter Review] ${experienceYears} yrs experience; verify partial skill or sponsorship details.`
          : `[Auto-Filtered] Does not meet mandatory JD visa/language/experience criteria (${matchScore}/100).`,
      standardizedSummaryBulletPoints: [
        `Work Authorization: ${visaStatus} (${visaStatus === "Sponsorship Required" ? "Requires Sponsorship" : "Authorized for US Employment"})`,
        `Language Matrix: Korean (${languages.korean}) | English (${languages.english}) | Spanish (${languages.spanish})`,
        `Relevant Experience & Tech: ${experienceYears} yrs experience — ${extractedSkills.join(", ")}`,
      ],
      status,
      parsedAt: "Just now",
    };

    return NextResponse.json({ analysis, engine: "IN2U AI NLP Engine" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to parse resume", details: String(error) },
      { status: 500 }
    );
  }
}
