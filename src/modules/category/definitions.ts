import { prisma } from '@/lib/prima/client';
import { Category } from '@prisma/client';

export interface CategoryItem {
  id: number;
  name: string;
  description: string;
  isDeleted?: boolean;
  regionId?: string | undefined; 
}

export interface CategoryInput {
  name: string;
  description: string;
  regionId: string;
}

export const fromDatabase = (cat: Category): CategoryItem => ({
  id: cat.id,
  name: cat.name,
  description: cat.description,
  regionId: cat.regionId ?? undefined,
  isDeleted: cat.isDeleted,
});

export interface ICategoryRepository {
  getAll(): Promise<CategoryItem[]>;
  finsById(id: number): Promise<CategoryItem | null>;
  update(id: number, data: CategoryItem): Promise<CategoryItem>;
  create(data: CategoryItem): Promise<CategoryItem>;
  delete(id: number): Promise<void>;
  activate(id: number): Promise<void>;
}

export class CategoryRepository implements ICategoryRepository {
  async finsById(id: number): Promise<CategoryItem | null> {
    try {
      const cat = await prisma.category.findFirst({
        where: { id },
      });
      if (!cat) return null;
      return fromDatabase(cat);
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, data: CategoryItem): Promise<CategoryItem> {
    try {
      const updatedCategory = await prisma.category.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          regionId: data.regionId,
        },
      });
      console.log(updatedCategory);
      return fromDatabase(updatedCategory);
    } catch (error) {
      throw error;
    }
  }

  async create(data: CategoryItem): Promise<CategoryItem> {
    try {
      const createdCategory = await prisma.category.create({ data });
      return fromDatabase(createdCategory);
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<CategoryItem[]> {
    try {
      const categories = await prisma.category.findMany();
      return categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        isDeleted: cat.isDeleted,
        regionId: cat.regionId ?? undefined,
      }));
    } catch (error) {
      throw error;
    }
  }
  async updateIsDeleted(id: number, isDeleted:boolean): Promise<void> {
    try {
      await prisma.category.update({
        where: { id },
        data: {
          isDeleted: isDeleted,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.updateIsDeleted(id, true);
    } catch (error) {
      throw error;
    }
  }
  async activate(id: number): Promise<void> {
    try {
      await this.updateIsDeleted(id, false);
    } catch (error) {
      throw error;
    }
  }
}
