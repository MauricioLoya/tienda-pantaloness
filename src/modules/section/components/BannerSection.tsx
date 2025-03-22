"use client";

import React from "react";
import { SectionItem } from "../definitions";

interface BannerSectionProps {
  section: SectionItem;
}

export const BannerSection: React.FC<BannerSectionProps> = ({ section }) => {
  return (
    <div
      className="hero h-[45rem] bg-cover bg-center rounded-lg"
      style={{
        backgroundImage: `url(${section.backgroundUrl})`,
        backgroundColor: section.backgroundColor,
      }}
    >
      <div className="hero-overlay bg-opacity-60 rounded-lg"></div>
      <div className="hero-content text-neutral-content h-full w-full flex flex-col justify-end items-start">
        <h2 className="mb-5 text-5xl font-bold">{section.title}</h2>
        <p className="mb-5 max-w-md">{section.description}</p>
        {section.actionUrl && (
          <a href={section.actionUrl} className="btn btn-primary">
            Ir a la sección
          </a>
        )}
      </div>
    </div>
  );
};
