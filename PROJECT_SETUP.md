# InvestAI - 智能投资推荐系统

## 📋 项目概述

这是一个基于 T3 全栈技术的智能投资推荐应用，系统根据用户画像推荐适配的投资配置方案。

### 核心功能模块
1. **用户中心** (`/user`) - ✅ 已完成
   - 用户注册/登录（JWT认证）
   - 投资画像管理（风险偏好、金额、期限、目标）
   - 个人信息展示

2. **项目库** (`/projects`) - 🔜 待开发
3. **智能推荐** (`/recommend`) - 🔜 待开发
4. **推荐记录** (`/history`) - 🔜 待开发

---

## 🛠️ 技术栈

- **前端**: React 19 + Next.js 16 (App Router)
- **后端**: Next.js API Routes
- **数据库**: SQLite + Prisma ORM
- **认证**: JWT (jose) + bcrypt密码加密
- **样式**: Tailwind CSS（黑白色系设计）
- **验证**: Zod
- **语言**: TypeScript

---

## 📁 项目结构

\`\`\`
text4/
├── app/                      # Next.js App Router
│   ├── api/                  # API路由
│   │   ├── auth/            # 认证相关API
│   │   │   ├── login/       # 登录
│   │   │   └── register/    # 注册
│   │   └── profile/         # 用户画像API
│   ├── login/               # 登录页面
│   ├── user/                # 用户中心页面
│   ├── projects/            # 项目库页面
│   ├── recommend/           # 智能推荐页面
│   ├── history/             # 推荐记录页面
│   ├── layout.tsx           # 全局布局
│   └── page.tsx             # 首页（重定向）
│
├── src/
│   ├── components/          # React组件
│   │   └── Navbar.tsx       # 顶部导航栏
│   ├── context/             # React Context
│   │   └── AuthContext.tsx  # 认证上下文
│   └── lib/                 # 工具库
│       ├── prisma.ts        # Prisma客户端
│       ├── auth.ts          # 认证工具（JWT、bcrypt）
│       └── validation.ts    # Zod验证Schema
│
├── prisma/
│   ├── schema.prisma        # 数据库Schema定义
│   └── dev.db              # SQLite数据库文件
│
├── scripts/
│   └── init-db.js          # 数据库初始化脚本
│
└── .codebuddy/
    └── rules/
        └── ProjectRequirements.mdc  # 项目规范文档
\`\`\`

---

## 🚀 快速开始

### 1. 安装依赖

\`\`\`bash
npm install
\`\`\`

### 2. 安装 better-sqlite3（用于数据库初始化）

\`\`\`bash
npm install better-sqlite3 --save
\`\`\`

### 3. 初始化数据库

\`\`\`bash
npm run db:init
\`\`\`

### 4. 生成 Prisma Client

\`\`\`bash
npm run db:generate
\`\`\`

### 5. 启动开发服务器

\`\`\`bash
npm run dev
\`\`\`

访问 http://localhost:3000，系统会自动重定向到登录页。

---

## 🗄️ 数据库设计

### Users 表（用户表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| username | TEXT | 用户名（唯一） |
| password | TEXT | 密码（bcrypt加密） |
| createdAt | DATETIME | 创建时间 |
| updatedAt | DATETIME | 更新时间 |

### UserProfiles 表（用户画像表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| userId | INTEGER | 外键 -> users.id |
| riskPreference | TEXT | 风险偏好（保守/稳健/激进） |
| investmentAmount | REAL | 投资金额 |
| investmentPeriod | TEXT | 投资期限（1年以内/1-3年/3-5年/5年以上） |
| investmentGoal | TEXT | 投资目标（保本增值/稳健收益/高收益增长） |
| updatedAt | DATETIME | 更新时间 |

---

## 🔐 安全特性

1. **密码加密**: 使用 bcrypt 进行密码哈希（10轮salt）
2. **JWT认证**: 使用 jose 库生成和验证JWT token（7天有效期）
3. **XSS防护**: React自动转义输出
4. **CSRF防护**: 使用Bearer token认证（非Cookie）
5. **输入验证**: Zod schema验证所有用户输入

---

## 🎨 UI设计规范

### 色彩方案（黑白主色调）
- **背景**: zinc-950（深黑）、zinc-900（中黑）、zinc-800（浅黑）
- **文字**: zinc-100（亮白）、zinc-400（灰白）
- **强调**: zinc-100（白色按钮）、zinc-950（按钮文字）

### 布局原则
- 响应式设计（桌面端/移动端自适应）
- 卡片式布局（圆角2xl、边框zinc-800）
- 均等分布（Grid/Flex布局）
- 平滑过渡动画

---

## 📝 API接口文档

### 1. 用户注册
- **接口**: `POST /api/auth/register`
- **请求体**:
  \`\`\`json
  {
    "username": "testuser",
    "password": "123456"
  }
  \`\`\`
- **响应**:
  \`\`\`json
  {
    "success": true,
    "user": { "id": 1, "username": "testuser" },
    "token": "eyJhbGc..."
  }
  \`\`\`

### 2. 用户登录
- **接口**: `POST /api/auth/login`
- **请求体**: 同注册
- **响应**: 同注册（包含用户画像）

### 3. 保存用户画像
- **接口**: `POST /api/profile`
- **请求头**: `Authorization: Bearer <token>`
- **请求体**:
  \`\`\`json
  {
    "riskPreference": "稳健",
    "investmentAmount": 50000,
    "investmentPeriod": "1-3年",
    "investmentGoal": "稳健收益"
  }
  \`\`\`

### 4. 获取用户画像
- **接口**: `GET /api/profile`
- **请求头**: `Authorization: Bearer <token>`

---

## 🔧 开发指南

### 添加新页面
1. 在 `app/` 目录下创建新文件夹
2. 添加 `page.tsx`
3. 在 `Navbar.tsx` 中添加导航链接
4. 实现页面UI（遵循黑白色系设计）

### 添加新API
1. 在 `app/api/` 下创建路由文件夹
2. 创建 `route.ts` 实现API逻辑
3. 在 `src/lib/validation.ts` 中添加验证Schema
4. 使用 `getUserFromRequest()` 进行认证

### 数据库更新
1. 修改 `prisma/schema.prisma`
2. 运行 `npm run db:generate`
3. 手动更新 `scripts/init-db.js` 中的表结构

---

## ✅ 当前完成进度

- [x] 项目初始化
- [x] 数据库设计（SQLite + Prisma）
- [x] 认证系统（注册/登录/JWT）
- [x] 全局布局和导航栏
- [x] 用户中心页面
  - [x] 登录/注册表单
  - [x] 投资画像编辑器
  - [x] 个人信息展示卡片
- [x] 占位页面（项目库、智能推荐、推荐记录）
- [ ] 项目库功能
- [ ] 智能推荐功能
- [ ] 推荐记录功能

---

## 📌 注意事项

1. **环境变量**: `.env` 文件包含JWT密钥，生产环境需更换
2. **数据库位置**: `prisma/dev.db`，需添加到 `.gitignore`
3. **Token存储**: 使用 `localStorage`，刷新页面保持登录状态
4. **认证保护**: 所有页面（除登录页）需验证token

---

## 🎯 下一步开发计划

1. **项目库模块**: 投资项目的CRUD管理
2. **智能推荐模块**: 基于用户画像的AI推荐算法
3. **推荐记录模块**: 历史推荐记录查看和管理
4. **数据可视化**: 投资组合图表展示

---

## 🤝 贡献指南

遵循以下开发原则：
- **SOLID**: 单一职责、开闭原则、里氏替换、接口隔离、依赖倒置
- **KISS**: Keep It Simple, Stupid
- **DRY**: Don't Repeat Yourself
- **YAGNI**: You Aren't Gonna Need It

---

## 📄 License

MIT License - 仅用于教育和学习目的
