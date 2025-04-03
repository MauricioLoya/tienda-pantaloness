'use server';
import { UserItem, UserRepository } from '../definitions';
export async function updateUserAction(data: UserItem): Promise<UserItem> {
  return new UserRepository().update(data.id, data);
}
