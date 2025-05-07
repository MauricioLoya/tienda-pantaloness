import React from 'react';
import ContactForm from '@/components/ContactForm';
import { BusinessHour, SettingsRepository } from '@/modules/settings/definitions';
import { getTranslations } from 'next-intl/server';

const ContactPage: React.FC = async () => {
  const settingsRepo = new SettingsRepository();

  const contactAddress = await settingsRepo.get('contactAddress');
  const contactCity = await settingsRepo.get('contactCity');
  const contactZipCode = await settingsRepo.get('contactZipCode');
  const contactPhone = await settingsRepo.get('contactPhone');
  const contactEmail = await settingsRepo.get('contactEmail');
  const businessHours: BusinessHour[] = JSON.parse(await settingsRepo.get('businessHours') || '[]');

  // Obtener traducciones
  const t = await getTranslations('ContactPage');

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-primary mb-4">{t('title')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('description')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">{t('contact_info_title')}</h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  className="text-primary w-5 h-5 mt-1 mr-4 fill-current"
                >
                  <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-lg">{t('address')}</h3>
                  <p className="text-gray-600">{contactAddress}</p>
                  <p className="text-gray-600">
                    {contactCity}, {t('zip_code')} {contactZipCode}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="text-primary w-5 h-5 mt-1 mr-4 fill-current"
                >
                  <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-lg">{t('phone')}</h3>
                  <p className="text-gray-600">{contactPhone}</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="text-primary w-5 h-5 mt-1 mr-4 fill-current"
                >
                  <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-lg">{t('email')}</h3>
                  <p className="text-gray-600">{contactEmail}</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="text-primary w-5 h-5 mt-1 mr-4 fill-current"
                >
                  <path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-lg">{t('business_hours')}</h3>
                  {businessHours && businessHours.length > 0 ? (
                    businessHours.map((hour) => (
                      <p key={hour.day} className="text-gray-600">
                        {t(`days.${hour.day}`)}: {hour.isOpen ? `${hour.openTime} - ${hour.closeTime}` : t('closed')}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-600">{t('not_available')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
};

export default ContactPage;