'use client'
import { Category } from '@prisma/client'
import Link from 'next/link'
import React from 'react'
type Props = {
  values: Category[]
}
const CategoryTable: React.FC<Props> = ({ values }) => {
  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Opciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {values.map(category => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap">{category.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {category.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    className="text-indigo-600 hover:text-indigo-900"
                    href={`/admin/categorias/${category.id}`}
                  >
                    Detalles
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CategoryTable
