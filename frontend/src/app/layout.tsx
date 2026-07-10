import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "../components/LayoutWrapper";
import { ThemeProvider, NO_FLASH_SCRIPT } from "../components/ThemeProvider";
import { I18nProvider } from "../lib/i18n";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Monitor Pro",
  description: "AI Monitor Pro - 本地 AI Agent Token 用量、成本与技能监控仪表盘。支持 Claude Code、Codex、Cursor、Hermes 等多种 Agent，提供 Token 追踪、成本分析、实时遥测等功能，完全本地运行，数据不上传。 | Token telemetry & observability for AI coding agents",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script id="tt-theme-init" strategy="beforeInteractive">
          {NO_FLASH_SCRIPT}
        </Script>
      </head>
      <I18nProvider>
        <ThemeProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </I18nProvider>
    </html>
  );
}
