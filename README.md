# InvestAI - 智能投资推荐应用

<div align="center">

![InvestAI Logo](https://img.shields.io/badge/InvestAI-智能投资推荐-000000?style=for-the-badge)

基于 **Next.js 15 + React 19** 的全栈智能投资推荐系统

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📖 项目简介

**InvestAI** 是一个完整的全栈 Web 应用，通过 AI 大模型根据用户的投资画像（风险偏好、投资金额、期限、目标）智能推荐个性化的投资配置方案。

### 核心功能
- 🔐 **用户认证** - 注册/登录/JWT会话管理
- 👤 **用户中心** - 投资画像管理（风险偏好/金额/期限/目标）
- 📊 **项目库** - 投资项目CRUD管理 + 高级筛选
- 🤖 **智能推荐** - AI生成个性化投资配置方案
- 📜 **推荐记录** - 历史推荐查询 + 详情查看

---

## 🚀 快速开始

### 前置要求
- Node.js 18+ 
- npm 或 yarn 或 pnpm

### 安装步骤

```bash
# 1. 克隆项目
git clone <repository-url>
cd text4

# 2. 安装依赖
npm install

# 3. 配置环境变量（Postgres + OpenAI）
cp .env.example .env.local
# 使用 vercel env pull 或 Neon 仪表盘，填入 POSTGRES_* / DATABASE_URL
# (可选) 追加 OPENAI_API_KEY 用于调用大模型

# 4. 启动开发服务器
npm run dev

# 5. 打开浏览器访问
http://localhost:3000
```

### 环境变量配置
创建 `.env.local` 并填入：
```env
# Postgres (Neon / Vercel)
POSTGRES_URL=postgresql://<user>:<password>@<pooled-host>/<database>?sslmode=require
POSTGRES_URL_NON_POOLING=postgresql://<user>:<password>@<direct-host>/<database>?sslmode=require
POSTGRES_PRISMA_URL=postgresql://<user>:<password>@<pooled-host>/<database>?connect_timeout=15&sslmode=require
POSTGRES_USER=<user>
POSTGRES_PASSWORD=<password>
POSTGRES_DATABASE=<database>
POSTGRES_HOST=<pooled-host>
DATABASE_URL=${POSTGRES_URL}
DATABASE_URL_UNPOOLED=${POSTGRES_URL_NON_POOLING}

# OpenAI API（仅在生成推荐时需要）
OPENAI_API_KEY=sk-your-api-key
OPENAI_API_BASE=https://api.openai.com/v1

# JWT 密钥（可选，默认使用内置密钥）
JWT_SECRET=your-secret-key-here
```

---

## 🎯 功能详解

### 1️⃣ 用户中心 (/user)
- **用户注册/登录**
  - 用户名唯一性验证
  - 密码 bcrypt 加密（10轮salt）
  - JWT token 会话管理（7天有效期）
  - "记住我" 功能
  
- **投资画像管理**
  - 风险偏好：保守型 / 稳健型 / 激进型
  - 投资金额：自定义金额（元）
  - 投资期限：1年以内 / 1-3年 / 3-5年 / 5年以上
  - 投资目标：保本增值 / 稳健收益 / 高收益增长

### 2️⃣ 项目库 (/projects)
- **项目管理**
  - 新增/编辑/删除投资项目
  - 项目类型：债券/基金/股票/理财产品/其他
  - 风险等级：1-5星（彩色星级）
  - 预期收益率、投资门槛
  
- **高级筛选**
  - 按项目类型筛选
  - 按风险等级筛选
  - 按投资门槛筛选
  - 多条件组合 + 一键重置

### 3️⃣ 智能推荐 (/recommend)
- **AI驱动推荐**
  - 基于用户画像 + 项目库数据
  - 调用 OpenAI 兼容 API
  - 生成个性化投资配置方案
  
- **推荐结果展示**
  - 配置总览（综合收益率/风险等级/适配度）
  - 推荐理由（AI生成）
  - 项目配置列表（比例/收益/风险）
  
- **智能配置规则**
  - 保守型：低风险≥70%，无高风险
  - 稳健型：中低风险≥60%，中高风险≤10%
  - 激进型：高风险≥60%，低风险≤10%

### 4️⃣ 推荐记录 (/history)
- **历史记录查询**
  - 按时间段筛选（日期选择器）
  - 推荐记录表格（时间/收益率/风险/适配度）
  - 按推荐时间倒序排列
  
- **详情查看**
  - 配置总览（3个指标卡片）
  - 推荐理由（完整AI说明）
  - 项目配置列表（详细信息）

---

## 🏗️ 技术架构

### 技术栈
- **前端框架**：Next.js 15 (App Router)
- **UI库**：React 19
- **语言**：TypeScript 5
- **样式**：Tailwind CSS 4
- **认证**：JWT (jose) + bcrypt
- **验证**：Zod
- **AI集成**：OpenAI 兼容 API
- **数据存储**：Neon Postgres（通过 @vercel/postgres + SQL）

### 项目结构
```
text4/
├── app/                              # Next.js App Router 页面
│   ├── (auth)/                      # 认证路由组（无导航栏）
│   │   └── login/                   # 登录/注册页面
│   ├── (main)/                      # 主应用路由组（有导航栏）
│   │   ├── dashboard/               # 首页仪表盘
│   │   ├── user/                    # 用户中心
│   │   ├── projects/                # 项目库
│   │   ├── recommend/               # 智能推荐
│   │   └── history/                 # 推荐记录
│   └── api/                         # API 路由
│       ├── auth/                    # 认证 API
│       ├── profile/                 # 用户画像 API
│       ├── projects/                # 项目管理 API
│       ├── recommend/               # 智能推荐 API
│       └── history/                 # 推荐记录 API
│
├── src/
│   ├── components/                  # UI 组件
│   │   ├── Navbar.tsx              # 顶部导航栏
│   │   ├── ProjectModal.tsx        # 项目编辑模态框
│   │   └── ConfirmDialog.tsx       # 确认对话框
│   ├── context/
│   │   └── AuthContext.tsx         # 全局认证状态
│   └── lib/                         # 工具库
│       ├── kvdb.ts                 # Postgres 数据访问层（@vercel/postgres）
│       ├── auth.ts                 # JWT + bcrypt
│       ├── openai.ts               # LLM 调用
│       ├── redis.ts                # 可选 Redis 工具
│       └── validation.ts           # Zod Schema
│
├── data/                            # 可选：JSON 种子示例
│   ├── users.json
│   ├── profiles.json
│   ├── projects.json
│   └── recommendations.json
│
└── scripts/
    └── init-db.js                  # 旧的 JSON 初始化脚本（保留作参考）
```

### 路由架构（重要特性）
使用 **Next.js 路由组（Route Groups）** 实现优雅的布局分离：
- `(auth)/` - 登录页面独立布局（无导航栏）
- `(main)/` - 主应用共享布局（有导航栏）
- 括号内的名称不会出现在URL中

---

## 🎨 UI/UX 设计

### 设计原则
- **黑白色系**：zinc系列（950/900/800/700）
- **彩色强调**：仅用于数据显示（收益率绿色/风险彩色/适配度蓝色）
- **卡片式布局**：统一圆角 + 边框
- **响应式设计**：桌面端和移动端自适应
- **动画效果**：平滑过渡 + 悬停高亮

### 色彩方案
```css
背景：bg-zinc-950（页面）/ bg-zinc-900（卡片）
边框：border-zinc-800 / border-zinc-700（悬停）
文字：text-zinc-100（标题）/ text-zinc-400（正文）
强调：text-green-400（收益）/ text-blue-400（适配度）
风险：绿/蓝/黄/橙/红（1-5星）
```

---

## 📊 数据存储（Postgres + Neon）

所有业务数据都存储在 Neon Postgres，`src/lib/kvdb.ts` 会在首次读写时自动运行 `CREATE TABLE IF NOT EXISTS` 语句。

| 表名 | 说明 | 关键字段 |
|------|------|----------|
| `users` | 账号信息 | `username`（唯一）、`password`、`created_at` |
| `user_profiles` | 投资画像 | `user_id`（唯一外键）、风险/金额/期限/目标 |
| `projects` | 项目库 | `risk_level`、`expected_return`、`investment_threshold` |
| `recommendations` | 推荐历史 | `overall_expected_return`、`match_score`、`project_allocations` (JSONB) |

### 数据初始化/排查
- `.env.local` 中的 `POSTGRES_URL*` 变量由 Vercel / Neon 自动注入，运行 `vercel env pull` 可同步到本地。
- 首次启动 `npm run dev` 即会创建所需表结构；若需清空数据，可在 Neon 控制台执行：
  ```sql
  TRUNCATE TABLE recommendations, projects, user_profiles, users RESTART IDENTITY CASCADE;
  ```
- `data/*.json` 和 `scripts/init-db.js` 保留为示例，可用于快速导入演示数据。

---

## 🔌 API 文档

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 用户画像
- `GET /api/profile` - 获取用户画像（需认证）
- `POST /api/profile` - 保存/更新画像（需认证）

### 项目管理
- `GET /api/projects` - 获取项目列表
- `POST /api/projects` - 创建新项目
- `PUT /api/projects/[id]` - 更新项目
- `DELETE /api/projects/[id]` - 删除项目

### 智能推荐
- `POST /api/recommend` - 生成推荐方案（需认证）

### 推荐记录
- `GET /api/history` - 获取推荐记录（需认证）

---

## 🔐 安全特性

1. **密码安全**
   - bcrypt 加密（10轮salt）
   - 密码不返回前端

2. **认证安全**
   - JWT token（7天有效期）
   - Bearer Token 验证
   - 路由保护（未登录自动跳转）

3. **输入验证**
   - Zod Schema 前后端双重验证
   - XSS 防护（HTML转义）
   - CSRF 防护

---

## 🧪 测试指南

### 功能测试流程
1. **注册/登录**
   - 访问 `http://localhost:3000`
   - 注册新用户（用户名唯一性检查）
   - 登录成功后跳转首页

2. **完善投资画像**
   - 点击顶部导航"用户中心"
   - 编辑投资画像（风险偏好/金额/期限/目标）
   - 保存画像

3. **管理投资项目**
   - 点击"项目库"
   - 新增/编辑/删除项目
   - 使用筛选功能

4. **生成智能推荐**
   - 点击"智能推荐"
   - 点击"生成推荐"按钮
   - 查看推荐结果
   - 保存推荐方案

5. **查看推荐记录**
   - 点击"推荐记录"
   - 使用时间段筛选
   - 查看详情

---

## 📝 开发指南

### 本地开发
```bash
# 启动开发服务器（热重载）
npm run dev

# 代码检查
npm run lint

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 代码规范
- **SOLID 原则**：单一职责、开闭原则
- **KISS 原则**：代码简洁易懂
- **DRY 原则**：避免重复代码
- **TypeScript 严格模式**：类型安全

---

## 📚 文档索引

- **PROJECT_SETUP.md** - 完整项目配置文档
- **QUICK_START.md** - 快速启动指南
- **PHASE1_SUMMARY.md** - 用户中心模块总结
- **PHASE2_SUMMARY.md** - 项目库模块总结
- **PHASE3_PROGRESS.md** - 智能推荐模块进度
- **PHASE4_COMPLETE.md** - 推荐记录模块完成总结
- **PROJECT_FINAL_SUMMARY.md** - 项目最终总结

---

## 🚧 已知限制

1. **数据存储**：使用 JSON 文件，适合小型应用（<1000用户）
2. **AI推荐**：需要配置 OpenAI API Key（可选）
3. **并发**：JSON 文件读写无锁机制，高并发下可能冲突

---

## 🔮 未来计划

### 功能扩展
- [ ] 数据导出（Excel/PDF）
- [ ] 推荐记录删除
- [ ] 推荐方案对比
- [ ] 图表可视化（收益趋势）
- [ ] 移动端优化（PWA）

### 技术升级
- [ ] 数据库迁移（PostgreSQL/MySQL）
- [ ] ORM 集成（Prisma）
- [ ] 缓存优化（Redis）
- [ ] 监控告警（Sentry）

---

## 📄 License

MIT License

---

## 👥 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📧 联系方式

如有问题或建议，欢迎提交 Issue 或联系开发团队。

---

<div align="center">

**InvestAI** - 智能投资，从此开始 🚀

Made with ❤️ by InvestAI Team

</div>
