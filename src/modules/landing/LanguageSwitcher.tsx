'use client';

import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useState, useEffect } from 'react';
import Loader from '@/lib/components/Loader';

const locales = [
  { code: 'mx', label: 'Mexico', flag: '🇲🇽' },
  { code: 'us', label: 'USA', flag: '🇺🇸' },
];

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = useLocale();
  const cleanPathname = removeLocalePrefix(pathname, currentLocale);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState<string | null>(null);

  // Cerrar el dropdown cuando se selecciona una opción
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown-container')) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Simular la carga cuando se cambia de idioma
  const handleLocaleChange = (locale: string) => {
    if (locale !== currentLocale) {
      setIsLoading(true);
      setSelectedLocale(locale);
      // El loading se quitará automáticamente cuando se navegue a la nueva página
      // pero ponemos un timeout por si acaso la navegación es muy rápida
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
    setIsOpen(false);
  };

  return (
    <div className="dropdown dropdown-end dropdown-container">
      <button
        className="btn btn-ghost m-1 normal-case"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isLoading ? (
          <Loader size="xs" color="primary" text={locales.find(l => l.code === selectedLocale)?.label} />
        ) : (
          <>
            {locales.find(locale => locale.code === currentLocale)?.label}{' '}
            {locales.find(locale => locale.code === currentLocale)?.flag}
          </>
        )}
      </button>

      {isOpen && (
        <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50">
          {locales.map(({ code, label, flag }) => (
            <li key={code} className={code === currentLocale ? 'bg-base-200 rounded-lg' : ''}>
              <Link
                href={`${cleanPathname}`}
                locale={code}
                onClick={() => handleLocaleChange(code)}
                className="flex items-center justify-between px-3 py-2"
              >
                <span>{label}</span>
                <span>{flag}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function removeLocalePrefix(pathname: string, locale: string) {
  const segments = pathname.split('/');
  if (segments[1] === locale) {
    return '/' + segments.slice(2).join('/');
  }
  return pathname;
}