import { NextResponse } from 'next/server';
import { findUserByUsername, createUser } from '@/src/lib/kvdb';
import { hashPassword, generateToken } from '@/src/lib/auth';
import { registerSchema } from '@/src/lib/validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 验证输入
    const validatedData = registerSchema.parse(body);
    const { username, password } = validatedData;

    // 检查用户名是否已存在
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return NextResponse.json(
        { error: '用户名已存在' },
        { status: 400 }
      );
    }

    // 加密密码
    const hashedPassword = await hashPassword(password);

    // 创建用户
    const newUser = await createUser(username, hashedPassword);

    // 生成 JWT token
    const token = await generateToken({
      userId: newUser.id,
      username: newUser.username,
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
      },
    });
  } catch (error) {
    console.error('注册失败:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: '注册失败' },
      { status: 500 }
    );
  }
}
