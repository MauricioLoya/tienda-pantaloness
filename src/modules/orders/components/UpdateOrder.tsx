'use client';

import React, { useState } from 'react';
import ModalGeneric from '@/lib/components/ModalGeneric';
import { useRouter } from 'next/navigation';
import { FaEdit } from 'react-icons/fa';
import { useToast } from '@/lib/components/ToastContext';
import { OrderStatusInput, OrderStatusItem } from '../definitions';
import OrderForm from './OrderForm';
import { updateOrderAction } from '../actions/updateOrderAction';

interface UpdateOrderProps {
    order: OrderStatusItem;
}

const UpdateOrder: React.FC<UpdateOrderProps> = ({ order }) => {
    const router = useRouter();
    const { showToast } = useToast();

    const [formState, setFormState] = useState<OrderStatusInput>({
        status: order.status || '',
    });

    const handleValuesChange = (values: OrderStatusInput) => {
        setFormState(values);
    };

    const handleSubmit = async (close: () => void) => {
        try {
            await updateOrderAction(order.id, formState);
            router.refresh();
            showToast('Orden actualizada correctamente', 'success');
            close();
        } catch (error: unknown) {
            showToast(
                error instanceof Error ? error.message : 'Error al actualizar la orden',
                'error'
            );
            console.error(error);
        }
    };

    return (
        <ModalGeneric
            title={`Actualizar Orden`}
            triggerBtnTitle='Actualizar'
            actionBtnText='Actualizar Cambios'
            triggerBtnContent={<FaEdit />}
            cancelBtnText='Cancelar'
            actionBtnFunction={handleSubmit}
            cancelBtnFunction={() => console.log('Cancelar')}
            fullScreen={false}
        >
            <OrderForm
                onValuesChange={handleValuesChange}
                initialData={formState}
            />
        </ModalGeneric>
    );
};

export default UpdateOrder;
