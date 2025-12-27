import { NextResponse } from 'next/server';
import { findRecommendationsByUserId } from '@/src/lib/kvdb';
import { verifyToken } from '@/src/lib/auth';

export async function GET(request: Request) {
  try {
    // 验证 token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);
    
    if (!payload) {
      return NextResponse.json({ error: '无效的 token' }, { status: 401 });
    }
    
    const userId = payload.userId;

    // 获取用户的推荐历史
    const recommendations = await findRecommendationsByUserId(userId);

    return NextResponse.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    console.error('获取推荐历史失败:', error);
    return NextResponse.json({ error: '获取推荐历史失败' }, { status: 500 });
  }
}
