'use client';

import React from 'react';
import { SectionItem } from '../definitions';

interface BannerSectionProps {
  section: SectionItem;
}

export const BannerSection: React.FC<BannerSectionProps> = ({ section }) => {
  console.log('BannerSection:', section);

  return (
    <div
      className='hero h-[45rem] bg-cover bg-center'
      style={{
        backgroundImage: `url(${section.backgroundUrl})`,
        backgroundColor: section.backgroundColor,
      }}
    >
      <div className='hero-overlay bg-opacity-60'></div>
      <div className='hero-content text-neutral-content h-full w-full flex flex-col justify-end items-start'>
        <h2 className='mb-5 text-5xl font-bold'>{section.title}</h2>
        <p className='mb-5 max-w-md'>{section.description}</p>
        {section.actionUrl && (
          <a href={section.actionUrl} className={`btn ${section.buttonColor}`}>
            {section.buttonText}
          </a>
        )}
      </div>
    </div>
  );
};
