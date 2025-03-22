'use server';
import { UserRepository } from "../definitions";
export async function deleteUserAction(id: number) {
  return new UserRepository().delete(id);
}