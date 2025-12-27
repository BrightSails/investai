import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/src/context/AuthContext";

export const metadata: Metadata = {
  title: "InvestAI - 智能投资推荐",
  description: "基于用户画像的智能投资推荐系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className="antialiased bg-zinc-950 text-zinc-100 font-sans"
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
