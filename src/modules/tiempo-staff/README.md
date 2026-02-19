# Módulo: Gestión de Tiempo y Staff

Este módulo gestiona la operación diaria del salón, incluyendo:

## Características Principales

### 1. Calendario Dinámico
- Vista diaria por columnas (empleados)
- Intervalos configurables
- Visualización de disponibilidad en tiempo real

### 2. Niveles de Staff
- Clasificación: Junior, Senior, Master
- Precios diferenciados por nivel
- Cálculo automático de comisiones

### 3. Motor de Disponibilidad
- Bloqueo automático por hora de comida
- Gestión de vacaciones e incapacidades
- Buffer Time: Tiempo de limpieza entre citas

## Estructura de Carpetas

```
tiempo-staff/
├── components/          # Componentes React
├── services/           # Lógica de negocio
├── hooks/              # Custom React hooks
├── types/              # Tipos TypeScript
└── README.md
```

## API Endpoints

- `GET /api/tiempo-staff/appointments` - Obtener citas
- `POST /api/tiempo-staff/appointments` - Crear cita
- `PUT /api/tiempo-staff/appointments/:id` - Actualizar cita
- `DELETE /api/tiempo-staff/appointments/:id` - Cancelar cita
- `GET /api/tiempo-staff/availability` - Obtener disponibilidad
- `GET /api/tiempo-staff/staff` - Listar staff

## Reglas de Negocio

1. No se puede asignar una cita a un empleado sin la especialidad requerida
2. Validación de horarios de comida
3. Respeto del buffer time entre citas
4. Bloqueo automático por incapacidades
