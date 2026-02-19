# Módulo: CRM Médico y Estético

Este módulo gestiona los datos médicos y estéticos de los clientes.

## Características Principales

### 1. Expediente Digital
- Ficha de salud con alertas críticas
- Registro de alergias (tintes, químicos, etc.)
- Historial médico completo
- Acceso controlado por PIN

### 2. Historial Visual
- Galería Antes/Después
- Fotos de servicios realizados
- Progreso visual del cliente

### 3. Check-in Rápido
- Escaneo de QR único del cliente
- Apertura instantánea de expediente en tablet
- Sin contacto

### 4. Perfil Editable
- Cliente puede actualizar datos médicos
- Gestión de alergias
- Actualización de preferencias

## Estructura de Carpetas

```
crm-medico/
├── components/          # Componentes React
├── services/           # Lógica de negocio
├── hooks/              # Custom React hooks
├── types/              # Tipos TypeScript
└── README.md
```

## API Endpoints

- `GET /api/crm-medico/clients/:id` - Obtener expediente
- `PUT /api/crm-medico/clients/:id` - Actualizar expediente
- `GET /api/crm-medico/clients/:id/photos` - Fotos antes/después
- `POST /api/crm-medico/clients/:id/photos` - Agregar foto
- `POST /api/crm-medico/check-in` - Check-in por QR

## Seguridad

- Datos médicos solo visibles con sesión PIN activa
- Encriptación de datos sensibles
- Auditoría de accesos
- Cumplimiento HIPAA/GDPR
