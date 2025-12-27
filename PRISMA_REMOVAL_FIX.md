# Prisma 依赖清理修复说明

## 问题描述

### 问题 1: Module not found '@prisma/client'
Vercel 部署时出现构建错误：
```
Module not found: Can't resolve '@prisma/client'
./src/lib/prisma.ts:1:1
```

### 问题 2: Export JsonDB doesn't exist
修复问题 1 后，出现新错误：
```
Export JsonDB doesn't exist in target module
./app/api/projects/[id]/route.ts:4:1
```

## 根本原因

1. **Prisma 遗留引用**：虽然已从 `package.json` 中删除了 Prisma 依赖，但以下文件仍在引用：
   - `src/lib/prisma.ts` - Prisma 客户端封装文件
   - `app/api/projects/[id]/route.ts` - 项目更新/删除 API 路由

2. **错误的导入语句**：`jsondb.ts` 没有导出 `JsonDB` 类，只导出了单独的函数（如 `getProjects`、`saveProjects`）

## 修复措施

### 1. 删除废弃文件
```bash
# 删除 Prisma 客户端文件
src/lib/prisma.ts  # ❌ 已删除
```

### 2. 重构 API 路由
**文件**: `app/api/projects/[id]/route.ts`

**修改前（错误）**:
```typescript
import { JsonDB } from '@/src/lib/jsondb'  // ❌ JsonDB 类不存在

const projectsDB = new JsonDB<any>('projects.json')
const project = await projectsDB.update(parseInt(params.id), {...})
```

**修改后（正确）**:
```typescript
import { getProjects, saveProjects } from '@/src/lib/jsondb'  // ✅ 使用函数导出

// 获取所有项目
const projects = getProjects()
const projectIndex = projects.findIndex(p => p.id === parseInt(params.id))

// 更新项目
projects[projectIndex] = { ...projects[projectIndex], ...validatedData }
saveProjects(projects)

// 删除项目
projects.splice(projectIndex, 1)
saveProjects(projects)
```

## 验证步骤

### 本地验证
```bash
# 1. 清理缓存
rm -rf .next node_modules/.cache

# 2. 初始化数据库
npm run db:init

# 3. 本地构建测试
npm run build  # ✅ 应该成功

# 4. 本地运行测试
npm run dev
```

### 检查清单
- [x] `package.json` 无 Prisma 依赖
- [x] `src/lib/prisma.ts` 已删除
- [x] 所有 API 路由使用 `jsondb.ts` 导出的函数
- [x] 数据文件已初始化（`data/*.json`）
- [x] 本地构建成功

## 当前数据存储架构

项目完全基于 **JSON 文件存储**，无需任何数据库：

```
data/
├── users.json           # 用户数据
├── profiles.json        # 投资画像
├── projects.json        # 投资项目
└── recommendations.json # 推荐记录
```

## API 路由使用规范

所有 API 路由应使用 `jsondb.ts` 导出的函数：

```typescript
import { 
  getProjects, saveProjects,     // 项目相关
  getUsers, saveUsers,           // 用户相关
  getProfiles, saveProfiles,     // 画像相关
  getRecommendations, saveRecommendations  // 推荐相关
} from '@/src/lib/jsondb'

// CRUD 示例
const projects = getProjects()                    // 读取
projects.push(newProject)                         // 新增
projects[index] = updatedProject                  // 更新
projects.splice(index, 1)                         // 删除
saveProjects(projects)                            // 保存
```

## Vercel 部署注意事项

✅ **无需环境变量** - 不需要配置数据库连接
✅ **无需安装额外依赖** - 纯 Node.js 文件操作
⚠️ **数据不持久化** - Vercel 文件系统是临时的，每次部署会重置

### 生产环境建议

如需真实持久化存储，推荐使用：
- **Vercel Postgres** - 官方集成
- **MongoDB Atlas** - 免费套餐 512MB
- **Supabase** - 开源 BaaS 方案

## 修复结果

- ✅ 所有 Prisma 引用已清除
- ✅ API 路由已迁移到 jsondb 函数
- ✅ 构建错误已修复
- ✅ 可正常部署到 Vercel

---

**修复时间**: 2024-12-26  
**影响文件**: 2 个  
**构建状态**: ✅ 通过
