import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiResponse } from '@/types';

/**
 * GET /api/appointments
 * Obtener lista de citas
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId');
    const clientId = searchParams.get('clientId');
    const staffId = searchParams.get('staffId');
    const status = searchParams.get('status');

    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (clientId) where.clientId = clientId;
    if (staffId) where.staffId = staffId;
    if (status) where.status = status;

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        client: true,
        staff: true,
        service: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    const response: ApiResponse<typeof appointments> = {
      success: true,
      data: appointments,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al obtener citas',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * POST /api/appointments
 * Crear nueva cita
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      tenantId,
      clientId,
      staffId,
      serviceId,
      startTime,
      endTime,
      notes,
    } = body;

    // Validación básica
    if (
      !tenantId ||
      !clientId ||
      !staffId ||
      !serviceId ||
      !startTime ||
      !endTime
    ) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Faltan campos requeridos',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Crear cita
    const appointment = await prisma.appointment.create({
      data: {
        tenantId,
        clientId,
        staffId,
        serviceId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        notes,
        status: 'PENDING',
        totalPrice: 0, // Se calculará basado en el servicio y nivel del staff
      },
      include: {
        client: true,
        staff: true,
        service: true,
      },
    });

    const response: ApiResponse<typeof appointment> = {
      success: true,
      data: appointment,
      message: 'Cita creada exitosamente',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al crear cita',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
