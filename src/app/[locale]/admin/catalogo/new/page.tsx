import React from 'react'
import BasicForm from '@/modules/catalogue/components/BasicForm'
import ImagesForm from '@/modules/catalogue/components/ImagesForm'
import CategoriesForm from '@/modules/catalogue/components/CategoriesForm'
import VariantsForm from '@/modules/catalogue/components/VariantsForm'
import HeaderContent from "@/lib/components/HeaderContent"
import { CategoryRepository } from "@/modules/category/definitions"
import { RegionItem, RegionRepository } from '@/modules/region/definitions'

const CreateProductPage: React.FC = async () => {
  const regions: RegionItem[] = await new RegionRepository().getAll();
  return (
    <>
      <HeaderContent title="Crear Producto" href="./" />
      <div className="flex justify-center mx-auto p-6">
        <div className="flex flex-initial">
          <BasicForm regions={regions} />
        </div>
        <div className="flex flex-col flex-2">
          <ImagesForm />
          <CategoriesForm allCategories={ await new CategoryRepository().getAll()} />
        </div>
      </div>
      <VariantsForm />
    </>
  )
}

export default CreateProductPage