# BeautySaaS - Plataforma de Gestión 360° para Salones y Bienestar

Una plataforma integral SaaS Multi-tenant diseñada para profesionalizar la operación de estéticas, barberías, spas y estudios de uñas. El sistema garantiza la rentabilidad mediante depósitos obligatorios, protege al cliente mediante historiales médicos digitales y escala el negocio a través de una IA consultora de lealtad.

## 🚀 Características Principales

### 📅 Gestión de Tiempo y Staff
- **Calendario Dinámico**: Vista diaria por columnas (empleados) con intervalos configurables
- **Niveles de Staff**: Clasificación (Junior, Senior, Master) con precios diferenciados y cálculo automático de comisiones
- **Motor de Disponibilidad**: Bloqueo automático por hora de comida, gestión de vacaciones e incapacidades, buffer time configurable

### 💰 Finanzas y Revenue Management
- **Depósito Obligatorio**: Configuración de anticipo (default 25%) para confirmar citas vía web
- **Rastreo de Depósitos**: Vinculación exacta de ID_Pago → Cita → Empleado
- **Cierre de Caja**: Conciliación de ingresos digitales vs. pagos físicos
- **Recuperación de Carritos**: Notificación automática si el cliente abandona el flujo de pago

### 🏥 CRM Médico y Estético
- **Expediente Digital**: Ficha de salud con alertas críticas (alergias a tintes, químicos, etc.)
- **Historial Visual**: Galería Antes/Después
- **Check-in Rápido**: Escaneo de QR único para apertura instantánea de expediente en tablet
- **Perfil Editable**: Cliente puede actualizar datos médicos

### 🎁 Sistema de Fidelización (Rewards)
- **Motor Configurable**: Cada negocio define rangos, puntos por gasto y reglas de canje
- **Niveles de Lealtad**: Tiers (Bronce, Plata, Oro) con beneficios automáticos
- **IA de Optimización**: Análisis post-90 días para sugerir el modelo de recompensas más rentable

## 🛠️ Stack Tecnológico

| Componente | Tecnología |
|-----------|-----------|
| **Frontend** | Next.js 14+ (App Router), React 18, TypeScript |
| **Styling** | Tailwind CSS |
| **Base de Datos** | PostgreSQL con Prisma ORM |
| **Autenticación** | JWT + PIN (4 dígitos) |
| **Pagos** | Stripe Connect (Split de pagos) |
| **Comunicaciones** | WhatsApp Business API (Twilio) |
| **Almacenamiento** | AWS S3 (fotos y documentos) |
| **IA** | OpenAI API (optimización de rewards) |

## 📁 Estructura del Proyecto

```
beautysaas/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/                   # Componentes reutilizables
│   ├── modules/                      # Módulos principales
│   │   ├── tiempo-staff/             # Gestión de tiempo y staff
│   │   ├── finanzas/                 # Finanzas y pagos
│   │   ├── crm-medico/               # CRM médico y estético
│   │   └── fidelizacion/             # Sistema de rewards
│   ├── api/                          # API Routes
│   ├── lib/                          # Utilidades (Prisma, etc.)
│   ├── utils/                        # Funciones auxiliares
│   ├── types/                        # Tipos TypeScript
│   ├── services/                     # Servicios de negocio
│   ├── hooks/                        # Custom React hooks
│   └── middleware/                   # Middlewares
├── prisma/
│   ├── schema.prisma                 # Esquema de base de datos
│   └── migrations/                   # Migraciones
├── public/                           # Archivos estáticos
├── .env.example                      # Variables de entorno
├── .gitignore
├── .eslintrc.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## 🗄️ Esquema de Base de Datos

### Modelos Principales

**Tenant**: Representa cada negocio en la plataforma
- `id`, `name`, `slug`, `vertical`, `email`, `phone`, `logo`
- `configRewards`, `depositPercentage`, `bufferTime`

**User**: Empleados del salón
- `id`, `tenantId`, `email`, `pin`, `role`, `level`
- `firstName`, `lastName`, `phone`, `skills`, `lunchTimeStart`, `lunchTimeEnd`
- `commissionRate`, `isActive`

**Client**: Clientes del salón
- `id`, `tenantId`, `qrCode`, `email`, `phone`
- `firstName`, `lastName`, `medicalNotes`, `allergies`
- `loyaltyPoints`, `loyaltyTier`, `profileImage`

**Appointment**: Citas programadas
- `id`, `tenantId`, `clientId`, `staffId`, `serviceId`
- `startTime`, `endTime`, `status`, `depositPaid`, `totalPrice`

**Payment**: Registro de pagos
- `id`, `tenantId`, `clientId`, `appointmentId`
- `amount`, `type`, `stripePaymentId`, `status`

**Service**: Servicios ofrecidos
- `id`, `tenantId`, `name`, `description`, `durationMinutes`
- `basePrice`, `juniorPrice`, `seniorPrice`, `masterPrice`

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js 18+ y pnpm
- PostgreSQL 14+
- Cuenta en Stripe, Twilio y AWS

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/yorshnu-skneg/BeautySaaS.git
cd beautysaas
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
# Editar .env.local con tus credenciales
```

4. **Configurar base de datos**
```bash
pnpm prisma:migrate
pnpm prisma:generate
```

5. **Ejecutar en desarrollo**
```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📚 Documentación de Módulos

### Tiempo y Staff
Consulta `src/modules/tiempo-staff/README.md` para detalles sobre:
- Calendario dinámico
- Gestión de niveles
- Motor de disponibilidad

### Finanzas
Consulta `src/modules/finanzas/README.md` para detalles sobre:
- Depósitos obligatorios
- Rastreo de pagos
- Cierre de caja

### CRM Médico
Consulta `src/modules/crm-medico/README.md` para detalles sobre:
- Expediente digital
- Check-in por QR
- Seguridad de datos

### Fidelización
Consulta `src/modules/fidelizacion/README.md` para detalles sobre:
- Motor de rewards
- Niveles de lealtad
- IA de optimización

## 🔒 Seguridad y Privacidad

- **Datos Médicos**: Solo visibles con sesión PIN activa
- **Encriptación**: SHA-256 para PINs, TLS para transmisión
- **Auditoría**: Registro de accesos a datos sensibles
- **Cumplimiento**: GDPR y regulaciones de privacidad

## 📊 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión con PIN
- `POST /api/auth/logout` - Cerrar sesión

### Citas
- `GET /api/appointments` - Listar citas
- `POST /api/appointments` - Crear cita
- `PUT /api/appointments/:id` - Actualizar cita
- `DELETE /api/appointments/:id` - Cancelar cita

### Clientes
- `GET /api/clients` - Listar clientes
- `GET /api/clients/:id` - Obtener cliente
- `PUT /api/clients/:id` - Actualizar cliente

### Pagos
- `GET /api/payments` - Listar pagos
- `POST /api/payments` - Crear pago
- `GET /api/payments/:id` - Obtener pago

## 🧪 Testing

```bash
# Ejecutar tests
pnpm test

# Coverage
pnpm test:coverage
```

## 📦 Build y Deployment

```bash
# Build para producción
pnpm build

# Iniciar servidor de producción
pnpm start
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte, contacta a support@beautysaas.com o abre un issue en GitHub.

## 🗺️ Roadmap

- [ ] Integración completa con Stripe Connect
- [ ] Motor de IA para optimización de rewards
- [ ] Aplicación móvil (React Native)
- [ ] Sincronización offline para tablets
- [ ] Integración WhatsApp Business API
- [ ] Dashboard de analytics
- [ ] Exportación de reportes (PDF/Excel)
- [ ] Soporte multi-idioma

## 👥 Autores

- **Equipo BeautySaaS** - Desarrollo inicial

---

**Última actualización**: Febrero 2024

Para más información, visita [beautysaas.com](https://beautysaas.com)
