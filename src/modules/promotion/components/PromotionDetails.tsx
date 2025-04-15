'use client';
import React, { useState } from 'react';
import { Promotion } from '@prisma/client';
import { FaCopy } from 'react-icons/fa';
import DisplayInfo from '@/lib/components/DisplayInfo';
import CopyClipboard from '@/lib/components/CopyClipboard';

type Props = {
  promotion: Promotion;
};

const PromotionDetails: React.FC<Props> = ({ promotion }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className='p-4'>
      <div className='grid gap-6'>
        <DisplayInfo
          info={[
            {
              label: 'Código',
              value: (
                <div className="flex flex-row items-center gap-2">
                  {promotion.code}
                  <CopyClipboard
                    text={promotion.code}
                    label="Copiar código"
                    buttonSize="btn-xs"
                    buttonColor="btn-accent"
                  />
                </div>
              ),
            },
            { label: 'Nombre', value: promotion.name },
            { label: 'Descripción', value: promotion.description },
            { label: 'Descuento', value: `${promotion.discount}%` },
            {
              label: 'Fecha inicio',
              value: promotion.startDate.toISOString().split('T')[0],
            },
            {
              label: 'Fecha fin',
              value: promotion.endDate.toISOString().split('T')[0],
            },
            { label: 'Activo', value: promotion.active ? 'Sí' : 'No' },
            {
              label: 'Región',
              value: promotion.regionId ? `${promotion.regionId}` : 'No asignada',
            },
          ]}
        />
        <div className='mt-6'>
          {promotion.isDeleted ? (
            <span className='px-4 py-2 bg-red-500 text-white rounded'>Promoción Inactiva</span>
          ) : (
            <span className='px-4 py-2 bg-green-500 text-white rounded'>Promoción Activa</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromotionDetails;
