'use client';

import React from 'react';
import ModalGeneric from '@/lib/components/ModalGeneric';
import { useRouter } from 'next/navigation';
import { FaEdit } from 'react-icons/fa';
import { useToast } from '@/lib/components/ToastContext';
import { OrderStatusItem } from '../definitions';
import OrderForm from './OrderForm';
import { updateOrderAction } from '../actions/updateOrderAction';

interface UpdateOrderProps {
    order: OrderStatusItem;
}

const UpdateOrder: React.FC<UpdateOrderProps> = ({ order }) => {
    const router = useRouter();
    const { showToast } = useToast();

    return (
        <ModalGeneric
            title={`Actualizar Orden`}
            triggerBtnTitle='Actualizar'
            triggerBtnContent={<FaEdit />}
            fullScreen={false}
        >
            <OrderForm
                initialData={{
                    status: order.status || '',
                }}
                onSuccess={async (values) => {
                    await updateOrderAction(order.id, {
                        status: values.status,
                    });
                    showToast('Orden actualizada correctamente', 'success');
                    router.refresh();
                }}
            />
        </ModalGeneric>
    );
};

export default UpdateOrder;
