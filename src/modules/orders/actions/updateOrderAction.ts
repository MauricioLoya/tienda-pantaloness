'use server';

import { prisma } from '@/lib/prima/client';
import { OrderStatusInput } from '../definitions';

export async function updateOrderAction(id: number, data: OrderStatusInput) {
  await prisma.order.update({
    where: { id },
    data: { status: data.status },
  });
}
