'use client';

import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useState } from 'react';
import Loader from '@/lib/components/Loader';

const locales = [
  { code: 'mx', label: 'Mexico', flag: '🇲🇽' },
  { code: 'us', label: 'USA', flag: '🇺🇸' },
];

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = useLocale();
  const cleanPathname = removeLocalePrefix(pathname ?? '', currentLocale);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState<string | null>(null);

  // Simular la carga cuando se cambia de idioma
  const handleLocaleChange = (locale: string) => {
    if (locale !== currentLocale) {
      setIsLoading(true);
      setSelectedLocale(locale);
      // El loading se quitará automáticamente cuando se navegue a la nueva página
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <details className="dropdown dropdown-end">
      <summary className="btn btn-ghost m-1 normal-case">
        {isLoading ? (
          <Loader size="xs" color="primary" text={locales.find(l => l.code === selectedLocale)?.label} />
        ) : (
          <>
            {locales.find(locale => locale.code === currentLocale)?.label}{' '}
            {locales.find(locale => locale.code === currentLocale)?.flag}
          </>
        )}
      </summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
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
    </details>
  );
}

function removeLocalePrefix(pathname: string, locale: string) {
  const segments = pathname.split('/');
  if (segments[1] === locale) {
    return '/' + segments.slice(2).join('/');
  }
  return pathname;
}