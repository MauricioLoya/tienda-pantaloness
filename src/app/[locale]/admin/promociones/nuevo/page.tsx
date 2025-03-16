import PromotionForm from '@/modules/promotion/components/PromotionForm'
import React from 'react'
import HeaderContent from "@/lib/components/HeaderContent";

const CreatePromotionPage: React.FC = async () => {
  return (
    <div>
      <HeaderContent title={`Crear Promoción`} href="./" />
      <PromotionForm mode="create" />
    </div>
  )
}

export default CreatePromotionPage
