import { prisma } from '@/lib/prima/client';

export interface RegionFreeShipping {
  amount: number;
  regionCode: string;
  enabled: boolean;
}

export type RegionItem = {
  code: string;
  name: string;
  flag: string;
  amountForFreeShipping?: number;
  isFreeShipping?: boolean;
  currencyCode?: string;
  shippingPrice?: number;
  taxRate?: number;
};

export class RegionRepository {
  async getAll(): Promise<RegionItem[]> {
    const regions = await prisma.region.findMany();
    return regions.map(region => ({
      code: region.code,
      name: region.name,
      flag: region.flag,
      isFreeShipping: region.isFreeShipping || undefined,
      amountForFreeShipping: region.amountForFreeShipping || undefined,
      currencyCode: region.currencyCode || undefined,
      shippingPrice: region.shippingPrice || undefined,
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
      isFreeShipping: region.isFreeShipping || undefined,
      shippingPrice: region.shippingPrice || undefined,
      amountForFreeShipping: region.amountForFreeShipping || undefined,
      currencyCode: region.currencyCode || undefined,
      taxRate: region.taxRate || undefined,
    };
  }
}
