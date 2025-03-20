import React from 'react'
import { getTranslations } from 'next-intl/server'

const HeroSection: React.FC = async () => {
  const t = await getTranslations('Categories')

  return (
    <section
      className="hero h-[35rem] bg-cover bg-center rounded-lg"
      style={{
        backgroundImage:
          'url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)'
      }}
    >
      <div className="hero-overlay bg-opacity-60 rounded-lg"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-white mb-8">
            {t('description')}
          </p>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
