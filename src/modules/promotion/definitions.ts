import { prisma } from "@/lib/prima/client";
import { Promotion } from "@prisma/client";

interface IPromotionRepository {
  getAll(): Promise<Promotion[]>;
  getById(id: number): Promise<Promotion | null>;
  create(data: Omit<Promotion, "id">): Promise<Promotion>;
  update(id: number, data: Partial<Promotion>): Promise<Promotion>;
  delete(id: number): Promise<void>;
}

export class PromotionRepository implements IPromotionRepository {
  async getAll(): Promise<Promotion[]> {
    try {
      return await prisma.promotion.findMany({
        where: { isDeleted: false },
      });
    } catch (error) {
      throw error;
    }
  }

  async getById(id: number): Promise<Promotion | null> {
    try {
      return await prisma.promotion.findFirst({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  async create(data: Omit<Promotion, "id" | "createdAt">): Promise<Promotion> {
    try {
      const promotion = await prisma.promotion.create({
        data,
      });
      return promotion;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, data: Partial<Promotion>): Promise<Promotion> {
    try {
      const promotion = await prisma.promotion.update({
        where: { id },
        data,
      });
      return promotion;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await prisma.promotion.update({
        where: { id },
        data: {
          isDeleted: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
