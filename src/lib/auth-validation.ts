import { auth } from '@/app/auth';
import { ActionPermission, createAbility, SubjectPermission } from '@/lib/ability';
import type { Session } from 'next-auth';

/**
 * Valida que el usuario esté autenticado como administrador
 * @returns Session del usuario autenticado
 * @throws Error si no está autenticado o no es admin
 */
export async function validateAdminSession(): Promise<Session> {
  const session = await auth();

  if (!session?.user) {
    throw new Error('No autenticado. Inicia sesión para continuar.');
  }

  // Validar que el usuario no esté marcado como eliminado
  if (session.user.isDeleted) {
    throw new Error('Cuenta de usuario desactivada.');
  }

  return session;
}

/**
 * Valida que el usuario tenga permisos específicos para realizar una acción
 * @param action - Acción a realizar ('create', 'read', 'update', 'delete', 'manage')
 * @param subject - Entidad sobre la que actuar ('User', 'Product', 'Category', etc.)
 * @returns Session del usuario si tiene permisos
 * @throws Error si no tiene permisos
 */
export async function validateAdminPermission(
  action: ActionPermission,
  subject: SubjectPermission
): Promise<Session> {
  const session = await validateAdminSession();

  const ability = createAbility(session.user.superAdmin);

  if (!ability.can(action, subject)) {
    throw new Error(`No tienes permisos para ${action} en ${subject}.`);
  }

  return session;
}

/**
 * Valida que el usuario sea Super Admin
 * @returns Session del super admin
 * @throws Error si no es super admin
 */
export async function validateSuperAdmin(): Promise<Session> {
  const session = await validateAdminSession();

  if (!session.user.superAdmin) {
    throw new Error('Solo los Super Administradores pueden realizar esta acción.');
  }

  return session;
}

/**
 * Wrapper para Server Actions que requieren autenticación básica de admin
 * @param action - Función del Server Action a ejecutar
 * @returns Función wrapper que valida antes de ejecutar
 */
export function withAdminAuth<T extends unknown[], R>(action: (...args: T) => Promise<R>) {
  return async (...args: T): Promise<R> => {
    await validateAdminSession();
    return action(...args);
  };
}

/**
 * Wrapper para Server Actions que requieren Super Admin
 * @param action - Función del Server Action a ejecutar
 * @returns Función wrapper que valida super admin antes de ejecutar
 */
export function withSuperAdmin<T extends unknown[], R>(action: (...args: T) => Promise<R>) {
  return async (...args: T): Promise<R> => {
    await validateSuperAdmin();
    return action(...args);
  };
}
