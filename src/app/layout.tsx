import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { AuthProviderWrapper } from "@/components/auth-provider";
import "./globals.css";

const notoSans = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "고갈서버",
  description: "고갈서버 스타일",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSans.variable} font-sans min-h-screen`}>
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
      </body>
    </html>
  );
}
