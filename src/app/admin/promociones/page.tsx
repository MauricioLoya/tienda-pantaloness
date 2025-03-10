import Loader from '@/lib/components/Loader'
import PromotionList from '@/modules/promotion/components/PromotionList'
import React, { Suspense } from 'react'

const PromotionPage: React.FC = async () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <PromotionList />
      </Suspense>
    </>
  )
}

export default PromotionPage
