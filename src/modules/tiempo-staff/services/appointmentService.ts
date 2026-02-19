import prisma from '@/lib/prisma';
import {
  isTimeSlotAvailable,
  calculateDepositAmount,
} from '@/utils/helpers';
import { AppointmentStatus } from '@/types';

export class AppointmentService {
  /**
   * Obtener disponibilidad de un empleado en una fecha específica
   */
  static async getStaffAvailability(
    staffId: string,
    date: Date,
    bufferTimeMinutes: number = 15
  ) {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    // Obtener citas del empleado para ese día
    const appointments = await prisma.appointment.findMany({
      where: {
        staffId,
        startTime: {
          gte: dayStart,
          lte: dayEnd,
        },
        status: {
          in: ['CONFIRMED', 'CHECK_IN', 'COMPLETED'],
        },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    // Obtener horario de negocio
    const staff = await prisma.user.findUnique({
      where: { id: staffId },
      include: { tenant: { include: { businessHours: true } } },
    });

    if (!staff) {
      throw new Error('Empleado no encontrado');
    }

    // Obtener día de la semana
    const dayOfWeek = date.getDay();
    const businessHour = staff.tenant.businessHours.find(
      (bh) => bh.dayOfWeek === dayOfWeek
    );

    if (!businessHour || businessHour.isClosed) {
      return {
        available: false,
        reason: 'El negocio está cerrado en esta fecha',
      };
    }

    return {
      available: true,
      businessHours: {
        openTime: businessHour.openTime,
        closeTime: businessHour.closeTime,
      },
      appointments,
      bufferTime: bufferTimeMinutes,
    };
  }

  /**
   * Validar si se puede crear una cita
   */
  static async validateAppointmentCreation(
    staffId: string,
    serviceId: string,
    startTime: Date,
    endTime: Date,
    tenantId: string
  ) {
    const errors: string[] = [];

    // Verificar que el empleado existe y tiene la especialidad
    const staff = await prisma.user.findUnique({
      where: { id: staffId },
    });

    if (!staff || staff.tenantId !== tenantId) {
      errors.push('Empleado no válido');
    }

    // Verificar que el servicio existe
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service || service.tenantId !== tenantId) {
      errors.push('Servicio no válido');
    }

    // Verificar que el empleado tiene la especialidad
    if (staff && service) {
      const hasSkill = staff.skills.includes(service.category || '');
      if (!hasSkill && service.category) {
        errors.push(
          `El empleado no tiene la especialidad: ${service.category}`
        );
      }
    }

    // Verificar disponibilidad de horario
    const appointments = await prisma.appointment.findMany({
      where: {
        staffId,
        startTime: {
          gte: new Date(startTime),
          lte: new Date(endTime),
        },
        status: {
          in: ['CONFIRMED', 'CHECK_IN'],
        },
      },
    });

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (
      !isTimeSlotAvailable(
        startTime,
        endTime,
        appointments,
        tenant?.bufferTime || 15
      )
    ) {
      errors.push('El horario no está disponible');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Crear una cita
   */
  static async createAppointment(data: {
    tenantId: string;
    clientId: string;
    staffId: string;
    serviceId: string;
    startTime: Date;
    endTime: Date;
    notes?: string;
  }) {
    // Validar
    const validation = await this.validateAppointmentCreation(
      data.staffId,
      data.serviceId,
      data.startTime,
      data.endTime,
      data.tenantId
    );

    if (!validation.valid) {
      throw new Error(`Validación fallida: ${validation.errors.join(', ')}`);
    }

    // Obtener información de precios
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });

    const staff = await prisma.user.findUnique({
      where: { id: data.staffId },
    });

    let totalPrice = service?.basePrice || 0;

    // Aplicar precio según nivel del staff
    if (staff?.level === 'SENIOR' && service?.seniorPrice) {
      totalPrice = service.seniorPrice;
    } else if (staff?.level === 'MASTER' && service?.masterPrice) {
      totalPrice = service.masterPrice;
    } else if (staff?.level === 'JUNIOR' && service?.juniorPrice) {
      totalPrice = service.juniorPrice;
    }

    // Obtener porcentaje de depósito
    const tenant = await prisma.tenant.findUnique({
      where: { id: data.tenantId },
    });

    const depositAmount = calculateDepositAmount(
      totalPrice,
      tenant?.depositPercentage || 25
    );

    // Crear cita
    const appointment = await prisma.appointment.create({
      data: {
        ...data,
        totalPrice,
        depositAmount,
        status: 'PENDING' as AppointmentStatus,
      },
      include: {
        client: true,
        staff: true,
        service: true,
      },
    });

    return appointment;
  }

  /**
   * Confirmar una cita (después del pago del depósito)
   */
  static async confirmAppointment(appointmentId: string) {
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'CONFIRMED' as AppointmentStatus,
        depositPaid: true,
      },
      include: {
        client: true,
        staff: true,
        service: true,
      },
    });

    return appointment;
  }

  /**
   * Cancelar una cita
   */
  static async cancelAppointment(appointmentId: string) {
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'CANCELLED' as AppointmentStatus,
      },
      include: {
        client: true,
        staff: true,
        service: true,
      },
    });

    return appointment;
  }
}
