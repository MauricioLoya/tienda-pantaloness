import FooterPage from '@/modules/landing/FooterPage';
import NavBar from '@/modules/landing/Navbar';
import { BannerSection } from '@/modules/section/components/BannerSection';
import { HighlightSection } from '@/modules/section/components/HighlightSection';
import { SectionRepository } from '@/modules/section/definitions';
import { SectionType } from '@prisma/client';
// import Loader from '@/lib/components/Loader';
// import SectionBox from '@/modules/landing/SectionBox';
// import ProductCard from '@/modules/product-list/componentes/ProductCard';
// import { useTranslations } from 'next-intl';
// import { getTranslations } from 'next-intl/server';
// import { Suspense } from 'react';

// const HomePage: React.FC = async () => {
//   // const t = getTranslations('HomePage')
//   const featuredProducts = [
//     {
//       id: '1',
//       name: 'Classic Leather Jacket',
//       description:
//         'Premium quality leather jacket with modern design. Made with genuine leather and featuring a timeless style that suits any occasion.',
//       basePrice: 299.99,
//       thumbnail:
//         'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=500',
//       isAvailable: true,
//       discountedPrice: 239.99,
//       discountPercentage: 20
//     },
//     {
//       id: '2',
//       name: 'Vintage Denim Jeans',
//       description:
//         'Comfortable and stylish denim jeans with perfect fit and classic wash. Made with high-quality denim that lasts.',
//       basePrice: 89.99,
//       thumbnail:
//         'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=500',
//       isAvailable: true
//     },
//     {
//       id: '3',
//       name: 'Designer Sunglasses',
//       description:
//         'UV protected trendy sunglasses with polarized lenses. Perfect for both style and eye protection.',
//       basePrice: 159.99,
//       thumbnail:
//         'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=500',
//       isAvailable: true,
//       discountedPrice: 119.99,
//       discountPercentage: 25
//     },
//     {
//       id: '4',
//       name: 'Smart Watch Pro',
//       description:
//         'Latest generation smartwatch with health tracking features. Includes heart rate monitoring and sleep tracking.',
//       basePrice: 199.99,
//       thumbnail:
//         'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=500',
//       isAvailable: true
//     }
//   ]

//   const saleProducts = [
//     {
//       id: '5',
//       name: 'Summer T-Shirt',
//       description:
//         'Cotton blend casual t-shirt perfect for summer days. Breathable fabric with modern cut.',
//       basePrice: 29.99,
//       thumbnail:
//         'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500',
//       isAvailable: true,
//       discountedPrice: 19.99,
//       discountPercentage: 33
//     },
//     {
//       id: '6',
//       name: 'Running Shoes',
//       description:
//         'Lightweight performance running shoes with advanced cushioning technology. Perfect for daily training.',
//       basePrice: 129.99,
//       thumbnail:
//         'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500',
//       isAvailable: true,
//       discountedPrice: 84.49,
//       discountPercentage: 35
//     },
//     {
//       id: '7',
//       name: 'Backpack',
//       description:
//         'Durable everyday backpack with multiple compartments. Water-resistant material and comfortable straps.',
//       basePrice: 79.99,
//       thumbnail:
//         'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500',
//       isAvailable: false
//     },
//     {
//       id: '8',
//       name: 'Winter Scarf',
//       description:
//         'Warm and cozy winter scarf made from premium wool blend. Perfect for cold weather.',
//       basePrice: 24.99,
//       thumbnail:
//         'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=500',
//       isAvailable: true,
//       discountedPrice: 17.99,
//       discountPercentage: 28
//     }
//   ]
//   const sections = await new SectionRepository().getAll()
//   console.log(sections)
//   return (
//     <>
//       <NavBar />

//       {sections.map((section) => {
//         switch (section.type) {
//           case SectionType.banner:
//             return <BannerSection key={section.id} section={section} />;
//           case SectionType.highlight:
//             return <HighlightSection key={section.id} section={section} />;
//           default:
//             return null;
//         }
//       })}
{
  /* <SectionBox>
        <div
          className="hero h-[45rem] bg-cover bg-center rounded-lg"
          style={{
            backgroundImage:
              'url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)'
          }}
        >
          <div className="hero-overlay bg-opacity-60 rounded-lg"></div>
          <div className="hero-content text-neutral-content h-full w-full">
            <div className="h-full w-full flex flex-col justify-end items-start">
              <h2 className="mb-5 text-5xl font-bold">{t('title')}</h2>
              <p className="mb-5 max-w-md">{t('sample_description')}</p>
              <button className="btn btn-primary">{t('go_to_category')}</button>
            </div>
          </div>
        </div>
      </SectionBox>
      <SectionBox bgColor="bg-primary" className="grid gap-6">
        <h2 className="text-white font-semibold text-4xl">
          {t('featured_products')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {featuredProducts.map((product, index) => (
            <div key={index} className="mx-auto">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button className="btn btn-secondary">{t('view_more')}</button>
        </div>
      </SectionBox>
      <SectionBox>
        <div
          className="hero h-[45rem] bg-cover bg-center rounded-lg"
          style={{
            backgroundImage:
              'url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)'
          }}
        >
          <div className="hero-overlay bg-opacity-60 rounded-lg"></div>
          <div className="hero-content text-neutral-content h-full w-full">
            <div className="h-full w-full flex flex-col justify-end items-start">
              <h2 className="mb-5 text-5xl font-bold">
                {t('house_selection')}
              </h2>
              <p className="mb-5 max-w-md">{t('sample_description')}</p>
              <button className="btn btn-primary">{t('go_to_category')}</button>
            </div>
          </div>
        </div>
      </SectionBox>
      <SectionBox bgColor="bg-secondary" className="grid gap-6">
        <h2 className="text-white font-semibold text-4xl">
          {t('season_sale')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {saleProducts.map((product, index) => (
            <div key={index} className="mx-auto">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button className="btn btn-primary">{t('view_more')}</button>
        </div>
      </SectionBox>
      <SectionBox bgColor="bg-white" className="grid gap-6">
        <div className="hero bg-base-200  rounded-lg">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <img
              alt="Contact"
              src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
              className="max-w-sm rounded-lg shadow-2xl"
            />
            <div>
              <h1 className="text-5xl font-bold">{t('contact_title')}</h1>
              <p className="py-6">{t('sample_description')}</p>
              <button className="btn btn-primary">{t('get_started')}</button>
            </div>
          </div>
        </div>
      </SectionBox> */
}
//       <FooterPage />
//     </>
//   )
// }
// export default HomePage;

const HomePage: React.FC = async () => {
  const sections = await new SectionRepository().getAll();
  return (
    <>
      <NavBar />
      {sections.map(section => {
        <br />;
        switch (section.type) {
          case SectionType.banner:
            return <BannerSection key={section.id} section={section} />;
          case SectionType.highlight:
            return <HighlightSection key={section.id} section={section} />;
          default:
            return null;
        }
      })}
      <FooterPage />
    </>
  );
};

export default HomePage;
