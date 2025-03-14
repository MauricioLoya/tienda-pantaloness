import React from 'react'
import BasicForm from '@/modules/catalogue/components/BasicForm'
import ImagesForm from '@/modules/catalogue/components/ImagesForm'
import CategoriesForm from '@/modules/catalogue/components/CategoriesForm'
import VariantsForm from '@/modules/catalogue/components/VariantsForm'
import HeaderContent from "@/lib/components/HeaderContent"
import { CategoryRepository } from "@/modules/category/definitions"

const CreateProductPage: React.FC = async () => {
  return (
    <>
      <HeaderContent title="Crear Producto" href="../" />
      <div className="flex justify-center mx-auto p-6">
        <div className="flex flex-initial">
          <BasicForm mode="create" />
        </div>
        <div className="flex flex-col flex-2">
          <ImagesForm mode="create" />
          <CategoriesForm mode="create" allCategories={ await new CategoryRepository().getAll()} />
        </div>
      </div>
      <VariantsForm mode="create" />
    </>
  )
}

export default CreateProductPage