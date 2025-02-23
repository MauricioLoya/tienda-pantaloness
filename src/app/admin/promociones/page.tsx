import Header from '@/modules/admin-dashboard/components/Header'
import PromotionList from '@/modules/promotion/components/PromotionList'
import React from 'react'

const PromotionPage: React.FC = () => {
  return (
    <>
      <Header
        title="🎉 Promociones de tu tienda online"
        description="Administra las ordenes de tu tienda, revisa el estado de las ordenes, actualizalos, lo que necesites."
      />
      <PromotionList />
    </>
  )
}

export default PromotionPage
