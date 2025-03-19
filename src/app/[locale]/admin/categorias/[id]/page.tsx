import React from 'react'
import { CategoryRepository } from '@/modules/category/definitions'
import { notFound } from 'next/navigation';
import HeaderContent from '@/lib/components/HeaderContent';
import CategoryDetail from '@/modules/category/components/CategoryDetail';
import { RegionRepository } from '@/modules/region/definitions';
import UpdateCategoryModal from '@/modules/category/components/UpdateCategor';
import DeleteCategoryModal from '@/modules/category/components/DeleteCategory';
type Props = {
  params: Promise<{ id: string }>
}

const CategoryDetailsPage: React.FC<Props> = async ({ params }) => {
  const { id } = await params
  const categoryRepo = new CategoryRepository()
  const category = await categoryRepo.finsById(Number(id))
  if (!category) return notFound();
  const regionRepo = new RegionRepository();
  const region = category.regionId ? await regionRepo.getById(category.regionId) : null;

  return (
    <>
      <HeaderContent title={`Detalle de ${category.name}`} href="./" />
      <div className="flex flex-col gap-6">
        <div>
          <UpdateCategoryModal category={category} regions={await new RegionRepository().getAll()} />
          <DeleteCategoryModal category={category} />
        </div>
        <CategoryDetail category={category} region={region} />
      </div>
    </>
  );
}

export default CategoryDetailsPage
