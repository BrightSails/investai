import { NextResponse } from 'next/server';
import { findProfileByUserId, getProjects, createRecommendation } from '@/src/lib/kvdb';
import { generateRecommendation } from '@/src/lib/openai';
import { verifyToken } from '@/src/lib/auth';

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

    // 获取请求体
    const body = await request.json();
    const { apiKey, apiUrl, saveToHistory } = body;

    if (!apiKey) {
      return NextResponse.json({ error: '请提供 OpenAI API Key' }, { status: 400 });
    }

    // 获取用户画像
    const profile = await findProfileByUserId(userId);
    if (!profile) {
      return NextResponse.json({ error: '请先完善投资画像' }, { status: 400 });
    }

    // 获取项目库
    const projects = await getProjects();
    if (projects.length === 0) {
      return NextResponse.json({ error: '项目库为空，无法生成推荐' }, { status: 400 });
    }

    // 调用 OpenAI API 生成推荐
    const recommendation = await generateRecommendation(
      {
        userProfile: {
          riskPreference: profile.riskPreference,
          investmentAmount: profile.investmentAmount,
          investmentPeriod: profile.investmentPeriod,
          investmentGoal: profile.investmentGoal,
        },
        projects: projects.map(p => ({
          id: p.id,
          name: p.name,
          type: p.type,
          riskLevel: p.riskLevel,
          expectedReturn: p.expectedReturn,
          investmentThreshold: p.investmentThreshold,
          description: p.description,
        })),
      },
      apiKey,
      apiUrl || 'https://api.openai.com/v1/chat/completions'
    );

    // 如果需要保存到历史记录
    let savedRecommendation = null;
    if (saveToHistory) {
      savedRecommendation = await createRecommendation(userId, recommendation);
    }

    return NextResponse.json({
      success: true,
      recommendation,
      saved: !!savedRecommendation,
      savedId: savedRecommendation?.id,
    });
  } catch (error) {
    console.error('生成推荐失败:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '生成推荐失败' }, { status: 500 });
  }
}
