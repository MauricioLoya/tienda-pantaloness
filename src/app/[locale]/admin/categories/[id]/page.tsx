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
import { numericRouteGuard } from '@/lib/utils';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CategoryDetailsPage({ params }: Props) {
  const id = numericRouteGuard((await params).id);

  const category = await new CategoryRepository().finsById(id);
  if (!category) return notFound();
  const region = category.regionId ? await new RegionRepository().getById(category.regionId) : null;

  const products = await new ProductRepository().getProductsForCategory(id);
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
      <HeaderContent title={`Detalles de ${category.name}`} href='./' action={actions} />
      <div className='flex flex-col gap-6 '>
        <CategoryDetail category={category} region={region} products={products} />
      </div>
    </>
  );
}
