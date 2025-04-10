import { prisma } from '@/lib/prima/client';
import { Promotion } from '@prisma/client';

export interface PromotionItem {
  id: number;
  code: string;
  name: string;
  description: string;
  discount: number;
  regionId: string;
  startDate: Date;
  endDate: Date;
  active: boolean;
  isDeleted: boolean;
  createdAt: Date;
}

export interface PromotionInput {
  code: string;
  name: string;
  description: string;
  discount: number;
  regionId: string;
  startDate: Date;
  endDate: Date;
  active: boolean;
}

export const fromDatabase = (prom: Promotion): PromotionItem => ({
  id: prom.id,
  code: prom.code,
  name: prom.name,
  description: prom.description,
  discount: prom.discount,
  regionId: prom.regionId ?? '',
  startDate: prom.startDate,
  endDate: prom.endDate,
  active: prom.active,
  isDeleted: prom.isDeleted,
  createdAt: prom.createdAt,
});

interface IPromotionRepository {
  getAll(): Promise<PromotionItem[]>;
  getById(id: number): Promise<PromotionItem | null>;
  create(data: PromotionInput): Promise<PromotionItem>;
  update(id: number, data: Partial<PromotionInput>): Promise<PromotionItem>;
  delete(id: number): Promise<void>;
  activate(id: number): Promise<void>;
}

export class PromotionRepository implements IPromotionRepository {
  async getAll(): Promise<PromotionItem[]> {
    try {
      const promotions = await prisma.promotion.findMany();
      return promotions.map(fromDatabase);
    } catch (error) {
      throw error;
    }
  }

  async getById(id: number): Promise<PromotionItem | null> {
    try {
      const promotion = await prisma.promotion.findFirst({
        where: { id },
      });
      return promotion ? fromDatabase(promotion) : null;
    } catch (error) {
      throw error;
    }
  }

  async create(data: PromotionInput): Promise<PromotionItem> {
    const formattedData = {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    };
    try {
      const promotion = await prisma.promotion.create({
        data: formattedData,
      });
      return fromDatabase(promotion);
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, data: PromotionInput): Promise<PromotionItem> {
    try {
      const promotion = await prisma.promotion.update({
        where: { id },
        data: data,
      });

      const a = fromDatabase(promotion);
      return a;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await prisma.promotion.update({
        where: { id },
        data: { isDeleted: true },
      });
    } catch (error) {
      throw error;
    }
  }

  async activate(id: number): Promise<void> {
    try {
      await prisma.promotion.update({
        where: { id },
        data: { isDeleted: false },
      });
    } catch (error) {
      throw error;
    }
  }
}
