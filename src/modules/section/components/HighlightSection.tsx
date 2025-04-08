'use client';

import React from 'react';
import { SectionItem } from '../definitions';
import ProductCard from '@/modules/product-list/componentes/ProductCard';
import SectionBox from '@/modules/landing/SectionBox';

interface HighlightSectionProps {
  section: SectionItem;
}

export const HighlightSection: React.FC<HighlightSectionProps> = ({ section }) => {
  return (
    <SectionBox bgColor={section.backgroundColor}>


      <h2 className='text-white font-semibold text-4xl mb-4'>{section.title}</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-6'>
        {section.highlightProducts.map(prod => (
          <ProductCard
            key={prod.slug}
            slug={prod.slug}
            name={prod.name}
            description={prod.description}
            basePrice={prod.basePrice}
            discountedPrice={prod.discountedPrice}
            discountPercentage={prod.discountPercentage}
            thumbnail={prod.imageUrl || '/placeholder.jpg'}
            isAvailable={prod.isAvailable}
          />
        ))}
      </div>
      {section.actionUrl && (
        <div className='flex justify-center mt-4'>
          <a href={section.actionUrl} className={`btn ${section.buttonColor}`}>
            {section.buttonText}
          </a>
        </div>
      )}
    </SectionBox>
  );
};
