# 📝 更新日志 (Changelog)

## [Phase 2] - 2024-12-26

### ✨ 新增功能

#### 项目库模块 (/projects)
- ✅ 投资项目完整CRUD功能
  - 新增项目（模态框表单）
  - 编辑项目（数据回显）
  - 删除项目（二次确认）
  - 查看项目列表
  
- ✅ 高级筛选系统
  - 按项目类型筛选（债券/基金/股票/理财产品/其他）
  - 按风险等级筛选（1-5星）
  - 按投资门槛筛选（≤X元）
  - 多条件组合筛选
  - 一键重置筛选
  
- ✅ 响应式数据表格
  - 彩色风险等级星级显示
  - 格式化金额显示
  - 悬停高亮效果
  - 统计信息显示
  
#### 登录页面增强
- ✅ "记住我"功能（自动填充用户名）
- ✅ "忘记密码"功能（友好提示）
- ✅ 修复数据库初始化报错

### 🗄️ 数据库更新
- ✅ 新增 `projects` 表
  - 字段：id, name, type, riskLevel, expectedReturn, investmentThreshold, description, createdAt, updatedAt
  
### 🔌 API更新
- ✅ `GET /api/projects` - 获取项目列表（支持筛选）
- ✅ `POST /api/projects` - 创建新项目
- ✅ `PUT /api/projects/[id]` - 更新项目
- ✅ `DELETE /api/projects/[id]` - 删除项目

### 🎨 UI组件
- ✅ `ProjectModal` - 项目新增/编辑模态框
- ✅ `ConfirmDialog` - 通用确认对话框（可复用）

### 📄 文档更新
- ✅ `PHASE2_SUMMARY.md` - Phase 2完成总结
- ✅ `LOGIN_ENHANCEMENTS.md` - 登录页面功能说明
- ✅ `CHANGELOG.md` - 本更新日志

---

## [Phase 1] - 2024-12-26 初始版本

### ✨ 新增功能

#### 用户中心模块 (/user)
- ✅ 用户注册/登录系统
  - JWT认证（7天有效期）
  - bcrypt密码加密
  - 自动登录恢复
  - 退出登录
  
- ✅ 投资画像管理
  - 风险偏好（保守/稳健/激进）
  - 投资金额
  - 投资期限（4个选项）
  - 投资目标（3个选项）
  
- ✅ 个人信息展示
  - 左右双栏布局
  - 实时更新
  - 编辑/取消模式

#### 全局功能
- ✅ 顶部导航栏
  - Logo + InvestAI品牌
  - 4个模块入口
  - 退出登录按钮
  
- ✅ 路由保护
  - 未登录自动跳转
  - Token验证
  
- ✅ 状态管理
  - AuthContext（全局认证状态）
  - localStorage持久化

### 🗄️ 数据库
- ✅ `users` 表（用户账号）
- ✅ `user_profiles` 表（投资画像）

### 🔌 API
- ✅ `POST /api/auth/register` - 用户注册
- ✅ `POST /api/auth/login` - 用户登录
- ✅ `GET /api/profile` - 获取用户画像
- ✅ `POST /api/profile` - 保存用户画像

### 🎨 UI设计
- ✅ 黑白色系（zinc系列）
- ✅ 响应式布局
- ✅ 现代化卡片式设计
- ✅ 平滑过渡动画

### 🔒 安全特性
- ✅ JWT认证
- ✅ bcrypt密码加密（10轮salt）
- ✅ Zod输入验证
- ✅ XSS防护
- ✅ CSRF防护

### 📄 文档
- ✅ `PROJECT_SETUP.md` - 完整技术文档
- ✅ `QUICK_START.md` - 快速启动指南
- ✅ `PHASE1_SUMMARY.md` - Phase 1总结
- ✅ `ARCHITECTURE.md` - 系统架构图
- ✅ `DEMO_CHECKLIST.md` - 演示清单

---

## 🎯 未来计划

### Phase 3 - 智能推荐模块
- [ ] 基于用户画像的智能推荐算法
- [ ] 项目匹配评分系统
- [ ] 推荐结果展示页面
- [ ] 推荐理由说明

### Phase 4 - 推荐记录模块
- [ ] 历史推荐记录列表
- [ ] 记录详情查看
- [ ] 记录删除功能
- [ ] 推荐统计分析

### 功能优化
- [ ] 真实的忘记密码功能（邮件验证）
- [ ] 第三方登录（OAuth）
- [ ] 数据导出功能（Excel/CSV）
- [ ] 图表可视化（投资分析）
- [ ] 实时通知（WebSocket）

### 性能优化
- [ ] API分页（大数据量）
- [ ] 图片懒加载
- [ ] 代码分割优化
- [ ] 数据库索引优化

---

## 📊 版本统计

### Phase 2 (当前版本)
- 总文件数：28个
- 数据库表：3个
- API接口：8个
- 页面路由：6个
- React组件：9个
- 代码行数：~3000行

### Phase 1
- 总文件数：20个
- 数据库表：2个
- API接口：4个
- 页面路由：6个
- React组件：7个
- 代码行数：~1500行

---

## 🐛 已修复问题

### Phase 2
- ✅ 修复登录注册时数据库连接报错
- ✅ 修复Prisma客户端未生成问题
- ✅ 完善数据库初始化脚本

### Phase 1
- ✅ 初始版本，无已知问题

---

## 🙏 致谢

感谢以下技术和工具：
- Next.js 16
- React 19
- Prisma ORM
- SQLite
- Tailwind CSS
- TypeScript
- Zod
- jose (JWT)
- bcryptjs

---

**持续更新中...** 🚀
