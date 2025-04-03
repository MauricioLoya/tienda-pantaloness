'use server';
import { UserInput, UserItem, UserRepository } from '../definitions';
export async function createUserAction(data: UserInput): Promise<UserItem> {
  return new UserRepository().create(data);
}
