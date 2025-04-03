'use client';
import React, { useState } from 'react';
import { Promotion } from '@prisma/client';
import { FaCopy } from 'react-icons/fa';
import DisplayInfo from '@/lib/components/DisplayInfo';
import Link from 'next/link';
import HeaderContent from '@/lib/components/HeaderContent';
import { RegionItem } from '@/modules/region/definitions';

type Props = {
  promotion: Promotion;
  region?: RegionItem;
};

const PromotionDetails: React.FC<Props> = ({ promotion, region }) => {
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
                <div>
                  <span>{promotion.code}</span>
                  <button
                    onClick={() => copyToClipboard(promotion.code)}
                    className={`ml-2 text-grey-500 hover:underline ${
                      copied ? 'text-green-500' : ''
                    }`}
                  >
                    {copied ? 'Copiado!' : <FaCopy />}
                  </button>
                </div>
              ),
            },
            { label: 'Nombre', value: promotion.name },
            { label: 'Descripción', value: promotion.description },
            { label: 'Descuento', value: `${promotion.discount}%` },
            {
              label: 'Fecha de inicio',
              value: promotion.startDate.toISOString().split('T')[0],
            },
            {
              label: 'Fecha de inicio',
              value: promotion.endDate.toISOString().split('T')[0],
            },
            { label: 'Activo', value: promotion.active ? 'Sí' : 'No' },
            {
              label: 'Región',
              value: region ? `${region.flag} ${region.name}` : 'No asignada',
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
