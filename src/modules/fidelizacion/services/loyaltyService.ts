import prisma from '@/lib/prisma';
import { getLoyaltyTier, LoyaltyTier } from '@/utils/helpers';

export class LoyaltyService {
  /**
   * Agregar puntos a un cliente
   */
  static async addPoints(clientId: string, points: number) {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new Error('Cliente no encontrado');
    }

    const newPoints = client.loyaltyPoints + points;
    const newTier = getLoyaltyTier(newPoints);

    const updated = await prisma.client.update({
      where: { id: clientId },
      data: {
        loyaltyPoints: newPoints,
        loyaltyTier: newTier,
      },
    });

    return updated;
  }

  /**
   * Canjear puntos
   */
  static async redeemPoints(clientId: string, pointsToRedeem: number) {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new Error('Cliente no encontrado');
    }

    if (client.loyaltyPoints < pointsToRedeem) {
      throw new Error('Puntos insuficientes');
    }

    const newPoints = client.loyaltyPoints - pointsToRedeem;
    const newTier = getLoyaltyTier(newPoints);

    const updated = await prisma.client.update({
      where: { id: clientId },
      data: {
        loyaltyPoints: newPoints,
        loyaltyTier: newTier,
      },
    });

    return updated;
  }

  /**
   * Obtener configuración de tiers de un negocio
   */
  static async getTierConfiguration(tenantId: string) {
    const tiers = await prisma.loyaltyRule.findMany({
      where: { tenantId },
      orderBy: {
        minPoints: 'asc',
      },
    });

    return tiers;
  }

  /**
   * Actualizar configuración de tier
   */
  static async updateTierConfiguration(
    tenantId: string,
    tier: 'BRONZE' | 'SILVER' | 'GOLD',
    data: {
      minPoints?: number;
      maxPoints?: number;
      discount?: number;
      benefits?: string[];
    }
  ) {
    const existing = await prisma.loyaltyRule.findUnique({
      where: {
        tenantId_tier: {
          tenantId,
          tier,
        },
      },
    });

    if (existing) {
      return await prisma.loyaltyRule.update({
        where: { id: existing.id },
        data,
      });
    } else {
      return await prisma.loyaltyRule.create({
        data: {
          tenantId,
          tier,
          minPoints: data.minPoints || 0,
          maxPoints: data.maxPoints,
          discount: data.discount,
          benefits: data.benefits || [],
        },
      });
    }
  }

  /**
   * Obtener beneficios del cliente según su tier
   */
  static async getClientBenefits(clientId: string) {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        tenant: true,
      },
    });

    if (!client) {
      throw new Error('Cliente no encontrado');
    }

    const tierConfig = await prisma.loyaltyRule.findUnique({
      where: {
        tenantId_tier: {
          tenantId: client.tenantId,
          tier: client.loyaltyTier,
        },
      },
    });

    return {
      client,
      tier: client.loyaltyTier,
      points: client.loyaltyPoints,
      benefits: tierConfig?.benefits || [],
      discount: tierConfig?.discount || 0,
    };
  }

  /**
   * Obtener estadísticas de lealtad del negocio
   */
  static async getLoyaltyStats(tenantId: string) {
    const clients = await prisma.client.findMany({
      where: { tenantId },
    });

    const stats = {
      totalClients: clients.length,
      byTier: {
        BRONZE: 0,
        SILVER: 0,
        GOLD: 0,
      },
      averagePoints: 0,
      totalPoints: 0,
    };

    clients.forEach((client) => {
      stats.byTier[client.loyaltyTier]++;
      stats.totalPoints += client.loyaltyPoints;
    });

    stats.averagePoints =
      clients.length > 0 ? stats.totalPoints / clients.length : 0;

    return stats;
  }

  /**
   * Generar recomendaciones de IA (después de 90 días)
   */
  static async generateAIRecommendations(tenantId: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new Error('Negocio no encontrado');
    }

    // Verificar si tiene al menos 90 días de operación
    const createdDate = new Date(tenant.createdAt);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    if (createdDate > ninetyDaysAgo) {
      return {
        available: false,
        message: 'Se requieren 90 días de datos para generar recomendaciones',
        daysRemaining: Math.ceil(
          (createdDate.getTime() - ninetyDaysAgo.getTime()) / (1000 * 60 * 60 * 24)
        ),
      };
    }

    // Obtener datos históricos
    const appointments = await prisma.appointment.findMany({
      where: {
        tenantId,
        status: 'COMPLETED',
      },
      include: {
        client: true,
        service: true,
      },
    });

    // Análisis básico
    const totalRevenue = appointments.reduce((sum, a) => sum + a.totalPrice, 0);
    const averageTicket = totalRevenue / appointments.length;
    const loyaltyStats = await this.getLoyaltyStats(tenantId);

    // Generar recomendaciones
    const recommendations = [];

    if (loyaltyStats.byTier.GOLD === 0) {
      recommendations.push({
        type: 'TIER_STRATEGY',
        title: 'Activar tier Gold',
        description: 'No hay clientes en tier Gold. Considera ajustar los requisitos.',
        priority: 'MEDIUM',
      });
    }

    if (loyaltyStats.averagePoints < 100) {
      recommendations.push({
        type: 'POINTS_STRATEGY',
        title: 'Aumentar puntos por gasto',
        description: 'El promedio de puntos es bajo. Considera aumentar la tasa de puntos.',
        priority: 'HIGH',
      });
    }

    if (averageTicket < 50) {
      recommendations.push({
        type: 'PRICING_STRATEGY',
        title: 'Revisar precios',
        description: 'El ticket promedio es bajo. Considera servicios premium o combos.',
        priority: 'MEDIUM',
      });
    }

    return {
      available: true,
      dataPoints: appointments.length,
      totalRevenue,
      averageTicket,
      loyaltyStats,
      recommendations,
    };
  }
}
