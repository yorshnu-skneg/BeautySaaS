import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiResponse } from '@/types';
import { generateQRCode } from '@/utils/helpers';

/**
 * GET /api/clients
 * Obtener lista de clientes
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'tenantId es requerido',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const clients = await prisma.client.findMany({
      where: { tenantId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const response: ApiResponse<typeof clients> = {
      success: true,
      data: clients,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching clients:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al obtener clientes',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * POST /api/clients
 * Crear nuevo cliente
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { tenantId, email, phone, firstName, lastName, allergies } = body;

    // Validación básica
    if (!tenantId || !firstName || !lastName) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Faltan campos requeridos',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Generar QR code único
    const qrCode = generateQRCode();

    // Crear cliente
    const client = await prisma.client.create({
      data: {
        tenantId,
        qrCode,
        email,
        phone,
        firstName,
        lastName,
        allergies: allergies || [],
        loyaltyTier: 'BRONZE',
        loyaltyPoints: 0,
      },
    });

    const response: ApiResponse<typeof client> = {
      success: true,
      data: client,
      message: 'Cliente creado exitosamente',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Error al crear cliente',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
