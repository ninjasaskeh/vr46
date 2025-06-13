import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DashboardStats } from '@/lib/types';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get all stats in parallel
    const [
      totalMaterials,
      totalWeightRecords,
      totalSuppliers,
      totalUsers,
      todayRecords,
      lowStockMaterials,
      unreadNotifications,
      avgWeightResult,
    ] = await Promise.all([
      prisma.material.count(),
      prisma.weightRecord.count(),
      prisma.supplier.count(),
      prisma.user.count(),
      prisma.weightRecord.count({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      prisma.material.count({
        where: {
          status: {
            in: ['LOW_STOCK', 'OUT_OF_STOCK'],
          },
        },
      }),
      prisma.notification.count({
        where: {
          isRead: false,
        },
      }),
      prisma.weightRecord.aggregate({
        _avg: {
          netWeight: true,
        },
      }),
    ]);

    const stats: DashboardStats = {
      totalMaterials,
      totalWeightRecords,
      totalSuppliers,
      totalUsers,
      todayRecords,
      lowStockMaterials,
      unreadNotifications,
      avgWeight: avgWeightResult._avg.netWeight || 0,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Dashboard Stats API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch dashboard statistics' 
      },
      { status: 500 }
    );
  }
}