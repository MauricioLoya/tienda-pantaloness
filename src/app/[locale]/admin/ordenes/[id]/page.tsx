import HeaderContent from '@/lib/components/HeaderContent';
import Loader from '@/lib/components/Loader';
import OrderDetail from '@/modules/orders/components/OrderDetail';
import UpdateOrder from '@/modules/orders/components/UpdateOrder';
import { OrderRepository } from '@/modules/orders/definitions';
import React, { Suspense } from 'react';

type Props = {
  params: Promise<{ id: string }>;
};
const OrderDetailPage: React.FC<Props> = async ({ params }) => {
  const { id } = await params;
  const detail = await new OrderRepository().getOrderById(Number(id));
  const actions = (
    <>
      <UpdateOrder order={detail.order} />
    </>
  );
  return (
    <>
      <Suspense fallback={<Loader />}>
        <HeaderContent title={`Orden No. ${detail.order.orderNumber}`} href='./' action={actions} />
        <OrderDetail id={Number(id)} />
      </Suspense>
    </>
  );
};

export default OrderDetailPage;
