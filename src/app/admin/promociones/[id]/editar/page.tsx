import PromotionForm from '@/modules/promotion/components/PromotionForm'
import { PromotionRepository } from '@/modules/promotion/definitions'
import React from 'react'

type Props = {
  params: { id: string }
}

const EditPromotionPage: React.FC<Props> = async ({ params }) => {
  const { id } = await params;

  const promotionRepo = new PromotionRepository()
  const promotion = await promotionRepo.getById(Number(id))
  if (!promotion) {
    return <div>Promoción no encontrada</div>
  }
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Promoción</h1>
      <PromotionForm id={id} initialData={promotion} mode="update" />
    </div>
  )
}

export default EditPromotionPage
