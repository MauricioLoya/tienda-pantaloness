'use server';

import { UserRepository } from '../definitions';

export async function ActivateUserAction(id: number) {
  return new UserRepository().activate(id);
}
