import Header from '@/modules/admin-dashboard/components/Header'
import React from 'react'
type Props = {
  children: React.ReactNode
}
const PromotionLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header
        title="📝 Tus Promociones"
        description="Administra las promociones de tu tienda, agrega promociones, actualizalas, lo que necesites"
      />
      {children}
    </>
  )
}

export default PromotionLayout
