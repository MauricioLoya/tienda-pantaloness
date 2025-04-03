import { prisma } from '@/lib/prima/client';
import { User } from '@prisma/client';

export interface UserItem {
  id: number;
  email: string;
  name: string;
  superAdmin: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface UserInput {
  email: string;
  name: string;
  password: string;
  superAdmin: boolean;
}

export const fromDatabase = (user: User): UserItem => ({
  id: user.id,
  email: user.email,
  name: user.name,
  superAdmin: user.superAdmin,
  isDeleted: user.isDeleted,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  deletedAt: user.deletedAt,
});

interface IUserRepository {
  getAll(): Promise<UserItem[]>;
  getById(id: number): Promise<UserItem | null>;
  create(data: UserInput): Promise<UserItem>;
  update(id: number, data: Partial<UserInput>): Promise<UserItem>;
  delete(id: number): Promise<void>;
}

export class UserRepository implements IUserRepository {
  async getAll(): Promise<UserItem[]> {
    const users = await prisma.user.findMany({});
    return users.map(fromDatabase);
  }

  async getById(id: number): Promise<UserItem | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? fromDatabase(user) : null;
  }

  async getByEmail(email: string): Promise<UserItem | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? fromDatabase(user) : null;
  }

  async create(data: UserInput): Promise<UserItem> {
    const user = await prisma.user.create({ data });
    return fromDatabase(user);
  }

  async update(id: number, data: Partial<UserInput>): Promise<UserItem> {
    const user = await prisma.user.update({ where: { id }, data });
    return fromDatabase(user);
  }

  async delete(id: number): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  }
  async activate(id: number): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { isDeleted: false, deletedAt: null },
    });
  }
}
