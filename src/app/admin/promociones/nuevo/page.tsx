"use client"

import { useRouter } from 'next/navigation'
import PromotionForm from '@/modules/promotion/components/PromotionForm'
import { useState } from 'react'

export default function CreatePromotionPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async (data: any) => {
    try {
      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        router.push('/admin/promociones')
      } else {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Error al crear la promoción')
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Nueva Promoción</h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <PromotionForm onSubmit={handleCreate} mode="create" />
    </div>
  )
}
