'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function CheckoutSuccessPage() {
  const t = useTranslations('CheckoutSuccessPage')

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="flex justify-center mb-6"></div>
      <h1 className="text-3xl font-bold mb-4">{t('thank_you')}</h1>
      <p className="text-lg max-w-md mx-auto mb-8">
        {t('order_success_message')}
      </p>
      <Link
        href="/"
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
      >
        {t('return_to_store')}
      </Link>
    </div>
  )
}
