# 🏗️ InvestAI 系统架构图

## 📐 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                     InvestAI 智能投资推荐系统                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        前端层 (React)                        │
├─────────────────────────────────────────────────────────────┤
│  🖥️  页面 (Pages)                                            │
│  ├─ / (首页重定向)                                           │
│  ├─ /login (登录注册)           ✅ Phase 1                   │
│  ├─ /user (用户中心)             ✅ Phase 1                   │
│  ├─ /projects (项目库)          🔜 Phase 2                   │
│  ├─ /recommend (智能推荐)       🔜 Phase 3                   │
│  └─ /history (推荐记录)         🔜 Phase 4                   │
│                                                              │
│  🧩 组件 (Components)                                        │
│  ├─ Navbar.tsx (导航栏)         ✅ Phase 1                   │
│  └─ [Future Components]         🔜 待开发                    │
│                                                              │
│  🔄 状态管理 (Context)                                       │
│  └─ AuthContext (认证状态)      ✅ Phase 1                   │
└─────────────────────────────────────────────────────────────┘
                              ↕️
┌─────────────────────────────────────────────────────────────┐
│                      API层 (Next.js Routes)                  │
├─────────────────────────────────────────────────────────────┤
│  🔐 认证 API                                                 │
│  ├─ POST /api/auth/register     ✅ Phase 1                   │
│  ├─ POST /api/auth/login        ✅ Phase 1                   │
│  └─ [Refresh Token]             🔜 待优化                    │
│                                                              │
│  👤 用户画像 API                                             │
│  ├─ GET  /api/profile           ✅ Phase 1                   │
│  └─ POST /api/profile           ✅ Phase 1                   │
│                                                              │
│  📊 项目库 API                                               │
│  └─ [CRUD APIs]                 🔜 Phase 2                   │
│                                                              │
│  🤖 智能推荐 API                                             │
│  └─ [Recommendation APIs]       🔜 Phase 3                   │
│                                                              │
│  📜 推荐记录 API                                             │
│  └─ [History APIs]              🔜 Phase 4                   │
└─────────────────────────────────────────────────────────────┘
                              ↕️
┌─────────────────────────────────────────────────────────────┐
│                      业务逻辑层 (Lib)                        │
├─────────────────────────────────────────────────────────────┤
│  🔒 认证工具 (auth.ts)                                       │
│  ├─ hashPassword()              ✅ bcrypt加密               │
│  ├─ verifyPassword()            ✅ 密码验证                 │
│  ├─ generateToken()             ✅ JWT生成                  │
│  ├─ verifyToken()               ✅ JWT验证                  │
│  └─ getUserFromRequest()        ✅ 请求认证                 │
│                                                              │
│  ✅ 验证工具 (validation.ts)                                │
│  ├─ registerSchema              ✅ 注册验证                 │
│  ├─ loginSchema                 ✅ 登录验证                 │
│  └─ profileSchema               ✅ 画像验证                 │
│                                                              │
│  🗄️  数据库客户端 (prisma.ts)                               │
│  └─ PrismaClient                ✅ 单例模式                 │
└─────────────────────────────────────────────────────────────┘
                              ↕️
┌─────────────────────────────────────────────────────────────┐
│                   数据持久层 (SQLite + Prisma)               │
├─────────────────────────────────────────────────────────────┤
│  📋 Users 表                                                 │
│  ├─ id (PK)                                                  │
│  ├─ username (UNIQUE)                                        │
│  ├─ password (bcrypt)                                        │
│  ├─ createdAt                                                │
│  └─ updatedAt                                                │
│                                                              │
│  📋 UserProfiles 表                                          │
│  ├─ id (PK)                                                  │
│  ├─ userId (FK → Users)                                      │
│  ├─ riskPreference                                           │
│  ├─ investmentAmount                                         │
│  ├─ investmentPeriod                                         │
│  ├─ investmentGoal                                           │
│  └─ updatedAt                                                │
│                                                              │
│  📋 [Future Tables]             🔜 Phase 2-4                 │
│  ├─ Projects (项目库)                                        │
│  ├─ Recommendations (推荐)                                   │
│  └─ RecommendHistory (记录)                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 数据流图

### 1. 用户注册流程
```
用户输入
  ↓
前端验证 (Zod)
  ↓
POST /api/auth/register
  ↓
后端验证 (Zod)
  ↓
检查用户名唯一性 (Prisma)
  ↓
密码加密 (bcrypt)
  ↓
写入数据库 (SQLite)
  ↓
生成JWT Token (jose)
  ↓
返回 user + token
  ↓
存入 localStorage
  ↓
跳转到用户中心
```

### 2. 用户登录流程
```
用户输入
  ↓
前端验证 (Zod)
  ↓
POST /api/auth/login
  ↓
后端验证 (Zod)
  ↓
查询用户 (Prisma)
  ↓
密码验证 (bcrypt)
  ↓
生成JWT Token (jose)
  ↓
返回 user + profile + token
  ↓
存入 localStorage
  ↓
跳转到用户中心
```

### 3. 保存投资画像流程
```
用户编辑表单
  ↓
点击"保存信息"
  ↓
前端验证 (Zod)
  ↓
POST /api/profile (带Token)
  ↓
验证Token (jose)
  ↓
后端验证 (Zod)
  ↓
Upsert操作 (Prisma)
  ↓
返回 profile
  ↓
更新 AuthContext
  ↓
刷新UI显示
```

### 4. 路由保护流程
```
访问受保护页面
  ↓
读取 localStorage
  ↓
Token存在？
  ├─ 否 → 跳转 /login
  └─ 是 → 验证Token
         ├─ 失效 → 跳转 /login
         └─ 有效 → 渲染页面
```

---

## 🧱 文件组织结构

```
text4/
│
├── 📁 app/                          # Next.js App Router
│   ├── 📁 api/                      # API路由层
│   │   ├── 📁 auth/
│   │   │   ├── 📁 login/
│   │   │   │   └── route.ts        ✅ 登录API
│   │   │   └── 📁 register/
│   │   │       └── route.ts        ✅ 注册API
│   │   └── 📁 profile/
│   │       └── route.ts            ✅ 画像API
│   │
│   ├── 📁 login/
│   │   └── page.tsx                ✅ 登录页
│   ├── 📁 user/
│   │   └── page.tsx                ✅ 用户中心
│   ├── 📁 projects/
│   │   └── page.tsx                🔜 项目库
│   ├── 📁 recommend/
│   │   └── page.tsx                🔜 智能推荐
│   ├── 📁 history/
│   │   └── page.tsx                🔜 推荐记录
│   │
│   ├── layout.tsx                  ✅ 根布局
│   ├── page.tsx                    ✅ 首页重定向
│   └── globals.css                 ✅ 全局样式
│
├── 📁 src/
│   ├── 📁 components/               # 可复用组件
│   │   └── Navbar.tsx              ✅ 导航栏
│   │
│   ├── 📁 context/                  # React Context
│   │   └── AuthContext.tsx         ✅ 认证状态
│   │
│   └── 📁 lib/                      # 工具库
│       ├── auth.ts                 ✅ JWT+bcrypt
│       ├── prisma.ts               ✅ DB客户端
│       └── validation.ts           ✅ Zod验证
│
├── 📁 prisma/
│   ├── schema.prisma               ✅ 数据库Schema
│   └── dev.db                      ✅ SQLite数据库
│
├── 📁 scripts/
│   └── init-db.js                  ✅ 数据库初始化
│
├── 📁 .codebuddy/
│   └── 📁 rules/
│       └── ProjectRequirements.mdc ✅ 项目规范
│
├── .env                             ✅ 环境变量
├── package.json                     ✅ 依赖配置
├── tsconfig.json                    ✅ TS配置
├── tailwind.config.ts               ✅ Tailwind配置
│
├── PROJECT_SETUP.md                 ✅ 完整文档
├── QUICK_START.md                   ✅ 快速启动
├── PHASE1_SUMMARY.md                ✅ Phase1总结
└── ARCHITECTURE.md                  ✅ 本架构文档
```

---

## 🔐 安全架构

```
┌─────────────────────────────────────────────────────────────┐
│                        安全防护层                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  🛡️  前端防护                                                │
│  ├─ XSS防护: React自动转义                                  │
│  ├─ 输入验证: Zod schema                                    │
│  └─ HTTPS: 生产环境强制                                     │
│                                                              │
│  🔒 认证层                                                   │
│  ├─ JWT Token: 7天过期                                      │
│  ├─ Bearer认证: 无Cookie依赖                                │
│  └─ Token验证: 每次API请求                                  │
│                                                              │
│  🔑 密码安全                                                 │
│  ├─ bcrypt加密: 10轮salt                                    │
│  ├─ 单向加密: 不可逆                                        │
│  └─ 密码不返回: API响应过滤                                 │
│                                                              │
│  🚫 CSRF防护                                                 │
│  ├─ 无Cookie认证: Bearer Token                             │
│  ├─ 同源策略: CORS配置                                      │
│  └─ Token隔离: localStorage                                 │
│                                                              │
│  ✅ 数据验证                                                 │
│  ├─ 前端验证: 立即反馈                                      │
│  ├─ 后端验证: 二次校验                                      │
│  └─ 类型安全: TypeScript                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 UI组件树

```
App Layout
│
├─ Navbar (导航栏)
│  ├─ Logo
│  ├─ 用户中心链接
│  ├─ 项目库链接
│  ├─ 智能推荐链接
│  ├─ 推荐记录链接
│  └─ 退出按钮
│
└─ Page Content
   │
   ├─ /login (登录页)
   │  ├─ Logo展示
   │  ├─ 切换按钮 (登录/注册)
   │  ├─ 表单
   │  │  ├─ 用户名输入
   │  │  ├─ 密码输入
   │  │  ├─ 错误提示
   │  │  └─ 提交按钮
   │  └─ 切换提示
   │
   ├─ /user (用户中心)
   │  ├─ 页面标题
   │  ├─ 左侧：个人信息卡片
   │  │  ├─ 用户名
   │  │  ├─ 风险偏好 (彩色标签)
   │  │  ├─ 投资金额
   │  │  ├─ 投资期限
   │  │  ├─ 投资目标
   │  │  └─ 编辑按钮
   │  └─ 右侧：投资画像编辑器
   │     ├─ 风险偏好选择 (3个按钮)
   │     ├─ 投资金额输入
   │     ├─ 投资期限下拉
   │     ├─ 投资目标下拉
   │     ├─ 成功/错误提示
   │     └─ 保存/取消按钮
   │
   ├─ /projects (项目库)
   │  └─ Coming Soon占位
   │
   ├─ /recommend (智能推荐)
   │  └─ Coming Soon占位
   │
   └─ /history (推荐记录)
      └─ Coming Soon占位
```

---

## 📊 状态管理架构

```
┌─────────────────────────────────────────────────────────────┐
│                      AuthContext (全局状态)                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  State:                                                      │
│  ├─ user: User | null                                        │
│  ├─ token: string | null                                     │
│  └─ isLoading: boolean                                       │
│                                                              │
│  Actions:                                                    │
│  ├─ login(user, token)      → 登录                          │
│  ├─ logout()                → 退出                          │
│  └─ updateUser(user)        → 更新用户信息                  │
│                                                              │
│  Persistence:                                                │
│  ├─ localStorage.token      → 持久化Token                   │
│  └─ localStorage.user       → 持久化用户信息                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              ↕️
┌─────────────────────────────────────────────────────────────┐
│                      组件消费状态                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Navbar:                                                     │
│  └─ 使用 token 判断是否显示导航链接                          │
│                                                              │
│  UserPage:                                                   │
│  ├─ 使用 user 展示个人信息                                   │
│  ├─ 使用 token 调用API                                       │
│  └─ 使用 updateUser 更新画像                                 │
│                                                              │
│  Protected Pages:                                            │
│  └─ 使用 token 进行路由保护                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 部署架构（未来）

```
┌─────────────────────────────────────────────────────────────┐
│                       生产环境架构                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  用户浏览器                                                  │
│       ↓                                                      │
│  CDN (静态资源)                                              │
│       ↓                                                      │
│  负载均衡器                                                  │
│       ↓                                                      │
│  Next.js服务器 (Vercel/自托管)                               │
│       ↓                                                      │
│  SQLite → PostgreSQL (生产建议)                              │
│                                                              │
│  配置:                                                       │
│  ├─ HTTPS证书                                                │
│  ├─ 环境变量 (.env.production)                              │
│  ├─ JWT强密钥                                                │
│  ├─ CORS白名单                                               │
│  └─ 数据库备份                                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📈 性能优化点

1. **代码分割**: Next.js自动按路由分割
2. **静态生成**: 登录页可SSG
3. **客户端缓存**: localStorage减少API调用
4. **数据库索引**: username唯一索引
5. **JWT无状态**: 减少数据库查询
6. **Prisma连接池**: 复用数据库连接
7. **图片优化**: Next.js Image组件
8. **CSS优化**: Tailwind JIT模式

---

## 🔮 扩展性设计

### 水平扩展
- Next.js支持多实例部署
- SQLite → PostgreSQL迁移
- 添加Redis缓存层

### 功能扩展
- 第三方登录（OAuth）
- 实时通知（WebSocket）
- 文件上传（云存储）
- 数据分析（图表库）

### 微服务拆分（可选）
```
API Gateway
    ├─ 用户服务
    ├─ 项目服务
    ├─ 推荐服务
    └─ 记录服务
```

---

**本架构文档详细描述了InvestAI系统的整体设计思路和技术实现！** 📚
