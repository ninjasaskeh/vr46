import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { z } from 'zod';

const materialUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  supplier: z.string().min(1, 'Supplier is required').optional(),
  unitPrice: z.number().positive('Unit price must be positive').optional(),
  unit: z.string().min(1, 'Unit is required').optional(),
  stock: z.number().min(0, 'Stock cannot be negative').optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only ADMIN and MARKETING can update materials
    if (!['ADMIN', 'MARKETING'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = materialUpdateSchema.parse(body);

    // Determine status based on stock level if stock is being updated
    let updateData: any = validatedData;
    if (validatedData.stock !== undefined) {
      let status = 'ACTIVE';
      if (validatedData.stock === 0) {
        status = 'OUT_OF_STOCK';
      } else if (validatedData.stock < 50) {
        status = 'LOW_STOCK';
      }
      updateData.status = status;
    }

    const material = await prisma.material.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: material,
    });
  } catch (error) {
    console.error('Materials PUT API Error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid data format',
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update material' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only ADMIN can delete materials
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    await prisma.material.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Material deleted successfully',
    });
  } catch (error) {
    console.error('Materials DELETE API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete material' 
      },
      { status: 500 }
    );
  }
}