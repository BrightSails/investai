# 🚀 快速启动指南

## 第一次运行项目

### 步骤 1: 安装 better-sqlite3
\`\`\`bash
npm install better-sqlite3 --save
\`\`\`

### 步骤 2: 初始化数据库
\`\`\`bash
npm run db:init
\`\`\`

### 步骤 3: 生成 Prisma Client
\`\`\`bash
npm run db:generate
\`\`\`

### 步骤 4: 启动开发服务器
\`\`\`bash
npm run dev
\`\`\`

### 步骤 5: 访问应用
打开浏览器访问: http://localhost:3000

---

## 使用流程

1. **首次访问** → 自动跳转到登录页 `/login`
2. **点击"立即注册"** → 注册新账号
   - 用户名：3-20个字符，仅限字母数字下划线
   - 密码：至少6个字符
3. **注册成功** → 自动登录并跳转到用户中心 `/user`
4. **编辑投资画像** → 点击"编辑投资画像"按钮
   - 选择风险偏好（保守/稳健/激进）
   - 输入投资金额
   - 选择投资期限
   - 选择投资目标
5. **保存信息** → 点击"保存信息"
6. **查看效果** → 左侧卡片实时更新

---

## 常见问题

### Q: 数据库文件在哪里？
A: `prisma/dev.db`

### Q: 如何重置数据库？
A: 删除 `prisma/dev.db` 文件，重新运行 `npm run db:init`

### Q: Token过期怎么办？
A: 重新登录即可（Token有效期7天）

### Q: 如何修改项目？
A: 查看 `PROJECT_SETUP.md` 完整文档

---

## 项目结构（方便修改）

\`\`\`
📁 关键文件位置：

前端页面：
├── app/login/page.tsx          # 登录页面
├── app/user/page.tsx           # 用户中心页面
├── app/projects/page.tsx       # 项目库（待开发）
├── app/recommend/page.tsx      # 智能推荐（待开发）
└── app/history/page.tsx        # 推荐记录（待开发）

后端API：
├── app/api/auth/login/route.ts      # 登录API
├── app/api/auth/register/route.ts   # 注册API
└── app/api/profile/route.ts         # 用户画像API

组件：
├── src/components/Navbar.tsx        # 顶部导航栏
└── src/context/AuthContext.tsx      # 认证状态管理

工具库：
├── src/lib/auth.ts                  # JWT、密码加密
├── src/lib/prisma.ts                # 数据库连接
└── src/lib/validation.ts            # 表单验证

数据库：
└── prisma/schema.prisma             # 数据库表结构定义
\`\`\`

---

## 下一步开发

当前已完成 **用户中心模块**，接下来可以开发：
1. 项目库 - 投资项目管理
2. 智能推荐 - AI推荐算法
3. 推荐记录 - 历史记录查看

详细开发指南请查看 `PROJECT_SETUP.md`
