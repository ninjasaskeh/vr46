import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { IoTWeighingData, IoTWeighingResponse } from '@/lib/types';
import { z } from 'zod';

// Validation schema for IoT weighing data
const iotWeighingSchema = z.object({
  deviceId: z.string().min(1, 'Device ID is required'),
  materialId: z.string().min(1, 'Material ID is required'),
  grossWeight: z.number().positive('Gross weight must be positive'),
  tareWeight: z.number().positive('Tare weight must be positive'),
  vehicleNumber: z.string().min(1, 'Vehicle number is required'),
  operatorId: z.string().min(1, 'Operator ID is required'),
  timestamp: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the incoming data
    const validatedData = iotWeighingSchema.parse(body);
    
    // Calculate net weight
    const netWeight = validatedData.grossWeight - validatedData.tareWeight;
    
    if (netWeight <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Net weight must be positive (gross weight > tare weight)' 
        },
        { status: 400 }
      );
    }

    // Verify that material exists
    const material = await prisma.material.findUnique({
      where: { id: validatedData.materialId },
    });

    if (!material) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Material not found' 
        },
        { status: 404 }
      );
    }

    // Verify that operator exists and has OPERATOR role
    const operator = await prisma.user.findUnique({
      where: { id: validatedData.operatorId },
    });

    if (!operator) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Operator not found' 
        },
        { status: 404 }
      );
    }

    if (operator.role !== 'OPERATOR') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User is not authorized as an operator' 
        },
        { status: 403 }
      );
    }

    // Create weight record
    const weightRecord = await prisma.weightRecord.create({
      data: {
        materialId: validatedData.materialId,
        grossWeight: validatedData.grossWeight,
        tareWeight: validatedData.tareWeight,
        netWeight: netWeight,
        vehicleNumber: validatedData.vehicleNumber.toUpperCase(),
        operatorId: validatedData.operatorId,
        status: 'COMPLETED',
        entryDate: new Date(),
        weighingDate: validatedData.timestamp ? new Date(validatedData.timestamp) : new Date(),
      },
      include: {
        material: true,
        operator: true,
      },
    });

    // Update material stock (subtract the net weight)
    await prisma.material.update({
      where: { id: validatedData.materialId },
      data: {
        stock: {
          decrement: netWeight,
        },
      },
    });

    // Check if material stock is low and create notification
    const updatedMaterial = await prisma.material.findUnique({
      where: { id: validatedData.materialId },
    });

    if (updatedMaterial && updatedMaterial.stock < 50) {
      await prisma.notification.create({
        data: {
          title: 'Low Stock Alert',
          message: `${updatedMaterial.name} inventory is running low (${updatedMaterial.stock} ${updatedMaterial.unit} remaining)`,
          type: 'WARNING',
          category: 'Inventory',
          priority: 'HIGH',
          isRead: false,
        },
      });

      // Update material status to LOW_STOCK
      await prisma.material.update({
        where: { id: validatedData.materialId },
        data: {
          status: updatedMaterial.stock <= 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
        },
      });
    }

    // Create success notification
    await prisma.notification.create({
      data: {
        title: 'Weight Record Completed',
        message: `Weight record for ${material.name} has been successfully processed (${netWeight} kg)`,
        type: 'SUCCESS',
        category: 'Operations',
        priority: 'NORMAL',
        isRead: false,
      },
    });

    // Prepare response
    const response: IoTWeighingResponse = {
      id: weightRecord.id,
      netWeight: netWeight,
      material: material.name,
      operator: operator.name || 'Unknown',
      timestamp: weightRecord.weighingDate?.toISOString() || new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: response,
    });

  } catch (error) {
    console.error('IoT Weighing API Error:', error);

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
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve recent weighing data (for testing/monitoring)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const deviceId = searchParams.get('deviceId');

    const whereClause = deviceId ? {
      // Note: We don't store deviceId in the database, but we can filter by other criteria
      // For now, we'll just return recent records
    } : {};

    const recentRecords = await prisma.weightRecord.findMany({
      where: whereClause,
      include: {
        material: true,
        operator: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    const formattedRecords = recentRecords.map(record => ({
      id: record.id,
      netWeight: record.netWeight,
      material: record.material.name,
      operator: record.operator.name || 'Unknown',
      vehicleNumber: record.vehicleNumber,
      timestamp: record.weighingDate?.toISOString() || record.createdAt.toISOString(),
      status: record.status,
    }));

    return NextResponse.json({
      success: true,
      data: formattedRecords,
    });

  } catch (error) {
    console.error('IoT Weighing GET API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}