import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IN2U HR | AI & RPA Staffing Automation Platform",
  description:
    "End-to-End Recruiting & Staffing Process Automation for IN2U HR: AI Resume Scoring, Multilingual Pre-screening Chatbot, Calendly Interview Sync, DocuSign/Checkr Onboarding, and Timesheet-to-QuickBooks Payroll & Invoicing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
