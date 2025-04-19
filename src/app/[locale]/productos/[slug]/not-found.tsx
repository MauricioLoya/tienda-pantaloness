
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('NotFoundPage');

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='text-center space-y-4'>
        <h1 className='text-4xl font-bold text-primary'>{t('product_not_found')}</h1>
        <p className='text-gray-600'>{t('product_not_found_message')}</p>
        <p>{t('error_code')}</p>
        <Link href='/' className='btn btn-primary'>
          {t('return_home')}
        </Link>
      </div>
    </div>
  );
}
