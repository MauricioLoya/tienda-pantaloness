'use client'

import { Category } from '@prisma/client'
import React from 'react'
import { deleteCategoryAction } from '../action/deleteCategoryAction'
type Props = {
  id?: string | number
  category: Omit<Category, 'id'>
}
const CategoryForm: React.FC<Props> = ({ category, id }) => {
  const [isPending, startTransition] = React.useTransition()

  const handleDelete = async () => {
    startTransition(async () => {
      await deleteCategoryAction(Number(id))
    })
  }

  return (
    <>
      <h1>Formulario de categoría</h1>
      <p>ID: {id}</p>
      <p>Nombre: {category.name}</p>
      <p>Descripción: {category.description}</p>
      <button
        disabled={isPending}
        className="bg-red-500 text-white px-10 py-2"
        onClick={handleDelete}
      >
        {isPending ? 'Eliminando...' : 'Eliminar'}
      </button>
    </>
  )
}

export default CategoryForm
