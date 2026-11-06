# IN2U HR 전체 대화 트랜스크립트 아카이브 (Auto-Synced)

> 마지막 자동 동기화 시각: 2026-11-06T01:47:41.928Z

---

### [1] 👤 User (2026-10-26T20:48:35Z)

1. IN2U HR의 핵심 업무 프로세스 구조스태핑/리크루팅 에이전시의 특성상 클라이언트(구인 기업)와 구직자(후보자) 사이에서 다음과 같은 다단계 프로세스로 운영됩니다.프로세스 단계주요 업무 내용현재의 일반적 수작업 병목1. 채용 의뢰 접수 & 소싱• 클라이언트 JD 접수 및 타겟 프로필 설정• Job Board(링크드인, 인디드, 자체 잡보드 등) 공고 게시 및 지원자 접수• 다중 채널 공고 등록 및 지원서 취합 수작업• 이력서 포맷 상이2. 스크리닝 & 1차 검증• 비자 상태(미국 영주권/취업비자 등), 어학 능력(한국어/영어/스페인어), 경력 요건 확인• 1차 전화/화상 프리 스크리닝 인터뷰 진행• 지원 자격 미달자 필터링에 많은 리크루터 공수 소요• 다국어 구사 여부 개별 검증3. 면접 조율 & 고객사 추천• 검증된 후보자 추천서(Candidate Profile/Resume) 재가공 및 송부• 고객사 면접 일정 조율, 리마인더 발송 및 피드백 수렴• 고객사-후보자 간 일정 조율 메일 핑퐁• 추천서 양식 통일 작업4. 채용 결정 & 온보딩• 오퍼레터 발급 및 계약 체결• I-9(취업 자격 확인), W-4, 배경조회(Background Check) 서류 접수• 계약서 서명 추적 및 신원조회 수기 확인• 온보딩 서류 누락 체크5. 파견 관리 & 페이롤 (Staffing)• 파견/임시직 근무자의 근무시간(Time-sheet) 집계• 주/월 단위 급여 계산, 세금 공제, 고객사 인보이스 발행• 현장 타임시트 승인 누락, 지각/초과근무 검증• 인보이스 대사 및 미수금 관리2. 프로세스 자동화(RPA / AI) 적용 아이디어① AI 기반 이력서 파싱 및 적합도 스코어링 (소싱 & 스크리닝 자동화)아이디어: 지원자가 제출한 영문/국문 이력서를 AI가 분석하여 (1) 비자 상태, (2) 다국어 구사 수준(한국어·영어·스페인어), (3) 핵심 기술
<truncated 695 bytes>
간 응대가 가능해집니다.③ 캘린더 연동 면접 스케줄링 및 리마인더 자동화아이디어: Calendly 또는 ATS(Applicant Tracking System) 스케줄러를 연동하여, 고객사 인터뷰어가 가능한 시간 슬롯을 후보자에게 전송하고 후보자가 선택하면 Zoom/Teams 링크 및 캘린더 초대가 자동 생성되도록 구성합니다.효과: 면접 전날 후보자에게 SMS/이메일 리마인더와 길 안내/면접 팁을 자동 발송하여 인터뷰 노쇼(No-show)율을 대폭 낮춥니다.④ 디지털 온보딩 & 규정 준수(Compliance) 자동화아이디어: 합격 통보 시 전자인쇄·서명 툴(DocuSign, PandaDoc 등)을 통해 온보딩 패키지(I-9, W-4, Direct Deposit, NDA 등)가 자동 발송되도록 파이프라인을 구축합니다.효과: 서류 서명 완료 여부를 실시간 추적하고 미작성자에게 자동 리마인드를 보내며, 백그라운드 체크 API(Checkr 등)와 연동해 결과 확인 시 담당자에게 즉시 알림을 전달합니다.⑤ 타임시트 연동 페이롤 및 인보이스 자동 발행 (Staffing 핵심)아이디어: 현장 근무자의 모바일/웹 출퇴근 기록을 클라이언트 담당자가 원클릭 승인하면, 급여 계산 시스템과 회계 툴(QuickBooks, Xero 등)로 데이터가 자동 전송되어 고객사 청구 인보이스를 자동 생성·발송합니다.효과: 엑셀로 일일이 타임시트를 합산하고 인보이스를 수작업 타이핑하는 과정을 없애 오지급 및 청구 누락 오류를 원천 차단합니다. 기반으로 자동화 기능을 각각 만들어줘

<ADDITIONAL_METADATA>
The current local time is: 2026-10-26T16:48:35-04:00.
</ADDITIONAL_METADATA>
<USER_SETTINGS_CHANGE>
The user changed setting `Model Selection` from None to Gemini 4 Argon (Medium). No need to comment on this change if the user doesn't ask about it. If reporting what model you are, please use a human readable name instead of the exact string.
</USER_SETTINGS_CHANGE>

---

### [2] 🤖 Assistant (2026-10-26T20:58:42Z)

**IN2U HR 5단계 핵심 업무 자동화(AI & RPA) 올인원 웹 플랫폼**을 구축하고 로컬 개발 서버(`http://localhost:3000`)를 실행했습니다.

---

### 🌐 바로 접속 및 실행 안내
- **로컬 실행 주소**: `http://localhost:3000` (현재 백그라운드에서 실행 중)
- **다국어 UI 지원**: 우측 상단 토글 버튼으로 **한국어 / ENG** UI를 실시간 전환할 수 있습니다.
- **외부 API 설정**: [`.env.example`](file:///c:/Users/zambi/OneDrive/Documents/In2hr.com/.env.example)에 정의된 환경변수(`OPENAI_API_KEY`, `TWILIO_*`, `CALENDLY_*`, `DOCUSIGN_*`, `CHECKR_*`, `QUICKBOOKS_*`)를 `.env.local`에 입력하면 실제 외부 API로 동작하며, 키가 없어도 내장된 AI/RPA 엔진으로 5가지 모듈 전체가 즉시 작동합니다.

---

### 🛠️ 5대 자동화 모듈 구현 상세 및 주요 파일

#### ① AI 기반 이력서 파싱 및 적합도 스코어링 (소싱 & 스크리닝 자동화)
- **관련 파일**: [`src/app/api/parse-resume/route.ts`](file:///c:/Users/zambi/OneDrive/Documents/In2hr.com/src/app/api/parse-resume/route.ts), [`AutomationDashboard`](file:///c:/Users/zambi/OneDrive/Documents/In2hr.com/src/components/AutomationDashboard.tsx#L326-L569)
- **핵심 기능**:
  - 타겟 고객사 JD(현대모비스 북미법인 HR, CJ대한통운 댈러스 물류 슈퍼바이저, SK배터리 아메리카 QA 엔지니어 등)를 선택하고 국/영문 자유 양식의 이력서를 입력하면 **(1) 미국 비자 상태**, **(2) 한국어·영어·스페인어 구사 수준**, **(3) 핵심 스킬 및 경력 연차**를 자동 추출합니다.
  - JD 필수 요건과 대조해 **0~100점 적합도 점수(비자 30점 + 어학 30점 + 역량/경력 40점)**를 매겨 우선순위(`Priority Shortlist` / `Review Needed` / `Auto-Filtered`) 순으로 자동 정렬합니다.
  - 후보자를 클릭하면 고객사 송부용 **표준 후보자 추천서(Standardized Candidate Profile)**가 자동 생성되며 원클릭 복사가 가능합니
<truncated 1247 bytes>
시간 슬롯을 클릭해 후보자 시간 선택을 시뮬레이션하면, 즉시 **Zoom / Microsoft Teams 미팅 링크가 자동 생성**되고 상태가 `Confirmed`로 동기화됩니다.
  - 면접 전날(D-1) 및 2시간 전(H-2) **SMS/이메일 리마인더 + 면접 팁 & 오시는 길 가이드**를 원클릭으로 발송하여 인터뷰 노쇼율을 낮춥니다.

#### ④ 디지털 온보딩(DocuSign) & 규정 준수(Checkr API) 자동화
- **관련 파일**: [`src/app/api/integrations/route.ts`](file:///c:/Users/zambi/OneDrive/Documents/In2hr.com/src/app/api/integrations/route.ts#L52-L66), [`AutomationDashboard`](file:///c:/Users/zambi/OneDrive/Documents/In2hr.com/src/components/AutomationDashboard.tsx#L933-L1089)
- **핵심 기능**:
  - 합격자 정보를 입력하고 발송 버튼을 누르면 **DocuSign 온보딩 패키지(`Offer Letter`, `Form I-9`, `Form W-4`, `Direct Deposit`, `NDA`)** 생성과 **Checkr 백그라운드 체크(`CHK-XXXXXX`)**가 동시에 실행됩니다.
  - 각 서류별 서명 상태 추적, 미서명자 자동 독촉 알림 발송, 전체 서명 및 신원조회 `Clear` 완료 웹훅 시뮬레이션을 지원합니다.

#### ⑤ 타임시트 연동 페이롤 & QuickBooks 인보이스 자동 발행 (Staffing 핵심)
- **관련 파일**: [`src/app/api/integrations/route.ts`](file:///c:/Users/zambi/OneDrive/Documents/In2hr.com/src/app/api/integrations/route.ts#L68-L96), [`AutomationDashboard`](file:///c:/Users/zambi/OneDrive/Documents/In2hr.com/src/components/AutomationDashboard.tsx#L1094-L1258)
- **핵심 기능**:
  - 현장 파견 근무자의 정규 근무시간 및 **미국 FLSA 기준 초과근무(40시간 초과 시 1.5배 할증)**, 지각/근태 플래그를 자동 집계합니다.
  - 클라이언트 담당자 **원클릭 승인(또는 일괄 승인)** 즉시 근무자 세전/세후 실수령액, 고객사 청구 금액, 에이전시 마진을 자동 계산하고 **QuickBooks 인보이스(`QBO-INV-2026-XXXX`)**를 생성하여 미리보기 카드로 출력합니다.

---

### [3] 👤 User (2026-11-06T01:45:28Z)

지금까지 대화한 내용 및 앞으로 대화한 내용을 doc 폴더를 만들어서 나의 github에 넣어줘 

<ADDITIONAL_METADATA>
The current local time is: 2026-11-05T20:45:28-05:00.
</ADDITIONAL_METADATA>

---

