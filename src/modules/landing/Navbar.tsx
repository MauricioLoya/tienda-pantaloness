'use client';
import CartButton from '@/modules/landing/cart/CartButton';
import React, { useState, useEffect } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const t = useTranslations('Navbar');
  const pathname = usePathname() ?? '';

  // Determina si la ruta está activa
  const isActive = (href: string) => pathname.endsWith(href);

  useEffect(() => {
    const fetchLogoUrl = async () => {
      try {
        const response = await fetch('/api/settings/logo');
        const data = await response.json();
        if (data.logoUrl) {
          setLogoUrl(data.logoUrl);
        }
      } catch (error) {
        console.error('Error fetching logo URL:', error);
      }
    };

    fetchLogoUrl();
  }, []);

  return (
    <div className="sticky top-0 z-50 w-full">
      <nav className="navbar bg-white shadow-lg">
        <div className="navbar max-w-7xl mx-auto">
          <div className="flex-1">
            <Link href={'/'} className="text-xl text-primary">
              {logoUrl ? (
                <img className="h-12 md:h-20 " src={logoUrl} alt="logo" />
              ) : (
                <div className="h-12 w-32 bg-gray-200 animate-pulse rounded"></div>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex-none lg:hidden">
            <CartButton />
            <button
              className="btn btn-square btn-ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="flex-none hidden lg:flex gap-2">
            <ul className="menu menu-horizontal px-1">
              <li>
                <Link
                  href={'/productos'}
                  className={`${isActive('/productos')
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'hover:bg-sky-100 hover:text-blue-600'
                    } px-3 py-2 rounded-md`}
                >
                  {t('products')}
                </Link>
              </li>
              <li>
                <Link
                  href={'/categorias'}
                  className={`${isActive('/categorias')
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'hover:bg-sky-100 hover:text-blue-600'
                    } px-3 py-2 rounded-md`}
                >
                  {t('categories')}
                </Link>
              </li>
              <li>
                <Link
                  href={'/contacto'}
                  className={`${isActive('/contacto')
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'hover:bg-sky-100 hover:text-blue-600'
                    } px-3 py-2 rounded-md`}
                >
                  {t('contact')}
                </Link>
              </li>
            </ul>
            <LanguageSwitcher />
            <CartButton />
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-50 p-4">
            <ul className="menu menu-vertical w-full">
              <li>
                <Link
                  href={'/productos'}
                  className={`${isActive('/productos')
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'hover:bg-sky-100 hover:text-blue-600'
                    } px-3 py-2 rounded-md`}
                >
                  {t('products')}
                </Link>
              </li>
              <li>
                <Link
                  href={'/categorias'}
                  className={`${isActive('/categorias')
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'hover:bg-sky-100 hover:text-blue-600'
                    } px-3 py-2 rounded-md`}
                >
                  {t('categories')}
                </Link>
              </li>
              <li>
                <Link
                  href={'/contacto'}
                  className={`${isActive('/contacto')
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'hover:bg-sky-100 hover:text-blue-600'
                    } px-3 py-2 rounded-md`}
                >
                  {t('contact')}
                </Link>
              </li>
            </ul>
            <div className="flex justify-center mt-4">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default NavBar;