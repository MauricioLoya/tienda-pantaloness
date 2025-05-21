/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/lib/prima/client';
import { RegionItem } from '../region/definitions';

export type SettingKey =
  | 'storeName'
  | 'logoUrl'
  | 'contactAddress'
  | 'contactCity'
  | 'contactZipCode'
  | 'contactPhone'
  | 'contactEmail'
  | 'businessHours'
  | `freeShipping_${string}`
  | `shippingFree_${string}`
  | 'socialLinks';

export interface BusinessHour {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface ContactInfo {
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  email: string;
  businessHours?: BusinessHour[];
}

export interface RegionFreeShipping {
  regionCode: string;
  amount: number;
  regularShippingPrice: number;
  enabled: boolean;
}

export interface SettingsFormValues {
  storeName: string;
  logoUrl: string;
  contactInfo: ContactInfo;
  freeShippingByRegion: RegionFreeShipping[];
  socialLinks: SocialLink[];
}

export class SettingsRepository {
  async getAll(): Promise<Record<string, any>> {
    const settings = await prisma.setting.findMany();
    const mapped: Record<string, any> = {};
    for (const setting of settings) {
      mapped[setting.key] = setting.value;
    }
    return mapped;
  }

  async get(key: SettingKey): Promise<any | null> {
    const setting = await prisma.setting.findUnique({ where: { key } });
    return setting?.value ?? null;
  }

  async update(key: SettingKey, value: any): Promise<void> {
    await prisma.setting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }

  async updateMany(settings: { key: SettingKey; value: any }[]): Promise<void> {
    const ops = settings.map(({ key, value }) =>
      prisma.setting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      })
    );
    await prisma.$transaction(ops);
  }

  async getSettingsInitialValues(regions: RegionItem[]): Promise<SettingsFormValues> {
    const allSettings = await this.getAll();
    const storeName = allSettings['storeName'] ?? '';
    const logoUrl = allSettings['logoUrl'] ?? '';

    // Parse business hours JSON
    const businessHoursJson = allSettings['businessHours'];
    let businessHours: BusinessHour[] = [];
    try {
      businessHours = businessHoursJson ? JSON.parse(businessHoursJson) : [];
    } catch {
      businessHours = [];
    }

    const contactInfo: ContactInfo = {
      address: allSettings['contactAddress'] ?? '',
      city: allSettings['contactCity'] ?? '',
      zipCode: allSettings['contactZipCode'] ?? '',
      phone: allSettings['contactPhone'] ?? '',
      email: allSettings['contactEmail'] ?? '',
      businessHours,
    };

    // Region shipping data
    const regionData = await prisma.region.findMany({
      where: { code: { in: regions.map(r => r.code) } },
      select: {
        code: true,
        shippingPrice: true,
        amountForFreeShipping: true,
        isFreeShipping: true,
      },
    });

    const freeShippingByRegion: RegionFreeShipping[] = regions.map(region => {
      const info = regionData.find(r => r.code === region.code);
      return {
        regionCode: region.code,
        amount: info?.amountForFreeShipping ?? 0,
        regularShippingPrice: info?.shippingPrice ?? 0,
        enabled: info?.isFreeShipping ?? false,
      };
    });

    const socialLinksJson = allSettings['socialLinks'];
    let socialLinks: SocialLink[] = [];
    try {
      socialLinks = socialLinksJson ? JSON.parse(socialLinksJson) : [];
    } catch {
      socialLinks = [];
    }

    return {
      socialLinks,
      storeName,
      logoUrl,
      contactInfo,
      freeShippingByRegion,
    };
  }

  async saveAllSettings(values: SettingsFormValues) {
    const settingsOps = [
      prisma.setting.upsert({
        where: { key: 'storeName' },
        create: { key: 'storeName', value: values.storeName },
        update: { value: values.storeName },
      }),
      prisma.setting.upsert({
        where: { key: 'logoUrl' },
        create: { key: 'logoUrl', value: values.logoUrl },
        update: { value: values.logoUrl },
      }),
      prisma.setting.upsert({
        where: { key: 'contactAddress' },
        create: { key: 'contactAddress', value: values.contactInfo.address },
        update: { value: values.contactInfo.address },
      }),
      prisma.setting.upsert({
        where: { key: 'contactCity' },
        create: { key: 'contactCity', value: values.contactInfo.city },
        update: { value: values.contactInfo.city },
      }),
      prisma.setting.upsert({
        where: { key: 'contactZipCode' },
        create: { key: 'contactZipCode', value: values.contactInfo.zipCode },
        update: { value: values.contactInfo.zipCode },
      }),
      prisma.setting.upsert({
        where: { key: 'contactPhone' },
        create: { key: 'contactPhone', value: values.contactInfo.phone },
        update: { value: values.contactInfo.phone },
      }),
      prisma.setting.upsert({
        where: { key: 'contactEmail' },
        create: { key: 'contactEmail', value: values.contactInfo.email },
        update: { value: values.contactInfo.email },
      }),
      prisma.setting.upsert({
        where: { key: 'businessHours' },
        create: {
          key: 'businessHours',
          value: JSON.stringify(values.contactInfo.businessHours ?? []),
        },
        update: { value: JSON.stringify(values.contactInfo.businessHours ?? []) },
      }),
      prisma.setting.upsert({
        where: { key: 'socialLinks' },
        create: {
          key: 'socialLinks',
          value: JSON.stringify(values.socialLinks),
        },
        update: { value: JSON.stringify(values.socialLinks) },
      }),
    ];

    const regionOps = values.freeShippingByRegion.map(region =>
      prisma.region.update({
        where: { code: region.regionCode },
        data: {
          amountForFreeShipping: region.amount,
          shippingPrice: region.regularShippingPrice,
          isFreeShipping: region.enabled,
        },
      })
    );

    await prisma.$transaction([...settingsOps, ...regionOps]);
    return { success: true };
  }
}
