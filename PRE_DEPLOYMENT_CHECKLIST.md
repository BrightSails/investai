# 📋 Vercel 部署前检查清单

## ✅ 本地构建测试

### 1. 清理环境
```bash
# Windows
rmdir /s /q node_modules .next
del package-lock.json

# Mac/Linux
rm -rf node_modules .next package-lock.json
```

### 2. 重新安装依赖
```bash
npm install
```

**检查点**：
- [ ] 没有安装错误
- [ ] 没有 `better-sqlite3` 或 `prisma` 相关警告

### 3. 初始化数据库
```bash
npm run db:init
```

**预期输出**：
```
✅ 创建 data 目录
✅ 创建 users.json
✅ 创建 profiles.json
✅ 创建 projects.json
✅ 创建 recommendations.json
✅ JSON 数据库初始化完成！
```

### 4. 运行构建
```bash
npm run build
```

**预期输出**：
```
▲ Next.js 16.1.0

✓ Creating an optimized production build
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (7/7)
✓ Collecting build traces
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    ...      ...
├ ○ /(auth)/login                        ...      ...
├ ○ /(main)/dashboard                    ...      ...
├ ○ /(main)/history                      ...      ...
├ ○ /(main)/projects                     ...      ...
├ ○ /(main)/recommend                    ...      ...
└ ○ /(main)/user                         ...      ...

○  (Static)  prerenerated as static content
```

**检查点**：
- [ ] 构建成功（没有错误）
- [ ] 没有 ESLint 错误
- [ ] 没有 TypeScript 类型错误
- [ ] 所有页面都已生成

---

## 📁 文件检查

### 必需文件
- [ ] `package.json` - 依赖配置正确
- [ ] `next.config.ts` - Next.js 配置
- [ ] `tsconfig.json` - TypeScript 配置
- [ ] `tailwind.config.ts` - Tailwind 配置
- [ ] `.gitignore` - Git 忽略配置
- [ ] `.vercelignore` - Vercel 忽略配置
- [ ] `vercel.json` - Vercel 部署配置
- [ ] `.env.example` - 环境变量示例

### 数据文件
- [ ] `data/.gitkeep` - 确保 data 目录被 Git 追踪
- [ ] `scripts/init-db.js` - 数据库初始化脚本（无 better-sqlite3 依赖）

### 源代码
- [ ] `app/` - 所有页面和 API 路由
- [ ] `src/components/` - UI 组件
- [ ] `src/context/` - 全局状态
- [ ] `src/lib/` - 工具函数

---

## 🔧 配置检查

### package.json
```json
{
  "scripts": {
    "build": "npm run db:init && next build",  // ✅ 构建前初始化
    "postinstall": "node scripts/init-db.js"   // ✅ 安装后初始化
  },
  "dependencies": {
    "bcryptjs": "^3.0.3",        // ✅
    "jose": "^6.1.3",            // ✅
    "next": "16.1.0",            // ✅
    "react": "19.2.3",           // ✅
    "react-dom": "19.2.3",       // ✅
    "zod": "^4.2.1"              // ✅
    // ❌ 不应包含: prisma, better-sqlite3, jsonwebtoken
  }
}
```

### next.config.ts
```typescript
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: false,  // ✅ 启用检查
  },
  typescript: {
    ignoreBuildErrors: false,   // ✅ 启用检查
  },
};
```

### .gitignore
```
data/*.json          // ✅ 忽略 JSON 数据文件
!data/.gitkeep       // ✅ 保留 .gitkeep
prisma/*.db          // ✅ 忽略数据库文件
```

---

## 🌐 Git 仓库检查

### 1. 检查 Git 状态
```bash
git status
```

**检查点**：
- [ ] 所有修改已暂存
- [ ] 没有未追踪的重要文件
- [ ] `data/.gitkeep` 已追踪
- [ ] `data/*.json` 已忽略

### 2. 提交代码
```bash
git add .
git commit -m "fix: Vercel 构建问题修复 - 移除不必要依赖，优化构建流程"
```

### 3. 推送到 GitHub
```bash
git push origin main
```

**检查点**：
- [ ] 推送成功
- [ ] GitHub 仓库已更新
- [ ] 所有文件都已上传

---

## 🔐 环境变量准备（可选）

### 如果需要 AI 推荐功能

准备以下环境变量：
```env
OPENAI_API_KEY=sk-xxx          # OpenAI API 密钥
OPENAI_API_BASE=https://...    # API 地址（可选）
JWT_SECRET=your-secret          # JWT 密钥（可选）
```

**注意**：
- 这些变量在 Vercel Dashboard 中配置
- 不要提交到 Git 仓库
- `.env.local` 已在 `.gitignore` 中

---

## 🚀 Vercel 部署准备

### 1. 账号准备
- [ ] 已有 Vercel 账号（或用 GitHub 登录）
- [ ] GitHub 仓库已关联

### 2. 项目信息
- **项目名称**: text4 (或自定义)
- **Framework**: Next.js
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 3. 环境变量（可选）
在 Vercel Dashboard 中添加：
- `OPENAI_API_KEY` (如需 AI 推荐)
- `OPENAI_API_BASE` (可选)
- `JWT_SECRET` (可选)

---

## ⚠️ 已知限制

### 1. 数据持久化
- ⚠️ JSON 文件在 Vercel 上是**临时的**
- ⚠️ 每次部署都会重置数据
- ✅ 适合演示和测试
- ❌ 不适合生产环境

**解决方案**：
- 使用 Vercel Postgres
- 使用 MongoDB Atlas
- 使用 Supabase

### 2. 文件写入
- ⚠️ Vercel 的文件系统是**只读的**（除了 /tmp）
- ⚠️ JSON 文件写入可能失败

**当前实现**：
- 项目库：可以正常 CRUD（内存中）
- 推荐记录：可以保存（但会丢失）
- 用户数据：可以注册/登录（但会丢失）

---

## 🧪 测试流程

### 本地测试
```bash
# 1. 构建
npm run build

# 2. 启动生产服务器
npm start

# 3. 访问
http://localhost:3000

# 4. 测试功能
- 注册新用户 ✅
- 登录 ✅
- 完善投资画像 ✅
- 添加项目 ✅
- 生成推荐（需要 API Key）✅
- 查看推荐记录 ✅
```

### Vercel 测试
部署成功后：
```bash
# 访问部署链接
https://your-app.vercel.app

# 测试所有功能
- 注册/登录
- 投资画像
- 项目管理
- 智能推荐（配置 API Key）
- 推荐记录
```

---

## 📊 构建日志分析

### 成功的构建日志
```
[00:00:05] Running "npm install"
[00:00:15] Installing dependencies...
[00:00:20] Running "npm run build"
[00:00:21] ✅ JSON 数据库初始化完成！
[00:00:25] ✓ Creating an optimized production build
[00:00:30] ✓ Compiled successfully
[00:00:35] ✓ Linting and checking validity of types
[00:00:40] ✓ Generating static pages
[00:00:45] Build Completed in /vercel/output
```

### 失败的构建日志（已修复）
```
❌ Error: Cannot find module 'better-sqlite3'
   → 已修复：移除依赖

❌ ESLint: React Hook useEffect has missing dependencies
   → 已修复：添加 eslint-disable 注释

❌ TypeError: Cannot read property 'xxx' of undefined
   → 已修复：类型检查和空值处理
```

---

## ✅ 最终检查

### 在部署前确认：
- [ ] 本地构建成功 (`npm run build`)
- [ ] 代码已推送到 GitHub
- [ ] 所有文件都已提交
- [ ] `package.json` 依赖正确（无 prisma/sqlite）
- [ ] 数据库初始化脚本正常工作
- [ ] `.vercelignore` 和 `vercel.json` 已创建
- [ ] 环境变量已准备（如需要）

### 部署步骤：
1. 登录 Vercel (https://vercel.com)
2. 点击 "Add New Project"
3. 选择你的 GitHub 仓库
4. 保持默认配置
5. 添加环境变量（可选）
6. 点击 "Deploy"
7. 等待 2-3 分钟
8. 获得部署链接 ✅

---

## 🎉 部署成功后

### 1. 功能测试
访问部署链接，测试所有功能

### 2. 配置域名（可选）
在 Vercel Dashboard 添加自定义域名

### 3. 监控
- 查看 Vercel Analytics
- 检查错误日志
- 监控性能指标

---

## 📚 相关文档

- `VERCEL_DEPLOYMENT.md` - 详细部署指南
- `VERCEL_BUILD_FIX.md` - 构建问题修复总结
- `README.md` - 项目介绍

---

**准备完成后，即可开始部署！🚀**

祝你部署顺利！如有问题，请查看构建日志。
