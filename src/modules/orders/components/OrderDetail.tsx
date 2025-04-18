import React from 'react';
import { OrderRepository } from '../definitions';
import DisplayInfo from '@/lib/components/DisplayInfo';
type Props = {
  id: number;
};
const OrderDetail: React.FC<Props> = async ({ id }) => {
  const orderRepo = new OrderRepository();
  const detail = await orderRepo.getOrderById(id);
  if (!detail) {
    return <div>Orden no encontrada</div>;
  }
  return (
    <>
      <div className='p-2'>
        <div className='grid gap-6'>
          <DisplayInfo
            info={[
              {
                label: 'Estado',
                value: detail.order.status,
              },
              {
                label: 'Número de Orden',
                value: detail.order.orderNumber,
                copyable: true,
              },
              {
                label: 'ID de Orden',
                value: detail.order.id,
                copyable: true,
              },
            ]}
          />
          <DisplayInfo
            info={[
              {
                label: 'Cliente',
                value: detail.customer.name,
                copyable: true,
              },
              {
                label: 'Correo Electrónico',
                value: detail.customer.email,
                copyable: true,
              },
              {
                label: 'Teléfono',
                value: detail.customer.phone,
                copyable: true,
              },
            ]}
          />

          <DisplayInfo
            info={[
              {
                label: 'Lina de Envío 1',
                value: detail.order.shipping_line1,
              },
              {
                label: 'Lina de Envío 2',
                value: detail.order.shipping_line2,
              },
              {
                label: 'Ciudad',
                value: detail.order.city,
              },
              {
                label: 'Estado',
                value: detail.order.state,
              },
              {
                label: 'Código Postal',
                value: detail.order.postalCode,
              },
              {
                label: 'País',
                value: detail.order.country,
              },
            ]}
          />

          <DisplayInfo
            info={[
              {
                label: 'Total',
                value: detail.order.totalAmount,
              },
              {
                label: 'Estado',
                value: detail.order.status,
              },
              {
                label: 'Fecha',
                value: detail.order.orderDate.toISOString(),
              },
            ]}
          />

          <DisplayInfo
            info={[
              {
                label: 'Productos',
                value: detail.items.length,
              },
              {
                label: 'Listado de Productos',
                value: detail.items.map(item => (
                  <div key={item.id}>
                    {item.quantity} x {item.productName} - ${item.price} c/u
                  </div>
                )),
              },
            ]}
          />

          <DisplayInfo
            info={[
              {
                label: 'Método de Pago',
                value: detail.payment?.paymentType || 'No definido',
              },
              {
                label: 'Stripe',
                value: detail.payment?.stripePayment || 'No definido',
              },
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
