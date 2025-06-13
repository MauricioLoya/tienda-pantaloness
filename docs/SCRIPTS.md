# 🛠️ Scripts de Administración

## 📁 Archivos de Entorno

Este proyecto utiliza diferentes archivos de entorno según el modo de ejecución:

- **`.env.local`** - Desarrollo local (no se commitea)
- **`.env.production`** - Configuración de producción (se commitea)
- **`.env.example`** - Plantilla de ejemplo (se commitea)

## 🚀 Scripts Disponibles

### Desarrollo (usa .env.local automáticamente)

```bash
# Ejecutar aplicación en desarrollo
npm run dev

# Crear administrador en desarrollo
npm run create:admin admin@dev.com password123
npm run create:admin admin@dev.com password123 "Juan Pérez"
```

### Producción (usa .env.production explícitamente)

```bash
# Ejecutar aplicación con configuración de producción
npm run dev:prod

# Compilar para producción
npm run build:prod

# Ejecutar en producción
npm run start:prod

# Crear administrador en producción
npm run create:admin:prod admin@prod.com securePassword123
npm run create:admin:prod admin@prod.com securePassword123 "Administrador Principal"
```

## 🗃️ Scripts de Base de Datos (Prisma)

### Desarrollo (usa .env.local)

```bash
# Generar cliente de Prisma
npm run db:generate

# Ejecutar migraciones en desarrollo
npm run db:migrate

# Ver estado de migraciones
npm run db:migrate:status

# Resetear base de datos de desarrollo
npm run db:reset

# Abrir Prisma Studio (desarrollo)
npm run db:studio

# Ejecutar seeders (desarrollo)
npm run db:seed
```

### Producción (usa .env.production)

```bash
# Ejecutar migraciones en producción
npm run db:migrate:prod

# Ver estado de migraciones en producción
npm run db:migrate:status:prod

# Resetear base de datos de producción (¡CUIDADO!)
npm run db:reset:prod

# Abrir Prisma Studio (producción)
npm run db:studio:prod

# Ejecutar seeders (producción)
npm run db:seed:prod
```

### 📊 Comando Status - Qué te muestra:

El comando `migrate status` te dice:

- ✅ **Migraciones aplicadas**: Cuáles ya están en la BD
- ⏳ **Migraciones pendientes**: Cuáles faltan por aplicar
- ❌ **Migraciones faltantes**: Si hay archivos que no existen
- 📁 **Ubicación**: Dónde están los archivos de migración
- 🔗 **Conexión**: A qué base de datos está conectado

### Ejemplo de salida:

```bash
Status
3 migrations found in prisma/migrations

Following migration have not yet been applied:
20250612_add_user_preferences

Your database is 1 migration(s) behind
```

### ⚠️ Comandos Importantes de Prisma

```bash
# Crear nueva migración
npm run db:migrate
# Esto crea un archivo de migración en prisma/migrations/

# Aplicar migraciones pendientes en producción
npm run db:migrate:prod
# Este comando aplica migraciones SIN crear nuevas

# Ver estado de migraciones
npx prisma migrate status
NODE_ENV=production npx prisma migrate status
```

## 🔄 Flujo de Trabajo Recomendado

### Para Desarrollo:

1. Modificar `schema.prisma`
2. Ejecutar `npm run db:migrate` (crea migración)
3. Probar cambios con `npm run db:studio`

### Para Producción:

1. Commitear migraciones del desarrollo
2. En servidor: `npm run db:migrate:prod` (aplica migraciones)
3. Verificar con `npm run db:studio:prod`

## 🔧 Script create:admin

### Funcionalidades

- ✅ Validación de email
- ✅ Validación de contraseña (mínimo 8 caracteres)
- ✅ Hash seguro de contraseña (bcrypt con 12 rounds)
- ✅ Verificación de usuario existente
- ✅ Creación de Super Admin automáticamente
- ✅ Detección automática de entorno
- ✅ Información detallada de la base de datos conectada

### Uso

```bash
npm run create:admin <email> <password> [nombre]
```

### Ejemplos

```bash
# Desarrollo (automático)
npm run create:admin admin@mitienda.com miPassword123

# Producción (explícito)
npm run create:admin:prod admin@mitienda.com securePassword456

# Con nombre personalizado
npm run create:admin admin@mitienda.com miPassword123 "Juan Pérez"
```

### Salida del Script

```
📄 Cargando configuración desde: .env.local
🚀 Creando administrador...
🌍 Entorno: development
🔗 Base de datos: Remota

✅ Administrador creado exitosamente:
   📧 Email: admin@mitienda.com
   👤 Nombre: admin
   🔑 ID: 1
   🛡️  Super Admin: Sí
   📅 Creado: 12/6/2025, 7:31:00 PM
```

## ⚙️ Configuración de Entornos

### Para Desarrollo Local

1. Copia `.env.example` a `.env.local`
2. Configura tus credenciales de desarrollo
3. Ejecuta `npm run dev`

### Para Producción

1. Edita `.env.production` con las credenciales reales
2. Ejecuta `npm run create:admin:prod` para crear administradores
3. Despliega con `npm run build:prod && npm run start:prod`

## 🔒 Seguridad

- ❌ **Nunca commitees** `.env.local` (contiene credenciales locales)
- ✅ **Sí commitea** `.env.production` (template, sin datos sensibles reales)
- ✅ **Sí commitea** `.env.example` (documentación)
- 🔐 **En producción real**, sobrescribe las variables sensibles en el servidor

## 📋 Variables de Entorno Requeridas

```bash
NODE_ENV=development|production
DATABASE_URL="postgresql://user:pass@host:port/db"
NEXTAUTH_URL="http://localhost:3000/"
AUTH_SECRET="your_secret_here"
APP_URL="http://localhost:3000/"
STRIPE_SECRET_KEY="sk_test_or_live_key"
STRIPE_PUBLIC_KEY="pk_test_or_live_key"
STRIPE_WEBHOOK_SECRET="whsec_your_secret"
RESEND_API_KEY="re_your_key"
```
