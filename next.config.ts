import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // 在生产构建时进行类型检查
    ignoreBuildErrors: false,
  },
  // API 路由超时配置（防止 Vercel KV 连接超时）
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // 优化图片加载
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
