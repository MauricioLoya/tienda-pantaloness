import { prisma } from '@/lib/prima/client';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateRandomPassword } from '@/lib/utils';

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

// Interfaz para la creación de usuarios
export interface UserInput {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  superAdmin: boolean;
}

export interface UserUpdateInput {
  email?: string;
  name?: string;
  superAdmin?: boolean;
}

export interface PasswordUpdateInput {
  currentPassword?: string;
  newPassword: string;
}

export const fromDatabase = (user: User): UserItem => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    superAdmin: user.superAdmin,
    isDeleted: user.isDeleted,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    deletedAt: user.deletedAt,
  };
};

interface IUserRepository {
  getAll(): Promise<UserItem[]>;
  getById(id: number): Promise<UserItem | null>;
  create(data: UserInput): Promise<UserItem>;
  update(id: number, data: UserUpdateInput): Promise<UserItem>;
  delete(id: number): Promise<void>;
  activate(id: number): Promise<void>;
  updatePassword(id: number, password: string): Promise<void>;
  validatePassword(id: number, password: string): Promise<boolean>;
}

export class UserRepository implements IUserRepository {
  async getAll(): Promise<UserItem[]> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        superAdmin: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
    return users.map(user => ({
      ...user,
      deletedAt: user.deletedAt || null,
    }));
  }

  async getById(id: number): Promise<UserItem | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        superAdmin: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
    return user
      ? {
          ...user,
          deletedAt: user.deletedAt || null,
        }
      : null;
  }

  async getByEmail(email: string): Promise<UserItem | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        superAdmin: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
    return user
      ? {
          ...user,
          deletedAt: user.deletedAt || null,
        }
      : null;
  }

  async create(data: UserInput): Promise<UserItem> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }
    if (!data.password) {
      data.password = generateRandomPassword();
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        superAdmin: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });

    return {
      ...user,
      deletedAt: user.deletedAt || null,
    };
  }

  async update(id: number, data: UserUpdateInput): Promise<UserItem> {
    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        superAdmin: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });

    return {
      ...user,
      deletedAt: user.deletedAt || null,
    };
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

  async updatePassword(id: number, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async validatePassword(id: number, password: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { password: true },
    });

    if (!user) {
      return false;
    }

    return bcrypt.compare(password, user.password);
  }
}
