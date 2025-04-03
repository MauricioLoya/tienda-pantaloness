import React from 'react';
import { CategoryRepository } from '@/modules/category/definitions';
import { notFound } from 'next/navigation';
import HeaderContent from '@/lib/components/HeaderContent';
import CategoryDetail from '@/modules/category/components/CategoryDetail';
import { RegionRepository } from '@/modules/region/definitions';
import { ProductRepository } from '@/modules/catalogue/definitions';
import UpdateCategory from '@/modules/category/components/UpdateCategory';
import DeleteCategory from '@/modules/category/components/DeleteCategory';
import ActivateCategory from '@/modules/category/components/ActivateCategory';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CategoryDetailsPage({ params }: Props) {
  const { id } = await params;
  const categoryId = Number(id);
  const category = await new CategoryRepository().finsById(categoryId);
  if (!category) return notFound();
  const region = category.regionId ? await new RegionRepository().getById(category.regionId) : null;

  const products = await new ProductRepository().getProductsForCategory(categoryId);
  const actions = (
    <>
      <UpdateCategory category={category} regions={await new RegionRepository().getAll()} />
      {category.isDeleted ? (
        <ActivateCategory category={category} />
      ) : (
        <DeleteCategory category={category} />
      )}
    </>
  );
  return (
    <>
      <HeaderContent title={`Detalle de ${category.name}`} href='./' action={actions} />
      <div className='flex flex-col gap-6 '>
        <CategoryDetail category={category} region={region} products={products} />
      </div>
    </>
  );
}
