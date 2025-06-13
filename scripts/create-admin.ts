import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { join } from 'path';

// Cargar variables de entorno según el NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';
config({ path: join(process.cwd(), envFile) });

console.log(`📄 Cargando configuración desde: ${envFile}`);

const prisma = new PrismaClient();

interface AdminData {
  email: string;
  password: string;
  name?: string;
}

async function createAdmin(adminData: AdminData) {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existingUser) {
      console.error(`❌ Error: El usuario con email ${adminData.email} ya existe`);
      process.exit(1);
    }

    // Hash de la contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

    // Crear el usuario admin
    const newAdmin = await prisma.user.create({
      data: {
        email: adminData.email,
        password: hashedPassword,
        name: adminData.name || adminData.email.split('@')[0],
        superAdmin: true,
        isDeleted: false,
      },
    });

    console.log('✅ Administrador creado exitosamente:');
    console.log(`   📧 Email: ${newAdmin.email}`);
    console.log(`   👤 Nombre: ${newAdmin.name}`);
    console.log(`   🔑 ID: ${newAdmin.id}`);
    console.log(`   🛡️  Super Admin: ${newAdmin.superAdmin ? 'Sí' : 'No'}`);
    console.log(`   📅 Creado: ${newAdmin.createdAt.toLocaleString()}`);
  } catch (error) {
    console.error('❌ Error al crear el administrador:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

function printUsage() {
  console.log('📖 Uso del script:');
  console.log('   npm run create:admin <email> <password> [nombre]');
  console.log('');
  console.log('📝 Ejemplos:');
  console.log('   npm run create:admin admin@mitienda.com miPassword123');
  console.log('   npm run create:admin admin@mitienda.com miPassword123 "Juan Pérez"');
  console.log('');
  console.log('📋 Requisitos:');
  console.log('   - Email válido y único');
  console.log('   - Contraseña segura (mínimo 8 caracteres)');
  console.log('   - Nombre (opcional, se usará el email si no se proporciona)');
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password: string): boolean {
  // Mínimo 8 caracteres
  return password.length >= 8;
}

async function main() {
  const args = process.argv.slice(2);

  // Verificar argumentos
  if (args.length < 2) {
    console.error('❌ Error: Se requieren al menos 2 argumentos (email y password)');
    console.log('');
    printUsage();
    process.exit(1);
  }

  const [email, password, name] = args;

  // Validar email
  if (!validateEmail(email)) {
    console.error('❌ Error: Email inválido');
    console.log('   El email debe tener un formato válido (ejemplo@dominio.com)');
    process.exit(1);
  }

  // Validar contraseña
  if (!validatePassword(password)) {
    console.error('❌ Error: Contraseña inválida');
    console.log('   La contraseña debe tener al menos 8 caracteres');
    process.exit(1);
  }

  console.log('🚀 Creando administrador...');
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(
    `🔗 Base de datos: ${process.env.DATABASE_URL?.includes('localhost') ? 'Local' : 'Remota'}`
  );
  console.log('');

  await createAdmin({
    email,
    password,
    name: name || undefined,
  });
}

main();
