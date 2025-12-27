import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/src/lib/auth';
import { projectSchema } from '@/src/lib/validation';
import { updateProject, deleteProject } from '@/src/lib/kvdb';

// 更新项目
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: '未授权，请先登录' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const body = await request.json();
    const validatedData = projectSchema.parse(body);
    
    const updatedProject = await updateProject(parseInt(params.id), validatedData);

    if (!updatedProject) {
      return NextResponse.json(
        { error: '项目不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      project: updatedProject,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: '更新项目失败' },
      { status: 500 }
    );
  }
}

// 删除项目
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: '未授权，请先登录' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const success = await deleteProject(parseInt(params.id));

    if (!success) {
      return NextResponse.json(
        { error: '项目不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '项目已删除'
    });
  } catch (error) {
    return NextResponse.json(
      { error: '删除项目失败' },
      { status: 500 }
    );
  }
}
