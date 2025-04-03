import { prisma } from '@/lib/prima/client';

export type RegionItem = {
  code: string;
  name: string;
  flag: string;
  currencyCode?: string;
  taxRate?: number;
};

export class RegionRepository {
  async getAll(): Promise<RegionItem[]> {
    const regions = await prisma.region.findMany();
    return regions.map(region => ({
      code: region.code,
      name: region.name,
      flag: region.flag,
      currencyCode: region.currencyCode || undefined,
      taxRate: region.taxRate || undefined,
    }));
  }

  async getById(code: string): Promise<RegionItem | null> {
    const region = await prisma.region.findFirst({
      where: { code },
    });
    if (!region) return null;
    return {
      code: region.code,
      name: region.name,
      flag: region.flag,
      currencyCode: region.currencyCode || undefined,
      taxRate: region.taxRate || undefined,
    };
  }
}
