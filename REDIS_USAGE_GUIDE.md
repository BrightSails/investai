# Redis 数据库使用指南

## 📚 概述

项目已经配置好 Redis 数据库，支持两种使用方式：
1. **`@vercel/kv`** - Vercel 官方封装，简单易用（推荐用于生产环境）
2. **`redis` 原生客户端** - 功能完整，适合复杂操作

---

## 🚀 快速开始

### 方式1：使用 Vercel KV（推荐）⭐

**优点**：
- ✅ 自动连接管理
- ✅ 类型安全
- ✅ 无需手动连接/断开
- ✅ Vercel 原生支持

**示例代码**：
```typescript
import { kv } from '@vercel/kv';

// GET 操作
const value = await kv.get('key');

// SET 操作
await kv.set('key', 'value');

// SET 带过期时间（秒）
await kv.set('key', 'value', { ex: 3600 });

// DEL 操作
await kv.del('key');

// INCR 操作
const newValue = await kv.incr('counter');

// Hash 操作
await kv.hset('user:1', { name: 'Alice', age: '25' });
const user = await kv.hgetall('user:1');

// Set 操作
await kv.sadd('tags', 'redis', 'database');
const tags = await kv.smembers('tags');
```

---

### 方式2：使用 Redis 原生客户端

**优点**：
- ✅ 支持所有 Redis 命令
- ✅ 适合复杂场景
- ✅ 更细粒度的控制

**文件位置**：`src/lib/redis.ts`

**示例代码**：
```typescript
import { getRedisClient, redisGet, redisSet } from '@/lib/redis';

// 使用便捷方法（简单）
const value = await redisGet('key');
await redisSet('key', 'value', { EX: 3600 });

// 使用客户端（复杂）
const client = await getRedisClient();
await client.set('key', 'value');
const result = await client.get('key');
```

---

## 📝 API 路由示例

### 测试 API 路由（已创建）

**文件**：`app/api/redis-test/route.ts`

#### 1. 测试连接
```bash
curl -X PATCH http://localhost:3000/api/redis-test
```

**响应**：
```json
{
  "success": true,
  "connected": true,
  "message": "Redis 连接正常"
}
```

#### 2. 设置数据
```bash
curl -X POST http://localhost:3000/api/redis-test \
  -H "Content-Type: application/json" \
  -d '{"key": "test-item", "value": "Hello Redis", "ttl": 3600}'
```

**响应**：
```json
{
  "success": true,
  "key": "test-item",
  "value": "Hello Redis",
  "ttl": 3600,
  "message": "数据保存成功"
}
```

#### 3. 获取数据
```bash
curl -X GET "http://localhost:3000/api/redis-test?key=test-item"
```

**响应**：
```json
{
  "success": true,
  "key": "test-item",
  "value": "Hello Redis",
  "message": "数据获取成功"
}
```

#### 4. 删除数据
```bash
curl -X DELETE "http://localhost:3000/api/redis-test?key=test-item"
```

**响应**：
```json
{
  "success": true,
  "key": "test-item",
  "deleted": true,
  "message": "删除成功"
}
```

---

## 🔧 在现有 API 中使用

### 示例：在用户注册 API 中使用 Redis 缓存

```typescript
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { createUser } from '@/lib/kvdb';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // 1. 检查 Redis 缓存（避免重复检查）
    const cached = await kv.get(`user:check:${username}`);
    if (cached) {
      return NextResponse.json(
        { error: '用户名已存在' },
        { status: 400 }
      );
    }

    // 2. 创建用户
    const user = await createUser(username, password);

    // 3. 缓存用户信息（30分钟过期）
    await kv.set(`user:check:${username}`, true, { ex: 1800 });

    return NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    return NextResponse.json(
      { error: '注册失败' },
      { status: 500 }
    );
  }
}
```

---

## 🎯 常用场景

### 1. 会话管理
```typescript
import { kv } from '@vercel/kv';

// 保存会话（1小时过期）
await kv.set(`session:${sessionId}`, JSON.stringify(userData), { ex: 3600 });

// 获取会话
const sessionData = await kv.get(`session:${sessionId}`);
const user = JSON.parse(sessionData as string);
```

### 2. 限流（Rate Limiting）
```typescript
import { kv } from '@vercel/kv';

const key = `rate:${userId}:${Date.now()}`;
const count = await kv.incr(key);
await kv.expire(key, 60); // 1分钟过期

if (count > 10) {
  return NextResponse.json(
    { error: '请求过于频繁' },
    { status: 429 }
  );
}
```

### 3. 缓存查询结果
```typescript
import { kv } from '@vercel/kv';

async function getProjects() {
  // 尝试从缓存获取
  const cached = await kv.get('projects:all');
  if (cached) {
    return JSON.parse(cached as string);
  }

  // 从数据库查询
  const projects = await fetchProjectsFromDB();

  // 缓存 5 分钟
  await kv.set('projects:all', JSON.stringify(projects), { ex: 300 });

  return projects;
}
```

### 4. 计数器
```typescript
import { kv } from '@vercel/kv';

// 增加访问计数
await kv.incr('page:views');

// 获取计数
const views = await kv.get('page:views');
```

---

## 🔒 环境变量配置

### 开发环境（.env.local）
```env
# Vercel KV（自动配置）
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...

# 或者 Redis URL（如果使用原生客户端）
REDIS_URL=redis://default:xxx@xxx.vercel.redis.com:6379
```

### 生产环境（Vercel Dashboard）
在 Vercel Dashboard 连接 KV 数据库后，环境变量会自动添加。

---

## 🧪 测试步骤

### 1. 本地测试

```bash
# 启动开发服务器
npm run dev

# 测试连接（新窗口）
curl -X PATCH http://localhost:3000/api/redis-test
```

### 2. 部署后测试

```bash
# 测试连接
curl -X PATCH https://你的域名.vercel.app/api/redis-test

# 写入数据
curl -X POST https://你的域名.vercel.app/api/redis-test \
  -H "Content-Type: application/json" \
  -d '{"key": "hello", "value": "world"}'

# 读取数据
curl -X GET "https://你的域名.vercel.app/api/redis-test?key=hello"
```

---

## 📊 性能对比

| 操作 | JSON 文件 | Redis |
|-----|----------|-------|
| 读取 | 10-50ms | < 5ms ⚡ |
| 写入 | 20-100ms | < 5ms ⚡ |
| 并发 | ❌ 串行 | ✅ 并发 |
| 持久化 | ❌ | ✅ |
| 缓存 | ❌ | ✅ |

---

## ⚠️ 注意事项

### 1. 连接管理
- **Vercel KV**：自动管理，无需手动关闭
- **Redis 客户端**：使用单例模式，避免创建多个连接

### 2. 数据类型
- Redis 只存储字符串，复杂对象需要 `JSON.stringify()` / `JSON.parse()`
- Vercel KV 自动处理 JSON 序列化

### 3. 过期时间
- 使用 `ex` 参数设置过期时间（秒）
- 避免存储永久数据

### 4. 键命名规范
```
user:123              # 用户数据
user:123:profile      # 用户画像
session:abc123        # 会话
cache:projects:all    # 缓存
counter:page:views    # 计数器
```

---

## 🚀 下一步

1. ✅ **已创建**：`src/lib/redis.ts` - Redis 客户端封装
2. ✅ **已创建**：`app/api/redis-test/route.ts` - 测试 API
3. 📝 **待实现**：在现有 API 中集成 Redis 缓存
4. 📝 **待实现**：会话管理、限流等功能

---

## 🔗 参考文档

- **Vercel KV**：https://vercel.com/docs/storage/vercel-kv
- **Redis 命令**：https://redis.io/commands
- **node-redis**：https://github.com/redis/node-redis

---

**现在可以开始使用 Redis 了！** 🎉

运行测试命令验证：
```bash
npm run dev
curl -X PATCH http://localhost:3000/api/redis-test
```
