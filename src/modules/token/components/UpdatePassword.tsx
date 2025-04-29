'use client';

import React from 'react';
import ModalGeneric from '@/lib/components/ModalGeneric';
import { useRouter } from 'next/navigation';
import { useToast } from '@/lib/components/ToastContext';
import PasswordForm from './AdminPasswordForm';
import { FaLock } from "react-icons/fa";
import { UpdatePasswordAction } from '../actions/updatePasswordAction';


interface UpdatePasswordProps {
    userId: number;
}
const UpdatePassword: React.FC<UpdatePasswordProps> = ({ userId }) => {
    const router = useRouter();
    const { showToast } = useToast();

    return (
        <ModalGeneric
            title={`Actualizar Contraseña`}
            triggerBtnTitle='Contraseña'
            triggerBtnContent={<FaLock />}
            fullScreen={false}
        >
            {(closeModal) => (
                <PasswordForm
                    userId={userId}
                    onSuccess={async (userId, newPassword) => {
                        showToast('Contraseña actualizada correctamente', 'success');
                        await UpdatePasswordAction(userId, newPassword);
                        router.refresh();
                    }}
                    onClose={closeModal}
                    isAdmin={true}
                />
            )}
        </ModalGeneric>
    );
};

export default UpdatePassword;