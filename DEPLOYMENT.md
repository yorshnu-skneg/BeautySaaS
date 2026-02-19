# Guía de Deployment - BeautySaaS

Esta guía describe cómo desplegar BeautySaaS en diferentes plataformas.

## Requisitos Previos

- Node.js 18+
- PostgreSQL 14+
- Cuenta en Vercel, AWS, o tu proveedor preferido
- Variables de entorno configuradas

## Deployment en Vercel (Recomendado)

Vercel es la plataforma recomendada para Next.js.

### Pasos

1. **Conectar repositorio**
   - Ve a [vercel.com](https://vercel.com)
   - Haz clic en "New Project"
   - Selecciona tu repositorio de GitHub

2. **Configurar variables de entorno**
   - En Vercel, ve a Settings → Environment Variables
   - Agrega todas las variables de `.env.example`

3. **Configurar base de datos**
   - Crea una instancia de PostgreSQL (Vercel Postgres, AWS RDS, etc.)
   - Actualiza `DATABASE_URL` en variables de entorno

4. **Deploy**
   - Vercel deployará automáticamente en cada push a main

### Configuración de Dominio Personalizado

```bash
# En Vercel Settings → Domains
# Agrega tu dominio personalizado
# Vercel proporcionará registros DNS
```

## Deployment en AWS

### EC2 + RDS

1. **Crear instancia EC2**
   ```bash
   # Conectar a la instancia
   ssh -i your-key.pem ec2-user@your-instance-ip
   
   # Instalar Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Instalar pnpm
   npm install -g pnpm
   ```

2. **Clonar y configurar**
   ```bash
   git clone https://github.com/yorshnu-skneg/BeautySaaS.git
   cd beautysaas
   pnpm install
   cp .env.example .env.local
   # Editar .env.local con credenciales AWS
   ```

3. **Configurar RDS**
   - Crea una instancia RDS PostgreSQL
   - Obtén el endpoint de conexión
   - Actualiza `DATABASE_URL`

4. **Ejecutar migraciones**
   ```bash
   pnpm prisma:migrate
   ```

5. **Build y start**
   ```bash
   pnpm build
   pnpm start
   ```

6. **Configurar PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   pm2 start "pnpm start" --name "beautysaas"
   pm2 startup
   pm2 save
   ```

## Deployment en Docker

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Build
RUN pnpm build

# Exponer puerto
EXPOSE 3000

# Start
CMD ["pnpm", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  db:
    image: postgres:14
    environment:
      POSTGRES_USER: beautysaas
      POSTGRES_PASSWORD: your_password
      POSTGRES_DB: beautysaas
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://beautysaas:your_password@db:5432/beautysaas
    depends_on:
      - db
    command: sh -c "pnpm prisma:migrate && pnpm start"

volumes:
  postgres_data:
```

## Deployment en Railway

1. **Conectar repositorio**
   - Ve a [railway.app](https://railway.app)
   - Haz clic en "New Project"
   - Selecciona "Deploy from GitHub"

2. **Agregar PostgreSQL**
   - En Railway, agrega un servicio PostgreSQL
   - Railway automáticamente configura `DATABASE_URL`

3. **Configurar variables**
   - Agrega todas las variables de entorno necesarias

4. **Deploy automático**
   - Railway deployará en cada push

## Checklist Pre-Deployment

- [ ] Todas las variables de entorno configuradas
- [ ] Base de datos migrada (`pnpm prisma:migrate`)
- [ ] Tests pasando (`pnpm test`)
- [ ] Linting sin errores (`pnpm lint`)
- [ ] Build exitoso (`pnpm build`)
- [ ] Dominio personalizado configurado
- [ ] SSL/TLS habilitado
- [ ] Backups de base de datos configurados
- [ ] Monitoreo y alertas configurados
- [ ] Plan de recuperación ante desastres

## Monitoreo Post-Deployment

### Logs

```bash
# Vercel
vercel logs

# AWS EC2
tail -f /var/log/pm2/beautysaas-error.log

# Docker
docker logs -f container_name
```

### Métricas

- Configurar CloudWatch (AWS) o equivalente
- Monitorear CPU, memoria, base de datos
- Alertas para errores y latencia alta

## Scaling

### Horizontal Scaling

- Usar load balancer (AWS ALB, Nginx)
- Múltiples instancias de la aplicación
- Cache distribuido (Redis)

### Vertical Scaling

- Aumentar recursos de la instancia
- Optimizar queries de base de datos
- Implementar caching

## Seguridad

- [ ] HTTPS/TLS habilitado
- [ ] Variables de entorno no en repositorio
- [ ] Firewall configurado
- [ ] Backups regulares
- [ ] Actualizaciones de dependencias
- [ ] Auditoría de accesos

## Troubleshooting

### Error de conexión a base de datos

```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Probar conexión
psql $DATABASE_URL -c "SELECT 1"
```

### Error de build

```bash
# Limpiar cache
rm -rf .next node_modules
pnpm install
pnpm build
```

### Problemas de rendimiento

- Verificar logs de error
- Analizar queries lentas
- Implementar caching
- Considerar CDN para assets estáticos

## Rollback

```bash
# Vercel
vercel rollback

# Git
git revert <commit-hash>
git push
```

---

Para más ayuda, consulta la documentación oficial de tu plataforma de deployment.
