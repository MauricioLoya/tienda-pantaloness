import CategoryForm from '@/modules/category/components/CategoryForm'
import { CategoryRepository } from '@/modules/category/definitions'
import React from 'react'

type Props = {
  params: Promise<{ id: string }>
}

const CategoryDetailsPage: React.FC<Props> = async ({ params }) => {
  const { id } = await params
  const categoryRepo = new CategoryRepository()
  const category = await categoryRepo.finsById(Number(id))
  if (!category) {
    return <div>Categoría no encontrada</div>
  }

  return (
    <>
      <CategoryForm category={category} id={id} />
    </>
  )
}

export default CategoryDetailsPage
