"use client"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import PromotionForm from '@/modules/promotion/components/PromotionForm'

export default function EditPromotionPage() {
  const router = useRouter()
  const params = useParams() as { id: string }
  const [promotion, setPromotion] = useState<any>(null)

  useEffect(() => {
    const fetchPromotion = async () => {
      const res = await fetch(`/api/promotions/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setPromotion(data)
      } else {
        console.error('Error al obtener la promoción')
      }
    }
    if (params.id) {
      fetchPromotion()
    }
  }, [params.id])

  const handleUpdate = async (data: any) => {
    const res = await fetch(`/api/promotions/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (res.ok) {
      router.push('/admin/promociones')
    } else {
      const errorData = await res.json()
      throw new Error(errorData.error || 'Error al actualizar la promoción')
    }
  }

  if (!promotion) return <div className="p-4">Cargando...</div>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Promoción</h1>
      <PromotionForm initialData={promotion} onSubmit={handleUpdate} mode="update" />
    </div>
  )
}
