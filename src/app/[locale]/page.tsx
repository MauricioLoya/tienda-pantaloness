import FooterPage from '@/modules/landing/FooterPage';
import NavBar from '@/modules/landing/Navbar';
import { BannerSection } from '@/modules/section/components/BannerSection';
import { HighlightSection } from '@/modules/section/components/HighlightSection';
import { SectionRepository } from '@/modules/section/definitions';
import { SectionType } from '@prisma/client';
import { headers } from 'next/headers';

const HomePage: React.FC = async () => {
  const headersList = await headers();
  const locale = headersList.get('x-next-intl-locale') || '';
  const sections = await new SectionRepository().getAllByRegion(locale);
  return (
    <>
      <NavBar />
      {sections.map(section => {
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
