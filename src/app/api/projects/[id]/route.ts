import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { authOptions } from '@/lib/auth-config';
import { db } from '@/lib/db';
import { updateProjectSchema } from '@/lib/schemas';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// Get a specific project by ID
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const project = await db.userProject.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Update a project by ID
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const validatedData = updateProjectSchema.parse(body);

    // Check if project exists and belongs to user
    const existingProject = await db.userProject.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Update the project
    const updatedProject = await db.userProject.update({
      where: {
        id,
      },
      data: validatedData,
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation Error', details: error.flatten() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Delete a project by ID
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if project exists and belongs to user
    const existingProject = await db.userProject.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Delete the project
    await db.userProject.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 