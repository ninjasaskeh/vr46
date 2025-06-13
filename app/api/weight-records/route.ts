import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';
    const materialId = searchParams.get('materialId') || '';

    const skip = (page - 1) * limit;

    const where = {
      AND: [
        status ? { status: status as any } : {},
        materialId ? { materialId } : {},
        // Operators can only see their own records
        session.user.role === 'OPERATOR' ? { operatorId: session.user.id } : {},
      ],
    };

    const [weightRecords, total] = await Promise.all([
      prisma.weightRecord.findMany({
        where,
        include: {
          material: true,
          operator: {
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
      prisma.weightRecord.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: weightRecords,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Weight Records GET API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch weight records' 
      },
      { status: 500 }
    );
  }
}