'use client';
import React from 'react';
import ConfirmModal from '@/lib/components/ConfirmModal';
import { useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';
import { useToast } from '@/lib/components/ToastContext';
import { deleteUserAction } from '../actions/deleteUserAction';
import { UserItem } from '../definitions';

interface DeleteUserProps {
  user: UserItem;
  btnColor?: string;
}

const DeleteUser: React.FC<DeleteUserProps> = ({ user, btnColor = 'btn-danger' }) => {
  const router = useRouter();
  const { showToast } = useToast();

  const handleConfirmDelete = async () => {
    try {
      await deleteUserAction(user.id);
      showToast('Usuario eliminada correctamente', 'success');
      router.refresh();
    } catch (error: any) {
      showToast('Error al eliminar el usuario', 'error');
    }
  };

  return (
    <ConfirmModal
      title='Eliminar Usuario'
      message={`¿Estás seguro de eliminar el usuario "${user.name}"?`}
      triggerBtnTitle='Eliminar'
      triggerBtnContent={<FaTrash />}
      confirmBtnText='Sí, eliminar'
      cancelBtnText='Cancelar'
      onConfirm={handleConfirmDelete}
      btnColor={btnColor}
    />
  );
};

export default DeleteUser;
