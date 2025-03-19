'use server';

import { prisma } from '@/lib/prima/client';

export async function removeProductFromCategoryAction(categoryId: number, productId: number): Promise<void> {
  try {
    await prisma.productCategory.deleteMany({
      where: {
        categoryId,
        productId,
      },
    });
  } catch (error) {
    console.error('Error al eliminar el producto de la categoría:', error);
    throw new Error('No se pudo eliminar el producto de la categoría.');
  }
}