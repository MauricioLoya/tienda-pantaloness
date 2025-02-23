"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function PromotionDetailsPage() {
  const params = useParams() as { id: string }
  const router = useRouter()
  const [promotion, setPromotion] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const res = await fetch(`/api/promotions/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setPromotion(data)
        } else {
          const errorData = await res.json()
          setError(errorData.error || 'Error al obtener la promoción')
        }
      } catch (err: any) {
        setError(err.message || 'Error al obtener la promoción')
      } finally {
        setLoading(false)
      }
    }
    if (params.id) {
      fetchPromotion()
    }
  }, [params.id])

  if (loading) return <div className="p-4">Cargando...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!promotion) return <div className="p-4">No se encontró la promoción.</div>

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Detalles de la Promoción</h1>
      <div className="mb-4">
        <span className="font-semibold text-gray-700">Código:</span>
        <span className="ml-2">{promotion.code}</span>
      </div>
      <div className="mb-4">
        <span className="font-semibold text-gray-700">Nombre:</span>
        <span className="ml-2">{promotion.name}</span>
      </div>
      <div className="mb-4">
        <span className="font-semibold text-gray-700">Descripción:</span>
        <span className="ml-2">{promotion.description}</span>
      </div>
      <div className="mb-4">
        <span className="font-semibold text-gray-700">Descuento:</span>
        <span className="ml-2">{promotion.discount}%</span>
      </div>
      <div className="mb-4">
        <span className="font-semibold text-gray-700">Fecha de inicio:</span>
        <span className="ml-2">{new Date(promotion.startDate).toLocaleDateString()}</span>
      </div>
      <div className="mb-4">
        <span className="font-semibold text-gray-700">Fecha de fin:</span>
        <span className="ml-2">{new Date(promotion.endDate).toLocaleDateString()}</span>
      </div>
      <div className="mb-4">
        <span className="font-semibold text-gray-700">Activo:</span>
        <span className="ml-2">{promotion.active ? 'Sí' : 'No'}</span>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => router.push(`/admin/promociones/${promotion.id}/editar`)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Editar
        </button>
      </div>
    </div>
  )
}
