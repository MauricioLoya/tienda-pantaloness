'use client';

import React, { useState } from 'react';

type AdminResetPasswordButtonProps = {
  userId: number;
  userEmail: string;
}

const AdminResetPasswordButton: React.FC<AdminResetPasswordButtonProps> = ({
  userId,
  userEmail
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleResetPassword = async () => {
    if (!confirm(`¿Estás seguro de que deseas restablecer la contraseña para el usuario ${userEmail}?`)) {
      return;
    }

    try {
      setIsLoading(true);
      setMessage(null);

      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (response.ok) {
        setMessage({
          text: `Se ha enviado una nueva contraseña al correo ${userEmail}`,
          type: 'success'
        });
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Error al restablecer la contraseña');
      }
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : 'Ha ocurrido un error',
        type: 'error'
      });

      console.error('Error al restablecer la contraseña:', error, userId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {message && (
        <div className={`p-2 rounded mb-2 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {message.text}
        </div>
      )}

      <button
        type="button"
        onClick={handleResetPassword}
        disabled={isLoading}
        className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Procesando...' : 'Restablecer contraseña'}
      </button>
    </div>
  );
};

export default AdminResetPasswordButton;