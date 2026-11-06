# IN2U HR — AI & RPA 스태핑/리크루팅 자동화 플랫폼

미국 한인 및 다국어(한국어·영어·스페인어) 스태핑/리크루팅 에이전시 **IN2U HR**의 5단계 핵심 업무 병목을 해결하기 위한 **Next.js (React + TypeScript + Tailwind CSS)** 풀스택 자동화 플랫폼입니다.

## 🚀 빠른 실행 방법 (Quick Start)

```bash
# 1. 의존성 설치
npm.cmd install

# 2. 개발 서버 실행 (http://localhost:3000)
npm.cmd run dev
```

> `.env.example` 파일을 `.env.local`로 복사해 실제 OpenAI, Twilio/Kakao, Calendly, DocuSign, Checkr, QuickBooks API 키를 입력할 수 있으며, API 키가 없어도 내장된 AI/RPA 시뮬레이션 엔진으로 5가지 모듈 전체가 즉시 작동합니다.

---

## 🧩 5대 프로세스 자동화 구현 내역

1. **① AI 기반 이력서 파싱 및 적합도 스코어링 (`/api/parse-resume`)**
   - 국/영문 자유 형식 이력서에서 **(1) 미국 비자 상태**, **(2) 한국어/영어/스페인어 구사 수준**, **(3) 핵심 기술 및 경력 연차** 자동 추출
   - 타겟 JD 대비 **0~100점 적합도 점수(비자 30점 + 어학 30점 + 역량/경력 40점)** 산출 및 우선순위 자동 정렬
   - 고객사 송부용 **표준 후보자 추천서(Standardized Candidate Profile)** 원클릭 생성 및 복사
2. **② 다국어 프리 스크리닝 챗봇/음성 AI (`/api/prescreen-chat`)**
   - 지원 직후 카카오톡/SMS/웹챗을 통해 **한국어(KO) · 영어(EN) · 스페인어(ES)** 3개 국어로 2~3분 인터뷰 수행
   - 비자 스폰서십 필요 여부, 희망 연봉/시급, 출근 가능일, 선호 근무지/교대근무 여부를 대화형으로 자동 수집하여 ATS에 실시간 반영
3. **③ 캘린더 연동 면접 스케줄링 및 노쇼 방지 리마인더 (`/api/integrations`)**
   - 고객사 면접관 가용 시간 슬롯 선택 시 **Zoom / Teams 미팅 링크 및 캘린더 초대장 자동 생성**
   - 면접 전날(D-1) 및 당일(H-2) SMS/이메일 리마인더, 길 안내 및 면접 팁 자동 발송
4. **④ 디지털 온보딩 & 규정 준수 자동화 (`/api/integrations`)**
   - 합격 통보 시 **DocuSign 온보딩 패키지(Offer Letter, Form I-9, Form W-4, Direct Deposit, NDA)** 자동 발송 및 서명 상태 실시간 추적
   - 미작성자 원클릭 자동 독촉 알림 및 **Checkr API 신원조회(Background Check)** 결과 실시간 연동
5. **⑤ 타임시트 연동 페이롤 & QuickBooks 인보이스 자동 발행 (`/api/integrations`)**
   - 현장 근무자 주간 근무시간 및 **미국 FLSA 기준 초과근무(40시간 초과 시 1.5배 할증)** 자동 계산
   - 클라이언트 담당자 **원클릭 승인** 즉시 급여/세금 공제 계산 및 **QuickBooks 청구 인보이스(`QBO-INV-2026-XXXX`)** 자동 생성
