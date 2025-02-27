'use client'
import React from 'react'
import Link from 'next/link'
import { Promotion } from '@prisma/client'

type Props = {
  values: Promotion[]
}

const PromotionTable: React.FC<Props> = ({ values }) => {
  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descuento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Opciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {values.map((promotion) => (
              <tr key={promotion.id}>
                <td className="px-6 py-4 whitespace-nowrap">{promotion.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">{promotion.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{promotion.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">{promotion.discount}%</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    className="text-indigo-600 hover:text-indigo-900 transition"
                    href={`/admin/promociones/${promotion.id}`}
                  >
                    Detalles
                  </Link>
                </td>
              </tr>
            ))}
            {values.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No se encontraron promociones.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PromotionTable
