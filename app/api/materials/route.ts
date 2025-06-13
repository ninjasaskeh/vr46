import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { z } from 'zod';

const materialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  supplier: z.string().min(1, 'Supplier is required'),
  unitPrice: z.number().positive('Unit price must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  stock: z.number().min(0, 'Stock cannot be negative'),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';

    const skip = (page - 1) * limit;

    const where = {
      AND: [
        search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { supplier: { contains: search, mode: 'insensitive' as const } },
          ],
        } : {},
        category ? { category: { contains: category, mode: 'insensitive' as const } } : {},
        status ? { status: status as any } : {},
      ],
    };

    const [materials, total] = await Promise.all([
      prisma.material.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.material.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: materials,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Materials GET API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch materials' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only ADMIN and MARKETING can create materials
    if (!['ADMIN', 'MARKETING'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = materialSchema.parse(body);

    // Determine status based on stock level
    let status = 'ACTIVE';
    if (validatedData.stock === 0) {
      status = 'OUT_OF_STOCK';
    } else if (validatedData.stock < 50) {
      status = 'LOW_STOCK';
    }

    const material = await prisma.material.create({
      data: {
        ...validatedData,
        status: status as any,
        createdBy: session.user.id,
      },
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
    console.error('Materials POST API Error:', error);

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
        error: 'Failed to create material' 
      },
      { status: 500 }
    );
  }
}