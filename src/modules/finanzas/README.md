# Módulo: Finanzas y Revenue Management

Este módulo gestiona todos los aspectos financieros de la plataforma.

## Características Principales

### 1. Depósito Obligatorio
- Configuración de anticipo (default 25%)
- Confirmación de citas vía web
- Validación de depósitos

### 2. Rastreo de Depósitos
- Vinculación exacta: ID_Pago -> Cita -> Empleado
- Historial de pagos
- Conciliación automática

### 3. Cierre de Caja
- Conciliación de ingresos digitales vs. pagos físicos
- Reporte diario de caja
- Exportación de reportes

### 4. Recuperación de Carritos
- Notificación automática por abandono
- Recordatorio de pago pendiente
- Integración con WhatsApp

## Estructura de Carpetas

```
finanzas/
├── components/          # Componentes React
├── services/           # Lógica de negocio
├── hooks/              # Custom React hooks
├── types/              # Tipos TypeScript
└── README.md
```

## API Endpoints

- `GET /api/finanzas/payments` - Obtener pagos
- `POST /api/finanzas/payments` - Crear pago
- `GET /api/finanzas/deposits` - Obtener depósitos
- `GET /api/finanzas/cash-close` - Cierre de caja
- `GET /api/finanzas/reports` - Reportes financieros

## Integraciones

- **Stripe Connect**: Procesamiento de pagos y split
- **Twilio**: Notificaciones de abandono
- **Email**: Confirmaciones de pago
