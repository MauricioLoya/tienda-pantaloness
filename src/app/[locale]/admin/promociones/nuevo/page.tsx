import PromotionForm from '@/modules/promotion/components/PromotionForm'
import React from 'react'

const CreatePromotionPage: React.FC = async () => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Nueva Promoción</h1>
      <PromotionForm mode="create" />
    </div>
  )
}

export default CreatePromotionPage
