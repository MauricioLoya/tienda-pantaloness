'use client'
import Link from 'next/link'
import React from 'react'
import DisplayTableInfo from '@/lib/components/DisplayTableInfo'
import { CategoryItem } from '../definitions'

type Props = {
  values: CategoryItem[]
}

const CategoryTable: React.FC<Props> = ({ values }) => {
  const headers = ['ID', 'Nombre', 'Descripción', 'Estatus', 'Opciones']
  const data = values.map((category) => ({
    ID: category.id,
    Nombre: category.name,
    Descripción: category.description,
    Estatus: category.isDeleted ? 'Eliminado' : 'Activo',
    Opciones: (
      <Link
        className="text-indigo-600 hover:text-indigo-900"
        href={`/admin/categorias/${category.id}`}
      >
        Detalles
      </Link>
    ),
  }))

  return <DisplayTableInfo headers={headers} data={data} keyField="ID" />
}

export default CategoryTable