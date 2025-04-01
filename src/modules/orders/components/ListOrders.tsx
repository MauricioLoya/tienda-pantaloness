import React from 'react'
import { OrderRepository } from '../definitions'
import OrderTable from './OrderTable'
import { RegionRepository } from '@/modules/region/definitions'

const ListOrders: React.FC = async () => {
  const orders = await new OrderRepository().getOrders()
  const regions = await new RegionRepository().getAll()

  return (
    <>
      <OrderTable values={orders} regions={regions} />
    </>
  )
}

export default ListOrders
