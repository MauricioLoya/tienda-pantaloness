import React from 'react'
import { OrderRepository } from '../definitions'
import OrderTable from './OrderTable'

const ListOrders: React.FC = async () => {
  const orderRepo = new OrderRepository()

  const orders = await orderRepo.getOrders()
  return (
    <>
      <OrderTable values={orders} />
    </>
  )
}

export default ListOrders
