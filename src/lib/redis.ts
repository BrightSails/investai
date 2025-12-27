import { createClient, RedisClientType } from 'redis';

// ==================== Redis 客户端单例 ====================

let redisClient: RedisClientType | null = null;
let isConnecting = false;

/**
 * 获取 Redis 客户端实例（单例模式）
 * 自动处理连接和重连
 */
export async function getRedisClient(): Promise<RedisClientType> {
  // 如果已有客户端且已连接，直接返回
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  // 如果正在连接，等待连接完成
  if (isConnecting) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return getRedisClient();
  }

  // 创建新连接
  isConnecting = true;

  try {
    const url = process.env.REDIS_URL;
    if (!url) {
      throw new Error('REDIS_URL 环境变量未设置');
    }

    // 创建客户端
    redisClient = createClient({
      url,
      socket: {
        reconnectStrategy: (retries) => {
          // 最多重试 10 次
          if (retries > 10) {
            console.error('Redis 重连失败，超过最大重试次数');
            return new Error('Redis 连接失败');
          }
          // 指数退避，最多等待 3 秒
          return Math.min(retries * 100, 3000);
        },
      },
    });

    // 错误处理
    redisClient.on('error', (err) => {
      console.error('Redis 客户端错误:', err);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis 已连接');
    });

    redisClient.on('disconnect', () => {
      console.warn('⚠️ Redis 连接断开');
    });

    // 连接
    await redisClient.connect();
    isConnecting = false;

    return redisClient;
  } catch (error) {
    isConnecting = false;
    console.error('Redis 连接失败:', error);
    throw error;
  }
}

/**
 * 关闭 Redis 连接（通常在应用关闭时调用）
 */
export async function closeRedisClient(): Promise<void> {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
    redisClient = null;
    console.log('✅ Redis 连接已关闭');
  }
}

// ==================== 便捷方法 ====================

/**
 * GET 操作
 */
export async function redisGet(key: string): Promise<string | null> {
  const client = await getRedisClient();
  return await client.get(key);
}

/**
 * SET 操作
 */
export async function redisSet(
  key: string,
  value: string,
  options?: { EX?: number; NX?: boolean }
): Promise<string | null> {
  const client = await getRedisClient();
  return await client.set(key, value, options);
}

/**
 * DEL 操作
 */
export async function redisDel(key: string): Promise<number> {
  const client = await getRedisClient();
  return await client.del(key);
}

/**
 * HGET 操作（Hash）
 */
export async function redisHGet(key: string, field: string): Promise<string | null | undefined> {
  const client = await getRedisClient();
  const result = await client.hGet(key, field);
  return result === null ? undefined : result;
}

/**
 * HSET 操作（Hash）
 */
export async function redisHSet(key: string, field: string, value: string): Promise<number> {
  const client = await getRedisClient();
  return await client.hSet(key, field, value);
}

/**
 * HGETALL 操作（Hash）
 */
export async function redisHGetAll(key: string): Promise<Record<string, string>> {
  const client = await getRedisClient();
  return await client.hGetAll(key);
}

/**
 * INCR 操作（自增）
 */
export async function redisIncr(key: string): Promise<number> {
  const client = await getRedisClient();
  return await client.incr(key);
}

/**
 * SADD 操作（Set 添加）
 */
export async function redisSAdd(key: string, ...members: string[]): Promise<number> {
  const client = await getRedisClient();
  return await client.sAdd(key, members);
}

/**
 * SMEMBERS 操作（Set 获取所有成员）
 */
export async function redisSMembers(key: string): Promise<string[]> {
  const client = await getRedisClient();
  return await client.sMembers(key);
}

/**
 * SREM 操作（Set 删除）
 */
export async function redisSRem(key: string, ...members: string[]): Promise<number> {
  const client = await getRedisClient();
  return await client.sRem(key, members);
}

/**
 * KEYS 操作（获取匹配的键，生产环境慎用）
 */
export async function redisKeys(pattern: string): Promise<string[]> {
  const client = await getRedisClient();
  return await client.keys(pattern);
}

/**
 * EXPIRE 操作（设置过期时间）
 */
export async function redisExpire(key: string, seconds: number): Promise<boolean> {
  const client = await getRedisClient();
  const result = await client.expire(key, seconds);
  return result === 1;
}
