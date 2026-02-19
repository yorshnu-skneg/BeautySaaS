# Guía de Contribución - BeautySaaS

¡Gracias por tu interés en contribuir a BeautySaaS! Este documento proporciona directrices y procedimientos para contribuir al proyecto.

## Código de Conducta

Por favor, sé respetuoso y profesional en todas las interacciones. Esperamos que todos los contribuyentes se adhieran a nuestro código de conducta.

## Cómo Contribuir

### Reportar Bugs

Antes de crear un reporte de bug, verifica la lista de issues para asegurarte de que el problema no haya sido reportado. Si encuentras un bug:

1. Usa un título descriptivo
2. Describe los pasos exactos para reproducir el problema
3. Proporciona ejemplos específicos para demostrar los pasos
4. Describe el comportamiento observado y qué esperabas ver
5. Incluye capturas de pantalla si es relevante

### Sugerir Mejoras

Las sugerencias de mejora son siempre bienvenidas. Para sugerir una mejora:

1. Usa un título descriptivo
2. Proporciona una descripción detallada de la mejora sugerida
3. Explica por qué sería útil
4. Lista algunos ejemplos de cómo funcionaría

### Pull Requests

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

#### Directrices para Pull Requests

- Sigue el estilo de código del proyecto
- Incluye comentarios apropiados en el código
- Actualiza la documentación si es necesario
- Asegúrate de que los tests pasen
- Proporciona una descripción clara de los cambios

## Estilo de Código

### TypeScript

- Usa tipos explícitos siempre que sea posible
- Evita `any` a menos que sea absolutamente necesario
- Usa interfaces para objetos complejos

### React

- Usa componentes funcionales con hooks
- Mantén los componentes pequeños y enfocados
- Usa nombres descriptivos para componentes

### Naming Conventions

- Archivos de componentes: PascalCase (e.g., `UserCard.tsx`)
- Archivos de utilidades: camelCase (e.g., `helpers.ts`)
- Variables y funciones: camelCase
- Constantes: UPPER_SNAKE_CASE

## Proceso de Desarrollo

### Setup Local

```bash
# Clonar repositorio
git clone https://github.com/yorshnu-skneg/BeautySaaS.git
cd beautysaas

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
pnpm dev
```

### Testing

```bash
# Ejecutar tests
pnpm test

# Coverage
pnpm test:coverage
```

### Linting

```bash
# Ejecutar linter
pnpm lint

# Arreglar errores automáticamente
pnpm lint --fix
```

## Estructura de Commits

Usa commits semánticos:

- `feat:` Nueva característica
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan código)
- `refactor:` Refactorización de código
- `perf:` Mejoras de rendimiento
- `test:` Agregar o actualizar tests

Ejemplo: `feat: agregar validación de PIN para login de staff`

## Preguntas

Si tienes preguntas, puedes:

1. Abrir una issue con la etiqueta `question`
2. Contactar al equipo de desarrollo
3. Revisar la documentación existente

## Licencia

Al contribuir, aceptas que tus contribuciones se licencien bajo la misma licencia MIT del proyecto.

---

¡Gracias por contribuir a BeautySaaS! 🎉
