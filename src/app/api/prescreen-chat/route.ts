import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, chatLang = "KO", step = 1, candidateName = "지원자", currentData = {} } = body;

    const apiKey = process.env.OPENAI_API_KEY;

    // Extract structured fields from user message
    const updatedData = { ...currentData };
    const lower = (message || "").toLowerCase();

    if (step === 1) {
      updatedData.needsVisaSponsorship =
        lower.includes("예") ||
        lower.includes("필요") ||
        lower.includes("yes") ||
        lower.includes("need") ||
        lower.includes("sí") ||
        lower.includes("necesito")
          ? !(
              lower.includes("불필요") ||
              lower.includes("없") ||
              lower.includes("아니") ||
              lower.includes("no ") ||
              lower.includes("citizen") ||
              lower.includes("영주권")
            )
          : false;
    } else if (step === 2) {
      updatedData.expectedSalary = message;
    } else if (step === 3) {
      updatedData.availableStartDate = message;
    } else if (step >= 4) {
      updatedData.preferredLocation = message;
    }

    // If real OPENAI_API_KEY is configured, let GPT generate the natural multilingual recruiter response
    if (apiKey && !apiKey.includes("your-openai-api-key")) {
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `You are IN2U HR's 24/7 Multilingual Pre-Screening AI Recruiter. Respond concisely in ${
                  chatLang === "KO" ? "Korean" : chatLang === "ES" ? "Spanish" : "English"
                }. Ask one question at a time: Step 1 -> Visa sponsorship, Step 2 -> Expected salary/hourly rate, Step 3 -> Available start date, Step 4 -> Location & shift confirmation, Step 5 -> Thank the candidate and confirm recruiter handoff.`,
              },
              {
                role: "user",
                content: `Current Step: ${step}. Candidate (${candidateName}) said: "${message}"`,
              },
            ],
            temperature: 0.3,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          return NextResponse.json({
            reply: data.choices[0].message.content,
            nextStep: step + 1,
            collectedData: updatedData,
            completed: step >= 4,
          });
        }
      } catch (e) {
        console.warn("OpenAI Prescreen fallback:", e);
      }
    }

    // Built-in Multilingual Conversational Flow (KO / EN / ES)
    const responses: Record<string, Record<number, string>> = {
      KO: {
        1: `네, 비자/취업 자격 확인되었습니다(${
          updatedData.needsVisaSponsorship ? "스폰서십 필요" : "스폰서십 불필요/즉시 근무 가능"
        }). 두 번째 질문입니다: 희망하시는 연봉(또는 시급) 수준은 어느 정도이신가요?`,
        2: `희망 급여(${message}) 기록 완료했습니다. 세 번째 질문입니다: 최종 합격 시 출근 가능일(Available Start Date)은 언제인가요?`,
        3: `출근 가능일(${message}) 확인했습니다! 마지막으로 희망 근무 지역 및 교대근무/오버타임 가능 여부를 알려주세요.`,
        4: `감사합니다 ${candidateName}님! 4가지 핵심 프리 스크리닝 항목이 ATS에 자동 등록되었으며, 담당 리크루터에게 알림이 발송되었습니다. 곧 면접 일정 조율 링크(Calendly)를 문자로 보내드리겠습니다!`,
      },
      EN: {
        1: `Got it! Work authorization recorded (${
          updatedData.needsVisaSponsorship ? "Sponsorship Needed" : "No Sponsorship Required"
        }). Question 2 of 4: What is your target annual salary or hourly rate?`,
        2: `Target compensation (${message}) saved. Question 3 of 4: What is your earliest available start date?`,
        3: `Start date (${message}) noted! Final question: Please confirm your preferred work location and shift/overtime availability.`,
        4: `Thank you, ${candidateName}! Your pre-screening profile has been automatically synced to IN2U HR ATS. A Calendly interview scheduling link will be sent via SMS shortly!`,
      },
      ES: {
        1: `¡Entendido! Estado de autorización registrado (${
          updatedData.needsVisaSponsorship ? "Requiere patrocinio" : "Autorizado sin patrocinio"
        }). Pregunta 2 de 4: ¿Cuál es tu expectativa salarial (por hora o anual)?`,
        2: `Expectativa salarial (${message}) guardada. Pregunta 3 de 4: ¿Cuál es tu fecha disponible para comenzar a trabajar?`,
        3: `¡Fecha registrada (${message})! Última pregunta: Confirma tu ubicación preferida y disponibilidad de turnos/horas extras.`,
        4: `¡Muchas gracias, ${candidateName}! Tus respuestas se han sincronizado automáticamente con el ATS de IN2U HR. ¡Recibirás un enlace de Calendly por SMS para agendar tu entrevista!`,
      },
    };

    const langPack = responses[chatLang] || responses.KO;
    const reply = langPack[Math.min(4, step)] || langPack[4];

    return NextResponse.json({
      reply,
      nextStep: step + 1,
      collectedData: updatedData,
      completed: step >= 4,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
