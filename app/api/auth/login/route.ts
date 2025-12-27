import { NextResponse } from 'next/server';
import { findUserByUsername, findProfileByUserId } from '@/src/lib/kvdb';
import { verifyPassword, generateToken } from '@/src/lib/auth';
import { loginSchema } from '@/src/lib/validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 验证输入
    const validatedData = loginSchema.parse(body);
    const { username, password } = validatedData;

    // 查找用户
    const user = await findUserByUsername(username);
    if (!user) {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 验证密码
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 生成 JWT token
    const token = await generateToken({
      userId: user.id,
      username: user.username,
    });

    // 查询用户画像
    const profile = await findProfileByUserId(user.id);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        profile: profile || null,
      },
    });
  } catch (error) {
    console.error('登录失败:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    );
  }
}
