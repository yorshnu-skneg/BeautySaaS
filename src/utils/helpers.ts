import crypto from 'crypto';

/**
 * Hash a PIN using SHA-256
 */
export function hashPin(pin: string): string {
  return crypto.createHash('sha256').update(pin).digest('hex');
}

/**
 * Compare a plain PIN with a hashed PIN
 */
export function comparePin(pin: string, hashedPin: string): boolean {
  return hashPin(pin) === hashedPin;
}

/**
 * Generate a unique QR code for a client
 */
export function generateQRCode(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Calculate commission based on level and total price
 */
export function calculateCommission(
  totalPrice: number,
  commissionRate: number
): number {
  return (totalPrice * commissionRate) / 100;
}

/**
 * Calculate deposit amount based on total price and deposit percentage
 */
export function calculateDepositAmount(
  totalPrice: number,
  depositPercentage: number
): number {
  return (totalPrice * depositPercentage) / 100;
}

/**
 * Check if a time slot is available
 */
export function isTimeSlotAvailable(
  requestedStart: Date,
  requestedEnd: Date,
  existingAppointments: Array<{ startTime: Date; endTime: Date }>,
  bufferTimeMinutes: number = 15
): boolean {
  const bufferMs = bufferTimeMinutes * 60 * 1000;

  return !existingAppointments.some((appointment) => {
    const appointmentStart = new Date(appointment.startTime).getTime();
    const appointmentEnd = new Date(appointment.endTime).getTime();
    const requestedStartMs = requestedStart.getTime();
    const requestedEndMs = requestedEnd.getTime();

    // Check if there's any overlap considering buffer time
    return (
      requestedStartMs < appointmentEnd + bufferMs &&
      requestedEndMs + bufferMs > appointmentStart
    );
  });
}

/**
 * Format time string (HH:MM)
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Format date string (DD/MM/YYYY)
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Get loyalty tier based on points
 */
export function getLoyaltyTier(
  points: number,
  tierConfig?: { bronze: number; silver: number; gold: number }
): 'BRONZE' | 'SILVER' | 'GOLD' {
  const config = tierConfig || { bronze: 0, silver: 500, gold: 1000 };

  if (points >= config.gold) return 'GOLD';
  if (points >= config.silver) return 'SILVER';
  return 'BRONZE';
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate PIN format (4 digits)
 */
export function isValidPin(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}
