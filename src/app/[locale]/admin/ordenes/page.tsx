import Loader from '@/lib/components/Loader'
import ListOrders from '@/modules/orders/components/ListOrders'
import React, { Suspense } from 'react'
import CreateOrder from '../../../../modules/orders/components/CreateOrder'

const OrdenesPage: React.FC = () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <CreateOrder />
        <ListOrders />
      </Suspense>
    </>
  )
}

export default OrdenesPage
