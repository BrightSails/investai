import { NextResponse } from 'next/server';
import { getProjects, createProject } from '@/src/lib/kvdb';
import { getUserFromRequest } from '@/src/lib/auth';
import { projectSchema } from '@/src/lib/validation';

// 获取所有项目
export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error('获取项目列表失败:', error);
    return NextResponse.json(
      { error: '获取项目列表失败' },
      { status: 500 }
    );
  }
}

// 创建新项目
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: '未授权，请先登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = projectSchema.parse(body);
    
    const newProject = await createProject(validatedData);

    return NextResponse.json({
      success: true,
      project: newProject,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: '创建项目失败' },
      { status: 500 }
    );
  }
}
