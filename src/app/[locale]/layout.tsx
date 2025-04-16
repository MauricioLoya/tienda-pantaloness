import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { CartProvider } from '@/context/CartContext';
import '../globals.css';
import { ToastProvider } from '@/lib/components/ToastContext';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: 'Jose Phine Jeans',
  description: 'La mejor tienda de pantalones en línea',
  keywords: 'pantalones, tienda, ropa, moda',
  robots: 'index, follow',
  openGraph: {
    title: 'Tienda Pantalones',
    description: 'La mejor tienda de pantalones en línea',
    type: 'website',
    locale: 'es_MX',
    url: 'https://tienda-pantalones.com',
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="robots" content={metadata.robots} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:locale" content={locale} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <link rel="icon" href="/favicon.ico" />
        <title>{metadata.title}</title>
      </head>
      <body>
        <NextIntlClientProvider>
          <CartProvider>
            <ToastProvider>{children}</ToastProvider>
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
