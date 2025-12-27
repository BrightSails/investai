import { NextResponse } from 'next/server';
import { findProfileByUserId, upsertProfile } from '@/src/lib/kvdb';
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

    // 查找用户画像
    const profile = await findProfileByUserId(userId);

    if (!profile) {
      return NextResponse.json({ profile: null });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('获取画像失败:', error);
    return NextResponse.json({ error: '获取画像失败' }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

    const body = await request.json();
    const { riskPreference, investmentAmount, investmentPeriod, investmentGoal } = body;

    // 验证必填字段
    if (!riskPreference || !investmentAmount || !investmentPeriod || !investmentGoal) {
      return NextResponse.json({ error: '所有字段都是必填的' }, { status: 400 });
    }

    // 创建或更新画像
    const profile = await upsertProfile(userId, {
      riskPreference,
      investmentAmount: parseFloat(investmentAmount),
      investmentPeriod,
      investmentGoal,
    });

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('保存画像失败:', error);
    return NextResponse.json({ error: '保存画像失败' }, { status: 500 });
  }
}
