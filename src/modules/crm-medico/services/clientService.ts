import prisma from '@/lib/prisma';
import { generateQRCode } from '@/utils/helpers';

export class ClientService {
  /**
   * Obtener expediente completo de un cliente
   */
  static async getClientRecord(clientId: string) {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        appointments: {
          include: {
            service: true,
            staff: true,
            serviceNotes: true,
          },
          orderBy: {
            startTime: 'desc',
          },
        },
        beforeAfterPhotos: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!client) {
      throw new Error('Cliente no encontrado');
    }

    return client;
  }

  /**
   * Actualizar información médica del cliente
   */
  static async updateMedicalInfo(
    clientId: string,
    data: {
      medicalNotes?: string;
      allergies?: string[];
    }
  ) {
    const client = await prisma.client.update({
      where: { id: clientId },
      data,
    });

    return client;
  }

  /**
   * Agregar alergias al cliente
   */
  static async addAllergy(clientId: string, allergy: string) {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new Error('Cliente no encontrado');
    }

    const allergies = [...new Set([...client.allergies, allergy])];

    const updated = await prisma.client.update({
      where: { id: clientId },
      data: { allergies },
    });

    return updated;
  }

  /**
   * Remover alergia del cliente
   */
  static async removeAllergy(clientId: string, allergy: string) {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new Error('Cliente no encontrado');
    }

    const allergies = client.allergies.filter((a) => a !== allergy);

    const updated = await prisma.client.update({
      where: { id: clientId },
      data: { allergies },
    });

    return updated;
  }

  /**
   * Agregar foto antes/después
   */
  static async addBeforeAfterPhoto(
    clientId: string,
    data: {
      beforeUrl: string;
      afterUrl: string;
      serviceType: string;
    }
  ) {
    const photo = await prisma.beforeAfterPhoto.create({
      data: {
        clientId,
        ...data,
      },
    });

    return photo;
  }

  /**
   * Obtener galería de fotos del cliente
   */
  static async getClientPhotos(clientId: string) {
    const photos = await prisma.beforeAfterPhoto.findMany({
      where: { clientId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return photos;
  }

  /**
   * Check-in por QR
   */
  static async checkInByQR(qrCode: string) {
    const client = await prisma.client.findUnique({
      where: { qrCode },
      include: {
        appointments: {
          where: {
            status: 'CONFIRMED',
          },
          include: {
            service: true,
            staff: true,
          },
        },
      },
    });

    if (!client) {
      throw new Error('Cliente no encontrado');
    }

    // Obtener la cita de hoy si existe
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointment = client.appointments.find((apt) => {
      const aptDate = new Date(apt.startTime);
      aptDate.setHours(0, 0, 0, 0);
      return aptDate.getTime() === today.getTime();
    });

    return {
      client,
      todayAppointment,
    };
  }

  /**
   * Registrar nota de servicio
   */
  static async addServiceNote(
    appointmentId: string,
    staffId: string,
    data: {
      content: string;
      photoUrl?: string;
    }
  ) {
    const note = await prisma.serviceNote.create({
      data: {
        appointmentId,
        staffId,
        ...data,
      },
    });

    return note;
  }

  /**
   * Obtener historial de servicios de un cliente
   */
  static async getClientServiceHistory(clientId: string) {
    const appointments = await prisma.appointment.findMany({
      where: {
        clientId,
        status: 'COMPLETED',
      },
      include: {
        service: true,
        staff: true,
        serviceNotes: true,
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    return appointments;
  }

  /**
   * Obtener alertas críticas del cliente
   */
  static async getClientAlerts(clientId: string) {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new Error('Cliente no encontrado');
    }

    const alerts = [];

    // Alerta por alergias
    if (client.allergies && client.allergies.length > 0) {
      alerts.push({
        type: 'ALLERGIES',
        severity: 'HIGH',
        message: `Alergias: ${client.allergies.join(', ')}`,
      });
    }

    // Alerta por notas médicas
    if (client.medicalNotes) {
      alerts.push({
        type: 'MEDICAL_NOTES',
        severity: 'MEDIUM',
        message: client.medicalNotes,
      });
    }

    return alerts;
  }
}
