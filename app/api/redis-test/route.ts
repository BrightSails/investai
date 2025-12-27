import { NextResponse } from 'next/server';
import { getRedisClient, redisGet, redisSet } from '../../../src/lib/redis';

/**
 * GET 请求 - 获取 Redis 中的数据
 * 示例：GET /api/redis-test?key=item
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key') || 'test-item';

    // 方式1：使用便捷方法
    const result = await redisGet(key);

    return NextResponse.json({
      success: true,
      key,
      value: result,
      message: result ? '数据获取成功' : '键不存在',
    });
  } catch (error) {
    console.error('Redis GET 错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

/**
 * POST 请求 - 设置 Redis 数据
 * 示例：POST /api/redis-test
 * Body: { "key": "item", "value": "Hello Redis", "ttl": 3600 }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, value, ttl } = body;

    if (!key || !value) {
      return NextResponse.json(
        { success: false, error: '缺少 key 或 value 参数' },
        { status: 400 }
      );
    }

    // 方式1：使用便捷方法（简单）
    const options = ttl ? { EX: ttl } : undefined;
    await redisSet(key, value, options);

    // 方式2：使用客户端（复杂操作）
    // const client = await getRedisClient();
    // await client.set(key, value, { EX: ttl });

    return NextResponse.json({
      success: true,
      key,
      value,
      ttl: ttl || null,
      message: '数据保存成功',
    });
  } catch (error) {
    console.error('Redis SET 错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE 请求 - 删除 Redis 数据
 * 示例：DELETE /api/redis-test?key=item
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { success: false, error: '缺少 key 参数' },
        { status: 400 }
      );
    }

    const client = await getRedisClient();
    const deletedCount = await client.del(key);

    return NextResponse.json({
      success: true,
      key,
      deleted: deletedCount > 0,
      message: deletedCount > 0 ? '删除成功' : '键不存在',
    });
  } catch (error) {
    console.error('Redis DELETE 错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH 请求 - 测试 Redis 连接
 * 示例：PATCH /api/redis-test
 */
export async function PATCH() {
  try {
    const client = await getRedisClient();
    
    // 执行 PING 命令测试连接
    const pong = await client.ping();

    return NextResponse.json({
      success: true,
      connected: pong === 'PONG',
      message: 'Redis 连接正常',
    });
  } catch (error) {
    console.error('Redis 连接测试失败:', error);
    return NextResponse.json(
      {
        success: false,
        connected: false,
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}
