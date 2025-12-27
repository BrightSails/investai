# Vercel 部署指南

## 🚀 快速部署

### 1. 前置准备
- GitHub 账号
- Vercel 账号（可用 GitHub 登录）
- 项目代码已推送到 GitHub

### 2. 部署步骤

#### 方式一：通过 Vercel Dashboard（推荐）

1. **登录 Vercel**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New Project"
   - 选择你的 GitHub 仓库（text4）
   - 点击 "Import"

3. **配置项目**
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. **环境变量配置**（可选）
   点击 "Environment Variables" 添加：
   ```
   OPENAI_API_KEY=sk-your-api-key-here
   OPENAI_API_BASE=https://api.openai.com/v1
   JWT_SECRET=your-secret-key-here
   NODE_ENV=production
   ```

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成（约 2-3 分钟）
   - 获得部署链接

#### 方式二：通过 Vercel CLI

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署到预览环境
vercel

# 4. 部署到生产环境
vercel --prod
```

---

## 🔧 构建问题排查

### 问题 1: "npm run build exited with 1"

**原因**：ESLint 或 TypeScript 错误

**解决方案**：
1. 本地运行构建检查错误
   ```bash
   npm run build
   ```

2. 检查 ESLint 错误
   ```bash
   npm run lint
   ```

3. 已修复的问题：
   - ✅ useEffect 依赖数组警告（已添加 eslint-disable 注释）
   - ✅ 路由跳转路径统一
   - ✅ JSON 数据库初始化脚本更新

### 问题 2: "data 文件夹不存在"

**原因**：构建时数据文件夹未创建

**解决方案**：
- ✅ 已在 `package.json` 中添加 `postinstall` 脚本
- ✅ 构建前自动运行 `node scripts/init-db.js`
- ✅ 创建空的 JSON 文件

### 问题 3: "Module not found"

**原因**：依赖未正确安装

**解决方案**：
```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📦 构建优化配置

### 1. next.config.ts
```typescript
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: false, // 构建时检查 ESLint
  },
  typescript: {
    ignoreBuildErrors: false,  // 构建时检查 TypeScript
  },
};
```

### 2. vercel.json
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["hkg1"]
}
```

### 3. .vercelignore
```
node_modules
.next
.env.local
*.log
prisma/*.db
```

---

## 🔐 环境变量说明

### 必需环境变量
无（所有功能都有默认值）

### 可选环境变量

| 变量名 | 说明 | 默认值 | 用途 |
|--------|------|--------|------|
| `OPENAI_API_KEY` | OpenAI API 密钥 | 无 | 智能推荐功能 |
| `OPENAI_API_BASE` | OpenAI API 地址 | https://api.openai.com/v1 | 自定义 API 端点 |
| `JWT_SECRET` | JWT 密钥 | 内置默认密钥 | 用户认证 |
| `NODE_ENV` | 运行环境 | production | 环境标识 |

### 配置环境变量

**在 Vercel Dashboard：**
1. 进入项目设置
2. 点击 "Environment Variables"
3. 添加变量名和值
4. 选择环境（Production / Preview / Development）
5. 点击 "Save"

**通过 CLI：**
```bash
vercel env add OPENAI_API_KEY
# 输入值后选择环境
```

---

## 🌐 自定义域名

### 添加域名
1. 在 Vercel 项目设置中点击 "Domains"
2. 输入你的域名（如 `investai.example.com`）
3. 按照提示添加 DNS 记录
4. 等待 DNS 生效（通常几分钟到几小时）

### DNS 配置示例
```
类型: CNAME
名称: investai (或 @)
值: cname.vercel-dns.com
```

---

## 📊 性能监控

### Vercel Analytics
自动启用，可在 Dashboard 查看：
- 页面访问量
- 加载时间
- 地理分布
- 设备类型

### 构建日志
- 每次部署都会生成构建日志
- 可在 Vercel Dashboard 查看
- 包含错误信息和警告

---

## 🔄 持续部署（CI/CD）

### 自动部署
Vercel 会自动监听 GitHub 仓库变化：

1. **推送到 main 分支** → 自动部署到生产环境
2. **推送到其他分支** → 自动部署到预览环境
3. **提交 Pull Request** → 生成预览链接

### 部署触发规则
```
main 分支 → Production
其他分支 → Preview
Pull Request → Preview
```

---

## 🐛 常见错误处理

### 错误 1: "ENOENT: no such file or directory, open 'data/users.json'"

**解决方案**：
- ✅ 确保 `scripts/init-db.js` 正常运行
- ✅ 检查 `package.json` 中的 `postinstall` 脚本

### 错误 2: "Cannot find module '@/src/..'"

**解决方案**：
- ✅ 检查 `tsconfig.json` 中的 `paths` 配置
- ✅ 确保所有导入路径正确

### 错误 3: "ESLint: React Hook useEffect has missing dependencies"

**解决方案**：
- ✅ 已添加 `// eslint-disable-next-line react-hooks/exhaustive-deps`
- ✅ 或将函数添加到依赖数组

---

## 📝 部署前检查清单

- [ ] 本地构建成功：`npm run build`
- [ ] 代码已推送到 GitHub
- [ ] 环境变量已配置（如需 AI 推荐功能）
- [ ] `data` 文件夹包含 `.gitkeep`
- [ ] `.gitignore` 正确配置
- [ ] `vercel.json` 配置正确

---

## 🎉 部署成功后

### 1. 测试功能
- 访问部署链接
- 测试注册/登录
- 测试所有核心功能

### 2. 初始化数据
- 创建测试用户
- 添加测试项目
- 生成推荐方案

### 3. 监控
- 查看 Vercel Analytics
- 检查构建日志
- 关注错误报告

---

## 📚 相关资源

- [Vercel 官方文档](https://vercel.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [Vercel CLI 文档](https://vercel.com/docs/cli)

---

## 💡 优化建议

### 1. 数据库升级
对于生产环境，建议使用：
- **Vercel Postgres**：PostgreSQL 数据库
- **MongoDB Atlas**：NoSQL 数据库
- **Supabase**：开源后端服务

### 2. 缓存优化
```typescript
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [...],
  },
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=3600' }
      ],
    },
  ],
};
```

### 3. 边缘函数
将 API 路由部署到边缘节点：
```typescript
// app/api/route.ts
export const runtime = 'edge';
```

---

**部署完成后，你的 InvestAI 应用就可以在全球范围内访问了！🚀**
