'use server';
import { UserRepository } from '../definitions';
import { validateSuperAdmin } from '@/lib/auth-validation';

export async function deleteUserAction(id: number) {
  // 🔒 Solo Super Admin puede eliminar usuarios
  await validateSuperAdmin();

  return new UserRepository().delete(id);
}
