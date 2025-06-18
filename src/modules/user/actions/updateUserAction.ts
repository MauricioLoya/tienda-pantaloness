'use server';
import { validateSuperAdmin } from '@/lib/auth-validation';
import { UserItem, UserRepository } from '../definitions';
export async function updateUserAction(data: UserItem): Promise<UserItem> {
  await validateSuperAdmin();
  return new UserRepository().update(data.id, data);
}
