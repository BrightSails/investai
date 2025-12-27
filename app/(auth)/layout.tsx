import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "登录 - InvestAI",
  description: "InvestAI 智能投资推荐系统 - 登录注册",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
