import FooterPage from '@/modules/landing/FooterPage';
import NavBar from '@/modules/landing/Navbar';
import { BannerSection } from '@/modules/section/components/BannerSection';
import { HighlightSection } from '@/modules/section/components/HighlightSection';
import { SectionRepository } from '@/modules/section/definitions';
import { SettingsRepository } from '@/modules/settings/definitions';
import { SectionType } from '@prisma/client';
import { headers } from 'next/headers';
import mxTranslations from '../../../messages/mx.json';
import usTranslations from '../../../messages/us.json';

const HomePage: React.FC = async () => {
  const headersList = await headers();
  const locale = headersList.get('x-next-intl-locale') || '';
  const sections = await new SectionRepository().getAllByRegion(locale);
  const settingsRepo = new SettingsRepository();
  const storeName = await settingsRepo.get('storeName');
  const logoUrl = await settingsRepo.get('logoUrl');
  const contactAddress = await settingsRepo.get('contactAddress');
  const contactCity = await settingsRepo.get('contactCity');
  const contactPhone = await settingsRepo.get('contactPhone');
  const contactEmail = await settingsRepo.get('contactEmail');
  const socialLinks = await settingsRepo.get('socialLinks');
  const contactInfo = {
    address: contactAddress || '',
    city: contactCity || '',
    zipCode: '',
    phone: contactPhone || '',
    email: contactEmail || '',
    businessHours: []
  };
  const currentTranslations = locale === 'mx' ? mxTranslations : usTranslations;
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
      <FooterPage
        storeName={storeName || ''}
        logoUrl={logoUrl || ''}
        texts={currentTranslations.footer}
        socialLinks={socialLinks ? JSON.parse(socialLinks) : []}
        contactInfo={contactInfo}
      />

    </>
  );
};

export default HomePage;
