'use server';

import { UserRepository } from '../definitions';
import { validateAdminPermission } from '@/lib/auth-validation';

export async function ActivateUserAction(id: number) {
  // 🔒 Validar permisos para gestionar usuarios
  await validateAdminPermission('update', 'User');

  return new UserRepository().activate(id);
}
