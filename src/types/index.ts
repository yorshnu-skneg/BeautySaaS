// Common types for BeautySaaS

export type Vertical = 'BARBER' | 'SPA' | 'NAILS' | 'HAIR' | 'AESTHETIC';
export type Role = 'ADMIN' | 'STAFF' | 'CLIENT';
export type Level = 'JUNIOR' | 'SENIOR' | 'MASTER';
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CHECK_IN' | 'COMPLETED' | 'CANCELLED';
export type LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  vertical: Vertical;
  email: string;
  phone?: string;
  logo?: string;
  depositPercentage: number;
  bufferTime: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  role: Role;
  level: Level;
  firstName: string;
  lastName: string;
  phone?: string;
  skills: string[];
  lunchTimeStart?: string;
  lunchTimeEnd?: string;
  commissionRate: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  tenantId: string;
  qrCode: string;
  email?: string;
  phone?: string;
  firstName: string;
  lastName: string;
  medicalNotes?: string;
  allergies: string[];
  loyaltyPoints: number;
  loyaltyTier: LoyaltyTier;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  durationMinutes: number;
  basePrice: number;
  juniorPrice?: number;
  seniorPrice?: number;
  masterPrice?: number;
  category?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  tenantId: string;
  clientId: string;
  staffId: string;
  serviceId: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  depositPaid: boolean;
  depositAmount?: number;
  totalPrice: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  tenantId: string;
  clientId: string;
  appointmentId?: string;
  amount: number;
  type: string;
  stripePaymentId?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
