import ResponsiveTable from '@/lib/components/ResponsiveTable'
import React from 'react'
import { OrderAdminTableRow } from '../definitions'
import Link from 'next/link'
type Props = {
  values: OrderAdminTableRow[]
}
const OrderTable: React.FC<Props> = ({ values }) => {
  return (
    <div className="p-4">
      <ResponsiveTable
        cols={[
          'ID',
          'Cliente',
          'Total',
          'Estado',
          'Fecha',
          'Items',
          'Método de Pago',
          'Acciones'
        ]}
      >
        {values.map(order => (
          <tr key={order.id}>
            <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
            <td className="px-6 py-4 whitespace-nowrap">{order.client}</td>
            <td className="px-6 py-4 whitespace-nowrap">{order.totalAmount}</td>
            <td className="px-6 py-4 whitespace-nowrap">{order.status}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              {order.createdAt.toISOString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">{order.itemsCount}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              {order.paymentMethod}
            </td>
            <td className="px-6 py-4">
              <Link
                href={`/admin/ordenes/${order.id}`}
                className="text-indigo-600 hover:text-indigo-900"
              >
                Detalles
              </Link>
            </td>
          </tr>
        ))}
      </ResponsiveTable>
    </div>
  )
}

export default OrderTable
