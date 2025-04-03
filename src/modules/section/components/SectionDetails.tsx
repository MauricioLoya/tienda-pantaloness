import React from 'react';
import DisplayInfo from '@/lib/components/DisplayInfo';
import { SectionItem } from '../definitions';
import { RegionItem } from '@/modules/region/definitions';
import { FaEye } from 'react-icons/fa';
import { HighlightSection } from './HighlightSection';
import { BannerSection } from './BannerSection';

type Props = {
  section: SectionItem;
  region?: RegionItem;
};

const SectionDetails: React.FC<Props> = ({ section, region }) => {
  return (
    <div className='container mx-auto p-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        {/* Información General */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-4'>Información General</h2>
          <DisplayInfo
            info={[
              { label: 'Título', value: section.title },
              { label: 'Descripción', value: section.description },
              { label: 'Tipo', value: section.type },
              { label: 'Orden', value: section.order },
              {
                label: 'Región',
                value: region ? `${region.flag} ${region.name}` : 'No asignada',
              },
            ]}
          />
        </div>

        {/* Apariencia y Acción */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-4'>Apariencia y Acción</h2>
          <DisplayInfo
            info={[
              {
                label: 'Fondo',
                value: section.backgroundUrl ? (
                  <img
                    src={section.backgroundUrl}
                    alt='Fondo'
                    className='w-24 h-24 object-cover rounded border'
                  />
                ) : (
                  'No asignado'
                ),
              },
              {
                label: 'Color de Fondo',
                value: (
                  <span
                    style={{ backgroundColor: section.backgroundColor }}
                    className='px-3 py-1 rounded text-white'
                  >
                    {section.backgroundColor}
                  </span>
                ),
              },
              {
                label: 'URL de Acción',
                value: section.actionUrl || 'No asignada',
              },
              {
                label: 'Texto del Botón',
                value: section.buttonText || 'No asignado',
              },
              {
                label: 'Color del Botón',
                value: section.buttonColor || 'No asignado',
              },
            ]}
          />
        </div>
      </div>
      <div className='mt-8'>
        <h2 className='text-2xl font-semibold mb-4 flex items-center gap-2'>
          <FaEye className='text-gray-700' /> Apariencia
        </h2>
        {section.type === 'highlight' && <HighlightSection section={section} />}
        {section.type === 'banner' && <BannerSection section={section} />}
      </div>
    </div>
  );
};

export default SectionDetails;
