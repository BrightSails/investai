# TypeScript 类型检查修复

## 问题描述

构建时出现 TypeScript 类型错误：
```
Type error: 'payload' is possibly 'null'.
app/api/profile/route.ts:15:20
const userId = payload.userId;
```

## 根本原因

`verifyToken()` 函数返回类型是 `Promise<JWTPayload | null>`，当 token 无效时返回 `null`。

但多个 API 路由直接使用 `payload.userId` 而没有检查 null，导致 TypeScript 编译失败。

## 修复的文件

### 1. `app/api/profile/route.ts` ✅
**修改前**:
```typescript
const payload = await verifyToken(token);
const userId = payload.userId;  // ❌ payload 可能为 null
```

**修改后**:
```typescript
const payload = await verifyToken(token);

if (!payload) {
  return NextResponse.json({ error: '无效的 token' }, { status: 401 });
}

const userId = payload.userId;  // ✅ 安全访问
```

修改位置：
- GET 方法（第 14-18 行）
- POST 方法（第 40-47 行）

### 2. `app/api/recommend/route.ts` ✅
**修改前**:
```typescript
const payload = await verifyToken(token);
const userId = payload.userId;  // ❌ payload 可能为 null
```

**修改后**:
```typescript
const payload = await verifyToken(token);

if (!payload) {
  return NextResponse.json({ error: '无效的 token' }, { status: 401 });
}

const userId = payload.userId;  // ✅ 安全访问
```

修改位置：
- POST 方法（第 14-20 行）

### 3. `app/api/history/route.ts` ✅
**已经有 null 检查**，无需修改。

### 4. `app/api/projects/[id]/route.ts` ✅
使用 `getUserFromRequest()` 函数（内部已处理 null），并有正确的检查：
```typescript
const user = await getUserFromRequest(request)

if (!user) {
  return NextResponse.json({ error: '未授权' }, { status: 401 })
}
```

## 类型安全最佳实践

### 正确的 Token 验证模式

```typescript
// ✅ 推荐方式 1：使用 verifyToken + null 检查
const payload = await verifyToken(token);
if (!payload) {
  return NextResponse.json({ error: '无效的 token' }, { status: 401 });
}
const userId = payload.userId;

// ✅ 推荐方式 2：使用 getUserFromRequest（封装了检查）
const user = await getUserFromRequest(request);
if (!user) {
  return NextResponse.json({ error: '未授权' }, { status: 401 });
}
const userId = user.userId;
```

### 错误的模式（会导致类型错误）

```typescript
// ❌ 直接访问，没有检查 null
const payload = await verifyToken(token);
const userId = payload.userId;  // TypeScript 错误！

// ❌ 使用断言（不安全）
const userId = payload!.userId;  // 运行时可能崩溃
```

## 验证步骤

```bash
# 1. TypeScript 类型检查
npx tsc --noEmit

# 2. ESLint 检查
npm run lint

# 3. 本地构建
npm run build

# 4. 本地运行
npm run dev
```

## 修复结果

- ✅ 所有 API 路由添加 null 检查
- ✅ TypeScript 类型检查通过
- ✅ 运行时类型安全
- ✅ 可以成功构建

## 相关文件

- `src/lib/auth.ts` - JWT 认证函数定义
- `app/api/profile/route.ts` - 用户画像 API
- `app/api/recommend/route.ts` - 智能推荐 API
- `app/api/history/route.ts` - 推荐记录 API
- `app/api/projects/[id]/route.ts` - 项目管理 API

## 类型定义

```typescript
// src/lib/auth.ts
export interface JWTPayload {
  userId: number
  username: string
}

export async function verifyToken(token: string): Promise<JWTPayload | null>
export async function getUserFromRequest(request: Request): Promise<JWTPayload | null>
```

---

**修复时间**: 2024-12-26  
**影响文件**: 2 个（profile.ts, recommend.ts）  
**类型检查**: ✅ 通过
