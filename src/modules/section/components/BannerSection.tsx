'use client';

import React from 'react';
import { SectionItem } from '../definitions';
import SectionBox from '@/modules/landing/SectionBox';
import { Link } from '@/i18n/navigation';

interface BannerSectionProps {
  section: SectionItem;
}

export const BannerSection: React.FC<BannerSectionProps> = ({ section }) => {
  return (
    <SectionBox>
      <div
        className="hero h-[45rem] bg-cover bg-center rounded-lg"
        style={
          {
            backgroundImage: `url(${section.backgroundUrl})`,
          }
        }
      >
        <div className="hero-overlay bg-opacity-60 rounded-lg"></div>
        <div className="hero-content text-neutral-content h-full w-full">
          <div className="h-full w-full flex flex-col justify-end items-start">
            <h2 className="mb-5 text-5xl font-bold">{section.title}</h2>
            <p className="mb-5 max-w-md">{section.description}</p>

            <Link href={section.actionUrl} className="btn btn-primary">{section.buttonText}</Link>
          </div>
        </div>
      </div>
    </SectionBox>
  )
  // return (
  //   <div
  //     className='hero h-[45rem] bg-cover bg-center max-w-7xl mx-auto'
  //     style={{
  //       backgroundImage: `url(${section.backgroundUrl})`,
  //       backgroundColor: section.backgroundColor,
  //     }}
  //   >
  //     <div className='hero-overlay bg-opacity-60'></div>
  //     <div className='hero-content text-neutral-content h-full w-full flex flex-col justify-end items-start'>
  //       <h2 className='mb-5 text-5xl font-bold'>{section.title}</h2>
  //       <p className='mb-5 max-w-md'>{section.description}</p>
  //       {section.actionUrl && (
  //         <a href={section.actionUrl} className={`btn ${section.buttonColor}`}>
  //           {section.buttonText}
  //         </a>
  //       )}
  //     </div>
  //   </div>
  // );
};
