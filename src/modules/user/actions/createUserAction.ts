'use server';
import { UserInput, UserItem, UserRepository } from '../definitions';
import { validateSuperAdmin } from '@/lib/auth-validation';

export async function createUserAction(data: UserInput): Promise<UserItem> {
  // 🔒 Solo Super Admin puede crear usuarios
  await validateSuperAdmin();

  return new UserRepository().create(data);
}
