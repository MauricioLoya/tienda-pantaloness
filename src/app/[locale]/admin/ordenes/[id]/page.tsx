import Loader from '@/lib/components/Loader'
import OrderDetail from '@/modules/orders/components/OrderDetail'
import React, { Suspense } from 'react'

type Props = {
  params: Promise<{ id: string }>
}
const OrderDetailPage: React.FC<Props> = async ({ params }) => {
  const { id } = await params
  return (
    <>
      <Suspense fallback={<Loader />}>
        <OrderDetail id={Number(id)} />
      </Suspense>
    </>
  )
}

export default OrderDetailPage
