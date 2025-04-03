'use client';

import React from 'react';
import { SectionItem } from '../definitions';

interface HighlightSectionProps {
  section: SectionItem;
}

export const HighlightSection: React.FC<HighlightSectionProps> = ({ section }) => {
  return (
    <div className={`p-6`} style={{ backgroundColor: section.backgroundColor }}>
      <h2 className='text-white font-semibold text-4xl mb-4'>{section.title}</h2>
      <p className='text-white mb-6 mt-6'>{section.description}</p>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {section.highlightProducts.map(prod => (
          <div key={prod.slug} className='mx-auto card w-64 bg-base-100 shadow-xl'>
            <figure>
              <img src={prod.imageUrl || '/placeholder.jpg'} alt={prod.name} />
            </figure>
            <div className='card-body'>
              <h2 className='card-title'>{prod.name}</h2>
              <p className='text-sm'>{prod.slug}</p>
            </div>
          </div>
        ))}
      </div>
      {section.actionUrl && (
        <div className='flex justify-center mt-4'>
          <a href={section.actionUrl} className={`btn ${section.buttonColor}`}>
            {section.buttonText}
          </a>
        </div>
      )}
    </div>
  );
};
