'use server';

import { prisma } from '@/lib/prima/client';
import { OrderStatusInput } from '../definitions';
import { validateAdminSession } from '@/lib/auth-validation';

export async function updateOrderAction(id: number, data: OrderStatusInput) {
  await validateAdminSession();
  await prisma.order.update({
    where: { id },
    data: { status: data.status, shippingDetails: data.shippingDetails },
  });
}
