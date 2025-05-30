import HeaderContent from '@/lib/components/HeaderContent';
import Loader from '@/lib/components/Loader';
import { numericRouteGuard } from '@/lib/utils';
import OrderDetail from '@/modules/orders/components/OrderDetail';
import UpdateOrder from '@/modules/orders/components/UpdateOrder';
import { OrderRepository } from '@/modules/orders/definitions';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';

type Props = {
  params: Promise<{ id: string }>;
};
const OrderDetailPage: React.FC<Props> = async ({ params }) => {
  const id = numericRouteGuard((await params).id);
  let detail;
  try {
    detail = await new OrderRepository().getOrderById(id);
  } catch (err) {
    return notFound();
  }
  const actions = (
    <>
      <UpdateOrder order={{
        id: detail.order.id,
        status: detail.order.status,
        shippingDetails: detail.order.shippingDetails ?? '',
      }} />
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
