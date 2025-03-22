'use server';

import { PromotionRepository } from "../definitions";
import { FormPromotionsValues } from "../components/PromotionForm";

export async function UpdatePromotionAction(id: number, data: Partial<FormPromotionsValues>) {
  return new PromotionRepository().update(id, {
    code: data.code!,
    name: data.name!,
    description: data.description!,
    discount: data.discount!,
    startDate: new Date(data.startDate as string),
    endDate: new Date(data.endDate as string),
    active: data.active!,
    regionId: data.regionId!
  });
}