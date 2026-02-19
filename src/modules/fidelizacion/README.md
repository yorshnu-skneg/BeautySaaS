# Módulo: Sistema de Fidelización (Rewards)

Este módulo gestiona el programa de lealtad y recompensas de cada negocio.

## Características Principales

### 1. Motor Configurable
- Cada negocio define sus rangos de puntos
- Configuración de puntos por gasto
- Reglas de canje personalizables
- Beneficios por tier

### 2. Niveles de Lealtad
- Tiers: Bronce, Plata, Oro
- Beneficios automáticos por nivel
- Promociones exclusivas
- Acceso a servicios premium

### 3. IA de Optimización
- Análisis de datos históricos (post-90 días)
- Sugerencias de modelo de recompensas
- Optimización según margen del salón
- Recomendaciones de precios

## Estructura de Carpetas

```
fidelizacion/
├── components/          # Componentes React
├── services/           # Lógica de negocio
├── hooks/              # Custom React hooks
├── types/              # Tipos TypeScript
├── ai/                 # Motor de IA
└── README.md
```

## API Endpoints

- `GET /api/fidelizacion/clients/:id/points` - Obtener puntos
- `POST /api/fidelizacion/clients/:id/redeem` - Canjear puntos
- `GET /api/fidelizacion/tiers` - Obtener configuración de tiers
- `PUT /api/fidelizacion/tiers/:tier` - Actualizar tier
- `GET /api/fidelizacion/ai/recommendations` - Recomendaciones IA

## Reglas de Negocio

- Puntos se acumulan automáticamente por gasto
- Cambio de tier es automático al alcanzar puntos
- Puntos no expiran (configurable)
- Recomendaciones IA solo después de 90 días de datos
