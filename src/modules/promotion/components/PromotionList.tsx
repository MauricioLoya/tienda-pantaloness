"use client"

import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

const PromotionList: React.FC = () => {
  const [promotions, setPromotions] = useState<any[]>([])
  const [filter, setFilter] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch('/api/promotions')
        if (res.ok) {
          const data = await res.json()
          setPromotions(data)
        } else {
          console.error('Error al obtener promociones')
        }
      } catch (error) {
        console.error('Error al obtener promociones', error)
      }
    }

    fetchPromotions()
  }, [])

  const filteredPromotions = useMemo(() => {
    return promotions.filter(promotion =>
      promotion.name.toLowerCase().includes(filter.toLowerCase())
    )
  }, [promotions, filter])

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          onClick={() => router.push('/admin/promociones/nuevo')}
        >
          Agregar Promoción
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filtrar por nombre"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded w-full"
        />
      </div>

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
                Activo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPromotions.map((promotion) => (
              <tr key={promotion.id}>
                <td className="px-6 py-4 whitespace-nowrap">{promotion.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">{promotion.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{promotion.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">{promotion.discount}%</td>
                <td className="px-6 py-4 whitespace-nowrap">{promotion.active ? 'Sí' : 'No'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 transition"
                    onClick={() => router.push(`/admin/promociones/${promotion.id}`)}
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
            {filteredPromotions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
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

export default PromotionList
