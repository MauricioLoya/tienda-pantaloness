'use server';
import { UserItem, UserRepository } from "../definitions";
export async function updateUserAction(id: number, data: UserItem) : Promise<UserItem> {
  return new UserRepository().update(id, data);
}