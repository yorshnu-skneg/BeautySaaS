import prisma from '@/lib/prisma';

export class PaymentService {
  /**
   * Crear un pago de depósito
   */
  static async createDepositPayment(data: {
    tenantId: string;
    clientId: string;
    appointmentId: string;
    amount: number;
    stripePaymentId?: string;
  }) {
    const payment = await prisma.payment.create({
      data: {
        ...data,
        type: 'DEPOSIT',
        status: 'completed',
      },
    });

    // Actualizar cita con depósito pagado
    await prisma.appointment.update({
      where: { id: data.appointmentId },
      data: {
        depositPaid: true,
        status: 'CONFIRMED',
      },
    });

    return payment;
  }

  /**
   * Crear un pago completo
   */
  static async createFullPayment(data: {
    tenantId: string;
    clientId: string;
    appointmentId?: string;
    amount: number;
    stripePaymentId?: string;
  }) {
    const payment = await prisma.payment.create({
      data: {
        ...data,
        type: 'FULL_PAYMENT',
        status: 'completed',
      },
    });

    return payment;
  }

  /**
   * Procesar reembolso por cancelación
   */
  static async processRefund(appointmentId: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { payment: true },
    });

    if (!appointment) {
      throw new Error('Cita no encontrada');
    }

    if (!appointment.depositPaid) {
      throw new Error('No hay depósito para reembolsar');
    }

    // Crear registro de reembolso
    const refund = await prisma.payment.create({
      data: {
        tenantId: appointment.tenantId,
        clientId: appointment.clientId,
        appointmentId,
        amount: -(appointment.depositAmount || 0),
        type: 'PENALTY_REFUND',
        status: 'completed',
      },
    });

    return refund;
  }

  /**
   * Obtener resumen de pagos para cierre de caja
   */
  static async getCashCloseSummary(tenantId: string, date: Date) {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    // Obtener pagos del día
    const payments = await prisma.payment.findMany({
      where: {
        tenantId,
        createdAt: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
      include: {
        appointment: true,
        client: true,
      },
    });

    // Calcular totales
    const summary = {
      totalDeposits: 0,
      totalFullPayments: 0,
      totalRefunds: 0,
      transactionCount: payments.length,
      paymentsByType: {} as Record<string, number>,
    };

    payments.forEach((payment) => {
      if (payment.type === 'DEPOSIT') {
        summary.totalDeposits += payment.amount;
      } else if (payment.type === 'FULL_PAYMENT') {
        summary.totalFullPayments += payment.amount;
      } else if (payment.type === 'PENALTY_REFUND') {
        summary.totalRefunds += Math.abs(payment.amount);
      }

      summary.paymentsByType[payment.type] =
        (summary.paymentsByType[payment.type] || 0) + 1;
    });

    return {
      date,
      summary,
      payments,
    };
  }

  /**
   * Obtener historial de pagos de un cliente
   */
  static async getClientPaymentHistory(clientId: string) {
    const payments = await prisma.payment.findMany({
      where: { clientId },
      include: {
        appointment: {
          include: {
            service: true,
            staff: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return payments;
  }

  /**
   * Obtener comisiones de un empleado
   */
  static async getStaffCommissions(staffId: string, month?: Date) {
    let where: any = {
      staffId,
    };

    if (month) {
      const monthStart = new Date(month);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);

      where.createdAt = {
        gte: monthStart,
        lt: monthEnd,
      };
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        ...where,
        status: 'COMPLETED',
      },
      include: {
        staff: true,
        service: true,
      },
    });

    let totalCommissions = 0;
    appointments.forEach((appointment) => {
      const commission = (appointment.totalPrice * appointment.staff.commissionRate) / 100;
      totalCommissions += commission;
    });

    return {
      staffId,
      period: month,
      appointmentCount: appointments.length,
      totalRevenue: appointments.reduce((sum, a) => sum + a.totalPrice, 0),
      totalCommissions,
      appointments,
    };
  }
}
