'use client';
import React, { useState } from 'react';
import { sendEmailConfirmation } from '../actions/sendEmailConfirmation';

type Props = {
  orderId: number;
};

const OrderDetailsActions: React.FC<Props> = ({ orderId }) => {
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleSendConfirmation = async () => {
    console.log('Enviando correo de confirmación para la orden:', orderId);

    try {
      setIsSending(true);
      setMessage(null);
      await sendEmailConfirmation(orderId);
      setMessage({
        text: 'Correo de confirmación enviado exitosamente',
        type: 'success'
      });
    } catch (error) {
      setMessage({
        text: 'Error al enviar el correo de confirmación',
        type: 'error'
      });
      console.error('Error sending confirmation email:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex justify-start items-center gap-2'>
        <button
          className='btn btn-sm btn-primary'
          onClick={handleSendConfirmation}
          disabled={isSending}
        >
          {isSending ? 'Enviando...' : 'Reenviar Correo de Confirmación'}
        </button>
      </div>

      {message && (
        <div className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default OrderDetailsActions;
