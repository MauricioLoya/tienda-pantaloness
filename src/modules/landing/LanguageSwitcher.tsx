'use client';

import { usePathname } from 'next/navigation';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

const locales = [
  { code: 'mx', label: 'Mexico', flag: '🇲🇽' },
  { code: 'us', label: 'USA', flag: '🇺🇸' },
];

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = useLocale();
  const cleanPathname = removeLocalePrefix(pathname, currentLocale);

  return (
    <div className='dropdown dropdown-end'>
      <label tabIndex={0} className='btn m-1'>
        {locales.find(locale => locale.code === currentLocale)?.label}{' '}
        {locales.find(locale => locale.code === currentLocale)?.flag}
      </label>
      <ul tabIndex={0} className='dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52'>
        {locales.map(({ code, label, flag }) => (
          <li key={code}>
            <Link href={`${cleanPathname}`} locale={code}>
              {label} {flag}
            </Link>
          </li>
        ))}
      </ul>
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
